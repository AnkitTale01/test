const userModel = require("../models/userModel");
const verifyModel = require("../models/verifyModel");

const list = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let sortField = req.query.sortField ? req.query.sortField : "createdAt"
        var sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : 1
        let search = req.query.q;
        let pipeline = [
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$unwind': {
                    'path': '$user',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'image': 1,
                    'name': {
                        '$concat': [
                            '$user.first_name', ' ', '$user.last_name'
                        ]
                    },
                    'is_verified': '$user.is_verified',
                    '_id': '$user._id',
                    'createdAt': 1
                }
            }
        ]

        if (search) {
            pipeline.push({
                $match: {
                    '$or': [
                        { 'name': { '$regex': search, '$options': 'i' } },

                    ]
                }
            })
        }
        pipeline.push({ $sort: { [sortField]: sortOrder } });
        let sort = {}
        sort[`${sortField}`] = sortOrder
        pipeline.push({ '$sort': sort })
        pipeline.push({ $skip: parseInt(skip) });
        pipeline.push({ '$limit': parseInt(limit) })
        var page = req.query.page
        if (page == 0) {
            page = 1
        }
        let count = (await verifyModel.aggregate(pipeline)).length;
        let list = await verifyModel.aggregate(pipeline)

        return res.status(200).send({ status: 1, message: 'Success!', data: { page, count, list } })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const updateVerifyStatus = async (req, res) => {
    try {
        let { userId, is_verified } = req.body;
        if (!userId) {
            return res.status(400).send({ status: 0, message: "Please enter user id!" })
        }
        let obj = {
            is_verified: is_verified
        }
        let update = await userModel.findByIdAndUpdate(userId, obj, { new: true })
        if (update.is_verified == 2) {
            return res.status(200).send({ status: 1, message: "Successfully user verified!" })
        } else {
            let deleteVerification = await verifyModel.findOneAndDelete({ userId: userId })
            return res.status(200).send({ status: 1, message: "Successfully user verification Reject!" })

        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: 'server error' })
    }
}

module.exports = {
    list, updateVerifyStatus
}