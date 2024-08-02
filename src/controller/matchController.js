const matchModel = require("../models/matchModel");
const { default: mongoose } = require('mongoose');
const userModel = require("../models/userModel");


const createMatch = async (req, res) => {
    try {
        let data = req.body;
        let { sender, receiver, type } = data;

        if (!sender) { return res.status(404).send({ status: 0, message: "all filed required!!" }) }
        if (!receiver) { return res.status(404).send({ status: 0, message: "all filed required!!" }) }
        var d = new Date()
        date = d.setHours(0, 0, 0, 0);
        console.log("----date", new Date(date));
        let findPlan = await userModel.findById(sender)
        if (findPlan) {
            let plan = findPlan.plan
            let obj = {
                sender: sender,
                receiver: receiver,
                type: type
            }
            if (plan == "Free" && type == "like") {
                let count = await matchModel.find({ sender: sender, type: "like", createdAt: { $gte: new Date(date) } }).count()
                // console.log("-----count", count);
                if (count == 1) { return res.status(404).send({ status: 0, message: "your daily like limit is over!" }) }
                let checkMatch = await matchModel.find({ sender: sender, receiver: receiver })
                if (checkMatch.length != 0) {
                    let updateMatch = await matchModel.findOneAndUpdate({ sender: sender, receiver: receiver }, { type: type }, { new: true })
                    return res.status(200).send({ status: 1, message: 'Swiped', data: [updateMatch] })
                } else {
                    let checkMatch = await matchModel.find({ sender: receiver, receiver: sender })
                    if (checkMatch.length != 0) {
                        // obj.matched = true;
                        //  let add = await matchModel.create(obj)
                        let checkMatched = await matchModel.findOneAndUpdate({ sender: receiver, receiver: sender }, { matched: true }, { new: true })
                        return res.status(200).send({ status: 1, message: 'Matched', data: [checkMatched] })
                    } else {

                        let add = await matchModel.create(obj)
                        if (type == 'like' || type == 'superLike') {
                            return res.status(200).send({ status: 1, message: 'Swiped', data: [add] })
                        } else {
                            return res.status(200).send({ status: 1, message: 'UnSwiped', data: [add] })
                        }
                    }
                }
            }
            else if (plan == "Free" && type == "superLike") {
                let count = await matchModel.find({ sender: sender, type: "superLike", createdAt: { $gte: new Date(date) } }).count()
                // console.log("-----count", count);
                if (count == 1) { return res.status(404).send({ status: 0, message: "your daily superlike limit is over!" }) }
                let checkMatch = await matchModel.find({ sender: sender, receiver: receiver })
                if (checkMatch.length != 0) {
                    let updateMatch = await matchModel.findOneAndUpdate({ sender: sender, receiver: receiver }, { type: type }, { new: true })
                    return res.status(200).send({ status: 1, message: 'Swiped', data: [updateMatch] })
                } else {
                    let checkMatch = await matchModel.find({ sender: receiver, receiver: sender })
                    if (checkMatch.length != 0) {
                        // obj.matched = true;
                        //  let add = await matchModel.create(obj)
                        let checkMatched = await matchModel.findOneAndUpdate({ sender: receiver, receiver: sender }, { matched: true }, { new: true })
                        return res.status(200).send({ status: 1, message: 'Matched', data: [checkMatched] })
                    } else {

                        let add = await matchModel.create(obj)
                        if (type == 'like' || type == 'superLike') {
                            return res.status(200).send({ status: 1, message: 'Swiped', data: [add] })
                        } else {
                            return res.status(200).send({ status: 1, message: 'UnSwiped', data: [add] })
                        }
                    }
                }
            }
            else if (plan == "Premium" && type == "superLike") {
                let count = await matchModel.find({ sender: sender, type: "superLike", createdAt: { $gte: new Date(date) } }).count()
                // console.log("-----count", count);
                if (count == 5) { return res.status(404).send({ status: 0, message: "your daily superlike limit is over!" }) }
                let checkMatch = await matchModel.find({ sender: sender, receiver: receiver })
                if (checkMatch.length != 0) {
                    let updateMatch = await matchModel.findOneAndUpdate({ sender: sender, receiver: receiver }, { type: type }, { new: true })
                    return res.status(200).send({ status: 1, message: 'Swiped', data: [updateMatch] })
                } else {
                    let checkMatch = await matchModel.find({ sender: receiver, receiver: sender })
                    if (checkMatch.length != 0) {
                        // obj.matched = true;
                        //  let add = await matchModel.create(obj)
                        let checkMatched = await matchModel.findOneAndUpdate({ sender: receiver, receiver: sender }, { matched: true }, { new: true })
                        return res.status(200).send({ status: 1, message: 'Matched', data: [checkMatched] })
                    } else {

                        let add = await matchModel.create(obj)
                        if (type == 'like' || type == 'superLike') {
                            return res.status(200).send({ status: 1, message: 'Swiped', data: [add] })
                        } else {
                            return res.status(200).send({ status: 1, message: 'UnSwiped', data: [add] })
                        }
                    }
                }
            }
            else if (plan == "Gold" && type == "superLike") {
                let count = await matchModel.find({ sender: sender, type: "superLike", createdAt: { $gte: new Date(date) } }).count()
                // console.log("-----count", count);
                if (count == 10) { return res.status(404).send({ status: 0, message: "your daily superlike limit is over!" }) }
                let checkMatch = await matchModel.find({ sender: sender, receiver: receiver })
                if (checkMatch.length != 0) {
                    let updateMatch = await matchModel.findOneAndUpdate({ sender: sender, receiver: receiver }, { type: type }, { new: true })
                    return res.status(200).send({ status: 1, message: 'Swiped', data: [updateMatch] })
                } else {
                    let checkMatch = await matchModel.find({ sender: receiver, receiver: sender })
                    if (checkMatch.length != 0) {
                        // obj.matched = true;
                        //  let add = await matchModel.create(obj)
                        let checkMatched = await matchModel.findOneAndUpdate({ sender: receiver, receiver: sender }, { matched: true }, { new: true })
                        return res.status(200).send({ status: 1, message: 'Matched', data: [checkMatched] })
                    } else {

                        let add = await matchModel.create(obj)
                        if (type == 'like' || type == 'superLike') {
                            return res.status(200).send({ status: 1, message: 'Swiped', data: [add] })
                        } else {
                            return res.status(200).send({ status: 1, message: 'UnSwiped', data: [add] })
                        }
                    }
                }
            }
            else {
                let checkMatch = await matchModel.find({ sender: receiver, receiver: sender })
                if (checkMatch.length != 0) {
                    // obj.matched = true;
                    //  let add = await matchModel.create(obj)
                    let checkMatched = await matchModel.findOneAndUpdate({ sender: receiver, receiver: sender }, { matched: true }, { new: true })
                    return res.status(200).send({ status: 1, message: 'Matched', data: [checkMatched] })
                } else {

                    let add = await matchModel.create(obj)
                    if (type == 'like' || type == 'superLike') {
                        return res.status(200).send({ status: 1, message: 'Swiped', data: [add] })
                    } else {
                        return res.status(200).send({ status: 1, message: 'UnSwiped', data: [add] })
                    }
                }
            }
        }





    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: [] })
    }
}

// const CreateMatch = async (req, res) => {
//     try {
//         let data = req.body;
//         let { sender, receiver, type } = data;
//         if (!sender) { return res.status(404).send({ status: 0, message: "all filed required!!" }) }
//         if (!receiver) { return res.status(404).send({ status: 0, message: "all filed required!!" }) }
//         let obj = {
//             sender: sender,
//             receiver: receiver,
//             type: type
//         }
//         let checkMatch = await matchModel.find({ sender: sender, receiver: receiver })
//         if (checkMatch.length != 0) {
//             return res.status(200).send({ status: 0, message: 'already Swiped.', data: [] })
//         } else {
//             let checkMatch = await matchModel.find({ sender: receiver, receiver: sender })
//             if (checkMatch.length != 0) {
//                 if (obj.type == 'disLike') {
//                     obj.matched = false
//                     let checkMatch = await matchModel.findOneAndUpdate({ sender: receiver, receiver: sender }, { matched: false }, { new: true })
//                     return res.status(200).send({ status: 1, message: 'Unswiped', data: [checkMatch] })

//                 } else {
//                     obj.matched = true;
//                     let checkMatch = await matchModel.findOneAndUpdate({ sender: receiver, receiver: sender }, { matched: true }, { new: true })
//                     return res.status(200).send({ status: 1, message: 'Matched', data: [checkMatch] })
//                 }
//                 let add = await matchModel.create(obj)
//             } else {
//                 let add = await matchModel.create(obj)
//                 return res.status(200).send({ status: 1, message: 'Swiped.', data: [add] })
//             }
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({ status: 0, message: "server error", data: [] })
//     }
// }

const deleteMatch = async (req, res) => {
    try {
        let data = req.body;
        let { _id } = data;
        if (!_id) { return res.status(404).send({ status: 0, message: "please enter id" }) }

        let result = await matchModel.findByIdAndDelete(_id);
        if (result) {
            return res.status(200).send({ status: 1, message: "SuccessFully deleted", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const getAllmatchedUserList = async (req, res) => {
    try {
        let q = [
            { '$match': { 'matched': true } },
            { '$lookup': { from: 'users', localField: 'receiver', foreignField: '_id', as: 'result' } },
            { $unwind: { 'path': '$result' } },
            { '$lookup': { from: 'images', localField: 'receiver', foreignField: 'userId', as: 'image' } },
            { $unwind: { 'path': '$image' } },
            { '$project': { 'result.first_name': 1, 'result.last_name': 1, 'result.phone': 1, 'image.image1': 1, 'image.image2': 1 } }
        ]
        let result = await matchModel.aggregate(q);


        return res.status(200).send({ status: 1, message: "data get successfully", data: result })
    } catch (error) {

        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const userGetOwnMatch = async (req, res) => {
    try {
        let data = req.body;
        let { id } = data;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }

        let q = [
            { $match: { $and: [{ 'sender': new mongoose.Types.ObjectId(id) }, { 'matched': true }] } },
            { $lookup: { from: 'users', localField: 'receiver', foreignField: '_id', as: 'result' } },
            { $lookup: { from: 'images', localField: 'receiver', foreignField: 'userId', as: 'img' } },
            { '$addFields': { 'image': { '$first': '$img.image' } } },
            { $unwind: { path: '$result' } },
            {
                $project: {
                    'first_name': '$result.first_name',
                    'last_name': '$result.last_name',
                    'age': { '$dateDiff': { 'startDate': { '$dateFromString': { 'dateString': '$result.birth_date' } }, 'endDate': '$$NOW', 'unit': 'year' } },
                    'phone': '$result.phone',
                    'gender': '$result.gender',
                    'height': '$result.height',
                    'weight': '$result.weight',
                    'city': '$result.city',
                    'image': 1,
                    'createdAt': 1
                }
            },
            { $sort: { 'createdAt': -1 } }
        ]

        let a = [

            { $match: { $and: [{ 'receiver': new mongoose.Types.ObjectId(id) }, { 'matched': true }] } },
            { $lookup: { from: 'users', localField: 'sender', foreignField: '_id', as: 'result' } },
            { $lookup: { from: 'images', localField: 'sender', foreignField: 'userId', as: 'img' } },
            { '$addFields': { 'image': { '$first': '$img.image' } } },
            { $unwind: { path: '$result' } },
            {
                $project: {
                    'first_name': '$result.first_name',
                    'last_name': '$result.last_name',
                    'age': {
                        '$dateDiff': {
                            'startDate': { '$dateFromString': { 'dateString': '$result.birth_date' } },
                            'endDate': '$$NOW',
                            'unit': 'year'
                        }
                    },
                    'phone': '$result.phone',
                    'gender': '$result.gender',
                    'height': '$result.height',
                    'weight': '$result.weight',
                    'city': '$result.city',
                    'image': 1,
                    'createdAt': 1
                }
            },
            { $sort: { 'createdAt': -1 } }

        ]
        let match = await matchModel.aggregate(q)

        let deta = await matchModel.aggregate(a)

        const result = match.concat(deta);

        if (result) {
            return res.status(200).send({ status: 1, message: "match list", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Somthing went wrong" })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const userGetLike = async (req, res) => {
    try {
        let data = req.body;
        let { id } = data;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }
        let q = [
            { '$match': { '$and': [{ 'receiver': new mongoose.Types.ObjectId(id) }, { 'type': 'like' }] } },
            { '$lookup': { from: 'users', localField: 'sender', foreignField: '_id', as: 'user' } },
            { '$lookup': { from: 'images', localField: 'sender', foreignField: 'userId', as: 'img' } },
            { $addFields: { 'image': { '$first': '$img.image' } } },
            { $unwind: { 'path': '$user' } },
            {
                '$project': {
                    'first_name': '$user.first_name',
                    'last_name': '$user.last_name',
                    'age': {
                        '$dateDiff': {
                            'startDate': {
                                '$dateFromString': {
                                    'dateString': '$user.birth_date'
                                }
                            },
                            'endDate': '$$NOW',
                            'unit': 'year'
                        }
                    },
                    'phone': '$user.phone',
                    'gender': '$user.gender',
                    'height': '$user.height',
                    'weight': '$user.weight',
                    'city': '$user.city',
                    'image': 1,
                    'createdAt': 1
                }
            }
        ]
        let like = await matchModel.find({ $and: [{ type: 'like' }, { receiver: id }] }).count()
        let result = await matchModel.aggregate(q)
        if (result) {
            return res.status(200).send({ status: 1, message: "like list", data: { like, result } })
        }
        else {
            return res.status(500).send({ status: 0, message: "Somthing went wrong" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const userGetSuperLike = async (req, res) => {
    try {
        let data = req.body;
        let { id } = data;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }
        let q = [
            { '$match': { '$and': [{ 'receiver': new mongoose.Types.ObjectId(id) }, { 'type': 'superLike' }] } },
            { '$lookup': { from: 'users', localField: 'sender', foreignField: '_id', as: 'user' } },
            { '$lookup': { from: 'images', localField: 'sender', foreignField: 'userId', as: 'img' } },
            { $addFields: { 'image': { '$first': '$img.image' } } },
            { $unwind: { 'path': '$user' } },
            {
                '$project': {
                    'first_name': '$user.first_name',
                    'last_name': '$user.last_name',
                    'age': {
                        '$dateDiff': {
                            'startDate': { '$dateFromString': { 'dateString': '$user.birth_date' } },
                            'endDate': '$$NOW',
                            'unit': 'year'
                        }
                    },
                    'phone': '$user.phone',
                    'gender': '$user.gender',
                    'height': '$user.height',
                    'weight': '$user.weight',
                    'city': '$user.city',
                    'image': 1,
                    'createdAt': 1
                }
            },
        ]
        let superLike = await matchModel.find({ $and: [{ type: 'superLike' }, { receiver: id }] }).count()
        let result = await matchModel.aggregate(q)
        if (result) {
            return res.status(200).send({ status: 1, message: "super like list", data: { superLike, result } })
        }
        else {
            return res.status(500).send({ status: 0, message: "Somthing went wrong" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const countMatchLikeAndSuperLike = async (req, res) => {
    try {
        let data = req.body;
        let { id } = data;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }
        let match = await matchModel.find({ $and: [{ sender: id }, { matched: true }] }).count()
        let like = await matchModel.find({ $and: [{ receiver: id }, { type: "like" }] }).count()
        let superLike = await matchModel.find({ $and: [{ receiver: id }, { type: "superLike" }] }).count()

        return res.status(200).send({ status: 1, message: "success", data: { match: match, like: like, superLike: superLike } })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const getlikeAndSuperLike = async (req, res) => {
    try {
        let data = req.body;
        let { id } = data;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId !" })
        }
        let q = [
            { '$match': { '$or': [{ 'receiver': new mongoose.Types.ObjectId(id) },] } },
            { $lookup: { from: 'users', localField: 'sender', foreignField: '_id', as: 'user' } },
            { $lookup: { from: 'images', localField: 'sender', foreignField: 'userId', as: 'img' } },
            { '$addFields': { 'image': { '$first': '$img.image' } } },
            { $unwind: { 'path': '$user' } },
            {
                '$project': {
                    _id: '$user._id',
                    'first_name': '$user.first_name',
                    'age': { '$dateDiff': { 'startDate': { '$dateFromString': { 'dateString': '$user.birth_date' } }, 'endDate': '$$NOW', 'unit': 'year' } },
                    "plan": "$user.plan",
                    'type': 1,
                    'image': 1,
                    'createdAt': 1
                }
            }
        ]
        let result = await matchModel.aggregate(q)
        if (result) {
            return res.status(200).send({ status: 1, message: "like and superLike!", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Somthing went wrong" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

module.exports = {
    createMatch, deleteMatch, getAllmatchedUserList, userGetOwnMatch, userGetLike,
    userGetSuperLike, countMatchLikeAndSuperLike, getlikeAndSuperLike
}