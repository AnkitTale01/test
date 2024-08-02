const emailModel = require("../models/emailModel");
const { isEmpty, sentEmail } = require('../MyModels/common_model')
const userModel = require('../models/userModel');
var nodemailer = require('nodemailer');


const createMail = async (req, res) => {
    try {
        let data = req.body;
        let { sendTo, subject, description } = data
        let userEmails = await userModel.distinct('email', { _id: { $in: ["642e9bf2d5f057f6dce7a96b", "6433c7f3446479a10d86a9c4"] } });
        console.log(userEmails)
        let dataObj = {
            subject: subject,
            html: description,
            emailArr: userEmails
        }
        await sentEmail(dataObj)
        let obj = {
            sendTo: sendTo,
            subject: subject,
            description: description
        }
        let result = await emailModel.create(obj);
        if (result) {
            return res.status(200).send({ status: 1, message: 'Success', data: result })
        } else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: 'server error', data: null })
    }
}

const emailList = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
        let sortOrder = req.query.sortOrder ? req.query.sortOrder : 1
        let search = req.query.q;

        let q = {}
        if (search) {
            let or = [];
            or[0] = { sendTo: { $regex: search, $options: "i" } }
            or[1] = { subject: { $regex: search, $options: "i" } }
            q.$or = or;

        }
        let records = await emailModel.count(q);
        var page = req.query.page
        console.log("123", page)
        if (page == 0) {
            page = 1
        }


        let result = await emailModel.find(q).select({ updatedAt: 0, __v: 0 }).sort([[sortBy, sortOrder]]).limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        if (result) {
            return res.status(201).send({ status: 1, message: "success", data: { totalMail: records, page: page, result } })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const deleteEmail = async (req, res) => {
    try {
        const data = req.body
        const { id } = data

        if (!id) {
            return res.status(200).send({ status: 0, message: "id is required" })
        }

        let response = await emailModel.findByIdAndDelete(id);

        if (response) {
            return res.status(201).send({ status: 1, message: "Successfully deleted", data: response })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", body: null })
    }
}

module.exports = { createMail, emailList ,deleteEmail}