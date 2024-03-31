db.getCollection("user").aggregate([
    {
        $match: {
            createdAt : { $gte: ISODate("2024-03-18"), $lt: ISODate("2024-03-19") }
        }
    },
    { $count: "totalUser" }
])

db.getCollection("user").find({})

db.getCollection("user").aggregate([
  {
    $project: {
      dateOfMonth: { $dayOfMonth: "$createdAt" },
      total: 1,
      serviceFee: 1
    }
  },
  {
    $group: {
      _id: { dateOfMonth: "$dateOfMonth" },
      count: { $sum: NumberInt(1) },
    }
  }
])