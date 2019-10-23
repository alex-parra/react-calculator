import React from "react";
import ReactDOM from "react-dom";
import { combineReducers, createStore } from "redux";
import { connect, Provider } from "react-redux";

import "./styles.scss";

const isZero = num => /0$/.test(String(num));
const isNum = num => /\d$/.test(String(num));
const isDec = num => /\.$/.test(String(num));
const hasDec = num => /[+\-x\/]?(\d+\.\d*)$/.test(String(num));
const isOp = num => /[+\-x\/]$/.test(String(num));
const has2Ops = num => /[+\-x\/]{2}$/.test(String(num));

/*
 * State -------------------------
 */

//const { combineReducers, createStore } = Redux;

const baseStateDefault = {
  version: "0.1"
};

const baseReducer = (state = baseStateDefault, action) => {
  return state;
};

const appStateDefault = {
  value: 0,
  reset: false
};

const appStateActions = {
  SET_VALUE: "SET_VALUE"
};

const appActionSetValue = value => ({
  type: appStateActions.SET_VALUE,
  data: value
});

const appReducer = (state = appStateDefault, action) => {
  switch (action.type) {
    case appStateActions.SET_VALUE:
      let { value, reset } = state;
      const { type, data: newSymbol } = action;

      if (reset === true) {
        value = isNum(newSymbol) ? 0 : value;
        reset = false;
      }

      if (newSymbol === "AC") {
        value = appStateDefault.value;
      } else if (newSymbol === "=") {
        value = eval(value.replace("x", "*"));
        reset = true;
      } else if (isNum(newSymbol)) {
        if (isZero(value)) value = newSymbol;
        else if (isNum(value) || isOp(value) | isDec(value)) value += newSymbol;
      } else if (isDec(newSymbol)) {
        if (!isDec(value) && !hasDec(value)) value += newSymbol;
      } else if (isOp(newSymbol)) {
        if (isNum(value)) value += newSymbol;
        else if (isOp(value)) {
          if (newSymbol === "-") value += newSymbol;
          else if (has2Ops(value)) value = value.slice(0, -2) + newSymbol;
          else value = value.slice(0, -1) + newSymbol;
        }
      }

      return { ...state, value, reset };
  }

  return state;
};

const rootReducer = combineReducers({
  base: baseReducer,
  app: appReducer
});

const store = createStore(rootReducer);

/*
 * Components --------------------
 */

const Display = props => {
  return <div id="display">{props.value}</div>;
};

const TouchPad = props => {
  const _handleKeyClick = data => {
    props.onTouch(data);
  };

  return (
    <div className="touchPad">
      <Key id="clear" symbol={"AC"} onClick={_handleKeyClick} />
      <Key id="neg" symbol={"±"} onClick={_handleKeyClick} />
      <Key id="divide" symbol={"/"} onClick={_handleKeyClick} />

      <Key id="seven" symbol={"7"} onClick={_handleKeyClick} />
      <Key id="eight" symbol={"8"} onClick={_handleKeyClick} />
      <Key id="nine" symbol={"9"} onClick={_handleKeyClick} />
      <Key id="multiply" symbol={"x"} onClick={_handleKeyClick} />

      <Key id="four" symbol={"4"} onClick={_handleKeyClick} />
      <Key id="five" symbol={"5"} onClick={_handleKeyClick} />
      <Key id="six" symbol={"6"} onClick={_handleKeyClick} />
      <Key id="subtract" symbol={"-"} onClick={_handleKeyClick} />

      <Key id="one" symbol={"1"} onClick={_handleKeyClick} />
      <Key id="two" symbol={"2"} onClick={_handleKeyClick} />
      <Key id="three" symbol={"3"} onClick={_handleKeyClick} />
      <Key id="add" symbol={"+"} onClick={_handleKeyClick} />

      <Key id="zero" symbol={"0"} onClick={_handleKeyClick} />
      <Key id="decimal" symbol={"."} onClick={_handleKeyClick} />
      <Key id="equals" symbol={"="} onClick={_handleKeyClick} />
    </div>
  );
};

const Key = props => {
  const _handleClick = ev => {
    ev.preventDefault();
    ev.target.blur();
    props.onClick({ key: props.symbol });
  };

  return (
    <button id={props.id} onClick={_handleClick}>
      <span>{props.symbol}</span>
    </button>
  );
};

const Wrapper = props => {
  const _handleTouch = ({ key }) => {
    props.setValue(key);
  };

  return (
    <div className="wrapper">
      <Display value={props.app.value} />
      <TouchPad onTouch={_handleTouch} />
    </div>
  );
};

/*
 * Boot --------------------
 */

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  setValue: value => dispatch(appActionSetValue(value))
});

const WrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper);

const App = props => {
  return (
    <Provider store={store}>
      <WrapperContainer />
    </Provider>
  );
}; // class App

ReactDOM.render(<App />, document.getElementById("app"));
