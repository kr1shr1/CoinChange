import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar.jsx';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import GroupCard from '../../Components/GroupCard/GroupCard.jsx';

export default function Main({ user, setUser, thememode, toggle}) {
  const [showGroup, setShowGroup] = useState(false);
  const [showGroupJoin, setShowGroupJoin] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupData, setGroupData] = useState([]); // Here's the correct declaration

  const [friendName, setFriendName] = useState('');
  const [groupInput, setGroupInput] = useState({
    userId: user._id,
    title: '',
    groupCode: '',
  });
  const [joinCode, setJoinCode] = useState({
    userId: user._id,
    JoingCode: '',
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
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  };

  // Function to send friend request
  const handleSendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:3001/friend/sendRequest/${user._id}`, {
        friendName,
      });
      alert(res.data.message);
      setFriendName('');
    } catch (err) {
      console.log(err);
    }
  };

  // Create group function
  const handleSubmit = (e) => {
    const groupCode = uuid();
    const addGroup = async () => {
      try {
        const res = await axios.post('http://localhost:3001/group/create', {
          groupInput: { ...groupInput, groupCode },
        });
        const val = res.data.newgroup;
        setGroupData((prev) => [...prev, val]);
      } catch (err) {
        console.log(err);
      }
    };
    addGroup();
    console.log(groupData)
    setGroupInput({
      userId: user._id,
      title: '',
    });
    handleGroupClose()
  };

  // Function to join group
  const handleJoin = () => {
    const addGroup = async () => {
      try {
        const res = await axios.post('http://localhost:3001/group/join', { joinCode });
        console.log(res.data.message);
        const temp = res.data.newgroup
        setGroupData((prev) => [...prev, temp]);
      } catch (err) {
        console.log(err.response.data.message);
      }
    };
    addGroup();
    setJoinCode({
      userId: user._id,
      JoingCode: '',
    });
  };

  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/group/getgroups/${user._id}`);
        setGroupData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getGroups();
  }, []);

  return (
    <div style={{ backgroundColor: thememode === 'dark' ? '#181818' : 'white' }}>
      <Navbar thememode={thememode} toggle={toggle} />
      <div className="flex flex-col gap-2 justify-start items-start min-h-screen" style={{ backgroundColor: thememode === 'dark' ? '#181818' : '#f0f0f0' }}>
        <div className="flex justify-between w-full">
          <div>
            <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-8 decoration-[#8656cd] dark:text-[#f0f0f0]"> Friends & Groups</div>
            <div className="mx-4 mt-4 text-gray-600 dark:text-gray-400 ">Streamline Bill Splitting and Debt Settlement Among Friends</div>
          </div>
          <button onClick={handleAddFriendShow} className="bg-[#8656cd] text-white p-4 rounded-lg m-4">+ Invite Friend</button>
        </div>
        <div className=" flex justify-left items-start w-full mb-4 mt-2 mx-4">
          <button onClick={handleGroupShow} className="bg-[#8656cd] text-white p-4 rounded-lg mx-2">+ Create Group</button>
          <button onClick={handleGroupJoinShow} className="bg-[#8656cd] text-white p-4 rounded-lg mx-2">Join Group</button>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-2 justify-evenly items-center gap-6 w-full h-fit dark:bg-[#181818]">
          {groupData?.map((data) => (
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
          ))}
        </div>
        <Modal show={showGroup} onHide={handleGroupClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="title">Group Name: </label>
            <input type="text" name={'title'} value={title} onChange={handleGroupInput('title')} required />
          </Modal.Body>
          <Modal.Footer>
            <button className="bg-[#8656cd] p-2 rounded-md text-white" onClick={handleSubmit} required>
              Save
            </button>
          </Modal.Footer>
        </Modal>
        <Modal show={showGroupJoin} onHide={handleGroupJoinClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Join Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="JoingCode">Group Code: </label>
            <input type="text" name={'JoingCode'} value={JoingCode} onChange={handleJoinInput('JoingCode')} required />
          </Modal.Body>
          <Modal.Footer>
            <button className="bg-[#8656cd] p-2 rounded-md text-white" onClick={handleJoin} required>
              Save
            </button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddFriend} onHide={handleAddFriendClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Friend</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="friendName">Enter Username of friend: </label>
            <input type="text" name="friendName" value={friendName} onChange={handleAddFriendInput} required />
          </Modal.Body>
          <Modal.Footer>
            <button className="bg-[#8656cd] p-2 rounded-md text-white" onClick={handleSendRequest} required>
              Invite
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
