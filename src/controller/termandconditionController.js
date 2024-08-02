const termAndconditionModel = require("../models/termAndCondition")

const createTermAndCondition = async (req, res) => {
    try {

        let text = req.body.text
        if (!text) {
            return res.status(400).send({ status: 0, message: "text is required..!" })
        }
        let obj = {
            text: text
        }
        let result = await termAndconditionModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "term and condition is created ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const termAndCondition = async (req, res) => {
    try {
        let result = await termAndconditionModel.find()
        if (result) {
            return res.status(200).send({ status: 0, message: "term and condition  list", data: result })

        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const updateTermAndCondition = async (req, res) => {
    try {
        let data = req.body
        let { text } = data
      
        if (!text) {
            return res.status(400).send({ status: 0, message: "text is required..!" })
        }
        let obj = {
            text: text
        }
        let result = await termAndconditionModel.updateOne(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "term and condition  updated ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const deleteTermAndCondition = async (req, res) => {
    try {
        let data = req.body
        let { id } = data
        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required..!" })
        }
        let result = await termAndconditionModel.findByIdAndDelete(id)
        if (result) {
            return res.status(200).send({ status: 1, message: "term and condition  deleted ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

module.exports = {
    createTermAndCondition,termAndCondition, updateTermAndCondition, deleteTermAndCondition
}