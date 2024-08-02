const notificationModel = require('../models/notificationModel');
const userModel = require('../models/userModel');
const FcmTokenModel = require('../models/fcmTokenModel')
var FCM = require('fcm-node');

const sendPushNotificationByToken = async (user_tokens, messageBody) => {
  try {
    var serverKey = 'AAAAUJ3EyNs:APA91bHSh5sYhoEybC77HdA78PCdjpFqLyvp8QDMI3suYRsFscw4AYOdg_cuTKkGYb-Qnn6fAS1V12_2f4iqtnqJxtshcpIDgviLTq0NNM67ZCBoW1BgKoLU97w1b3GtDF5VQOFe7IOK';
    var fcm = new FCM(serverKey);
    const { title, body, image } = messageBody;
    var message = {
      registration_ids: user_tokens, // must be in array 
      notification: {
        title: title,
        body: body,
        image: image // must be a url
      },
    };
    console.log("meassge", message);
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!" + err);
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
    return true
  } catch (err) {
    console.log(err);
    return false
  }
}

const create = async (req, res) => {
  try {

    const { title, body, sendTo, sendToIds, action, actionId, image, type } = req.body
    if (!title) {
      return res.status(400).send({ status: 0, message: "please enter title" })
    }
    if (!body) {
      return res.status(400).send({ status: 0, message: "please enter body" })
    }

    let obj = {
      title: title,
      body: body,
      image: image,
      sendTo: sendTo,
      sendToIds: sendToIds,
      action: action,
      actionId: actionId,
      type: type
    }

    let messageBody = {
      title: title,
      body: body,
      image: image,
    }
    let result = await notificationModel.create(obj);

    if (sendTo == 'goldUser') {
      let users = await userModel.distinct('_id', { plan: "Gold", is_push: false })
      let condobj = { userId: { $in: users } };
      let tokens = await FcmTokenModel.distinct('fcm_token', condobj);
      let sentPush = await sendPushNotificationByToken(tokens, messageBody)

    }

    if (sendTo == 'vipUser') {
      let users = await userModel.distinct('_id', { plan: "Vip", is_push: false })
      let condobj = { userId: { $in: users } };
      let tokens = await FcmTokenModel.distinct('fcm_token', condobj);
      let sentPush = await sendPushNotificationByToken(tokens, messageBody)
    }

    if (sendTo == 'premiumUser') {
      let users = await userModel.distinct('_id', { plan: "Premium", is_push: false })
      let condobj = { userId: { $in: users } };
      let tokens = await FcmTokenModel.distinct('fcm_token', condobj);
      let sentPush = await sendPushNotificationByToken(tokens, messageBody)
    }
    if (sendTo == 'all') {
      let users = await userModel.distinct('_id', { is_push: false })
      let condobj = { userId: { $in: users } };
      let tokens = await FcmTokenModel.distinct('fcm_token', condobj);
      let sentPush = await sendPushNotificationByToken(tokens, messageBody)
    }
    if (result) {
      return res.status(200).send({ status: 1, message: "notification created", })
    } else {
      return res.status(200).send({ status: 0, message: "something went wrong in create notification", data: null })
    }

  } catch (error) {
    console.log(error)
    return res.status(200).send({ status: 0, message: "server error in create notification", data: null })
  }
}

const list = async (req, res) => {
  try {
    let limit = req.query.limit ? req.query.limit : 10;
    let search = req.query.q;
    let q = {}
    if (search) {
      let or = [];
      or[0] = { title: { $regex: search, $options: "i" } }
      or[1] = { body: { $regex: search, $options: "i" } }
      q.$or = or;
    }
    let records = await notificationModel.count(q);
    var page = req.query.page
    if (page == 0) {
      page = 1
    }

    let results = await notificationModel.find(q).select({ __v: 0 }).sort({ createdAt: -1 }).limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    if (results) {
      return res.status(200).send({ status: 1, message: "success", data: { total: records, page: page, list: results } })
    } else {
      return res.status(200).send({ status: 0, message: "no data found", data: null })
    }
  } catch (error) {
    console.log("Error : ", error)
    return res.status(200).send({ status: 0, message: "server error", data: null })
  }
}

const remove = async (req, res) => {
  let id = req.body.id;

  let result = await notificationModel.findOneAndRemove({ _id: id })
  if (result) {
    return res.status(200).send({ status: 1, message: "notification deleted", data: null })
  } else {
    return res.status(200).send({ status: 0, message: "something went wrong in update notification", data: null })
  }
}

module.exports = { create, list, remove }