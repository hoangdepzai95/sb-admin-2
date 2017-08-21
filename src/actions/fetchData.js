export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';
export const RECEIVE_TOTAL_BILL = 'RECEIVE_TOTAL_BILL';
export const RECEIVE_BILL = 'RECEIVE_BILL';
export const RECEIVE_STATUS = 'RECEIVE_STATUS';
export const RECEIVE_CATEGORY = 'RECEIVE_CATEGORY';

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

export function receiveStatus(data) {
  return {
    type: RECEIVE_STATUS,
    data,
  };
}

export function receiveCategory(data) {
  return {
    type: RECEIVE_CATEGORY,
    data,
  };
}
