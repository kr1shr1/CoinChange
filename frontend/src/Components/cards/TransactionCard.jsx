import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
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
  const { type, amount, category, desc, date} = transInput;
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
      <Modal.Header className="bg-gray-200">
        <Modal.Title className="text-xl font-bold text-blue-900">
          Edit Transaction
        </Modal.Title>
        <button
          type="button"
          className="absolute top-0 right-0 mt-2 mr-2 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2"
          onClick={handleClose}
        >
          <span aria-hidden="true" className="text-bold rounded-full">
            x
          </span>
        </button>
      </Modal.Header>
      <Modal.Body className="bg-gray-200 text-blue-900 p-4 space-y-4">
        {/* Transaction Type Input */}
        <div>
          <label htmlFor="type" className="block font-medium">
            Transaction Type
          </label>
          <select
            name="type"
            id="type"
            value={type}
            onChange={handleTransInput('type')}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="expense" className="font-bold text-red-500">
              Expense
            </option>
            <option value="income" className="font-bold text-green-500">
              Income
            </option>
          </select>
        </div>

        {/* Currency Input */}
        <div>
          <label htmlFor="currency" className="block font-medium">
            Currency
          </label>
          <select
            name="currency"
            id="currency"
            value="inr"
            onChange={handleTransInput('currency')}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="inr">INR</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block font-medium">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={handleTransInput('amount')}
            className={`w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              type === 'expense' ? 'text-red-500' : 'text-green-500'
            }`}
            required
          />
        </div>

        {/* Category Input */}
        <div>
          <label htmlFor="category" className="block font-medium">
            Category
          </label>
          <input
            name="category"
            type="text"
            value={category}
            onChange={handleTransInput('category')}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="desc" className="block font-medium">
            Description
          </label>
          <input
            type="text"
            name="desc"
            value={desc}
            onChange={handleTransInput('desc')}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block font-medium">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={handleTransInput('date')}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-200 flex justify-end">
        <button
          className="bg-blue-900 px-4 py-2 rounded-md text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSubmit}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default TransactionCard;
