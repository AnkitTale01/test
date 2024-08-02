const adminModel = require('../models/adminModel')


const createSubAdmin = async (req, res) => {
    try {
        let data = req.body;

        let {id, first_name, last_name, phone, password, email, role, image } = data

        let deta = await adminModel.find({$and:[{_id:id},{type:"admin"}]})
        console.log(deta)
        if (!first_name) {
            return res.status(400).send({ status: 0, message: "please enter first name" })
        }
        if (!last_name) {
            return res.status(400).send({ status: 0, message: "please enter last name" })
        }
        if (!phone) {
            return res.status(400).send({ status: 0, message: "please enter phone" })
        }
        if (phone.length != 10) {
            return res.status(400).send({ status: 0, message: "please enter 10 digits" })
        }
        let number = await adminModel.find({ phone });
        if (number.length != 0) {
            return res.status(400).send({ status: 0, message: "phone number already exit" })
        }
        if (!password) {
            return res.status(400).send({ status: 0, message: "please enter password" })
        }
        if (!email) {
            return res.status(400).send({ status: 0, message: "please enter email" })
        }
        if (!role) {
            return res.status(400).send({ status: 0, message: "please enter role" })
        }
        let obj = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            image: image,
            password: password,
            role: role
        }
        let result = await adminModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: 'Sucess', data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "Server error", data: null })
    }
}

const updateSubAdmin = async (req, res) => {
    try {
        let data = req.body;

        let { id, first_name, last_name, image, phone, password, email, role } = data
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter adminId" })
        }
        if (phone.length != 10) {
            return res.status(400).send({ status: 0, message: "please enter 10 digits" })
        }
        let obj = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            image: image,
            phone: phone,
            password: password,
            image: image,
            role: role
        }
        let result = await adminModel.findByIdAndUpdate(id, obj, { new: true })
        if (result) {
            return res.status(200).send({ status: 1, message: 'Sucess', data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "Server error", data: null })
    }
}

const deleteSubAdmin = async (req, res) => {
    try {
        let id = req.body.id;

        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter subadminId" })
        }
        let result = await adminModel.findByIdAndDelete(id)
        if (result) {
            return res.status(200).send({ status: 1, message: 'Sucess', data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "Server error", data: null })
    }
}

const subAdminList = async (req, res) => {
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
            or[3] = { phone: { $regex: search, $options: "i" } }
            or[4] = { role: { $regex: search, $options: "i" } }
            q.$or = or;

        }
        let records = await adminModel.count({$and:[q,{type:'subadmin'}]});
        var page = req.query.page
        console.log("123", page)
        if (page == 0) {
            page = 1
        }
        console.log(JSON.stringify(q))

        let result = await adminModel.find({$and:[q,{type:'subadmin'}]}).select({ __v: 0, token: 0, otp: 0, createdAt: 0, updatedAt: 0 }).sort([[sortBy, sortOrder]]).limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        if (result) {
            return res.status(200).send({ status: 1, message: 'Sucess', data: { total: records, page: parseInt(page), list: result } })
        }
        else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "Server error", data: null })
    }
}

const updateSubAdminStatus = async (req, res) => {
    try {
        let data = req.body;
        let { id, is_blocked } = data
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter subadmin id" })
        }
        let obj = {
            is_blocked: is_blocked
        }
        let result = await adminModel.findByIdAndUpdate(id, obj, { new: true })
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



module.exports = { createSubAdmin, updateSubAdmin, deleteSubAdmin, subAdminList, updateSubAdminStatus }