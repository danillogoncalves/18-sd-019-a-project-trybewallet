import { receiveCodeCoinFailure, receiveCodeCoinSuccess } from '.';
import currencyQuoteBRLApi from '../services/currencyQuoteBRLApi';

const actionFetchCurrency = () => async (dispatch) => {
  try {
    const response = await currencyQuoteBRLApi();
    const currencies = Object.keys(response)
      .filter((currency) => currency !== 'USDT');
    return dispatch(receiveCodeCoinSuccess(currencies));
  } catch (error) {
    return dispatch(receiveCodeCoinFailure(error));
  }
};

export default actionFetchCurrency;
