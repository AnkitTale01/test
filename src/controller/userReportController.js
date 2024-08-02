const { default: mongoose } = require("mongoose");
const userReportModel = require("../models/userReportModel");
const notificationModel =require('../models/notificationModel')

const userSendReport = async (req, res) => {
    try {
        let data = req.body;
        let { senderId, userId, reason, image, description } = data
        if (!senderId) { return res.status(404).send({ status: 0, message: "please enter senderId" }) }
        if (!userId) { return res.status(404).send({ status: 0, message: "please enter userId" }) }
        if (!reason) { return res.status(404).send({ status: 0, message: "please enter reason" }) }
        if (!description) { return res.status(404).send({ status: 0, message: "please enter description" }) }
        let obj = {
            senderId: senderId,
            userId: userId,
            reason: reason,
            image: image,
            description: description
        }
        let result = await userReportModel.create(obj);
        if (result) {
            return res.status(200).send({ status: 1, message: "Successfully ", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userViewReportStatus = async (req, res) => {
    try {
        let data = req.body;
        let { _id } = data
        if (!_id) { return res.status(404).send({ status: 0, message: "please enter Id" }) }
        let result = await userReportModel.findById(_id)
        if (result) {
            return res.status(200).send({ status: 1, message: "Successfully get status", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userDeleteReport = async (req, res) => {
    try {
        let data = req.body;
        let { _id } = data
        if (!_id) { return res.status(404).send({ status: 0, message: "please enter Id" }) }
        let result = await userReportModel.findByIdAndDelete(_id)
        if (result) {
            return res.status(200).send({ status: 1, message: "Successfully delete", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

module.exports = { userSendReport, userViewReportStatus, userDeleteReport }