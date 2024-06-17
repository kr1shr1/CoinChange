import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar.jsx"; // Ensure the path and case match the actual file
import Avatar from "@mui/material/Avatar";
import "./Profile.css"; // Import your CSS file
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close"; 
import { v4 as uuidv4 } from "uuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const Profile = ({ user, setUser, setIsLoggedIn }) => {
  const params = useParams();
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [profileRating, setProfileRating] = useState(0);
  const [reviews, setReviews] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [openEditSnack, setOpenEditSnack] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/user/getUser/${params.id}`
        );
        setData(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    const getRating = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/reviews/getRating/${params.id}`
        );
        setProfileRating(res.data.rating);
      } catch (err) {
        console.log(err);
      }
    };

    const getReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/reviews/getReviews/${params.id}`
        );
        setReviews(res.data.reviews);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
    getRating();
    getReviews();
  }, [params.id]);

  const handleSubmit = async () => {
    try {
      const review = {
        _id: uuidv4(),
        Reviewer: user._id,
        ReviewedUser: params.id,
        ReviewerName: user.name,
        Rating: rating,
        Comment: comment,
        Date: new Date(),
      };
      const res = await axios.post(
        `http://localhost:3001/api/reviews/addReview/${params.id}`,
        review
      );
      setComment("");
      setRating(0);
      handleClose();
      toast.success("Review added successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };
  const handleCloseEditSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenEditSnack(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const actionedit = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseEditSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setNewPhoto(file);
  };

  const handlePhotoUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("photo", newPhoto);
      await axios.post(
        `http://localhost:3001/api/user/updatePhoto/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar user={user} setIsLoggedIn={setIsLoggedIn} />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <h1>{data?.username}</h1>
            <div className="name" style={{ fontSize: "24px", color: "white" }}>
              Name: {data?.name}
            </div>
            <div className="rating">
              {Math.round(profileRating * 100) / 100}
            </div>
          </div>
          <label htmlFor="photo-upload" className="photo-icon">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <Avatar src="/broken-image.jpg" className="avatar" />
          </label>
        </div>

        <div className="separator"></div>
        <div className="profile-details">
          <div className="w-1/2 float-left mr-4">
            <div className="about-section bg-gray-100 p-4 rounded font-semibold text-gold mt-2">
              <h2>About</h2>
              <div className="email mt-4">EMAIL: {data?.email}</div>
              <div className="age mt-4">Age: {data?.age}</div>
              <div className="location mt-4">Location: {data?.location}</div>
              <div className="gender mt-4">Gender: {data?.gender}</div>
            </div>
            <Link to={`/reviews/${params.id}`} className="see-reviews-button">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#006400",
                  color: "goldenrod",
                  borderRadius: "5%",
                  padding: "12px 24px",
                  fontSize: "16px",
                }}
                size="small"
              >
                <span style={{ color: "goldenrod" }}>See Reviews</span>
              </Button>
            </Link>
          </div>

        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography component="legend" variant="subtitle1">
              How is {data.name} as a driver/rider? Leave a review!
            </Typography>
            <div className="flex flex-col justify-around">
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                className="mb-4 mt-2"
                aria-required
              />
              <TextField
                id="outlined-multiline-static"
                label="Review"
                multiline
                rows={4}
                className="my-2"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-end mt-5">
              <Button variant="outlined" size="large" onClick={handleSubmit}>
                Add Review
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
      <ToastContainer />
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        action={action}
        onClose={handleCloseSnack}
        message="Review deleted"
      />
      <Snackbar
        open={openEditSnack}
        autoHideDuration={6000}
        action={actionedit}
        onClose={handleCloseEditSnack}
        message="Review edited"
      />
    </div>
  );
};

export default Profile;
