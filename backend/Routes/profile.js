const router = require('express').Router()
const profile = require('../Controllers/profile')


router.put('/addImg/:id', profile.profileImage)
router.get('/getInbox/:userId',profile.getInbox)


module.exports = router