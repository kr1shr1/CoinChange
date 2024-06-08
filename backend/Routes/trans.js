const router =require('express').Router();
const trans = require('../Controllers/trans');


router.post('/addTransaction', trans.addTrans)
router.get('/getTransactions/:userId', trans.getTrans)
router.put('/editTransaction/:id', trans.editTrans)
router.delete('/deleteTransaction/:id', trans.deleteTrans)
router.get("/getTotalStats/:userId",trans.getTotalStats);
router.post("/getTransactionsByFilter",trans.getTransFilter);
router.get("/getWeekly/:userId", trans.getWeekly);
router.get("/getMonthly/:userId",trans.getMonthly);
router.get("/getYearly/:userId",trans.getYearly);
router.get("/getCategoryWise/:userId",trans.getCategoryWise);

//! TO BE FINALIZE MORE ROUTES





module.exports = router