const { isEmpty } = require('../MyModels/common_model');
const FaqModel = require('../models/FaqModel');

const createFaq = async (req, res) => {
    try {
        let data = req.body;
        let { question, answer } = data;

        if (!question ) {
            return res.status(400).send({ status: 0, message: "all field required" })
        }
        if (!answer) {
            return res.status(400).send({ status: 0, message: "all field required" })
        }
        let obj = {
            question: question,
            answer: answer
        }
        let result = await FaqModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const faqList = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let search = req.query.q;
        let q = {}
        if (search) {
            let or = [];
            or[0] = { question: { $regex: search, $options: "i" } }
            or[1] = { answer: { $regex: search, $options: "i" } }
            q.$or = or;
        }
        let records = await FaqModel.count(q);
        let pages = Math.ceil(records / limit);

        console.log(JSON.stringify(q))
        let results = await FaqModel.find(q).select({ __v: 0 }).sort({ createdAt: -1 }).limit(limit);
        if (results) {
            return res.status(200).send({ status: 1, message: "success", data: { total: records, pages: pages, list: results } })
        } else {
            return res.status(200).send({ status: 0, message: "no data found", data: null })
        }
    } catch (error) {
        console.log("Error : ", error)
        return res.status(200).send({ status: 0, message: "server error", data: null })
    }
}

const updateFaq = async (req, res) => {
    try {
        let data = req.body;
        let { id, question, answer } = data;

        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter id" })
        }
        let obj = {
            question: question,
            answer: answer
        }
        let result = await FaqModel.findByIdAndUpdate(id, obj, { new: true })
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const getFaq =async(req,res)=>{
    try {
        let data = req.body;
        let { id } = data;

        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required" })
        }

        let result = await FaqModel.findById(id)
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong",data:null })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const deleteFaq = async (req, res) => {
    try {
        let data = req.body;
        let { id } = data;

        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required" })
        }

        let result = await FaqModel.findByIdAndDelete(id)
        if (result) {
            return res.status(200).send({ status: 1, message: "data deleted", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

module.exports ={createFaq,faqList,updateFaq,getFaq,deleteFaq}