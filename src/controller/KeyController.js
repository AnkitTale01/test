const KeyTypeModel = require('../models/KeyTypeModel')
const KeyModel = require('../models/KeyModel')
const { isEmpty } = require('../MyModels/common_model')
const { default: mongoose } = require('mongoose')


const keyTypeAdd = async (req, res) => {
    try {
        const data = req.body

        const { title } = data

        if (isEmpty(title)) {
            return res.status(200).send({ status: 0, message: "all field required" })
        }

        let obj = {
            title: title,

        }

        let add = await KeyTypeModel.create(obj)

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

const keyTypeUpdate = async (req, res) => {
    try {
        const data = req.body
        const { id, title, is_active } = data
        if (isEmpty(id)) {
            return res.status(200).send({ status: 0, message: "Id is require" })
        }
        let obj = {}
        if (!isEmpty(title)) { obj = { ...obj, title } }
        if (!isEmpty(is_active)) { obj = { ...obj, is_active } }

        let update = await KeyTypeModel.findByIdAndUpdate(id, obj, { new: true });

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

const keyTypeList = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let search = req.query.q;
        let q = {}
        if (search) {
            let or = [];
            or[0] = { title: { $regex: search, $options: "i" } }
            q.$or = or;
        }

        let records = await KeyTypeModel.count(q);
        var page = req.query.page

        if (page == 0) {
            page = 1
        }


        let result = await KeyTypeModel.find(q).select({ createdAt: 0, updatedAt: 0, __v: 0 }).sort({ createdAt: -1 }).limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        if (result) {
            return res.status(201).send({ status: 1, message: "Successfully get a list", data: { totalkeyType: records, page: page, result } })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const keyTypeDelete = async (req, res) => {
    try {
        const data = req.body
        const { id } = data

        if (isEmpty(id)) {
            return res.status(200).send({ status: 0, message: "Id is required" })
        }

        let response = await KeyTypeModel.findByIdAndDelete(id);

        if (response) {
            return res.status(201).send({ status: 1, message: " Deleted", data: response })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const keyAdd = async (req, res) => {
    try {
        const data = req.body

        const { title, key_type_id } = data

        if (isEmpty(title) || isEmpty(key_type_id)) {
            return res.status(200).send({ status: 0, message: "all field required" })
        }

        let obj = {
            title: title,
            key_type_id: key_type_id
        }

        let add = await KeyModel.create(obj)

        if (add) {
            return res.status(201).send({ status: 1, message: "SuccessFully Created", data: add })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const keyUpdate = async (req, res) => {
    try {
        const data = req.body
        const { id, title, is_active, key_type_id } = data
        if (isEmpty(id)) {
            return res.status(200).send({ status: 0, message: "Id is required" })
        }
        let obj = {}
        if (!isEmpty(title)) { obj = { ...obj, title } }
        if (!isEmpty(is_active)) { obj = { ...obj, is_active } }
        if (!isEmpty(key_type_id)) { obj = { ...obj, key_type_id } }

        let update = await KeyModel.findByIdAndUpdate(id, obj, { new: true });

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

const keyList = async (req, res) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
        var sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : 1
        let search = req.query.q;

        //   let   pipeline = [

        //         {
        //             '$lookup': {
        //                 'from': 'keytypes',
        //                 'localField': 'key_type_id',
        //                 'foreignField': '_id',
        //                 'as': 'key'
        //             }
        //         }, {
        //             '$unwind': {
        //                 'path': '$key',
        //                 'preserveNullAndEmptyArrays': true
        //             }
        //         }, {
        //             '$project': {
        //                 'title': 1,
        //                 'key_type': '$key.title',
        //                 'is_active': 1
        //             }
        //         }
        //     ]
        let q = [
            {
                '$match': {
                    'is_active': true
                }
            }, {
                '$lookup': {
                    'from': 'keys',
                    'localField': '_id',
                    'foreignField': 'key_type_id',
                    'as': 'key'
                }
            }, {
                '$unwind': {
                    'path': '$key',
                    'includeArrayIndex': 'string'
                }
            }, {
                '$project': {
                    "_id": "$key._id",
                    'title': '$key.title',
                    'is_active': '$key.is_active',
                    'key_type': '$title'
                }
            }
        ]
        let records = (await KeyTypeModel.aggregate(q)).length

        if (search) {
            q.push({
                '$match': {

                    'key_type': {
                        '$regex': search,
                        '$options': 'i'
                    }

                }
            })
        }
        // let records = (await KeyModel.aggregate(pipeline)).length;
        let page = Math.ceil(records / limit);
        let sort = {}
        sort[`${sortBy}`] = sortOrder
        // pipeline.push({ '$sort': sort })
        // pipeline.push({ '$skip': parseInt(skip) })
        // pipeline.push({ '$limit': parseInt(limit) })

        q.push({ '$sort': sort })
        q.push({ '$skip': parseInt(skip) })
        q.push({ '$limit': parseInt(limit) })

        // let result = await KeyModel.aggregate(pipeline)
        let result = await KeyTypeModel.aggregate(q)

        if (result) {
            return res.status(201).send({ status: 1, message: "Successfully get a list", data: { totalkeyType: records, page: page, result } })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const keyDelete = async (req, res) => {
    try {
        const data = req.body
        const { id } = data

        if (isEmpty(id)) {
            return res.status(200).send({ status: 0, message: "Id is required" })
        }

        let response = await KeyModel.findByIdAndDelete(id);

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

const keyTypeListForDropdown = async (req, res) => {
    try {
        let result = await KeyTypeModel.find({ is_active: 1 });

        if (result) {
            return res.status(201).send({ status: 1, message: "Success", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const getKeyTypeById = async (req, res) => {
    try {
        let data = req.body
        let { id } = data
        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required" })
        }
        let pipeline = [
            {
                '$match': {
                    '_id': new mongoose.Types.ObjectId(id)
                }
            }, {
                '$lookup': {
                    'from': 'keys',
                    'localField': '_id',
                    'foreignField': 'key_type_id',
                    'as': 'key'
                }
            }, {
                '$unwind': {
                    'path': '$key'
                }
            }, {
                '$project': {
                    'id': '$key._id',
                    'title': '$key.title',
                    '_id': 0
                }
            }
        ]
        let result = await KeyTypeModel.aggregate(pipeline)
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        } else {
            return res.status(500).send({ status: 1, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}


module.exports = {
    keyTypeAdd, keyTypeDelete, keyTypeList, keyTypeUpdate, keyAdd, keyDelete, keyList,
    keyUpdate, keyTypeListForDropdown, getKeyTypeById
}