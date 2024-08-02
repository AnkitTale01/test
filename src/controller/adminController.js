const { isEmpty } = require('../MyModels/common_model')
const adminModel = require('../models/adminModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const matchModel = require('../models/matchModel');
const { default: mongoose } = require('mongoose')
const preferenceModel = require('../models/preferenceModel');
const userPreferenceModel = require('../models/userPreferenceModel');
const subscriptionModel = require('../models/subscriptionModel');
const imageModel = require('../models/imageModel');
const userReportModel = require('../models/userReportModel');


require("dotenv").config()

const adminImageUpload = async (req, res) => {
    try {
        let fileUrl = req.fileUrl;
        if (fileUrl) {
            return res.status(201).send({ status: 1, message: "image Uploaded", data: fileUrl })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong in update admin", data: null })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userImageUploadByadmin = async (req, res) => {
    try {
        let data = req.body;
        let { userId, image } = data
        if (!userId) { return res.status(404).send({ status: 0, message: "please enter userId" }) }
        if (!image) { return res.status(404).send({ status: 0, message: "please enter image1" }) }
        let obj = {
            userId: userId,
            image: image,
        }
        let result = await imageModel.create(obj)

        if (result) {
            return res.status(200).send({ status: 1, message: "successfully upload image", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const adminSignup = async (req, res) => {
    try {
        let adminId = req.adminId
        const data = req.body
        const { first_name, last_name, email, phone, password, image } = data

        let checkEmail = await adminModel.findOne({ email: email })
        if (checkEmail && checkEmail._id.toString() != adminId) {
            return res.status(400).send({ status: 0, message: "Email already register, Please try different user" })
        }

        let obj = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            password: password,
            image: image
        }

        let update = await adminModel.findOneAndUpdate({ _id: adminId }, obj, { new: true }).select({ "__v": 0, updatedAt: 0 })

        if (update) {
            return res.status(201).send({ status: 1, message: "admin Updated", data: update })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong in update admin", data: null })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const adminLogin = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data

        if (!email) {
            return res.status(200).send({ status: 0, message: "Please enter email" })
        }
        if (!password) {
            return res.status(200).send({ status: 0, message: "Please enter password" })
        }

        let adminDetails = await adminModel.findOne({ email })
        if (!adminDetails) {

            return res.status(200).send({ status: 0, message: "invalid email" })
        } else if (adminDetails.password != password) {
            return res.status(200).send({ status: 0, message: "invalid password" })

        }

        else if (adminDetails.type == 'subadmin') {

            const token = jwt.sign({ adminId: adminDetails._id }, process.env.SubAdminSecretKey);


            let addToken = await adminModel.findOneAndUpdate({ email }, { token: token }, { new: true })

            return res.status(200).send({ status: 1, message: "success", data: addToken })
        }
        else {
            const token = jwt.sign({ adminId: adminDetails._id }, process.env.AdminSecretKey);

            let addToken = await adminModel.findOneAndUpdate({ email }, { token: token }, { new: true })

            return res.status(200).send({ status: 1, message: "success", data: addToken })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const adminData = async (req, res) => {
    try {
        let id = req.body.id

        let result = await adminModel.find({ _id: id }).select({ __v: 0, createdAt: 0, updatedAt: 0, password: 0, token: 0 })
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const adminprofile = async (req, res) => {
    try {
        let id = "64195c57fa6bb2dcd47f3aee"
        let data = req.body;
        let { first_name, last_name, phone, email, image } = data;
        let obj = {
            first_name: first_name,
            last_name: last_name,
            image: image,
            email: email,
            phone: phone
        }

        let result = await adminModel.findByIdAndUpdate(id, obj, { new: true })
        if (result) {
            return res.status(200).send({ status: 1, message: "Successfully update", data: result })
        } else {
            console.log(result)
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const changePassword = async (req, res) => {
    try {
        let id = "64195c57fa6bb2dcd47f3aee"
        let data = req.body;
        let { oldPassword, newPassword, confirmPassword } = data;
        if (newPassword != confirmPassword) {
            return res.status(200).send({ status: 0, message: "New and Confirm Password mismatch!", data: null })
        }
        let adminDetail = await adminModel.findById(id);
        if (adminDetail.password != oldPassword) {
            return res.status(200).send({ status: 0, message: "Invalid Old Password!", data: null })
        }
        let result = await adminModel.findByIdAndUpdate(id, { password: newPassword }, { new: true });
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userList = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
        let sortOrder = req.query.sortOrder ? req.query.sortOrder : 1
        let search = req.query.q;
        let q = {}
        if (search) {
            let or = [];
            or[0] = { first_name: { $regex: search, $options: "i" } }
            or[1] = { last_name: { $regex: search, $options: "i" } }
            or[2] = { email: { $regex: search, $options: "i" } }
            // or[3] = { phone: { $regex: search, $options: "i" } }
            q.$or = or;
        }
        let records = await userModel.count(q);
        var page = req.query.page
        if (page == 0) {
            page = 1
        }
        let results = await userModel.find(q).select({ __v: 0, token: 0, otp: 0, createdAt: 0, updatedAt: 0 }).sort([[sortBy, sortOrder]]).limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        if (results) {
            return res.status(200).send({ status: 1, message: "success", data: { total: records, page: parseInt(page), list: results } })
        } else {
            return res.status(200).send({ status: 0, message: "no data found", data: null })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userStatusUpdate = async (req, res) => {
    try {
        let data = req.body;
        let { userId, is_Blocked } = data
        if (!userId) {
            return res.status(400).send({ message: "please enter userId" })
        }
        let obj = {
            is_Blocked: is_Blocked
        }
        let result = await userModel.findByIdAndUpdate(userId, obj, { new: true })
        if (result) {

            return res.status(200).send({ status: 1, message: "success", data: result })
        } else {
            return res.status(200).send({ status: 0, message: "no data found", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const countSamePref = async (req, res) => {
    try {
        let data = req.body;
        let { preferenceId } = data;
        let result = await userPreferenceModel.find({ preferenceId }).count();

        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: { totaluser: result } })
        } else {
            return res.status(200).send({ status: 0, message: "no data found", data: null })
        }
    } catch (error) {

        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const filterByPreference = async (req, res) => {
    try {
        let data = req.body;
        let { _id } = data;
        let q = [
            {
                '$match': {
                    '_id': new mongoose.Types.ObjectId(_id) || ('641a97c005b5e3734f8c9aa7')
                }
            }, {
                '$lookup': {
                    'from': 'userpreferences',
                    'localField': '_id',
                    'foreignField': 'preferenceId',
                    'as': 'result'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'result.userId',
                    'foreignField': '_id',
                    'as': 'userList'
                }
            }, {
                '$project': {
                    'userList': 1,
                    '_id': 0
                }
            },
            {
                '$unwind': {
                    'path': '$userList'
                }
            }
        ]
        let result = await preferenceModel.aggregate(q)
        console.log(result)
    } catch (error) {

        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }

}

const viewUserProfile = async (req, res) => {
    try {
        let data = req.body;
        let { userId } = data;
        if (!userId) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }
        let userDetails = await userModel.findById(userId).select({ createdAt: 0, updatedAt: 0, otp: 0, is_suspended: 0, is_Blocked: 0, __v: 0, token: 0, zodiac_sign: 0, about: 0, pets: 0, covid_vaccine: 0, caste: 0, dietary_preference: 0, education_level: 0, workout: 0, sleeping_habits: 0, social_media: 0 })
        //({first_name:1,last_name:1,email:1,phone:1,country:1,country_code:1,image:1,height:1,weight:1,location:1,gender:1,birth_date:1,marital_status:1,city:1,plan:1})
        let userImage = await imageModel.find({ userId }).select({ image: 1, _id: 0 })

        let userPreference = (await userPreferenceModel.aggregate([
            {
                '$match': { 'userId': new mongoose.Types.ObjectId(userId) }
            }, {
                '$lookup': { 'from': 'preferences', 'localField': 'preferenceId', 'foreignField': '_id', 'as': 'result' }
            }, {
                $unwind: { path: "$result" }
            }, {
                '$project': { 'title': "$result.title", '_id': 0 }
            }
        ]))//[0].result;
        if (userDetails) {
            return res.status(200).send({ status: 1, message: 'User Deteils', data: { userDetails, userImage, userPreference } })
        }
        else {
            return res.status(500).send({ status: 0, message: 'Something went wrong' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const viewUserSubscription = async (req, res) => {
    try {
        let data = req.body;
        let { userId } = data;
        if (!userId) {
            return res.status(400).send({ status: 0, message: "please enter UserId" })
        }
        let result = await subscriptionModel.find({ userId: userId }).populate('planId').select({ '__v': 0, _id: 0 }).sort({ createdAt: -1 })
        if (result) {
            return res.status(200).send({ status: 1, message: "Successfully get data", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const viewAllSubscription = async (req, res) => {
    try {

        let limit = req.query.limit ? req.query.limit : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let search = req.query.q;

        let pipeline = [
            { '$lookup': { 'from': 'users', 'localField': 'userId', 'foreignField': '_id', 'as': 'result' } },
            { '$lookup': { 'from': 'plans', 'localField': 'planId', 'foreignField': '_id', 'as': 'plan' } },
            { '$unwind': { 'path': '$plan', 'preserveNullAndEmptyArrays': true } },
            { '$unwind': { 'path': '$result', 'preserveNullAndEmptyArrays': true } },
            {
                '$project': {
                    'id': '$result._id',
                    'userName': { '$concat': ['$result.first_name', ' ', '$result.last_name'] },
                    'planName': '$plan.name',
                    'amount': 1,
                    'validity': '$plan.validity',
                    'createdAt': 1
                }
            },
        ]
        if (search) {
            pipeline.push({
                '$match': {
                    '$or': [
                        { 'userName': { '$regex': search, '$options': 'i' } },
                        { 'planName': { '$regex': search, '$options': 'i' } }
                    ]
                } })
        }

        let records = (await subscriptionModel.aggregate(pipeline)).length;
        let page = Math.ceil(records / limit);
        pipeline.push({ '$skip': parseInt(skip) })
        pipeline.push({ '$limit': parseInt(limit) })

        let final = await subscriptionModel.aggregate(pipeline)

        if (final) {
            return res.status(200).send({ status: 1, message: "success", data: { total: records, page: page, list: final } })
        } else {
            return res.status(200).send({ status: 0, message: "no data found", data: null })
        }
        //
    } catch (error) {

        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const addUser = async (req, res) => {
    try {
        let data = req.body;
        let { first_name, last_name, plan, phone, email, birth_date, height, gender, image, weight, city, country, marital_status, country_code } = data
        if (!first_name) {
            return res.status(400).send({ status: 0, message: "please enter first name" })
        }
        if (!last_name) {
            return res.status(400).send({ status: 0, message: "please enter last name" })
        }
        if (!phone) {
            return res.status(200).send({ message: 'please enter a phone number' })
        }
        if (phone.length != 10) {
            return res.status(400).send({ status: 0, message: "please enter 10 digits" })
        }
        let number = await userModel.find({ phone });
        if (number.length > 0) {
            return res.status(400).send({ status: 0, message: "phone number already exit" })
        }
        if (!email) {
            return res.status(400).send({ status: 0, message: "please enter email" })
        }
        if (!birth_date) {
            return res.status(400).send({ status: 0, message: "please enter date of birth" })
        }
        if (!gender) {
            return res.status(400).send({ status: 0, message: "please enter gender" })
        }
        if (!marital_status) {
            return res.status(400).send({ status: 0, message: "please enter marital status" })
        }
        obj = {
            first_name: first_name,
            last_name: last_name,
            birth_date: birth_date,
            email: email,
            phone: phone,
            country_code: country_code,
            gender: gender,
            marital_status: marital_status,
            plan: plan,
            height: height,
            weight: weight,
            image: image,
            city: city,
            country: country,
            created_by: "admin"
        }
        let result = await userModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "user created", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const updateUser = async (req, res) => {
    try {
        let data = req.body;
        var userId = req.body.userId


        let { first_name, country_code, last_name, email, phone, birth_date, plan, height, gender, image, weight, city, country, looking_for, marital_status, location, about, zodiac_sign, education_level, covid_vaccine, health, personality_type, pets, drinking, smoking, workout, dietary_preference, sleeping_habits } = data

      if(phone){  if (phone.length != 10) {
            return res.status(400).send({ status: 0, message: "please enter 10 digits" })
        }}

        let user = await userModel.find({ _id: userId, created_by: "admin" })

        let obj = {
            first_name: first_name,
            last_name: last_name,
            country_code: country_code,
            email: email,
            birth_date: birth_date,
            height: height,
            gender: gender,
            image: image,
            phone: phone,
            plan: plan,
            weight: weight,
            city: city,
            country: country,
            marital_status: marital_status
        }
        if (user.length != 0) {

            let result = await userModel.findByIdAndUpdate({ _id: userId }, obj, { new: true })
            if (result) {
                return res.status(200).send({ status: 1, message: "save user details", data: result })
            }
        } else {
            return res.status(200).send({ status: 0, message: "you can't change user deatils!", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const deleteUser = async (req, res) => {
    try {
        let data = req.body;
        let { id } = data;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }
        let result = await userModel.findByIdAndDelete({ _id: id })
        if (result) {
            return res.status(200).send({ status: 1, message: "user delete", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something wont wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const blockUser = async (req, res) => {
    try {
        let data = req.body;
        let { userId, reportId } = data;
        if (!userId) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }

        let result = await userModel.findByIdAndUpdate(userId, { is_Blocked: true }, { new: true })

        let updateReport = await userReportModel.updateMany({ userId }, { status: true }, { new: true })
        if ({ result })
            if (result || updateReport) {
                return res.status(200).send({ status: 1, message: "user blocked", data: { result, updateReport } })
            } else {
                return res.status(500).send({ status: 0, message: "Something wont wrong", data: null })
            }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const locationStatus = async (req, res) => {
    try {
        let data = req.body;
        let { id, is_location } = data;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }
        let obj = {
            is_location: is_location
        }
        let result = await userModel.findByIdAndUpdate(id, obj, { new: true })


        if (result)
            if (result) {
                return res.status(200).send({ status: 1, message: "success", data: result })
            } else {
                return res.status(500).send({ status: 0, message: "something wont wrong", data: null })
            }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const MatchedUsersAnalytics = async (req, res) => {
    try {
        var d = new Date(req.query.end)
        d = d.setDate(d.getDate() + 1);
        let start = req.query.start ? new Date(req.query.start) : null
        var end = req.query.end ? new Date(d) : new Date()
        let limit = req.query.limit ? req.query.limit : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let pipeline = [
            {
                '$match': {
                    '$and': [
                        { 'matched': true },
                        { 'updatedAt': { '$gte': new Date(start), '$lte': new Date(end) } }
                    ]
                }
            },
            { '$lookup': { 'from': 'users', 'localField': 'sender', 'foreignField': '_id', 'as': 'sender' } },
            { '$unwind': { 'path': '$sender', 'includeArrayIndex': 'string' } },
            { '$lookup': { 'from': 'users', 'localField': 'receiver', 'foreignField': '_id', 'as': 'receiver' } },
            { '$unwind': { 'path': '$receiver', 'includeArrayIndex': 'string' } },
            {
                '$project': {
                    'senderName': { '$concat': ['$sender.first_name', ' ', '$sender.last_name'] },
                    'senderId': '$sender._id',
                    'recieverName': { '$concat': ['$receiver.first_name', ' ', '$receiver.last_name'] },
                    'receiverId': '$receiver._id',
                    'updatedAt': 1
                }
            },
            { '$sort': { updatedAt: -1 } }
        ]
        let records = (await matchModel.aggregate(pipeline)).length;

        let page = Math.ceil(records / limit);
        pipeline.push({ '$skip': parseInt(skip) })
        pipeline.push({ '$limit': parseInt(limit) })

        let result = await matchModel.aggregate(pipeline)
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: { totalMatch: records, page: parseInt(page), result } })
        } else {
            return res.status(200).send({ status: 0, message: "no data found", data: null })
        }
    } catch (error) {

        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userAnalytics = async (req, res) => {
    try {
        var d = new Date(req.query.end)
        d = d.setDate(d.getDate() + 1);
        let start = req.query.start ? new Date(req.query.start) : null
        var end = req.query.end ? new Date(d) : new Date()
        let limit = req.query.limit ? req.query.limit : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let pipeline = [
            { '$match': { 'createdAt': { '$gte': new Date(start), '$lte': new Date(end) } } },
            { '$sort': { createdAt: -1 } }
        ]
        let recordDb = (await userModel.aggregate([
            { '$match': { 'createdAt': { '$gte': new Date(start), '$lte': new Date(end) } } },
            {
                $project: {
                    male: { $cond: [{ $eq: ["$gender", "male"] }, 1, 0] },
                    female: { $cond: [{ $eq: ["$gender", "female"] }, 1, 0] },
                    other: { $cond: [{ $eq: ["$gender", "other"] }, 1, 0] },
                    active: { $cond: [{ $eq: ["$is_Blocked", true] }, 1, 0] },
                    inactive: { $cond: [{ $eq: ["$is_Blocked", false] }, 1, 0] },
                    Married: { $cond: [{ $eq: ["$marital_status", "Married"] }, 1, 0] },
                    Single: { $cond: [{ $eq: ["$marital_status", "Single"] }, 1, 0] },
                    Widowed: { $cond: [{ $eq: ["$marital_status", "Widowed"] }, 1, 0] },
                    Divorced: { $cond: [{ $eq: ["$marital_status", "Divorced"] }, 1, 0] },
                }
            },
            {
                $group: {
                    _id: null, male: { $sum: "$male" },
                    female: { $sum: "$female" },
                    other: { $sum: "$other" },
                    active: { $sum: "$active" },
                    inactive: { $sum: "$inactive" },
                    Married: { $sum: "$Married" },
                    Single: { $sum: "$Single" },
                    Widowed: { $sum: "$Widowed" },
                    Divorced: { $sum: "$Divorced" },
                    total: { $sum: 1 }
                }
            },
            { '$sort': { createdAt: -1 } }
        ]))

        pipeline.push({ '$skip': parseInt(skip) })
        pipeline.push({ '$limit': parseInt(limit) })
        let record = recordDb.length > 0 ? recordDb : [{ "_id": null, "male": 0, "female": 0, "other": 0, "active": 0, "inactive": 0, "Married": 0, "Single": 0, "Widowed": 0, "Divorced": 0, "total": 0 }]
        let page = Math.ceil(parseInt(record[0]?.total) / limit);

        let result = await userModel.aggregate(pipeline)

        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: { totalUser: record[0].total, page: parseInt(page), record, result } })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const planAnalytics = async (req, res) => {
    try {

        var d = new Date(req.query.end)
        d = d.setDate(d.getDate() + 1);
        let start = req.query.start ? new Date(req.query.start) : null
        var end = req.query.end ? new Date(d) : new Date()
        let limit = req.query.limit ? req.query.limit : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit

        let pipeline = [
            { '$match': { 'createdAt': { '$gte': new Date(start), '$lte': new Date(end) } } },
            { '$lookup': { 'from': 'plans', 'localField': 'planId', 'foreignField': '_id', 'as': 'plan' } },
            { '$unwind': { 'path': '$plan', 'includeArrayIndex': 'string' } },
            { '$lookup': { 'from': 'users', 'localField': 'userId', 'foreignField': '_id', 'as': 'user' } },
            { '$unwind': { 'path': '$user', 'includeArrayIndex': 'string' } },
            {
                '$project': {
                    'name': { '$concat': ['$user.first_name', ' ', '$user.last_name'] },
                    'id': '$user._id',
                    'plan': '$plan.name',
                    'amount': 1,
                    'createdAt': 1
                }
            },
            { '$sort': { createdAt: -1 } }
        ]

        let recordDb = (await subscriptionModel.aggregate([
            { '$match': { 'createdAt': { '$gte': new Date(start), '$lte': new Date(end) } } },
            { $lookup: { from: 'plans', localField: 'planId', foreignField: '_id', as: 'plan' } },
            { $unwind: { path: '$plan', includeArrayIndex: 'string' } },
            {
                $project: {
                    advance: { $cond: [{ $eq: ["$plan.name", "Advance"] }, 1, 0] },
                    gold: { $cond: [{ $eq: ["$plan.name", "Gold"] }, 1, 0] },
                    premium: { $cond: [{ $eq: ["$plan.name", "Premium"] }, 1, 0] },
                    vip: { $cond: [{ $eq: ["$plan.name", "Vip"] }, 1, 0] },
                    amount: 1
                }
            },
            {
                $group: {
                    _id: null, Advance: { $sum: "$advance" },
                    Gold: { $sum: "$gold" },
                    Premium: { $sum: "$premium" },
                    Vip: { $sum: "$vip" },
                    totalAmount: { $sum: "$amount" },
                    total: { $sum: 1 }
                }
            },
            { '$sort': { createdAt: -1 } }
        ]))
        let record = recordDb.length > 0 ? recordDb : [{ "_id": null, "Advance": 0, "Gold": 0, "Premium": 0, "Vip": 0, "totalAmount": 0, "total": 0 }]
        let page = Math.ceil(parseInt(record[0]?.total) / limit);
        pipeline.push({ '$skip': parseInt(skip) })
        pipeline.push({ '$limit': parseInt(limit) })
        pipeline.push({ '$sort': { createdAt: -1 } })
        let result = await subscriptionModel.aggregate(pipeline);
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: { totalSubscriber: record[0].total, page: parseInt(page), record, result } })
        }
    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: 0, message: "server error", data: null })
    }
}

module.exports = {
    adminImageUpload, userImageUploadByadmin, adminSignup, adminData, adminprofile, changePassword,
    addUser, updateUser, deleteUser, adminLogin, userList, userStatusUpdate, MatchedUsersAnalytics,
    countSamePref, viewUserProfile, viewUserSubscription, viewAllSubscription, filterByPreference, blockUser,
    locationStatus, userAnalytics, planAnalytics
}
