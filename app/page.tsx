"use client";

import styles from "./page.module.css";
import {
  accountFromSecret,
  buyMassaRolls,
  createClient,
  getAddressInfo,
  getBalanceMas,
  maxServiceFee,
  operationStatus,
  sendFeeOperation,
} from "@/utils";
import { useEffect, useState } from "react";
import { Client, IAccount } from "@massalabs/massa-web3";
import { decimalPoint } from "@/utils";
import { buyFee, masDecimals, serviceFee } from "@/utils";

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

  const initClient = async () => {
    setLoading(true);
    await accountFromSecret().then(async (account) => {
      const client = await createClient(account);
      setClient(client);
      setAccount(account);
      setAddress(account.address);

      setMessage("Auto roll buy started!");
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

      console.log(`$MAS balance: ${numberBalance}`);

      let rolls = Math.floor(numberBalance / 100);

      const oneRoll =
        100 + buyFee + serviceFee + Math.floor(numberBalance * serviceFee);

      if (
        numberBalance > oneRoll &&
        numberBalance <
          rolls * 100 +
            buyFee +
            serviceFee +
            Math.floor(numberBalance * serviceFee)
      ) {
        rolls -= 1;
      }

      const newRollsAmount =
        rolls * 100 +
        buyFee +
        serviceFee +
        Math.floor(numberBalance * serviceFee);

      const newRollAmount =
        rolls > 1
          ? newRollsAmount
          : 100 + buyFee + serviceFee + Math.floor(numberBalance * serviceFee);

      const amountToNewRoll = newRollAmount - numberBalance;
      setAmountToNewRoll(
        numberBalance < 100 ? amountToNewRoll + 1 : amountToNewRoll
      );

      let fee = rolls;
      if (fee > 100) {
        fee = maxServiceFee;
      }

      if (numberBalance > newRollAmount) {
        setServiceMasFee(fee);
        const message =
          rolls > 0
            ? `$MAS amount reached for ${rolls} rolls`
            : "Not enough $MAS to buy rolls";
        setMessage(message);
        setBuyRolls(rolls);
      }
    }
  }, [balance, loading]);

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
      sendFeeOperation(client!, serviceMasFee.toString()).then((feeTx) => {
        console.log(`Fee tx: ${feeTx[0]}, fee: ${serviceMasFee}`);
        setMessage(`Fee txId: ${feeTx[0]}, fee: ${serviceMasFee}`);

        operationStatus(client!, feeTx[0], false).then(({ status }) => {
          console.log(`Fee status: ${status}`);
          setMessage(`Fee status: ${status}`);

          if (status === 6) {
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

  return (
    <main className={styles.main}>
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

      <div className={styles.description}>
        <p>
          1 roll = 100 $MAS + {buyFee} $MAS tx fee + {serviceFee * 100}% service
          fee + {serviceFee} $MAS tx fee
        </p>
      </div>
      <div className={styles.description}>
        <p>Max service fee: {maxServiceFee + serviceFee} $MAS</p>
      </div>
      <div className={styles.description}>
        <p>Fee example: 1 auto roll = 1.01 $MAS service + tx fee</p>
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
