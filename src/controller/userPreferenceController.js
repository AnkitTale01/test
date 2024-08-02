const { isEmpty, } = require('../MyModels/common_model');
const preferenceModel = require('../models/preferenceModel');
const userPreferenceModel = require('../models/userPreferenceModel');
const { default: mongoose } = require("mongoose");



const preferenceList = async (req, res) => {
    try {
        let data = req.body;
        let { userId } = data;
        if (!userId) { return res.status(404).send({ status: 0, message: "please enter userId" }) }

        let pref = await userPreferenceModel.aggregate([{ '$match': { userId: new mongoose.Types.ObjectId(userId) } }]);

        let result = await preferenceModel.find({ is_active: false });
        let ids = [];

        await Promise.all(
            pref.map(async (i) => {
                const Pref = i.preferenceId;
                ids.push({ Pref: Pref });
            })
        );
        const preferenceIds = ids.map(obj => obj.Pref);

        // Find matching and unmatched ids
        const matchedIds = [];
        const unmatchedIds = [];

        for (const obj of result) {
            if (preferenceIds.some(prefId => prefId.equals(obj._id))) {
                matchedIds.push({ ...obj._doc, is_select: true });
            } else {
                unmatchedIds.push({ ...obj._doc, is_select: false });
            }
        }
        let filteredData = unmatchedIds.filter((obj => !obj.userId))

        let Result = matchedIds.concat(filteredData)
        if (Result) {
            return res.status(200).send({ status: 1, message: "Successfully get list", data: Result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong " })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const userAddPreference = async (req, res) => {
    try {
        let data = req.body;
        let { userId, preferenceId, title } = data
        if (!userId) { return res.status(404).send({ status: 0, message: "please enter userId" }) }
        if (title) {
            let Count = await userPreferenceModel.find({ userId: userId }).count()
            if (Count < 4) {
                if (title) {
                    let obj = {
                        userId: userId,
                        title: title
                    }
                    let add = await preferenceModel.create(obj)
                    if (add) {
                        let Obj = {
                            preferenceId: add._id,
                            userId: userId
                        }
                        let result = await userPreferenceModel.create(Obj)
                        return res.status(201).send({ status: 1, message: "Preference add!", data: result })
                    }
                }
            } else {
                return res.status(200).send({ status: 0, message: "You can select only 4 preference!" })
            }

        }
        else {
            let DeletePref = await userPreferenceModel.findOneAndDelete({ preferenceId: preferenceId, userId: userId })
            if (DeletePref) {
                let delete_pref = await preferenceModel.findOneAndDelete({ _id: preferenceId, userId: userId })
                return res.status(200).send({ status: 1, message: "Preference remove!", data: DeletePref })
            }
            let obj = {
                userId: userId,
                preferenceId: preferenceId
            }
            let Count = await userPreferenceModel.find({ userId: userId }).count()
            if (Count < 4) {
                let result = await userPreferenceModel.create(obj)
                return res.status(200).send({ status: 1, message: "Preference add!", data: result })
            } else {
                return res.status(200).send({ status: 0, message: "You can select only 4 preference!" })
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userPreferenceList = async (req, res) => {
    try {
        let data = req.body;
        let { userId } = data;
        if (!userId) { return res.status(404).send({ status: 0, message: "please enter userId" }) }
        let pipeline = [
            {
                '$match': { userId: new mongoose.Types.ObjectId(userId) }
            },
            {
                '$lookup': { 'from': 'preferences', 'localField': 'preferenceId', 'foreignField': '_id', 'as': 'result' }
            }, {
                '$unwind': { 'path': '$result', 'preserveNullAndEmptyArrays': true }
            }, {
                '$project': { 'preference': '$result.title', '_id': 1 }
            }
        ]
        let result = await userPreferenceModel.aggregate(pipeline)
        if (result) {
            return res.status(200).send({ status: 1, message: "Successfully get list", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong ", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}


module.exports = { preferenceList, userAddPreference, userPreferenceList }