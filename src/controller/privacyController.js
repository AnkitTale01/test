const privacyModel = require("../models/privacyModel")

const createPrivacy = async (req, res) => {
    try {

        let text = req.body.text
        if (!text) {
            return res.status(400).send({ status: 0, message: "text is required..!" })
        }
        let obj = {
            text: text
        }
        let result = await privacyModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "privacy policy created ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const privacyList = async (req, res) => {
    try {
        let result = await privacyModel.find()
        if (result) {
            return res.status(200).send({ status: 0, message: "privacy policy list", data: result })

        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const updatePrivacy = async (req, res) => {
    try {
        let data = req.body
        let {  text } = data
        
        if (!text) {
            return res.status(400).send({ status: 0, message: "text is required..!" })
        }
        let obj = {
            text: text
        }
        let result = await privacyModel.updateOne(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "privacy policy updated ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const deletePrivacy = async (req, res) => {
    try {
        let data = req.body
        let { id } = data
        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required..!" })
        }
        let result = await privacyModel.findByIdAndDelete(id)
        if (result) {
            return res.status(200).send({ status: 1, message: "privacy policy deleted ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

module.exports = {
    createPrivacy,privacyList, updatePrivacy, deletePrivacy
}