const { isEmpty } = require("../MyModels/common_model.js");
const settingModel = require("../models/adminSetting");

const freeUser = async (req, res) => {
    try {
        let data = req.body;
        let { likeLimitForFreeUser, superLikeLimitForFreeUser, matchLimitForFreeUser, userAccessLimit } = data;
        if (isEmpty(likeLimitForFreeUser)) {
            return res.status(400).send({ status: 0, message: 'all field required' })
        }
        if (isEmpty(superLikeLimitForFreeUser)) {
            return res.status(400).send({ status: 0, message: 'all field required' })
        }
        if (isEmpty(matchLimitForFreeUser)) {
            return res.status(400).send({ status: 0, message: 'all field required' })
        }
        let obj = {
            likeLimitForFreeUser: likeLimitForFreeUser,
            superLikeLimitForFreeUser: superLikeLimitForFreeUser,
            matchLimitForFreeUser: matchLimitForFreeUser,
            userAccessLimit: userAccessLimit
        }
        let result = await settingModel.create(obj);
        if (result) {
            return res.status(200).send({ status: 1, message: 'Succes', data: result })
        } else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: 'server error', data: null })
    }
}

const updateLimit = async (req, res) => {
    try {
        let id = "642ff93bdbcdb90c89acc55c";
        let data = req.body;

        let { likeLimitForFreeUser, superLikeLimitForFreeUser, matchLimitForFreeUser, userAccessLimit } = data;

        let obj = {
            likeLimitForFreeUser: likeLimitForFreeUser,
            superLikeLimitForFreeUser: superLikeLimitForFreeUser,
            matchLimitForFreeUser: matchLimitForFreeUser,
            userAccessLimit: userAccessLimit
        }
        let result = await settingModel.findByIdAndUpdate(id, obj, { new: true });
        if (result) {
            return res.status(200).send({ status: 1, message: 'Succes', data: result })
        } else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: 'server error', data: null })
    }
}

const fetchData = async (req, res) => {
    try {
        let result = await settingModel.find();
        if (result) {
            return res.status(200).send({ status: 1, message: 'Succes', data: result })
        } else {
            return res.status(500).send({ status: 0, message: 'Something went wrong', data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: 'server error', data: null })
    }
}

module.exports = { freeUser, updateLimit, fetchData }