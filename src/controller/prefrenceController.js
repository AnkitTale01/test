const preferenceModel = require('../models/preferenceModel')
const { isEmpty } = require('../MyModels/common_model')

const preferenceAdd = async (req, res) => {
    try {
        const data = req.body
        
        const { title,icon } = data

        if (isEmpty(title)) {
            return res.status(400).send({ status: 0, message: "all field required" })
        }
        
        let obj = {
            title: title,
            icon: icon
        }

        let add = await preferenceModel.create(obj)

        if (add) {
            return res.status(201).send({ status: 1, message: "success", data: add })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const preferenceUpdate = async (req, res) => {
    try {
        const data = req.body
        let fileUrl = req.fileUrl;
        const { id, title } = data
        let icon = fileUrl;
        if (isEmpty(id)) {
            return res.status(200).send({ status: 0, message: "all field required" })
        }
        let obj = {}
        if (!isEmpty(title)) { obj = { ...obj, title } }
        if (!isEmpty(icon)) { obj = { ...obj, icon } }


        let update = await preferenceModel.findByIdAndUpdate(id, obj, { new: true });

        if (update) {
            return res.status(201).send({ status: 1, message: "Successfully updated", data: update })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const preferenceList = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let search = req.query.q;
        let q = {}
        if (search) {
            let or = [];
            or[0] = {title: { $regex: search, $options: "i" } }      
            q.$or = or;
        }
        
        let records = await preferenceModel.count(q);
        var page = req.query.page
        console.log("123", page)
        if (page == 0) {
            page = 1
        }


        let result = await preferenceModel.find(q).select({ createdAt: 0, updatedAt: 0, __v: 0 }).sort({createdAt:-1}).limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        if (result) {
            return res.status(201).send({ status: 1, message: "success", data: { totalPreference: records, page: page, result } })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const preferenceDelete = async (req, res) => {
    try {
        const data = req.body
        const { id } = data

        if (isEmpty(id)) {
            return res.status(200).send({ status: 0, message: "all field required" })
        }

        let response = await preferenceModel.findByIdAndDelete(id);

        if (response) {
            return res.status(201).send({ status: 1, message: "Successfully deleted", data: response })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const blockpref = async (req, res) => {
    try {
        const data = req.body
        const { id ,is_active } = data

        if (isEmpty(id)) {
            return res.status(200).send({ status: 0, message: "all field required" })
        }
        let obj ={
            is_active: is_active
        }
        let result = await preferenceModel.findByIdAndUpdate(id,obj,{new:true});

        if (result) {
            return res.status(201).send({ status: 1, message: "Successfully update", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

module.exports = { preferenceAdd, preferenceDelete, preferenceList, preferenceUpdate,blockpref }