const planModel = require("../models/planModel");
const subscriptionModel = require("../models/subscriptionModel");
const userModel = require("../models/userModel");

const planList = async (req, res) => {
  try {

    let { id } = req.body;
    let q = []
    let Data = await userModel.findById(id)
    let plan = Data.plan
    console.log("--->>>>", plan);
    if (plan === "Free") {
      q.push({ $match: { is_active: true } })
    }
    if (plan === "Premium") {
      q.push({ $match: { $and: [{ is_active: true }, { name: { $in: ['Gold', 'Vip'] } }] } })
    }
    if (plan === "Gold") {
      q.push({ $match: { $and: [{ is_active: true }, { name: { $in: ['Vip'] } }] } })
    }
    if (plan === "Vip") {
      q.push({ $match: { $and: [{ is_active: true }, { name: { $in: [''] } }] } })
    }
    q.push({
      '$addFields': {
        'discountPercentage': {
          '$multiply': [
            {
              '$divide': [
                {
                  '$subtract': [
                    '$price', '$discounted_price'
                  ]
                }, '$price'
              ]
            }, 100
          ]
        }
      }
    })
    q.push({
      '$addFields': {
        'discountPercentage': {
          '$round': '$discountPercentage'
        }
      }
    })
    q.push({
      '$lookup': {
        'from': 'features',
        'localField': '_id',
        'foreignField': 'planId',
        'as': 'feauture',
        'pipeline': [
          {
            '$match': {
              'is_active': true
            }
          }, {
            '$project': {
              'createdAt': 0,
              'updatedAt': 0,
              'is_active': 0,
              '__v': 0
            }
          }
        ]
      }
    }, {
      '$unwind': {
        'path': '$feature',
        'preserveNullAndEmptyArrays': true
      }
    })

    let list = await planModel.aggregate(q)
    if (list) {
      return res.status(200).send({ status: 1, message: "success", data: list })
    } else {
      return res.status(500).send({ status: 0, message: "Something went wrong !!!" })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 0, message: "server error", data: null })
  }
}

const subscriptionAdd = async (req, res) => {
  try {
    let data = req.body;
    var { planId, userId } = data;
    if (!planId) {
      return res.status(400).send({ status: 0, message: "please enter planId" })
    }
    if (!userId) {
      return res.status(400).send({ status: 0, message: "please enter userId" })
    }
    let findPlan = await planModel.findOne({ _id: planId })
    let planName = findPlan.name;
    let amount = findPlan.discounted_price
    if (planName == 'Premium') {
      date = new Date();
      date.setDate(date.getDate() + 30);
    }
    if (planName == 'Gold') {
      date = new Date();
      date.setDate(date.getDate() + 180);
    }
    if (planName == 'Vip') {
      date = new Date();
      date.setDate(date.getDate() + 360);
    }
    let obj = {
      planId: planId,
      userId: userId,
      validity: date,
      amount: amount
    }
    let result = await subscriptionModel.create(obj);
    if (result) {
      let plan = await planModel.find({ _id: planId });
      var name = [];
      for (let i of plan) {
        name.push(i.name)
      }
      name = name.toString()
      let user = await userModel.findOneAndUpdate({ _id: userId }, { plan: name }, { new: true })

      return res.status(200).send({ status: 1, message: "subscription added!", body: result })
    } else {
      return res.status(200).send({ status: 0, message: "Something went wrong", body: null })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 0, message: "server error", data: null })
  }
}

const viewSubscription = async (req, res) => {
  try {
    let data = req.body;
    let { _id } = data;
    if (!_id) {
      return res.status(400).send({ status: 0, message: "please enter subscriptionId" })
    }
    let result = await subscriptionModel.findById(_id);
    let validity = result.validity
    let dayMilliSeconds = 1000 * 60 * 60 * 24;
    let todaySDate = new Date(new Date().toISOString().slice(0, 10));
    let currentDate = new Date()
    let currentDiff = new Date(validity) - currentDate;
    // console.log("---->>>dif>", new Date(currentDiff));
    totalDays = Math.abs(currentDiff / dayMilliSeconds);
    remainingDays = Math.floor(totalDays);
    //  let year = remainingDays % 365
    let days;
    if (remainingDays > 360) {
      days = "1 Year"
    }
    else if (remainingDays < 360 && remainingDays > 30) {
      let month = (remainingDays /30)
      days = Math.floor(month)
    } else {
      let Day = (remainingDays % 30)
      days = Day
    }
    // console.log("---->>>>>days", days);
    if (remainingDays == 0) {
      let userData = await userModel.findByIdAndUpdate(userId, { plan: Free }, { new: true })
    }
    // console.log("--->>>", year, remainingDays);

    if (result) {
      return res.status(200).send({ status: 1, message: "subscription details", data: result })
    } else {
      return res.status(200).send({ status: 0, message: "Something went wrong", data: null })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 0, message: "server error", data: null })
  }
}


module.exports = { subscriptionAdd, viewSubscription, planList }