import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actionFetchCurrency from '../actions/actionsAsysc';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      currencies: [],
      description: '',
      currency: '',
      method: 'Dinheiro',
      tag: 'Alimentação',
    };
  }

  async componentDidMount() {
    const { getCodeCurrencies } = this.props;
    await getCodeCurrencies();
    const { currencies } = this.props;
    this.setState({
      currencies,
      currency: currencies[0],
    });
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { userEmail } = this.props;
    const { value, currencies, description, currency, method, tag } = this.state;
    const METHODS = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
    const TAGS = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
    return (
      <div>
        <header>
          <h1>TrybeWallet</h1>
          <span data-testid="email-field">{ userEmail }</span>
          <span data-testid="total-field">0</span>
          <span data-testid="header-currency-field">
            BRL
          </span>
        </header>
        <div>
          <label htmlFor="valueId">
            Valor:
            <input
              data-testid="value-input"
              id="valueId"
              type="number"
              name="value"
              value={ value }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="descriptionId">
            Descrição:
            <input
              data-testid="description-input"
              id="descriptionId"
              type="text"
              name="description"
              value={ description }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="currencyId">
            Moeda:
            <select
              id="currencyId"
              name="currency"
              value={ currency }
              onChange={ this.handleChange }
            >
              { currencies.map((eCurrency, index) => (
                <option key={ index } value={ eCurrency }>{eCurrency}</option>
              ))}
            </select>
          </label>
          <label htmlFor="methodId">
            Método de pagamento:
            <select
              data-testid="method-input"
              id="methodId"
              name="method"
              value={ method }
              onChange={ this.handleChange }
            >
              { METHODS.map((eMethod, index) => (
                <option key={ index } value={ eMethod }>{eMethod}</option>
              ))}
            </select>
          </label>
          <label htmlFor="tagId">
            Categoria:
            <select
              data-testid="tag-input"
              id="tagId"
              name="tag"
              value={ tag }
              onChange={ this.handleChange }
            >
              { TAGS.map((eTag, index) => (
                <option key={ index } value={ eTag }>{eTag}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.user.email,
  currencies: state.wallet.currencies,
});

const mapDispatchToProps = (dispatch) => ({
  getCodeCurrencies: (currencies) => dispatch(actionFetchCurrency(currencies)),
});

Wallet.propTypes = {
  userEmail: PropTypes.string.isRequired,
  getCodeCurrencies: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
