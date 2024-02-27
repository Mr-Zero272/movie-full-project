db.getCollection("movie").aggregate([
    {
        $lookup: {from : "requirement", localField: "requirement", foreignField: "_id", as: "req"}
    },
    {
        $match: {"req.0.specificRequireTypes": { $elemMatch: { "typeName": {$in: ["3D"]}, "nScreenings": 2}}, "genres": {$in : [ObjectId("65978b44080dda3f81e06106")]} }
    }
])
