"use client";

import styles from "./page.module.css";

import { useEffect, useState } from "react";
import { Client, IAccount } from "@massalabs/massa-web3";
import {
  accountFromSecret,
  buyMassaRolls,
  getAddressInfo,
  getBalanceMas,
  getCandidateBalance,
  maxServiceFee,
  minServiceFee,
  operationStatus,
  progressiveFee,
  sendFeeMnsOperation,
  title,
  buyFee,
  masDecimals,
  customClient,
  decimalPoint,
} from "@/utils";

const version = "1.1.0";

export default function Home() {
  const [client, setClient] = useState<Client | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [account, setAccount] = useState<IAccount | null>(null);
  const [buyRolls, setBuyRolls] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [activeRolls, setActiveRolls] = useState<number>(0);
  const [finalRolls, setFinalRolls] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceMasFee, setServiceMasFee] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [amountToNewRoll, setAmountToNewRoll] = useState<number>(0);
  const [calculatedFee, setCalculatedFee] = useState<number>(0);
  const [rollsNumber, setRollsNumber] = useState<number>(0);

  const calculateServiceFee = async (rolls: number) => {
    const fee = await progressiveFee(client!, rolls);
    let rollsFee = rolls > 1 ? minServiceFee + fee : minServiceFee;
    rollsFee = rollsFee > maxServiceFee ? maxServiceFee : rollsFee;
    setCalculatedFee(rollsFee);
  };

  const initClient = async () => {
    setLoading(true);
    await accountFromSecret().then(async (account) => {
      const client = await customClient(account);
      setClient(client);
      setAccount(account);
      setAddress(account.address);

      setMessage("Auto roll buy started!");

      setRollsNumber(1);

      setLoading(false);
    });
  };

  useEffect(() => {
    if (client && address) {
      getBalanceMas(address, client).then((balance) => {
        setBalance(balance);
      });

      getAddressInfo(client, address).then((account) => {
        const { activeRolls, finalRolls } = account;
        setActiveRolls(activeRolls);
        setFinalRolls(finalRolls);
      });

      progressiveFee(client, rollsNumber).then((fee) => {
        let rollsFee = rollsNumber > 1 ? minServiceFee + fee : minServiceFee;
        rollsFee = rollsFee > maxServiceFee ? maxServiceFee : rollsFee;
        setCalculatedFee(rollsFee);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      if (client && address) {
        getBalanceMas(address, client).then((balance) => {
          setBalance(balance);
          getAddressInfo(client, address).then((account) => {
            const { activeRolls, finalRolls } = account;
            setActiveRolls(activeRolls);
            setFinalRolls(finalRolls);
          });
        });
      }
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [client, address, loading]);

  useEffect(() => {
    if (loading) return;
    if (balance) {
      const numberBalance = Number(decimalPoint(balance, masDecimals));

      let serviceFee;

      let rolls = Math.floor(numberBalance / 100);

      progressiveFee(client!, rolls).then((fee) => {
        serviceFee = rolls > 1 ? minServiceFee + fee : minServiceFee;
        const oneRoll = 100 + buyFee * 2 + serviceFee;

        if (
          numberBalance > oneRoll &&
          numberBalance < rolls * 100 + buyFee * 2 + serviceFee
        ) {
          rolls -= 1;
        }

        const newRollsAmount = rolls * 100 + buyFee * 2 + serviceFee;

        const newRollAmount =
          rolls > 1 ? newRollsAmount : 100 + buyFee * 2 + minServiceFee;

        const amountToNewRoll = newRollAmount - numberBalance;
        setAmountToNewRoll(
          numberBalance < 100 ? amountToNewRoll : amountToNewRoll
        );

        if (serviceFee > 1000) {
          serviceFee = maxServiceFee;
        }

        if (numberBalance > newRollAmount) {
          setServiceMasFee(serviceFee);
          const message =
            rolls > 0
              ? `$MAS amount reached for ${rolls} rolls`
              : "Not enough $MAS to buy rolls";
          setMessage(message);
          setBuyRolls(rolls);
        }
      });
    }
  }, [balance, loading, client]);

  useEffect(() => {
    if (buyRolls > 0) {
      setLoading(true);
      setMessage(`Buy ${buyRolls} rolls`);

      buyMassaRolls(client!, buyRolls).then((tx) => {
        console.log(`Buy rolls tx: ${tx[0]}`);
        setMessage(
          `Buy rolls txId: ${tx[0]}, fee: ${buyFee} $MAS, rolls: ${buyRolls}`
        );

        operationStatus(client!, tx[0], false).then(({ status }) => {
          console.log(`Buy rolls status: ${status}`);
          setMessage(`Buy rolls status: ${status}`);

          if (status === 6) {
            getCandidateBalance(address!, client!).then((balance) => {
              setBalance(balance);
              getAddressInfo(client!, address!).then((account) => {
                const { activeRolls, finalRolls } = account;
                setActiveRolls(activeRolls);
                setFinalRolls(finalRolls);
              });
            });
            setMessage(`Buy rolls success`);
            setSuccess(true);
            setBuyRolls(0);
          } else {
            setMessage(`Buy rolls failed! Retrying shortly...`);
            setError("Buy rolls failed");

            setBuyRolls(0);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyRolls]);

  useEffect(() => {
    if (success === true) {
      sendFeeMnsOperation(client!, serviceMasFee.toString()).then((feeTx) => {
        console.log(`Fee tx: ${feeTx[0]}, fee: ${serviceMasFee}`);
        setMessage(`Fee txId: ${feeTx[0]}, fee: ${serviceMasFee}`);

        operationStatus(client!, feeTx[0], false).then(({ status }) => {
          console.log(`Fee status: ${status}`);
          setMessage(`Fee status: ${status}`);

          if (status === 6) {
            getCandidateBalance(address!, client!).then((balance) => {
              setBalance(balance);
              getAddressInfo(client!, address!).then((account) => {
                const { activeRolls, finalRolls } = account;
                setActiveRolls(activeRolls);
                setFinalRolls(finalRolls);
              });
            });

            setLoading(false);
            setMessage(`Fee success! Thank you!`);
            setSuccess(false);
            setServiceMasFee(0);
            setTimeout(() => {
              setMessage("Auto roll buy ON!");
            }, 5000);
          } else {
            setLoading(false);
            setMessage(`Fee transaction failed! Fee will not be charged!`);
            setError("Fee failed");
            setSuccess(false);
            setServiceMasFee(0);

            setTimeout(() => {
              setMessage("Auto roll buy ON!");
            }, 5000);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  if (title !== "Massa Auto Roll") {
    throw new Error(
      "Title is not correct. Change it to 'Massa Auto Roll' in utils/constants.ts"
    );
  }

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.description}>
        <a
          href="https://github.com/calyn05/next-auto-rolls.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p>Check Github for updates. Version: {version}</p>
        </a>
      </div>
      <div className={styles.description}>
        <p>
          $MAS balance:&nbsp;
          <code className={styles.code}>{decimalPoint(balance!, 9)}</code>
        </p>
        <p>
          Final rolls:&nbsp;
          <code className={styles.code}>{finalRolls}</code>
        </p>
        <p>
          Active rolls:&nbsp;
          <code className={styles.code}>{activeRolls}</code>
        </p>
        <div>
          <p>
            MAS to new roll:&nbsp;
            <code className={styles.code}>
              {" "}
              {amountToNewRoll.toFixed(masDecimals)}
            </code>
          </p>
        </div>
      </div>

      <div className={styles.center}>
        {!client && (
          <button
            className={styles.button}
            onClick={() => {
              initClient();
            }}
          >
            Start auto buy
          </button>
        )}

        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {client && (
            <div className={styles.description}>
              <p>{message}</p>
            </div>
          )}
          {loading && (
            <div className={styles.description}>
              <p>Await finalization!</p>
            </div>
          )}
        </div>
      </div>

      <h3>Progressive fee system</h3>
      <div className={styles.inputContainer}>
        <label htmlFor="rolls">
          {client
            ? `Enter rolls number to calculate`
            : `Start auto buy to calculate`}
        </label>
        <input
          type="number"
          name="rolls"
          min={1}
          onChange={(e) => {
            if (e.target.value === "") {
              setRollsNumber(1);
              calculateServiceFee(1);
              return;
            }
            setRollsNumber(Number(e.target.value));
            calculateServiceFee(Number(e.target.value));
          }}
          placeholder="Rolls number"
          disabled={loading || !client}
        />
      </div>

      {client && (
        <>
          <div className={styles.description}>
            <p>
              Service fee: {calculatedFee} $MAS for {rollsNumber} auto{" "}
              {rollsNumber > 1 ? "rolls" : "roll"}
            </p>
            <p>
              Total transaction cost:{` `}
              {rollsNumber * 100 + buyFee * 2 + calculatedFee} $MAS
            </p>
          </div>
          <div className={styles.description}>
            <p>
              Example:{` `}
              {rollsNumber > 1
                ? `${rollsNumber} rolls`
                : `${rollsNumber} roll`}{" "}
              = {rollsNumber * 100} $MAS + {buyFee} $MAS tx fee +{" "}
              {calculatedFee} $MAS service fee + {buyFee} $MAS tx fee
            </p>
          </div>
        </>
      )}

      <div className={styles.grid}>
        <a
          href={
            address
              ? `https://massmetrix.net/data/address?q=${address}`
              : "https://massmetrix.net/"
          }
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            MassMetriX <span>-&gt;</span>
          </h2>
          <p>Online dashboard for Massa Node runners with Node Status!</p>
        </a>

        <a
          href="https://app.dusa.io/trade?ref=7s3w3p"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Dusa Dex <span>-&gt;</span>
          </h2>
          <p>
            Trade $MAS on the first DEX on Massa blockchain! And check the
            incentives program!
          </p>
        </a>

        <a
          href="https://www.mexc.com/register?inviteCode=123Wwm"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            MEXC <span>-&gt;</span>
          </h2>
          <p>Trade $MAS on MEXC - centralized exchange.</p>
        </a>

        <a
          href="https://share.bitget.com/u/5VSDGH70"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            BitGet <span>-&gt;</span>
          </h2>
          <p>Trade $MAS on BitGet - centralized exchange.</p>
        </a>
      </div>
    </main>
  );
}
