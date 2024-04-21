const Transaction = require("../models/trans");

const addTrans = async (req, res) => {
  const transaction = new Transaction(req.body);
  try {
    await transaction.save();
    res
      .status(200)
      .json({ message: "Transaction saved successfully", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error at adding Transaction" });
  }
};

const getTrans = async (req, res) => {
  const { userId } = req.params;
  try {
    const transaction = await Transaction.find({ userId: userId });
    if (!transaction) {
      return res.json({ message: "No Transaction Found" }).status(404);
    }
    return res
      .json({ transaction, message: "Transaction fetched successfully" })
      .status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error at fetching Transaction" });
  }
};

const editTrans = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  // console.log(req.body.transInput)
  try {
    const transaction = await Transaction.find({ userId : id });
    if (!transaction)
      return res
        .status(404)
        .json({ message: "Unable to fetch the give transaction detail" });

    const newtran = await Transaction.findByIdAndUpdate(
      id,
      {
        $set: req.body.transInput,
      },
      { new: true }
    );

    if (!newtran)
      return res.status(404).json({ meassage: "Transaction not found" });

    res.json(newtran);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error at editing transaction" });
  }
};

const deleteTrans = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const transaction = await Transaction.findById(id);
    console.log(transaction);
    if (!transaction)
      return res
        .status(404)
        .json({ message: "Unable to fetch the given transaction" });
    const deleted = await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Succesfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error at deleting the transaction" });
  }
};

const getTransFilter = async (req, res) => {
  const { userId, category, startDate, endDate } = req.body.filterInput;
  try {
    let filter = { userId: userId };
    if (req.body.filterInput.category !== "") {
      filter.category = category;
    }
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate + "T00:00:00.000+00:00"),
        $lte: new Date(endDate + "T23:59:59.999+00:00"),
      };
    }
    const trans = await Transaction.find(filter).sort({ date: -1 });
    if (!trans) {
      return res
        .status(404)
        .json({ message: "Unable to find filtered Transaction" });
    }
    res.json({ trans, message: "Filtered Transaction" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTotalStats = async (req, res) => {
  const userId = req.params.userId;
  console.log("user:", userId);
  try {
    // Calculate total income
    const incomeResult = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: "income",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    // Calculate total expenses
    const expenseResult = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: "expense",
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome =
      incomeResult.length > 0 ? Math.floor(incomeResult[0].totalIncome) : 0;
    const totalExpense =
      expenseResult.length > 0 ? Math.floor(expenseResult[0].totalExpense) : 0;
    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
    // res.json({incomeResult,expenseResult})
  } catch (err) {
    res.json({ message: "No stats found" });
  }
};
const getWeekly = async (req, res) => {
  const userId = req.params.userId;
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const weeklyData = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: sevenDaysAgo, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          totalIncome: 1,
          totalExpense: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 }, // Sort by date in ascending order
      },
    ]);

    res.json({ weeklyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMonthly = async (req, res) => {
  const userId = req.params.userId;

  try {
    const currentDate = new Date();
    // currentDate.setHours(23, 59, 59, 999);
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: firstDayOfMonth, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" },
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          month: "$_id",
          totalIncome: 1,
          totalExpense: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    res.json({ monthlyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getYearly = async (req, res) => {
  const userId = req.params.userId;

  try {
    const currentDate = new Date();
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const yearlyData = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: firstDayOfYear, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y", date: "$date" },
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          year: "$_id",
          totalIncome: 1,
          totalExpense: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1 },
      },
    ]);

    res.json({ yearlyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCategoryWise = async (req, res) => {
  const id = req.params.userId;
  try {
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          userId: id,
        },
      },
      {
        $group: {
          _id: { $toLower: "$category" },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);
    res.json(categoryData);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getTrans,
  editTrans,
  deleteTrans,
  addTrans,
  getTransFilter,
  getTotalStats,
  getWeekly,
  getMonthly,
  getYearly,
  getCategoryWise,
};
