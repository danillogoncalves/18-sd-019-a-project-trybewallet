// Coloque aqui suas actions
export const RECEIVE_EMAIL = 'RECEIVE_EMAIL';
export const RECEIVE_CODE_CURRERY_SUCCESS = 'RECEIVE_CODE_CURRERY_SUCCESS';
export const RECEIVE_CODE_CURRERY_FAILURE = 'RECEIVE_CODE_CURRERY_FAILURE';

export const receiveEmail = (value) => ({
  type: RECEIVE_EMAIL, email: value,
});
export const receiveCodeCoinSuccess = (currency) => ({
  type: RECEIVE_CODE_CURRERY_SUCCESS, currencies: currency,
});

export const receiveCodeCoinFailure = (error) => ({
  type: RECEIVE_CODE_CURRERY_SUCCESS, error,
});
