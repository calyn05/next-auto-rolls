export const decimalPoint = (
  value: BigInt,
  decimals: number,
  toFixed: number = decimals
) => {
  return (Number(value) / 10 ** decimals).toFixed(toFixed);
};
