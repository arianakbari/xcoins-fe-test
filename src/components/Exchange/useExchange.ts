import { useReducer, useState } from "react";
import getExchangeRate from "../../services/api";
import { toDecimalPlaces } from "../../utils";

const initialState = {
  balances: {
    USD: {
      amount: 200,
      sign: "$",
    },
    EUR: {
      amount: 150,
      sign: "€",
    },
    GBP: {
      amount: 10,
      sign: "£",
    },
  },
  fromCurrency: "",
  fromValue: 0,
  toCurrency: "",
  toValue: 0,
  rate: 0,
};

enum ACTIONS {
  SET_BALANCE,
  SET_FROM_CURRENCY,
  SET_FROM_VALUE,
  SET_TO_CURRENCY,
  SET_TO_VALUE,
  SET_RATE,
  EXCHANGE,
  SWAP,
}

type Action =
  | { type: ACTIONS.SET_BALANCE; payload: { currency: string; value: number } }
  | {
      type: ACTIONS.SET_FROM_CURRENCY | ACTIONS.SET_TO_CURRENCY;
      payload: string;
    }
  | { type: ACTIONS.SET_FROM_VALUE | ACTIONS.SET_TO_VALUE; payload: number }
  | { type: ACTIONS.SET_RATE; payload: number }
  | { type: ACTIONS.EXCHANGE }
  | { type: ACTIONS.SWAP; payload: { swapValues: boolean } };

function reducer(
  state: typeof initialState,
  action: Action
): typeof initialState {
  switch (action.type) {
    case ACTIONS.SET_BALANCE:
      return {
        ...state,
        balances: {
          ...state.balances,
          [action.payload.currency]: {
            // @ts-ignore
            ...state.balances[action.payload.currency],
            amount: action.payload.value,
          },
        },
      };
    case ACTIONS.SET_FROM_CURRENCY:
      return {
        ...state,
        fromCurrency: action.payload,
      };
    case ACTIONS.SET_TO_CURRENCY:
      return {
        ...state,
        toCurrency: action.payload,
      };
    case ACTIONS.SET_FROM_VALUE:
      return {
        ...state,
        fromValue: action.payload,
        toValue: state.rate
          ? toDecimalPlaces(state.rate * action.payload, 4)
          : state.toValue,
      };
    case ACTIONS.SET_TO_VALUE:
      return {
        ...state,
        toValue: action.payload,
      };
    case ACTIONS.SET_RATE:
      return {
        ...state,
        rate: toDecimalPlaces(action.payload, 4),
        toValue: toDecimalPlaces(action.payload * state.fromValue, 4),
      };
    case ACTIONS.EXCHANGE:
      return {
        ...state,
        balances: {
          ...state.balances,
          [state.fromCurrency]: {
            ...(state.balances as any)[state.fromCurrency],
            amount: toDecimalPlaces(
              (state.balances as any)[state.fromCurrency].amount -
                state.fromValue,
              2
            ),
          },
          [state.toCurrency]: {
            ...(state.balances as any)[state.toCurrency],
            amount: toDecimalPlaces(
              (state.balances as any)[state.toCurrency].amount + state.toValue,
              2
            ),
          },
        },
        fromValue: 0,
        toValue: 0,
      };
    case ACTIONS.SWAP:
      const { fromCurrency, fromValue, toCurrency, toValue } = state;
      const rate = toDecimalPlaces(1 / state.rate, 4);
      return {
        ...state,
        fromCurrency: toCurrency,
        toCurrency: fromCurrency,
        rate,
        fromValue: action.payload.swapValues ? toValue : fromValue,
        toValue: action.payload.swapValues ? fromValue : toValue,
      };
  }
  return state;
}

const useExchange = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const getFromCurrencies = (): string[] => {
    let currencies = Object.keys(state.balances);
    if (state.toCurrency)
      currencies = currencies.filter((cur) => cur !== state.toCurrency);
    return currencies;
  };
  const getToCurrencies = (): string[] => {
    let currencies = Object.keys(state.balances);
    if (state.fromCurrency)
      currencies = currencies.filter((cur) => cur !== state.fromCurrency);
    return currencies;
  };
  const fromValueOnChange = (value: string) => {
    dispatch({
      type: ACTIONS.SET_FROM_VALUE,
      payload: value !== "" ? Math.abs(toDecimalPlaces(value, 2)) : 0,
    });
  };
  const fromCurrencyOnChange = async (value: string) => {
    dispatch({
      type: ACTIONS.SET_FROM_CURRENCY,
      payload: value,
    });
    // if toCurrency is set, get the exchange rate
    if (state.toCurrency) {
      try {
        dispatch({
          type: ACTIONS.SET_RATE,
          payload: await getExchangeRate(value, state.toCurrency),
        });
      } catch (error) {
        // some error handling
      }
    }
  };
  const toCurrencyOnChange = async (value: string) => {
    dispatch({
      type: ACTIONS.SET_TO_CURRENCY,
      payload: value,
    });
    // if fromCurrency is set, get the exchange rate
    if (state.fromCurrency) {
      try {
        dispatch({
          type: ACTIONS.SET_RATE,
          payload: await getExchangeRate(state.fromCurrency, value),
        });
      } catch (error) {
        // some error handling
      }
    }
  };
  const exchangeBtnOnClick = () => {
    if (state.fromValue > (state.balances as any)[state.fromCurrency].amount) {
      setShowErrorDialog(true);
      return;
    }
    dispatch({ type: ACTIONS.EXCHANGE });
  };
  const swapBtnOnClick = () => {
    dispatch({
      type: ACTIONS.SWAP,
      payload: { swapValues: !!state.fromValue },
    });
  };

  return {
    state,
    showErrorDialog,
    setShowErrorDialog,
    getFromCurrencies,
    getToCurrencies,
    fromValueOnChange,
    fromCurrencyOnChange,
    toCurrencyOnChange,
    exchangeBtnOnClick,
    swapBtnOnClick,
  };
};

export default useExchange;
