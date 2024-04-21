import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import TransactionCard from "../../Components/cards/TransactionCard";
import { CSVLink } from "react-csv";
import "./Dashboard.css";

const Dashboard = ({ user, thememode, toggle, setUser }) => {
  const [updateFlag, setUpdateFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [transInput, setTransInput] = useState({
    userId: user._id,
    type: "expense",
    amount: "",
    category: "",
    desc: "",
    date: "",
    currency: "",
  });
  const [filterInput, setFilterInput] = useState({
    userId: user._id,
    category: "",
    startDate: "",
    endDate: "",
  });
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState(transactionData);
  const [filterState, setFilterState] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [incomeShow, setIncomeShow] = useState(false);
  const [expenseShow, setExpenseShow] = useState(false);
  const headers = [
    { label: "Transaction Type", key: "type" },
    { label: "Amount", key: "amount" },
    { label: "Category", key: "category" },
    { label: "Description", key: "desc" },
    { label: "Date", key: "date" },
  ];
  const { type, category, desc, date, currency } = transInput;
  let { amount } = transInput;

  useEffect(() => {
    console.log("transactionData: ", transactionData);
  }, [transactionData]);
  // Functions to handle modal visibility
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleIncomeClose = () => setIncomeShow(false);
  const handleIncomeShow = () => setIncomeShow(true);
  const handleExpenseClose = () => setExpenseShow(false);
  const handleExpenseShow = () => setExpenseShow(true);

  // Functions to handle input
  const handleTransInput = (name) => (e) => {
    setTransInput({ ...transInput, [name]: e.target.value });
  };

  // Handle Filter Input
  const handleFilterInput = (name) => (e) => {
    setFilterInput({ ...filterInput, [name]: e.target.value });
  };

  //? UseEffect for getting totalStats
  useEffect(() => {
    const getTotalStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/trans/getTotalStats/${user._id}`
        );
        console.log(res.data);
        setStats(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    getTotalStats();
  }, [updateFlag]);

  const isFilterEmpty =
    filterInput.category === "" &&
    filterInput.startDate === "" &&
    filterInput.endDate === "";

  //?useEffect for getting all transactions
  useEffect(() => {
    const temp = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/trans/getTransactions/${user._id}`
        );
        console.log(res.data.message);
        setTransactionData(res.data.transaction);
        if (isFilterEmpty) {
          setFilteredData(res.data.transaction);
        }
      } catch (err) {
        console.error(err.response.data);
      }
    };
    temp();
  }, [updateFlag]);

  //?function to retrieve user transactions with filter
  const handleFilter = (e) => {
    e.preventDefault();
    setFilterInput({
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isFilterEmpty) {
          const res = await axios.post(
            "http://localhost:3001/trans/getTransactionsByFilter",
            { filterInput }
          );
          console.log("Fetch Data for filtered");
          setFilteredData(res.data.trans);
          setTransactionData(res.data.trans);
        }
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchData();
  }, [updateFlag, filterInput, isFilterEmpty, user._id]);

  //function to send mail
  const mailsend = async () => {
    try {
      const reqmail = user.email;
      console.log(reqmail);
      const res = await axios
        .post("http://localhost:3001/mail/sendmail", { reqmail })
        .then(() => alert("Message Sent Succesfully"))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const currenciData = "inr";

  // Retrieve all user transactions or apply filter

  // Update unique categories
  useEffect(() => {
    if (transactionData) {
      const categoriesSet = new Set(
        transactionData.map((transaction) => transaction.category)
      );
      setUniqueCategories([...categoriesSet]);
    }
  }, [updateFlag, transactionData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(transInput);
    try {
      const res = await axios.post(
        "http://localhost:3001/trans/addTransaction",
        transInput
      );
      console.log(res.data.message);
      const val = res.data.transaction;
      setTransactionData((prev) => [...prev, val]);
      setUpdateFlag((prevFlag) => !prevFlag);
      handleClose();
    } catch (err) {
      console.log(err.response.data);
    }
    // mailsend();
    setTransInput({
      userId: user._id,
      type: "expense",
      amount: "",
      category: "",
      desc: "",
      date: "",
      currency: "",
    });
  };

  return (
    <div
      style={{ backgroundColor: thememode === "dark" ? "#181818" : "#f0f0f0" }}
    >
      <Navbar thememode={thememode} toggle={toggle} />
      <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-3 decoration-[#8656cd] dark:text-[#f0f0f0]">
        Welcome, {user.username}!
      </div>
      <div className="mt-2 mx-4 text-gray-600 dark:text-gray-400">
        Let's add some transactions!
      </div>
      <div className="h-full flex flex-col justify-center items-start ">
        <div
          className="flex w-[99vw] justify-evenly items-center h-20 p-4  d-parent"
          style={{
            backgroundColor: thememode === "dark" ? "#181818" : "#f0f0f0",
          }}
        >
          {/* User monetary stats */}
          <div className="  w-60 rounded-md flex flex-col justify-center bg-[#8656cd] h-10 text-white items-center chill">
            <div className="flex  justify-between p-4 font-bold gap-6">
              <div>Income</div>
              <div>&#8377;{stats.totalIncome}</div>
            </div>
          </div>
          <div className="  w-60 rounded-md flex flex-col justify-center bg-[#8656cd] h-10 text-white items-center chill">
            <div className="flex  justify-between p-4 font-bold gap-6">
              <div>Balance</div>
              <div>&#8377;{stats.balance}</div>
            </div>
          </div>
          <div className="  w-60 rounded-md flex flex-col justify-center bg-[#8656cd] h-10 text-white items-center chill">
            <div className="flex  justify-between p-4 font-bold gap-6">
              <div className="text-md flex justify-evenly gap-2">
                <span> Expense </span>
              </div>
              <div>&#8377;{stats.totalExpense}</div>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div
          className="flex px-4 py-4 justify-center items-center h-[100%] filter w-[99vw]"
          style={{
            backgroundColor: thememode === "dark" ? "#181818" : "#f0f0f0",
          }}
        >
          <div
            className="flex justify-center align-middle py-2 px-2 font-bold text-2xl"
            style={{ color: thememode === "dark" ? "white" : "black" }}
          >
            Filters:
          </div>
          {/* Category */}
          <select
            className="mx-2 border-2 rounded-md p-3 category-all"
            name="category"
            id="category"
            selected="All"
            onChange={handleFilterInput("category")}
            value={filterInput.category}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {/* Date */}
          <input
            type="date"
            id="startDate"
            className="mx-2 my-2 border-2 rounded-md p-3"
            value={filterInput.startDate}
            onChange={handleFilterInput("startDate")}
            placeholder="Start date"
          ></input>
          <input
            type="date"
            id="endDate"
            className="mx-2 my-2 border-2 rounded-md p-3"
            value={filterInput.endDate}
            onChange={handleFilterInput("endDate")}
            placeholder="End date"
          ></input>
          <button
            onClick={handleFilter}
            className="mx-2 p-2 my-2 bg-[#8656cd] text-white rounded-md lg:w-80"
          >
            Clear Filter
          </button>
          {/* Exporting data */}
          {/* <CSVLink className='export-dashboard' data={filteredData} headers={headers} filename={"Transaction_Data.csv"}><button className='my-2  p-2 bg-[#8656cd] text-white p-2 rounded-md'>Export</button></CSVLink> */}
        </div>
        {/* Listing Transaction Cards below filter bar */}
        <div className="min-h-screen w-full flex flex-col align-middle">
          <div style={{ width: "100%" }}>
            {(filterState === false ? transactionData : filteredData)?.map(
              (trans) => (
                <TransactionCard
                  user={user}
                  key={trans._id}
                  transactionData={trans}
                  thememode={thememode}
                  toggle={toggle}
                  setTransactionData={setTransactionData}
                  setUpdateFlag={setUpdateFlag}
                />
              )
            )}
          </div>
        </div>
      </div>
      {/* Add transaction modal */}
      <button
        onClick={handleShow}
        className="bg-[#8656cd] text-white rounded-full px-2 py-2 w-12 h-12 shadow-md fixed bottom-8 right-8"
      >
        +
      </button>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add transaction input section */}
          <label htmlFor="type">Transaction type: </label>
          <select
            name="type"
            id="type"
            value={type}
            onChange={handleTransInput("type")}
            className="px-1 border-1 py-1 mx-2 rounded-md"
            required
          >
            <option value="">Select</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <br />
          <label htmlFor="currency">Currency: </label>
          <select
            name="currency"
            id="currency"
            value={currency}
            onChange={handleTransInput("currency")}
            className="px-1 border-1 py-1 mx-2 rounded-md"
            required
          >
            <option value="inr">inr</option>
            <option value="usd">usd</option>
            <option value="eur">eur</option>
            <option value="gbp">gbp</option>
            <option value="jpy">jpy</option>
            <option value="aud">aud</option>
            <option value="cad">cad</option>
            <option value="cny">cny</option>
            <option value="hkd">hkd</option>
            <option value="sgd">sgd</option>
            <option value="chf">chf</option>
            <option value="sek">sek</option>
            <option value="mxn">mxn</option>
          </select>
          <br />
          <label htmlFor="amount">Amount: </label>
          <input
            type="number"
            name={"amount"}
            value={amount}
            onChange={handleTransInput("amount")}
            required
          ></input>
          <label htmlFor="category">Category: </label>
          <input
            name={"category"}
            type="text"
            value={category}
            onChange={handleTransInput("category")}
            required
          ></input>
          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            name={"desc"}
            value={desc}
            onChange={handleTransInput("desc")}
          ></input>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            name={"date"}
            value={date}
            onChange={handleTransInput("date")}
            required
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-[#8656cd] p-2 rounded-md text-white"
            onClick={handleSubmit}
            required
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={incomeShow}
        onHide={handleIncomeClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Congratulations! You are rewarded with a Badge!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src="BadeLog.png" alt="Badge Image" className="w-100" />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal
        show={expenseShow}
        onHide={handleExpenseClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Congratulations! You are rewarded with a Badge!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src="AAKR.png" alt="Badge Image" className="w-100" />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
