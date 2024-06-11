import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./Dues.css";
import axios from "axios";
import BillCard from "../../Components/cards/BillCard.jsx";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import ToggleBtn from "../../Components/Navbar/ToggleBtn.jsx";

function Dues({ user, thememode, toggle }) {
  const [billflag, setbillflag] = useState(false);
  const [dueItem, setdueItem] = useState({
    userId: user._id,
    title: "",
    dueDate: "",
    amount: "",
    toWhom: "",
    recurring: "",
    currency: "",
  });

  const [filterInput, setFilterInput] = useState({
    userId: user._id,
    category: "",
    startDate: "",
    endDate: "",
  });

  const [deleteDiv, setdeleteDiv] = useState(false);
  const [BillData, setBillData] = useState([]);
  // ---------------input -----------------------
  const handleBillInput = (name) => (e) => {
    setdueItem({ ...dueItem, [name]: e.target.value });
  };
  // -----------------function to manage mails -------------------
  const mailsendstart = async () => {
    try {
      const reqmail = user.email;
      console.log(reqmail);
      const res = await axios.post(
        "http://localhost:3001/api/mail/sendstartmail",
        { reqmail }
      );
      alert("Message Sent Successfully");
    } catch (err) {
      console.error("Error sending start mail:", err);
    }
  };

  const mailsendrecurring = async (recurring) => {
    try {
      const reqmail = user.email;
      const duedate = dueItem.dueDate;
      const recurring = dueItem.recurring;
      console.log(reqmail);
      const res = await axios.post(
        "http://localhost:3001/mail/sendmailrecurring",
        { reqmail, duedate, recurring }
      );
      alert("Message Sent Successfully");
    } catch (err) {
      console.error("Error sending recurring mail:", err);
    }
  };
  // ----------------------- Submit -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(dueItem);
    try {
      const res = await axios.post("http://localhost:3001/bill/addBill", {
        dueItem,
      });
      console.log(res.data.savingData);
      console.log(res.data.savingData.message);
      alert(res.data.message);

      setdueItem({
        title: "",
        dueDate: "",
        amount: "",
        toWhom: "",
        recurring: "",
        currency: "",
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this bill?");
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

  //! To get the prev bills of user from the database
  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/bill/getBill/${user._id}`
        );
        console.log(res.data.billDetail);
        setBillData(res.data.billDetail);
      } catch (err) {
        console.log(err.resposne.data.message);
      }
    };
    getBills();
  }, [billflag]);

  return (
    <>
      <Navbar/>
      <div className="outer min-h-screen w-full bg-gray-900">
        <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-8 text-gray-200">
          Bills and Dues
        </div>
        <div className="mx-4 text-green-500 mt-2">
          Manage your recurring bills and dues here. Receive reminders through
          e\mail.
        </div>

        <div className="hero-section h-full flex flex-wrap justify-between">
          <div className="hero-left border border-purple-600 dark:border-gray-600 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full md:w-[45%] lg:w-[30%]">
            <div className="due flex flex-col gap-4 mb-4">
              <label htmlFor="Title" className="text-black ">
                Reason
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Input due-title"
                value={dueItem.title}
                onChange={handleBillInput("title")}
                className="p-2 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            <div className="due flex flex-col gap-4 mb-4">
              <label htmlFor="Date" className="text-black dark:text-white">
                Due-Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                placeholder="Input date of due"
                value={dueItem.dueDate}
                onChange={handleBillInput("dueDate")}
                className="p-2 rounded-md dark:bg-gray-700 dark:text-gray-400"
              />
            </div>

            <div className="due flex flex-col gap-4 mb-4">
              <label htmlFor="amount" className="text-black dark:text-white">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                required
                placeholder="Input amount"
                value={dueItem.amount}
                onChange={handleBillInput("amount")}
                className="p-2 rounded-md dark:bg-gray-700"
              />
            </div>

            <div className="due flex flex-col gap-4 mb-4">
              <label htmlFor="PersonDue" className="text-black dark:text-white">
                Due-To-Person
              </label>
              <input
                type="text"
                name="toWhom"
                id="toWhom"
                required
                value={dueItem.toWhom}
                onChange={handleBillInput("toWhom")}
                placeholder="To whom"
                className="p-2 rounded-md dark:bg-gray-700"
              />
            </div>

            <div className="due flex flex-col gap-4 mb-4">
              <label htmlFor="currency" className="text-black dark:text-white">
                Currency:
              </label>
              <select
                name="currency"
                id="currency"
                value={dueItem.currency}
                onChange={handleBillInput("currency")}
                className="p-2 rounded-md dark:bg-gray-700 dark:text-gray-400"
                required
              >
                <option>Select:</option>
                <option value="inr">INR</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="jpy">JPY</option>
                <option value="aud">AUD</option>
                <option value="cad">CAD</option>
                <option value="cny">CNY</option>
                <option value="hkd">HKD</option>
                <option value="sgd">SGD</option>
                <option value="chf">CHF</option>
                <option value="sek">SEK</option>
                <option value="mxn">MXN</option>
              </select>
            </div>

            <div className="due flex flex-col gap-4 mb-4">
              <label htmlFor="recurring" className="text-black dark:text-white">
                Recurring:
              </label>
              <select
                name="recurring"
                id="recurring"
                required
                value={dueItem.recurring}
                onChange={handleBillInput("recurring")}
                className="p-2 rounded-md dark:bg-gray-700 dark:text-gray-400"
              >
                <option value="">Select</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div
              className="add-btn flex justify-center items-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              onClick={handleSubmit}
            >
              Add Due
            </div>
          </div>

          <div className="hero-right w-full md:w-[55%] lg:w-[65%] mt-4 md:mt-0">
            <div className="storing-dues">
              <div className="overflow-y-scroll w-full max-h-[500px] bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
                {BillData?.map((bill) => (
                  <BillCard
                    billflag={billflag}
                    setbillflag={setbillflag}
                    user={user}
                    BillData={bill}
                    key={bill._id}
                    thememode={thememode}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dues;
