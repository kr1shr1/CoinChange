import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Button } from "react-bootstrap";
import { AiTwotoneCalendar } from "react-icons/ai";
// ------------- TransactionCard --------------------------
const TransactionCard = ({
  user,
  transactionData,
  key,
  thememode,
  toggle,
  setTransactionData,
  setUpdateFlag,
}) => {
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
  if (!transactionData) {
    return (
      <>
        <div>No Transactions Exists</div>
      </>
    );
  }
  const { type, amount, category, desc, date, currency } = transInput;
  //  ---------------- Input ---------------------
  const handleTransInput = (name) => (e) => {
    setTransInput({ ...transInput, [name]: e.target.value });
  };
  // -------------------- functions to handle open and close  ---------------
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //  ---------------- function to handle submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3001/trans/editTransaction/${transactionData._id}`,
        { transInput }
      );
      console.log(res.data);
      setTransInput({
        userId: user._id,
        type: "expense",
        amount: "",
        category: "",
        desc: "",
        date: "",
        currency: "",
      });
      setUpdateFlag((prev) => !prev);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  //  --------------function to delete ---------------
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/trans/deleteTransaction/${id}`
      );
      console.log(res.data);
      console.log(transactionData);
      setUpdateFlag((prevFlag) => !prevFlag);
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
    <Card className="mx-4 my-4 p-4 bg-[#bfc0c0] shadow-md rounded-lg w-64 h-64">
      <Card.Header className="font-bold text-lg overflow-hidden text-[#1b263b] border-b-2 border-gray-200 dark:border-gray-700">
        Category: {transactionData.category}
      </Card.Header>
      <Card.Body className="flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2 text-gray-600">
          <Card.Text className="text-md font-semibold ">
            Amount: <span className="text-green-600">₹{transactionData.amount}</span>
          </Card.Text>
          <div className="flex gap-2">
            <AiFillEdit
              onClick={handleShow}
              className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-150"
            />
            <AiFillDelete
              onClick={() => handleDelete(transactionData._id)}
              className="text-red-500 hover:text-red-700 cursor-pointer transition duration-150"
            />
          </div>
        </div>
        <Card.Text className="text-sm font-bold text-gray-600  mb-1">
          Description: {transactionData.desc}
        </Card.Text>
        <Card.Text className="text-sm text-gray-600 ">
          Date: {transactionData?.date?.substring(0, 10)}
        </Card.Text>
      </Card.Body>
    </Card>

      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Add transaction input section
          <label htmlFor="type">Transaction type: </label>
          <select
            name="type"
            id="type"
            selected="Expense"
            value={type}
            onChange={handleTransInput("type")}
            className="px-1 border-1 py-1 mx-2 rounded-md"
            required
          >
            <option
              value="expense"
              className="font-bold"
              style={{ color: "red" }}
            >
              Expense
            </option>
            <option
              value="income"
              className="font-bold"
              style={{ color: "green" }}
            >
              Income
            </option>
          </select>
          <br />
          <Card variant="light" border="success" className="mx-4 my-4">
            <Card.Header className="font-bold">
              Transaction Category :- {transactionData.category}
            </Card.Header>
            <Card.Body>
              <div className="flex justify-between items-center gap-40 border-2">
                <Card.Text className="text-2xl  flex justify-evenly items-center font-bold mx-1">
                  &#x20B9;{transactionData.amount}
                </Card.Text>

                <div className="flex justify-between items-center gap-40">
                  <Card.Text className="flex align-middle my-1 mx-2">
                    <AiTwotoneCalendar
                      size={20}
                      style={{ cursor: "pointer" }}
                    />
                    {transactionData.date &&
                      transactionData.date.substring(0, 10)}
                  </Card.Text>

                  <div className="flex justify-between items-center gap-6">
                    <AiFillEdit
                      onClick={handleShow}
                      style={{ cursor: "pointer", fontSize: "20px" }}
                    />
                    <AiFillDelete
                      onClick={() => handleDelete(transactionData._id)}
                      style={{ cursor: "pointer", fontSize: "20px" }}
                    />
                  </div>
                </div>
              </div>
              <Card.Text className="font-bold my-2">
                Transaction description :- {"  "}
                {transactionData.desc}
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton style={{ cursor: "pointer" }}>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="type">Transaction type: </label>
          <select
            name="type"
            id="type"
            selected="Expense"
            value={type}
            onChange={handleTransInput("type")}
            className="px-1 border-1 py-1 mx-2 rounded-md"
            required
          >
            <option
              value="expense"
              className="font-bold"
              style={{ color: "red" }}
            >
              Expense
            </option>
            <option
              value="income"
              className="font-bold"
              style={{ color: "green" }}
            >
              Income
            </option>
          </select>
          <br />

          <label htmlFor="amount">Amount: </label>
          <input
            type="number"
            value={amount}
            name={"amount"}
            onChange={handleTransInput("amount")}
            required
            style={{ color: type === "expense" ? "red" : "green" }}
          />

          <label htmlFor="category">Category: </label>
          <input
            name={"category"}
            value={category}
            type="text"
            onChange={handleTransInput("category")}
            required
          />

          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            value={desc}
            name={"desc"}
            onChange={handleTransInput("desc")}
          />

          <label htmlFor="date">Date:</label>
          <input
            type="date"
            value={date}
            name={"date"}
            onChange={handleTransInput("date")}
            required
          />
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
    </div>
  );
};

export default TransactionCard;
