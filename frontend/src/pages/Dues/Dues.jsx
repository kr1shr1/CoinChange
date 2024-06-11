import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./Dues.css";
import axios from "axios";
import BillCard from '../../Components/cards/BillCard.jsx';
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
      alert(res.data.message)


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

  //! To get the prev bills of user from the database
  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/bill/getBill/${user._id}`
        );
        // console.log(res.data.billDetail);
        setBillData(res.data.billDetail);
      } catch (err) {
        console.log(err.resposne.data.message);
      }
    };
    getBills();
  }, [billflag, dueItem]);


  return (
    <>
      <Navbar thememode={thememode} toggle={toggle} />
      <div className="outer min-h-screen w-full bg-gray-100 dark:bg-gray-800">
        <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-8 text-purple-600 dark:text-gray-200">
          Bills and Dues
        </div>
        <div className="mx-4 text-gray-600 dark:text-gray-400 mt-2">
          Manage your recurring bills and dues here. Receive reminders through
          email.
        </div>

        <div className="hero-section h-full">
          <div className="hero-left border-purple-600 dark:border-gray-600 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="due flex justify-between w-full gap-4">
              <label
                htmlFor="Title"
                className="w-[30%] text-black dark:text-white"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Input due-title"
                value={dueItem.title}
                onChange={handleBillInput("title")}
                className="w-[70%] p-2 dark:bg-gray-700"
                required
              />
            </div>

            <div className="due flex justify-between w-full gap-4">
              <label
                htmlFor="Date"
                className="w-[30%] text-black dark:text-white"
              >
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
                className="w-[70%] p-2 dark:bg-gray-700 dark:text-gray-400"
              />
            </div>

            <div className="due flex justify-between w-full gap-4">
              <label
                htmlFor="amount"
                className="w-[30%] text-black dark:text-white"
              >
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                required
                placeholder="Input amount in Rs."
                value={dueItem.amount}
                onChange={handleBillInput("amount")}
                className="w-[70%] p-2 rounded-md text-center bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div className="due flex justify-between w-full gap-4 dueperson ">
              <label
                htmlFor="PersonDue"
                className="w-[30%] text-black dark:text-white"
              >
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
                className="w-[70%] p-2 dark:bg-gray-700"
              />
            </div>

            <div className="due flex justify-between w-full gap-4">
              <label htmlFor="currency" className="text-black dark:text-white">
                Currency:
              </label>
              <select
                name="currency"
                id="currency"
                value={dueItem.currency}
                onChange={handleBillInput("currency")}
                className="w-[70%] p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-400"
                required
              >
                <option>Select:</option>
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
            </div>

            <div className="due flex justify-between w-full gap-4">
              <label htmlFor="recurring" className="text-black dark:text-white mt-2">
                Recurring:
              </label>
              <select
                name="recurring"
                id="recurring"
                required
                value={dueItem.recurring}
                onChange={handleBillInput("recurring")}
                className="w-[70%] p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-400 mt-2"
              >
                <option value="">Select</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div
              className="add-btn flex justify-center items-center cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              onClick={handleSubmit}
            >
              Add Due
            </div>
          </div>

          <div className="hero-right h-full">
            <div className="storing-dues">
              <div className="overflow-y-scroll w-full max-h-[500px]">
                {BillData?.map((bill) => (
              <BillCard billflag={billflag} setbillflag={setbillflag} user={user} BillData={bill} key={bill._id} thememode={thememode}/>
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
