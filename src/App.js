import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import body_img from "./img/bgc.jpg";

const round = (value) => Math.round(value * 100) / 100;

const CurrencySelect = (props) => {
  // currency select component
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    >
      {props.arr}
    </select>
  );
};

const InputValue = (props) => {
  // amount value input component
  return (
    <input
      type="number"
      value={props.inputValue}
      onChange={(e) => {
        +e.target.value > 0
          ? props.onChange(+e.target.value)
          : props.onChange("");
      }}
    />
  );
};

const Header = () => {
  const defaultCurrency1 = "USD";
  const defaultCurrency2 = "UAH";
  const defaultInput1 = 1;
  const [currencyArr, setCurrencyArr] = useState(); // currency names & rates array
  const [rates, setRates] = useState([]);
  const [currency1, setCurrency1] = useState(defaultCurrency1);
  const [currency2, setCurrency2] = useState(defaultCurrency2);
  const [currencyRate1, setCurrencyRate1] = useState(1);
  const [currencyRate2, setCurrencyRate2] = useState(1);
  const [input1, setInput1] = useState(defaultInput1);
  const [input2, setInput2] = useState(0);

  const getRateByCode = (code) => {
    return rates.filter((i) => i.cc === code)[0].rate;
  };

  const selectChange1 = (val) => {
    setCurrency1(val);
    const newRate = getRateByCode(val);
    setCurrencyRate1(newRate);
    setInput2(round((+newRate * +input1) / +currencyRate2));
  };

  const selectChange2 = (val) => {
    setCurrency2(val);
    const newRate = getRateByCode(val);
    setCurrencyRate2(newRate);
    setInput1(round((+newRate * +input2) / +currencyRate1));
  };

  const inputChange1 = (val) => {
    setInput1(val);
    setInput2(round((+val * +currencyRate1) / +currencyRate2));
  };

  const inputChange2 = (val) => {
    setInput2(val);
    setInput1(round((+val * +currencyRate2) / +currencyRate1));
  };

  const loadCurrencyArray = async () => {
    // get currency array from NBU API
    try {
      let currency = await axios.get(
        // request to API
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
      );
      currency.data.push({
        // add UAH to array
        r030: 980,
        txt: "Українська гривня",
        rate: 1,
        cc: "UAH",
      });

      currency.data.sort((a, b) => {
        // sort by currency symbolic code
        return a.cc < b.cc ? -1 : 1;
      });

      let curArr = []; // <option> elements for select tag array
      let rates = [];
      currency.data.forEach((i, n) => {
        // create JSX <option> elements array
        curArr.push(
          <option key={n} value={i.cc} rate={i.rate}>
            {i.cc} ({i.txt})
          </option>
        );
        rates.push({ cc: i.cc, rate: i.rate });
      });
      setCurrencyArr(curArr);
      setRates(rates);
      const defRate1 = rates.filter((i) => i.cc === defaultCurrency1)[0].rate; // default rate of currency 1
      setCurrencyRate1(defRate1);
      const defRate2 = rates.filter((i) => i.cc === defaultCurrency2)[0].rate;
      setCurrencyRate2(defRate2); // default rate of currency 2
      setInput2(round((defaultInput1 * defRate1) / defRate2));
    } catch (err) {
      console.log("Error currency array load ", err);
    }
  };

  useEffect(() => {
    loadCurrencyArray();
  }, []);

  return (
    <header className="header">
      <h1>Конвертор валют</h1>
      <form action="">
        <div className="currency-select-section">
          <CurrencySelect
            value={currency1}
            arr={currencyArr}
            onChange={selectChange1}
          />
          <InputValue onChange={inputChange1} inputValue={input1} />
        </div>
        <div className="currency-select-section">
          <CurrencySelect
            value={currency2}
            arr={currencyArr}
            onChange={selectChange2}
          />
          <InputValue onChange={inputChange2} inputValue={input2} />
        </div>
      </form>
    </header>
  );
};

const Body = () => {
  return (
    <div className="body">
      <img src={body_img} alt="" />
    </div>
  );
};

const Footer = () => {
  return (
    <footer>
      Курси валют згідно поточного курсу{" "}
      <a href="https://bank.gov.ua" target="blanc">
        національного банку України
      </a>
    </footer>
  );
};

const App = () => {
  return (
    <div className="App">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default App;
