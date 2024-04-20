const user = require('../models/user');

async function sentRequest(req, res) {
    const {userId} = req.params
    const friend = req.body.friendName
    try {

    const userr = await user.findById(userId);
    const username  = userr.username
    console.log('9: ', username)
    const friendDocument = await user.findOne({username : friend})
        //!Friend not found
        if (!friendDocument) {
            return res.json({ message: "User not found !!" }).status(404);
        }
        //!Already friend
        if (friendDocument.friends.includes(username)) {
            return res.json({ message: "Already friend" }).status(200);
        }
        //!Already friend request send
        if (friendDocument.receivedRequests.includes(username)) {
            return res.json({ message: "Friend request alerady sent" }).status(200);
        }
        const userListUpdate = await user.findByIdAndUpdate(userId, { $push: { sentRequests: friend } }, { new: true });
        const friendListUpdate = await user.findByIdAndUpdate(friendDocument._id, { $push: { receivedRequests: username, inbox:`${username} sent you a friend request` } }, { new: true });
        return res.json({userListUpdate, friendListUpdate, message: "Friend Request Send" });

    } catch (err) {

        console.log(err, 'error with sending the request');
        return res.status(500).json({ error: "Internal Server Error" });

    }

}
async function acceptRequest(req, res) {
    try {
        const {userId} = req.body.userid
        const username = user.findById(userId).exec().username
        const friend = req.body.friendUsername
        const friendDocument =  user.findOne({ username : friend})

        if(!friendDocument) return res.json({message : "Enter valid User Detail"})
        if(friendDocument.friends.includes(username)) return res.json({message: "Already Friends"})


        const acceptingFriend = await user.findByIdAndUpdate(userId, { $push: { friends: friend }, $pull: { receivedRequests: friendName } }, {new: true });
        const updateWaitingList = await user.findByIdAndUpdate(friendDocument._id, {$push:{friends: username, inbox:`${username} accepted your friend request`}, $pull:{sentRequest: username}}, {new: true});

        res.json({acceptingFriend, updateWaitingList, message: 'Friend Request Accepted'})
        //?Again inbox feature not implemented
    } catch (err) {
        console.log(err, 'error with the accepting the request');
        return res.status(500).json({ error: "Internal Server Error" });
        
    }
}



module.exports = {sentRequest, acceptRequest}