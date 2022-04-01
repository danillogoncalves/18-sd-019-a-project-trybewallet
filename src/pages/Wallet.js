import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actionFetchCurrency from '../actions/actionsAsysc';

class Wallet extends React.Component {
  componentDidMount() {
    const { getCodeCurrencies } = this.props;
    getCodeCurrencies();
  }

  render() {
    const { userEmail } = this.props;
    return (
      <div>
        <h1>TrybeWallet</h1>
        <span data-testid="email-field">{ userEmail }</span>
        <span data-testid="total-field">0</span>
        <span data-testid="header-currency-field">
          BRL
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.user.email,
});

const mapDispatchToProps = (dispatch) => ({
  getCodeCurrencies: (currencies) => dispatch(actionFetchCurrency(currencies)),
});

Wallet.propTypes = {
  userEmail: PropTypes.string.isRequired,
  getCodeCurrencies: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
