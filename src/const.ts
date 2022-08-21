export const SALT_ROUND = 5;
export enum TRANSACTION_ENUM {
  INCOME = 'income',
  EXPENSES = 'expenses',
}
export const jwtConstants = {
  secret: process.env.jwtSecret || 'secret',
};
