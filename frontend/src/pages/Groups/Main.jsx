import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import axios from "axios";
import GroupCard from "../../Components/GroupCard/GroupCard.jsx";

export default function Main({ user, setUser, thememode, toggle }) {
  const [showGroup, setShowGroup] = useState(false);
  const [showGroupJoin, setShowGroupJoin] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupData, setGroupData] = useState([]); // Here's the correct declaration

  const [friendName, setFriendName] = useState("");
  const [groupInput, setGroupInput] = useState({
    userId: user._id,
    title: "",
    groupCode: "",
  });
  const [joinCode, setJoinCode] = useState({
    userId: user._id,
    JoingCode: "",
  });

  const { title, groupCode } = groupInput;
  const { JoingCode } = joinCode;

  // Modal opening and closing logic
  const handleGroupClose = () => setShowGroup(false);
  const handleGroupShow = () => setShowGroup(true);
  const handleGroupJoinClose = () => setShowGroupJoin(false);
  const handleGroupJoinShow = () => setShowGroupJoin(true);
  const handleAddFriendShow = () => setShowAddFriend(true);
  const handleAddFriendClose = () => setShowAddFriend(false);

  // Handling input
  const handleGroupInput = (name) => (e) => {
    setGroupInput({ ...groupInput, [name]: e.target.value });
  };

  const handleJoinInput = (name) => (e) => {
    setJoinCode({ ...joinCode, [name]: e.target.value });
  };

  const handleAddFriendInput = (e) => {
    setFriendName(e.target.value);
  };

  // Generating random group join code logic
  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  // Function to send friend request
  const handleSendRequest = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3001/friend/sendRequest/${user._id}`,
        {
          friendName,
        }
      );
      alert(res.data.message);
      setFriendName("");
    } catch (err) {
      console.log(err);
    }
  };

  // Create group function
  const handleSubmit = (e) => {
    const groupCode = uuid();
    const addGroup = async () => {
      try {
        const res = await axios.post("http://localhost:3001/group/create", {
          groupInput: { ...groupInput, groupCode },
        });
        const val = res.data.newgroup;
        setGroupData((prev) => [...prev, val]);
      } catch (err) {
        console.log(err);
      }
    };
    addGroup();
    console.log(groupData);
    setGroupInput({
      userId: user._id,
      title: "",
    });
    handleGroupClose();
  };

  // Function to join group
  const handleJoin = () => {
    const addGroup = async () => {
      try {
        const res = await axios.post("http://localhost:3001/group/join", {
          joinCode,
        });
        console.log(res.data.message);
        const temp = res.data.newgroup;
        setGroupData((prev) => [...prev, temp]);
      } catch (err) {
        console.log(err.response.data.message);
      }
    };
    addGroup();
    setJoinCode({
      userId: user._id,
      JoingCode: "",
    });
  };

  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/getgroups/${user._id}`
        );
        setGroupData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getGroups();
  }, []);
  return (
    <div
      style={{ backgroundColor: thememode === "dark" ? "#181818" : "white" }}
    >
      <Navbar thememode={thememode} toggle={toggle} />
      <div className="flex flex-col gap-2 justify-start items-start h-[60vh] bg-slate-900">
        <div className="flex justify-between w-full">
          <div>
            <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-8 decoration-slate-400 text-[#f0f0f0]">
              {" "}
              Friends & Groups
            </div>
            <div className="mx-4 mt-4 text-gray-400 text-2xl ">
              Streamline Bill Splitting and Debt Settlement Among Friends !
            </div>
          </div>
          <button
            onClick={handleAddFriendShow}
            className="transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white font-bold p-4 rounded-lg m-4"
          >
            + Invite Friend
          </button>
        </div>
        <div className=" flex justify-left h-[30vh] items-start w-full mb-4 mt-2 mx-4">
          <button
            onClick={handleGroupShow}
            className="transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white p-4 rounded-lg mx-2"
          >
            + Create Group
          </button>
          <button
            onClick={handleGroupJoinShow}
            className="transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white p-4 rounded-lg mx-2"
          >
            Join Group
          </button>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-2 justify-evenly items-center gap-6 w-full h-fit">
          {!groupData[0] ? (
            <div className="-translate-y-5 px-4 text-xl bg-slate-900">
              No Group Found
            </div>
          ) : (
            groupData?.map((data) => (
              <GroupCard
                key={data._id}
                setGroupData={setGroupData}
                groupData={data}
                allgroupsdata={groupData}
                setSelectedGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
                thememode={thememode}
                toggle={toggle}
                user={user}
              />
            ))
          )}
        </div>

        {/* Example Modal schema */}
        <Modal
          show={showGroup}
          onHide={handleGroupClose}
          animation={false}
          centered
        >
          <Modal.Header className="bg-[#e2e8f0]">
            <Modal.Title className="text-xl font-bold text-[#1b263b]">
              Add Group
            </Modal.Title>
            <button
              type="button"
              className="absolute top-0 right-0 mt-2 mr-2 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2"
              onClick={handleGroupClose}
            >
              <span aria-hidden="true" className="text-bold rounded-full">
                x
              </span>
            </button>
          </Modal.Header>
          <Modal.Body className="bg-[#e2e8f0] text-[#1b263b] p-4 space-y-1">
            <label htmlFor="title" className="block font-medium text-[#1b263b]">
              Group Name:{" "}
            </label>
            <input
              type="text"
              name={"title"}
              value={title}
              onChange={handleGroupInput("title")}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </Modal.Body>
          <Modal.Footer className="bg-[#e2e8f0] flex justify-end">
            <button
              className="bg-[#1b263b] mr-1 px-4 py-2 rounded-md text-white font-semibold hover:bg-[#2e4266] focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSubmit}
              required
            >
              Save
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showGroupJoin}
          onHide={handleGroupJoinClose}
          animation={false}
          centered
        >
          <Modal.Header className="bg-[#e2e8f0]">
            <Modal.Title className="text-xl font-bold text-[#1b263b]">
              Join Group
            </Modal.Title>
            <button
              type="button"
              className="absolute top-0 right-0 mt-2 mr-2 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2"
              onClick={handleGroupJoinClose}
            >
              <span aria-hidden="true" className="text-bold rounded-full">
                x
              </span>
            </button>
          </Modal.Header>
          <Modal.Body className="bg-[#e2e8f0] text-[#1b263b] p-4 space-y-1">
            <label
              htmlFor="JoingCode"
              className="block font-medium text-[#1b263b]"
            >
              Group Code:
            </label>
            <input
              type="text"
              name="JoingCode"
              value={JoingCode}
              onChange={handleJoinInput("JoingCode")}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </Modal.Body>
          <Modal.Footer className="bg-[#e2e8f0] flex justify-end">
            <button
              className="bg-[#1b263b] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#2e4266] focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleJoin}
              required
            >
              Save
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showAddFriend}
          onHide={handleAddFriendClose}
          animation={false}
          centered
        >
          <Modal.Header className="bg-[#e2e8f0]">
            <Modal.Title className="text-xl font-bold text-[#1b263b]">
              Add Friend
            </Modal.Title>
            <button
              type="button"
              className="absolute top-0 right-0 mt-2 mr-2 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2"
              onClick={handleAddFriendClose}
            >
              <span aria-hidden="true" className="text-bold rounded-full">
                x
              </span>
            </button>
          </Modal.Header>
          <Modal.Body className="bg-[#e2e8f0] text-[#1b263b] p-4 space-y-1">
            <label
              htmlFor="friendName"
              className="block font-medium text-[#1b263b]"
            >
              Enter Username of friend:
            </label>
            <input
              type="text"
              name="friendName"
              value={friendName}
              onChange={handleAddFriendInput}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </Modal.Body>
          <Modal.Footer className="bg-[#e2e8f0] flex justify-end">
            <button
              className="bg-[#1b263b] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#2e4266] focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSendRequest}
              required
            >
              Invite
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
