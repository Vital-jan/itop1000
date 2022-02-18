import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import body_img from "./img/bgc.jpg";

const Body = () => {
  return (
    <div className="body">
      <img src={body_img} alt="" />
    </div>
  );
};

const CurrencySelect = (props) => {
  return (
    <div className="currency-select-section">
      <select
        className="currency-select"
        onChange={(e) => {
          console.log(e.target.value);
        }}
      >
        {props.arr}
      </select>
      <input type="number" />
    </div>
  );
};

const Result = (props) => {
  return <div className="result-item">{props.value}</div>;
};

const Header = () => {
  const [currencyArr, setCurrencyArr] = useState();

  const loadCurrencyArray = async () => {
    let curArr = [];
    try {
      let currency = await axios.get(
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
      );
      currency.data.forEach((i, n) => {
        curArr.push(
          <option value={i.rate} key={n}>
            {i.cc} ({i.txt})
          </option>
        );
      });
      setCurrencyArr(curArr);
    } catch (err) {
      console.log("Error currency array load ", err);
    }
  };

  useEffect(() => {
    loadCurrencyArray();
  }, []);

  return (
    <header className="header">
      <CurrencySelect arr={currencyArr} />
      <CurrencySelect arr={currencyArr} />
      <Result value={"4.5.0"} />
    </header>
  );
};

const App = () => {
  return (
    <div className="App">
      <Header />
      <Body />
    </div>
  );
};

export default App;
