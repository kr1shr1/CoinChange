import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { AiFillEdit, AiFillDelete, AiTwotoneCalendar } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Button } from "react-bootstrap";

const BillCard = ({ billflag, setbillflag, user, BillData, thememode }) => {
  const [show, setShow] = useState(false);
  const [BillInput, setBillInput] = useState({
    userId: user._id,
    title: "",
    dueDate: "",
    amount: "",
    toWhom: "",
    recurring: "",
  });

  const { title, amount, toWhom, dueDate } = BillInput;

  // Function to handle the bill's input
  const handleBillInput = (name) => (e) => {
    setBillInput({ ...BillInput, [name]: e.target.value });
  };

  // Handling the closing and opening of edit modal
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setBillInput({
      userId: user._id,
      title: BillData.title,
      dueDate: BillData.dueDate,
      amount: BillData.amount,
      toWhom: BillData.toWhom,
      recurring: BillData.recurring,
    });
    setShow(true);
  };

  // Function to handle submitting the edit data
  const handleSubmit = (e) => {
    e.preventDefault();
    const editBill = async () => {
      try {
        const res = await axios.put(
          `http://localhost:3001/bill/editBill/${BillData._id}`,
          { BillInput }
        );
        console.log(res.data.message);
        setBillInput({
          userId: user._id,
          title: "",
          dueDate: "",
          amount: "",
          toWhom: "",
          recurring: "",
        });
        setbillflag((prev) => !prev);
        handleClose();
      } catch (err) {
        console.log(err);
      }
    };
    editBill();
  };

  // Handling the delete function with confirmation
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bill?"
    );
    if (!confirmDelete) {
      return;
    }

    const delBill = async (id) => {
      try {
        const res = await axios.delete(
          `http://localhost:3001/bill/deleteBill/${id}`
        );
        console.log(res.data.message);
        setbillflag((prev) => !prev);
      } catch (err) {
        console.log(err);
      }
    };
    delBill(id);
  };

  // Function to track past due payments
  const paymentTime = () => {
    let duedate = new Date(BillData.dueDate);
    let currDate = new Date();
    return currDate > duedate;
  };

  return (
    <div>
      <Card
        variant="light"
        className="mx-4 my-4 p-3"
        style={{
          backgroundColor: "#F4F4F4",
          color: "#333333",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Card.Body>
          <Card.Title style={{ color: paymentTime() ? "#FF4500" : "#32CD32" }}>
            {BillData.title}
          </Card.Title>
          <Card.Text>To: {BillData.toWhom}</Card.Text>
          <Card.Text>Amount: &#8377; {BillData.amount}</Card.Text>
          <Card.Text>
            Date: {BillData.dueDate?.substring(0, 10)}{" "}
            <AiTwotoneCalendar size={20} />
          </Card.Text>
          <div className="d-flex justify-content-end">
            <AiFillEdit
              onClick={handleShow}
              style={{
                cursor: "pointer",
                color: "#007BFF",
                marginRight: "1rem",
              }}
            />
            <AiFillDelete
              onClick={() => handleDelete(BillData._id)}
              style={{ cursor: "pointer", color: "#DC3545" }}
            />
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}
        >
          <Modal.Title>Edit Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="amount" style={{ color: "#333333" }}>
            Amount:
          </label>
          <input
            type="number"
            value={amount}
            name={"amount"}
            onChange={handleBillInput("amount")}
            required
            className="form-control"
          />

          <label htmlFor="person" style={{ color: "#333333" }}>
            To Whom:
          </label>
          <input
            type="text"
            name={"person"}
            value={toWhom}
            onChange={handleBillInput("toWhom")}
            required
            className="form-control"
          />

          <label htmlFor="title" style={{ color: "#333333" }}>
            Title:
          </label>
          <input
            type="text"
            name={"title"}
            value={title}
            onChange={handleBillInput("title")}
            required
            className="form-control"
          />

          <label htmlFor="date" style={{ color: "#333333" }}>
            Date:
          </label>
          <input
            type="date"
            name={"dueDate"}
            value={dueDate}
            onChange={handleBillInput("dueDate")}
            required
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BillCard;
