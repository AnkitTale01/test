const { default: mongoose } = require("mongoose");
const featureModel = require("../models/featureModel");

const create = async (req, res) => {
    try {
        let { feature, planId } = req.body;
        if (!planId) {
            return res.status(400).send({ status: 0, message: 'Please enter planId!' })
        }
        if (!feature) {
            return res.status(400).send({ status: 0, message: 'Please enter feature!' })
        }
        let obj = {
            feature: feature,
            planId: planId
        }

        let create = await featureModel.create(obj)
        return res.status(201).send({ status: 1, message: "Feature created!", data: create })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const update = async (req, res) => {
    try {
        let { id, feature, planId } = req.body;
        if (!id) {
            return res.status(400).send({ status: 0, message: 'Please enter feature id!' })
        }
        let obj = {
            feature: feature,
            planId: planId
        }
        let create = await featureModel.findByIdAndUpdate(id, obj, { new: true })
        return res.status(200).send({ status: 1, message: "Feature updated!", data: create })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const deleteFeature = async (req, res) => {
    try {
        let { id } = req.body;
        if (!id) {
            return res.status(400).send({ status: 0, message: 'Please enter feature id!' })
        }
        let create = await featureModel.findByIdAndDelete(id)
        return res.status(200).send({ status: 1, message: "Feature deleted!", data: create })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const list = async (req, res) => {
    try {
        let { id } = req.query;
        let limit = req.query.limit ? req.query.limit : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let search = req.query.q;

        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter planId!" })
        }
        let q = [
            {
                '$match': {
                    'planId': new mongoose.Types.ObjectId(id)
                }
            },
            {
                $project: {
                    feature: 1,
                    "is_active": 1,
                    "createdAt": 1
                }
            }
        ]

        if (search) {
            q.push({
                '$match': {

                    'feature': {
                        '$regex': search,
                        '$options': 'i'
                    }

                }
            })
        }
        let records = (await featureModel.aggregate(q)).length
        let page = Math.ceil(records / limit);
        q.push({ '$skip': parseInt(skip) })
        q.push({ '$limit': parseInt(limit) })

        let list = await featureModel.aggregate(q)
        return res.status(200).send({ status: 1, message: "success!", data: { records, page, list } })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const updateStatus = async (req, res) => {
    try {
        let { id, is_active } = req.body;
        if (!id) {
            return res.status(400).send({ status: 0, message: 'Please enter feature id!' })
        }
        let obj = {
            is_active: is_active
        }
        let update = await featureModel.findByIdAndUpdate(id, obj, { new: true })
        // let stts = update.is_active
        if (update) {
            // if (stts == true) {
                return res.status(200).send({ status: 1, message: "Feature status update!" })
            // } else {
            //     return res.status(200).send({ status: 1, message: "Feature deactive!" })
            // }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

module.exports = {
    create, update, deleteFeature, list, updateStatus
}