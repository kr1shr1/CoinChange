const express = require('express')
const { creategroup,joingroup,getgroups,getmembers,splitBill, markPaid, markApproved,deleteGroup, simplifyDebt, approveDebt, getDebts,getgroup,addComment,getAllComments, addFriendsToGroup } = require("../Controllers/groups");

const router = express.Router();
router.post("/create",creategroup)
router.post("/join",joingroup)
router.put("/addfriendsgroup/:id",addFriendsToGroup)
router.get("/getgroups/:id",getgroups)
router.get("/getgroup/:id",getgroup)
router.get("/getmembers/:id",getmembers)
router.post("/splitbill",splitBill)
router.put("/markpaid/:id",markPaid)
router.put("/markapproved/:id",markApproved)
router.post("/simplifyDebt/:id",simplifyDebt)
router.post("/approveDebt/:id",approveDebt)
router.get("/getDebts/:groupId",getDebts)
router.delete("/remove/:id",deleteGroup)
router.post("/addcomment",addComment)
router.get("/getcomments/:id",getAllComments)


module.exports = router