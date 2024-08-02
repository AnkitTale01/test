const cookieModel = require("../models/cookiePolicyModel")

const addCookie = async (req, res) => {
    try {

        let text = req.body.text
        if (!text) {
            return res.status(400).send({ status: 0, message: "text is required..!" })
        }
        let obj = {
            text: text
        }
        let result = await cookieModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "policy created ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const cookieList = async (req, res) => {
    try {
        let result = await cookieModel.find()
        if (result) {
            return res.status(200).send({ status: 0, message: "policy list", data: result })

        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const updateCookie = async (req, res) => {
    try {
        let data = req.body
        let {  text } = data
              if (!text) {
            return res.status(400).send({ status: 0, message: "text is required..!" })
        }
        let obj = {
            text: text
        }
        let result = await cookieModel.updateOne(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "cookies updated ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const deleteCookie = async (req, res) => {
    try {
        let data = req.body
        let { id } = data
        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required..!" })
        }
        let result = await cookieModel.findByIdAndDelete(id)
        if (result) {
            return res.status(200).send({ status: 1, message: "policy deleted ", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

module.exports = {
    addCookie,cookieList, updateCookie, deleteCookie
}