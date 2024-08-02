const { default: mongoose } = require("mongoose");
const reportModel = require("../models/reportModel");
const userReportModel = require("../models/userReportModel");

const reportAdd = async (req, res) => {
    try {
        let data = req.body;
        let { reason } = data;
        if (!reason) {
            return res.status(404).send({ status: 0, message: "please enter reason" })
        }
        let obj = {
            reason: reason
        }
        let result = await reportModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "report created", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const list = async (req, res) => {
    try {
        let result = await reportModel.find()
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: { result } })

        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const reportList = async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
        var sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : 1
        let search = req.query.q;
        let reason = req.query.reason;

        let pipeline = [
            { $lookup: { from: 'users', localField: 'senderId', foreignField: '_id', as: 'reporter' } },
            { $unwind: { path: '$reporter', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'reports', localField: 'reason', foreignField: '_id', as: 'reason' } },
            { $unwind: { path: '$reason', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    'id': '$_id',
                    'senderName': {
                        '$concat': [
                            '$reporter.first_name', ' ', '$reporter.last_name'
                        ]
                    },
                    'receiverName': {
                        '$concat': [
                            '$user.first_name', ' ', '$user.last_name'
                        ]
                    },
                    'receiverId': '$user._id',
                    'reason': '$reason.reason',
                    'image': 1,
                    'description': 1,
                    'date': '$createdAt',
                    'status': 1
                }
            },

        ]
        if (reason) {
            pipeline.push({
                $match: { 'reason': { '$regex': reason, '$options': 'i' } }
            })
        }
        if (search) {
            pipeline.push({
                $match: {
                    '$or': [
                        { 'senderName': { '$regex': search, '$options': 'i' } },
                        { 'receiverName': { '$regex': search, '$options': 'i' } },
                        { 'reason': { '$regex': search, '$options': 'i' } }
                    ]
                }
            })
        }

        //  let records = (await userReportModel.aggregate(pipeline)).length;
        let records = await userReportModel.count(pipeline)
        let sort = {}
        sort[`${sortBy}`] = sortOrder
        pipeline.push({ '$sort': sort })
        pipeline.push({ '$skip': parseInt(skip) })
        pipeline.push({ '$limit': parseInt(limit) })

        let final = await userReportModel.aggregate(pipeline)
        let page = Math.ceil(records / limit);

        if (final) {
            return res.status(200).send({ status: 1, message: "report List", data: { totalReport: records, page: parseInt(page), final } })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const reportDelete = async (req, res) => {
    try {
        let data = req.body;
        let { _id } = data;
        if (!_id) { return res.status(400).send({ status: 0, message: "please enter Id" }) }
        let result = await userReportModel.findByIdAndDelete(_id)
        if (result) {
            return res.status(200).send({ status: 1, message: "report successFully deleted", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}


module.exports = { reportAdd, list, reportList, reportDelete }