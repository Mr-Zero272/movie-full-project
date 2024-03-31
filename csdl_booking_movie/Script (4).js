db.getCollection("order").aggregate([
  {
    $project: {
      month: { $month: "$createdAt" },
      total: 1,
      serviceFee: 1
    }
  },
  {
    $group: {
      _id: { month: "$month" },
      totalSum: { $sum: "$total" },
      serviceFeeSum: { $sum: "$serviceFee" }
    }
  }
])