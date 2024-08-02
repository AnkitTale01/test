
const imageModel = require("../models/imageModel.js");
const { uploadFile, deleteImage } = require("../MyModels/aws.js");
const { isEmpty } = require("../MyModels/common_model.js");

const imageUpload = async (req, res, next) => {
    try {

        const files = req.files
        let imageUrl = ""
        if (!isEmpty(files)) {
            const userImage = await uploadFile(files[0])
            imageUrl = userImage;
        }
        
        req.fileUrl = imageUrl
        req.body[`${files[0].fieldname}`] = imageUrl
        next()
        //return res.status(200).send({ status: 1, message: "user Image", data: userImage })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const voiceUpload = async (req, res, next) => {
    try {

        const files = req.files
        let voiceUrl = ""
        if (!isEmpty(files)) {
            const userVoice = await uploadFile(files[0])
            voiceUrl = userVoice;
        }

        req.voice_record = voiceUrl
        next()
        //return res.status(200).send({ status: 1, message: "user Image", data: userImage })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const userImageUpload = async (req, res) => {
    try {
        let userId = req.params.id;
        let fileUrl = req.fileUrl;
        if (!userId) { return res.status(404).send({ status: 0, message: "please enter userId" }) }
        if (!fileUrl) { return res.status(404).send({ status: 0, message: "please enter image" }) }


        let obj = {
            userId: userId,
            image: fileUrl,
        }
        let result = await imageModel.create(obj)

        if (result) {
            return res.status(200).send({ status: 1, message: "successfully upload image", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const viewImage = async (req, res) => {
    try {

        let userId = req.body.userId
        if (!userId) {
            return res.status(400).send({ status: 0, message: "Please enter userId!" })
        }
        let list = await imageModel.find({ userId: userId })
        if (list.length == []) {
            return res.status(200).send({ status: 0, message: "image list!", data: [] })
        }
        else {
            return res.status(200).send({ status: 1, message: "image list!", data: list })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const updateImage = async (req, res) => {
    try {
        let id = req.body.id
        let userId = req.params.id;
        let fileUrl = req.fileUrl;
        if (!fileUrl) { return res.status(400).send({ status: 0, message: "please enter image" }) }
        if (!id) {
            return res.status(400).send({ status: 0, message: "Please enter id!" })
        }
        let obj = {
            userId: userId,
            image: fileUrl,
        }
        let update = await imageModel.findByIdAndUpdate(id, obj, { new: true })
        return res.status(200).send({ status: 1, message: "image update!", data: update })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const deleteImages = async (req, res) => {
    try {
        let id = req.body.id
        if (!id) {
            return res.status(400).send({ status: 0, message: "Please enter id!" })
        }
        let Delete = await imageModel.findByIdAndDelete(id)
        return res.status(200).send({ status: 1, message: "User image deleted!", data: Delete })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const userImagedelete = async (req, res) => {
    try {
        let Id = req.params.id;
        if (!Id) { return res.status(404).send({ status: 0, message: "please enter userId" }) }
        let result = await imageModel.findByIdAndDelete(Id);
        let str = "https://shadi-app.s3.ap-southeast-2.amazonaws.com/abc/download1%20%281%29%20%281%29.jpg";
        let fileName = str.substring(54)
        let d1 = await deleteImage(str)
        if (result) {
            return res.status(200).send({ status: 1, message: "successfully upload image", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}


// copy database 
const { MongoClient } = require('mongodb');
const sourceUri = '';
const destinationUri = '';
const transferData = async () => {
  const sourceClient = new MongoClient(sourceUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const destinationClient = new MongoClient(destinationUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await sourceClient.connect();
    await destinationClient.connect();

    console.log('Connected to both databases');

    const sourceDb = sourceClient.db();
    const destinationDb = destinationClient.db();

    const collections = await sourceDb.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      const sourceCollection = sourceDb.collection(collectionName);
      const data = await sourceCollection.find({}).toArray();

      console.log(`Fetched ${data.length} documents from source collection: ${collectionName}`);

      const destinationCollection = destinationDb.collection(collectionName);
      const destinationData = await destinationCollection.find({}).toArray();
      if (!destinationData.length > 0) {
        if (data.length > 0) {
          const result = await destinationCollection.insertMany(data);
          console.log(`Inserted ${result.insertedCount} documents into destination collection: ${collectionName}`);
        }
      }

    }

  } catch (error) {
    console.error('Error transferring data:', error);
  } finally {
    await sourceClient.close();
    await destinationClient.close();
    console.log('Connections closed');
  }
};

// transferData();

module.exports = { imageUpload, userImageUpload, viewImage, deleteImages, userImagedelete, updateImage, voiceUpload }