export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';
export const RECEIVE_TOTAL_BILL = 'RECEIVE_TOTAL_BILL';
export const RECEIVE_BILL = 'RECEIVE_BILL';

export function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    users,
  };
}

export function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    user,
  };
}
export function receiveProduct(product) {
  return {
    type: RECEIVE_PRODUCT,
    product,
  };
}
export function receiveTotalBill(total) {
  return {
    type: RECEIVE_TOTAL_BILL,
    total,
  };
}

export function receiveBill(bills, page) {
  return {
    type: RECEIVE_BILL,
    bills,
    page,
  };
}
