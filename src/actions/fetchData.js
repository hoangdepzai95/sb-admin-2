export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';

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
