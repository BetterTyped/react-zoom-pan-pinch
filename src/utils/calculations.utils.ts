/**
 * Rounds number to given decimal
 * eg. roundNumber(2.34343, 1) => 2.3
 */
export const roundNumber = (num: number, decimal: number) => {
  return Number(num.toFixed(decimal));
};

/**
 * Checks if value is number, if not it returns default value
 * 1# eg. checkIsNumber(2, 30) => 2
 * 2# eg. checkIsNumber(null, 30) => 30
 */
export const checkIsNumber = (num: any, defaultValue: number) => {
  return typeof num === "number" ? num : defaultValue;
};
