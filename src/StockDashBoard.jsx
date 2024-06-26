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
      setFormMessage(
        "Form Submitted Successfully! Submit to Add More Stocks to Your Stock List!"
      );
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

  const [stockData, setStockData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStockData = () => {
      setLoading(true);
      setError(null);

      fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${formInputs.symbol}&apikey=demo`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch stock data");
          }
          return response.json();
        })
        .then((data) => {
          setStockData(data);
        })
        .catch((error) => {
          console.error("Error fetching stock data:", error);
          setError("Failed to fetch stock data. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (formInputs.symbol) {
      fetchStockData();
    }
  }, [formInputs.symbol]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <ComponentDisplay formInputs={formInputs} stockData={stockData} />
    </div>
  );
}

function ComponentDisplay({ formInputs, stockData }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const currentPrice =
    stockData["Global Quote"] && stockData["Global Quote"]["05. price"];

  const profitLoss =
    (currentPrice - formInputs.purchasePrice) * formInputs.purchaseAmount;

  const handleOnClick = (e) => {
    console.log("Delete Stock");
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null;
  } else if (formInputs.symbol && stockData["Global Quote"]) {
    return (
      <div>
        <h1>Stock Symbol: {formInputs.symbol}</h1>
        <p>Quantity: {formInputs.purchaseAmount}</p>
        <p>Purchase Price: {formInputs.purchasePrice}</p>
        <p>Latest Price: {currentPrice}</p>
        <p>Profit/Loss: {profitLoss}</p>
        <button onClick={handleOnClick}>Delete Stock</button>
      </div>
    );
  } else {
    return null;
  }
}

function StockList({ formInputs }) {
  const [stockList, setStockList] = useState([]); // Initialize stockList with an empty array of StockComponents.

  useEffect(() => {
    if (Object.keys(formInputs).length !== 0) {
      setStockList((prevStockList) => [...prevStockList, formInputs]);
    }
  }, [formInputs]);

  return (
    <>
      <div>
        <h1>Your Stock List</h1>
        {stockList.length === 0 ? (
          <p>No stocks added yet.</p>
        ) : (
          stockList.map((inputs, index) => (
            <StockComponent key={index} formInputs={inputs} />
          ))
        )}
      </div>
    </>
  );
}

function Footer() {
  return <div></div>;
}

function StockDashBoard() {
  const [formInputs, setFormInputs] = useState({});

  return (
    <>
      <div>
        <WelcomeHeader />
        <UserForm setFormInputs={setFormInputs} />
        <StockList formInputs={formInputs} />
        <Footer />
      </div>
    </>
  );
}

export default StockDashBoard;
