import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { AiTwotoneCalendar } from 'react-icons/ai';


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

  {
    /*-----------------function to handle the bill's input8--------*/
  }
  const handleBillInput = (name) => (e) => {
    setBillInput({ ...BillInput, [name]: e.target.value });
  };

  // -------------- handling the closing and opening of edit -------------
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // --------------funtion to handle the submitting the edit data ---------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const editBill = async () => {
      console.log(BillInput, " : Edit Bill");
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
      } catch (err) {
        console.log(err);
      }
    };
    editBill();
  };

  // ----------------  handling the delete function --------------------
  const handleDelete = (id) => {
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

  //function to track past due payments
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