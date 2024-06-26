import { useState, useEffect, useCallback, useContext } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./StockDashBoard.css";

function WelcomeHeader() {
  return <div>"Welcome!"</div>;
}

function FormInput({ id, label, type, step, value, onChange }) {
  return (
    <div className="form-input">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function StockForm({
  handleOnSubmit,
  symbol,
  purchasePrice,
  purchaseAmount,
  handleChangeSymbol,
  handleChangePurchasePrice,
  handleChangePurchaseAmount,
}) {
  const formInputs = [
    {
      id: "stockSymbol",
      label: "Enter Stock Ticker",
      type: "text",
      step: "0.1",
      value: symbol,
      onChange: handleChangeSymbol,
    },
    {
      id: "purchasePrice",
      label: "Enter Purchase Price",
      type: "number",
      step: "0.1",
      value: purchasePrice,
      onChange: handleChangePurchasePrice,
    },
    {
      id: "purchaseAmount",
      label: "Enter Purchase Amount",
      type: "number",
      step: "0.1",
      value: purchaseAmount,
      onChange: handleChangePurchaseAmount,
    },
  ];

  return (
    <form onSubmit={handleOnSubmit}>
      {formInputs.map((input) => (
        <FormInput key={input.id} {...input} />
      ))}
      <button type="submit">Submit Form</button>
    </form>
  );
}

function UserFormHeader() {
  return <div>Create Your Own Stocks DashBoard!</div>;
}

function UserFormInputs({ setFormMessage, setFormInputs }) {
  const [symbol, setSymbol] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (symbol && purchasePrice && purchaseAmount) {
      setFormInputs({
        symbol: symbol,
        purchasePrice: purchasePrice,
        purchaseAmount: purchaseAmount,
      });
      setFormMessage("Form Submitted Successfully! Retrieving Data...");
    } else {
      let errorMessage = "Please fill in the following fields: ";
      if (!symbol) errorMessage += "stock ticker, ";
      if (!purchasePrice) errorMessage += "purchase price, ";
      if (!purchaseAmount) errorMessage += "purchase amount, ";
      errorMessage = errorMessage.slice(0, -2);
      setFormMessage(errorMessage);
    }
  };

  return (
    <StockForm
      handleOnSubmit={handleOnSubmit}
      symbol={symbol}
      purchasePrice={purchasePrice}
      purchaseAmount={purchaseAmount}
      handleChangeSymbol={(e) => setSymbol(e.target.value)}
      handleChangePurchasePrice={(e) => setPurchasePrice(e.target.value)}
      handleChangePurchaseAmount={(e) => setPurchaseAmount(e.target.value)}
    />
  );
}

function UserFormResponse({ formMessage }) {
  return (
    <div>
      <div>{formMessage}</div>
    </div>
  );
}

function UserForm({ setFormInputs }) {
  const [formMessage, setFormMessage] = useState(
    "Submit to Add A Stock Component."
  );

  return (
    <>
      <UserFormHeader />
      <UserFormInputs
        setFormMessage={setFormMessage}
        setFormInputs={setFormInputs}
      />
      <UserFormResponse formMessage={formMessage} />
    </>
  );
}

function StockComponent({ formInputs }) {
  // Use the formInputs state here
  console.log("Form Inputs in StockComponent:", formInputs);

  return <div>{formInputs.symbol}</div>;
}

function StockList() {}

function Footer() {
  return <div>{/* Render the footer */}</div>;
}

function StockDashBoard() {
  const [formInputs, setFormInputs] = useState({});

  return (
    <>
      <div>
        <WelcomeHeader />
        <UserForm setFormInputs={setFormInputs} />
        <StockComponent formInputs={formInputs} />
        <Footer />
      </div>
    </>
  );
}

export default StockDashBoard;
