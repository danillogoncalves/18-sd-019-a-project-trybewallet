import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionFetchCurrency, actionFetchExpenses } from '../actions/actionsAsysc';
import { deleteExpense } from '../actions';

const TAGS = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
const METHODS = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      currencies: [],
      description: '',
      currency: '',
      method: METHODS[0],
      tag: TAGS[0],
      isDisabled: true,
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
    }, () => this.validateButton());
  };

  validateButton = () => {
    const { value, description } = this.state;
    this.setState({
      isDisabled: !(value && description),
    });
  }

  handleClick = async () => {
    const {
      getExpenseAndExchangeRate,
    } = this.props;
    const { value, description, currency, method, tag } = this.state;
    await getExpenseAndExchangeRate({ value, description, currency, method, tag });
    const { currencies } = this.props;
    this.setState({
      value: '',
      description: '',
      currency: currencies[0],
      method: METHODS[0],
      tag: TAGS[0],
      isDisabled: true,
    });
  }

  totalExpenses = () => {
    const { expenses } = this.props;
    if (expenses.length) {
      return expenses.reduce((acc, curr) => {
        const { value, currency, exchangeRates } = curr;
        const sum = +value * +exchangeRates[currency].ask;
        acc += sum;
        return acc;
      }, 0).toFixed(2);
    }
    return 0;
  }

  deleteExpenseClick = ({ target }) => {
    const { expenses, getDeleteExpense } = this.props;
    getDeleteExpense(expenses, target.id);
  }

  render() {
    const { userEmail, expenses } = this.props;
    const { value, currencies, description,
      currency, method, tag, isDisabled } = this.state;
    return (
      <div>
        <header>
          <h1>TrybeWallet</h1>
          <span data-testid="email-field">{ userEmail }</span>
          <span data-testid="total-field">{this.totalExpenses()}</span>
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
          <input
            type="submit"
            value="Adicionar despesa"
            disabled={ isDisabled }
            onClick={ this.handleClick }
          />
        </div>
        <table>
          <tbody>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
            {
              expenses.map((expense) => (
                <tr key={ expense.id }>
                  <td>{ expense.description }</td>
                  <td>{ expense.tag }</td>
                  <td>{ expense.method }</td>
                  <td>{ (+expense.value).toFixed(2) }</td>
                  <td>{ expense.exchangeRates[expense.currency].name }</td>
                  <td>{ (+expense.exchangeRates[expense.currency].ask).toFixed(2) }</td>
                  <td>
                    { ((+expense.value)
                   * (+expense.exchangeRates[expense.currency].ask)).toFixed(2) }
                  </td>
                  <td>Real</td>
                  <td>
                    <input
                      data-testid="delete-btn"
                      type="button"
                      value="Excluir"
                      id={ expense.id }
                      onClick={ this.deleteExpenseClick }
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.user.email,
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  getCodeCurrencies: () => dispatch(actionFetchCurrency()),
  getExpenseAndExchangeRate: (expense) => dispatch(actionFetchExpenses(expense)),
  getDeleteExpense: (...payload) => dispatch(deleteExpense(...payload)),
});

Wallet.propTypes = {
  userEmail: PropTypes.string.isRequired,
  getCodeCurrencies: PropTypes.func.isRequired,
  getExpenseAndExchangeRate: PropTypes.func.isRequired,
  getDeleteExpense: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  expenses: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
