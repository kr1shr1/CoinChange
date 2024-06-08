import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "./GroupCard.css";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";

const GroupCard = ({
  key,
  setgroupData,
  groupData,
  allgroupsdata,
  setSelectedGroup,
  selectedGroup,
  thememode,
  toggle,
  user,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showGroupHome, setShowGroupHome] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState([]);
  const [checkedState, setCheckedState] = useState(
    new Array(user.friends.length).fill(false)
  );

  //! Change the state of friends list when the checkbox is checked
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
    const updatedFriends = user.friends.filter((friend, index) =>
      updatedCheckedState[index]
    );

    setFriends(updatedFriends);
  };

  //! Checked friends are send to join the group
  const handleAddFriendsToGroup = async () => {
    console.log(friends);
    try {
      const res = await axios.put(
        `http://localhost:3001/group/addfriend/${groupData._id}`,
        { friends }
      );
      alert(res.data.message);
      setShowAddFriend(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const [copied, setCopied] = useState(false);
  const handleAddFriendClose = () => setShowAddFriend(false);
  const handleAddFriendShow = () => setShowAddFriend(true);
  const handleCopyToClipboard = () => {
    setCopied(true);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOpenGroup = () => {
    setShowGroupHome(true);
    setSelectedGroup(groupData);
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/group/remove/${groupData._id}`
      );
      console.log(res);
      alert(res.data.message)
      const delgroup = res.data.groupp;
      setgroupData(allgroupsdata.filter((data) => data._id != delgroup._id));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center items-center card-parent h-full p-1">
      <Card
        border="secondary"
        className="card-component flex flex-col justify-start items-start gap-3"
        style={{
          backgroundColor: thememode === "dark" ? "#282828" : "white",
          color: thememode === "dark" ? "white" : "black",
        }}
      >
        <Card.Body className="w-full p-1 ">
          <div className="flex flex-col justify-start items-start gap-1">
            <Card.Header className="w-full">
              <b> Group Title</b> :- {groupData.title}
            </Card.Header>
            <div className="p-2">
              <Card.Text className="text-md w-fit justify-start items-center">
                <b> Group Code </b> :- <br />
                <div className="flex align-middle">
                  <div className="flex">
                    <input
                      type="text"
                      value={groupData.groupCode}
                      name=""
                      id=""
                      style={{
                        backgroundColor:
                          thememode === "dark" ? "#3a3a3a" : "white",
                      }}
                    />
                    <CopyToClipboard
                      text={groupData.groupCode}
                      onCopy={handleCopyToClipboard}
                    >
                      <button>
                        <MdContentCopy className="ml-2 text-xl" />
                      </button>
                    </CopyToClipboard>
                  </div>
                  <button
                    className="mx-2 px-2 bg-[#8656cd] rounded-md text-white lg:w-80 md:w-80"
                    onClick={handleAddFriendShow}
                  >
                    or Add Friend
                  </button>
                </div>
              </Card.Text>
            </div>

            <div className="w-full p-2 my-2 flex flex-col justify-center items-start gap-3">
              <button
                className="rounded-md p-1 text-white w-full bg-[#8656cd]"
                onClick={() => navigate(`/simplifydebt/${groupData._id}`)}
                style={{ cursor: "pointer" }}
              >
                Simplify Debt
              </button>
              <button
                className="rounded-md p-1 text-white w-full bg-[#8656cd]"
                onClick={() => navigate(`/billsplit/${groupData._id}`)}
                style={{ cursor: "pointer" }}
              >
                Split bill
              </button>

              <div className="flex justify-between items-center w-full">
                <AiFillEdit
                  onClick={handleShow}
                  style={{ cursor: "pointer" }}
                />
                <AiFillDelete onClick={handleDelete} />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Modal
        show={showAddFriend}
        onHide={handleAddFriendClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select friends to be added</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="friends-list">
            {user.friends.map((name, index) => {
              return (
                <li key={index}>
                  <div className="toppings-list-item h-8 align-middle">
                    <div className="left-section flex px-4 align-middle">
                      <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={name}
                        value={name}
                        checked={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                        className="flex justify-start w-4 align middle"
                      />
                      <label
                        htmlFor={`custom-checkbox-${index}`}
                        className="flex align-middle m-2"
                      >
                        {name}
                      </label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="rounded-md p-1 text-white w-full bg-[#8656cd]"
            onClick={handleAddFriendsToGroup}
            required
          >
            Add to group
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupCard;
