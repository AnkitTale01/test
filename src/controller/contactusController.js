const queryModel= require('../models/queryModel');
const contactUsModel = require('../models/contactusModel')

const createContactUs = async (req, res) => {
    try {
        let data = req.body;
        let {userId, title, image, description } = data;
        if (!userId) {
            return res.status(400).send({ status: 0, message: "userId is required" })
        }
        if (!title) {
            return res.status(400).send({ status: 0, message: "title is required" })
        }
        if (!description) {
            return res.status(400).send({ status: 0, message: "description is required" })
        }
        
        let obj = {
            userId:userId,
            title: title,
            image: image,
            description: description
        }
        let result = await contactUsModel.create(obj)
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

const contactusList = async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let skip = (req.query.page ? req.query.page : 0) * limit
        let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
        var sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : -1
        let search = req.query.q;
        
        let pipeline =[
            {
              '$lookup': {
                'from': 'users', 
                'localField': 'userId', 
                'foreignField': '_id', 
                'as': 'user'
              }
            }, {
              '$unwind': {
                'path': '$user', 
                'includeArrayIndex': 'string'
              }
            }, {
              '$project': {
                'title': 1, 
                'image': 1, 
                'name': {
                  '$concat': [
                    '$user.first_name', ' ', '$user.last_name'
                  ]
                }, 
                'description': 1, 
                'createdAt': 1
              }
            }
          ]
          if(search){
            pipeline.push({
                $match:{
                    'title': {
                        '$regex': search,
                        '$options': 'i'
                    }
                }
            })
          }
        let records = await contactUsModel.count(pipeline);
        let sort = {}
        sort[`${sortBy}`] = sortOrder
        pipeline.push({ '$sort': sort })
        pipeline.push({ '$skip': parseInt(skip) })
        pipeline.push({ '$limit': parseInt(limit) })

        let page = Math.ceil(records / limit);
        let result =await contactUsModel.aggregate(pipeline)
        if (result) {
            return res.status(201).send({ status: 1, message: "Successfully get a list", data: { total: records, page: page, result } })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const deleteContactUs = async (req, res) => {
    try {
        let data = req.body;
        let {id} = data;

        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required" })
        }
       
        let result = await contactUsModel.findByIdAndDelete(id)
        if (result) {
            return res.status(200).send({ status: 1, message: "Successfully Deleted", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const sendReply = async (req, res) => {
    try {
        let data = req.body;
        let {qId, image, description } = data;
        if (!qId) {
            return res.status(400).send({ status: 0, message: "Id is required" })
        }
        if (!description) {
            return res.status(400).send({ status: 0, message: "description is required" })
        }
        
        let obj = {
            qId:qId,
            image: image,
            description: description
        }
        let result = await queryModel.create(obj)
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}


module.exports = {
    createContactUs, contactusList,deleteContactUs,sendReply
}