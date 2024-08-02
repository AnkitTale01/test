const { isEmpty, send_mobile_otp, verifyEmail, CompletedProfile } = require('../MyModels/common_model')
const emailModel = require('../models/emailModel')
const jwt = require('jsonwebtoken');
const imageModel = require('../models/imageModel')
const matchModel = require('../models/matchModel')
const userModel = require('../models/userModel')
const https = require('https');
const userPreferenceModel = require('../models/userPreferenceModel')
const { default: mongoose, mongo } = require('mongoose');
const { pipeline } = require('stream');
const verifyModel = require('../models/verifyModel');
const { Agent } = require('http');
const userReportModel = require('../models/userReportModel');
const fcmTokenModel = require('../models/fcmTokenModel');
const liveStreamingModel = require("../models/liveStreamingModel")

async function validateFbToken(token) {
    // https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=EAAemVLwtqg4BABcqt2On5EwVFpMkgrlLAehh1KH6c1YpSzAt79bNElFbEUskLf2kUP3WYZAbdQnI5WXDnSXsY6RMzKygToD2RC0VyEPfj1I1J5kjQMoCHXwTTHlcnQqbswbIziLDeoEo7FVwVFqj62oxKiChwbswWnXvzf5JipIDMQ9AbvEoeFyM0M4b1zpaZCyjMeQzcuQoQ8A4IqfZARO7LEkBj3TBZC8sqPiKwgZDZD
    return new Promise((resolve) => {
        let url = "https://graph.facebook.com/me?fields=id,birthday,gender,first_name,last_name,email&access_token=" + token
        https.get(url, (resp) => {
            var data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => { resolve(JSON.parse(data)); });
        }).on("error", (err) => {
            resolve(null);
            console.log("Error: " + err.message);
        });
    })
}

const loginWithFacebook = async (req, res) => {
    const data = req.body;
    const { token } = data
    if (!token) {
        return res.status(400).send({ status: 0, message: "Please pass token", data: null })
    }

    let response = await validateFbToken(req.body.token)
    // console.log({ response })
    if (!response) {
        return res.status(400).send({ status: 0, message: "invalid token", data: null })
    }

    let findUser = await userModel.findOne({ email: response.email })
    if (!findUser) {
        let inputDate = response.birthday
        const [month, day, year] = inputDate.split('/');
        let birthday = response.birthday?`${year}-${month}-${day}`:''
        let registerObj = {
            phone: null, first_name: response.first_name,
            last_name: response.last_name, email: response.email,
            social_platform: "facebook", social_id: response.id,
            gender: response.gender,
            birth_date: birthday, is_Email: response.email,
            otp: ""
        }
        findUser = await userModel.create(registerObj)
    }
    if (findUser) {
        let data = findUser.toObject({ flattenMaps: true });
        let token = jwt.sign({ userId: findUser._id, email: "", phone: "" }, 'USER')
        data['isSignup'] = 0
        data['token'] = token
        delete data.__v
        delete data.updatedAt
        delete data.otp
        let profile = await CompletedProfile(data)
        data['profilePercentage'] = profile
        return res.status(200).send({ status: 1, message: "login success", data: data })
    } else {
        return res.status(200).send({ status: 0, message: "Something wrong in create user. Please try again", data: null })
    }

    // if(findUser) {
    //     const data = findUser.toObject({ flattenMaps: true });
    //     let token = jwt.sign({ userId: findUser._id, email:"", phone:"" }, 'USER')
    //     data['isSignup'] = 0
    //     data['token'] = token
    //     delete data.__v
    //     delete data.updatedAt
    //     delete data.otp
    //     return res.status(200).send({ status: 1, message: "login success", data: data })
    // } else {
    //     let registerObj = {
    //         phone: null,
    //         first_name: response.first_name,
    //         last_name: response.last_name,
    //         email: response.email,
    //         social_platform: "facebook",
    //         social_id: response.id,
    //         image: response.picture,
    //         birth_date: null,
    //         gender: null,
    //         level: null,
    //         bio:"",
    //         otp:""
    //     }
    //     let create = await userModel.create(registerObj)
    //     if (create) {
    //         const data = create.toObject({ flattenMaps: true });
    //         let token = jwt.sign({ userId: create._id, email: create.email, phone: create.phone }, 'USER')
    //         data['isSignup'] = 1
    //         data['token'] = token
    //         delete data.__v
    //         delete data.updatedAt
    //         delete data.otp
    //         return res.status(200).send({ status: 1, message: "signup sucessfully", data: data })
    //     }
    //     return res.status(200).send({ status: 0, message: "Something wrong in create user. Please try again", data: null })
    // }
}

const loginWithGoogle = async (req, res) => {
    const data = req.body;
    const { token } = data
    if (!token) {
        return res.status(400).send({ status: 0, message: "Please pass token", data: null })
    }

    let decode = jwt.decode(token)
    if (!decode) {
        return res.status(400).send({ status: 0, message: "Invalid token", data: null })
    }
    console.log("Google Decode : ", decode)
    let findUser = await userModel.findOne({ email: decode.email })
    if (findUser) {
        const data = findUser.toObject({ flattenMaps: true });
        let token = jwt.sign({ userId: findUser._id, email: findUser.email, phone: findUser.phone }, 'USER')
        data['isSignup'] = 0
        data['token'] = token
        delete data.__v
        delete data.updatedAt
        delete data.otp
        let profile = await CompletedProfile(data)
        data['profilePercentage'] = profile
        return res.status(200).send({ status: 1, message: "login success", data: data })
    } else {
        let registerObj = {
            phone: '',
            first_name: decode.given_name,
            last_name: decode.family_name,
            email: decode.email,
            is_Email: decode.email,
            social_platform: "google",
            social_id: decode.sub,
            // image: decode.picture,
            birth_date: '',
            gender: '',
            bio: "",
            otp: ""
        }
        let create = await userModel.create(registerObj)
        if (create) {
            const data = create.toObject({ flattenMaps: true });
            let token = jwt.sign({ userId: create._id, email: create.email, phone: create.phone }, 'USER')
            data['isSignup'] = 1
            data['token'] = token
            delete data.__v
            delete data.updatedAt
            delete data.otp

            let profile = await CompletedProfile(data)
            data['profilePercentage'] = profile
            return res.status(200).send({ status: 1, message: "signup sucessfully", data: data })
        }
        return res.status(200).send({ status: 0, message: "Something wrong in create user. Please try again", data: null })
    }
}

const userLogin = async (req, res) => {
    try {
        const data = req.body
        let { phone } = data;
        if (!phone) {
            return res.status(400).send({ message: 'please enter a phone number' })
        }
        if (phone.length !== 10) {
            return res.status(400).send({ message: 'please enter 10 digit' })
        }

        // const otp = Math.floor(1000 + Math.random() * 9000)
        const otp = 1234
        let otpsend = await send_mobile_otp(phone, otp)
        let userdata = await userModel.find({ phone: phone });

        if (isEmpty(userdata)) {
            let obj = {
                phone: phone,
                is_Phone: phone,
                otp: otp
            }

            let createdata = await userModel.create(obj)
            return res.status(200).send({ status: 1, massege: 'Otp send to your mobile', data: createdata._id })
        } else {
            let updatedUser = await userModel.findOneAndUpdate({ _id: userdata[0]._id }, { $set: { otp: otp } }, { new: true });

            return res.status(200).send({ status: 1, massege: 'Otp send to your mobile', data: updatedUser._id })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const recoverAcounnt = async (req, res) => {
    try {
        const data = req.body
        const { security_question, security_answer } = data;
        if (!security_question) {
            return res.status(400).send({ status: 0, message: "security question is required..!" })
        }
        if (!security_answer) {
            return res.status(400).send({ status: 0, message: "security answer is required..!" })
        }
        let userdata = await userModel.findOne({ security_question });

        if (!userdata) {
            return res.status(404).send({ status: 0, message: "invalid question" })
        }
        if (userdata.security_answer != security_answer) {
            return res.status(404).send({ status: 0, message: "incorrect answer" })
        }
        else {
            return res.status(200).send({ status: 1, massege: 'Account recovered successfully', data: userdata._id })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: error, data: null })
    }
}

const verifyOTP = async (req, res) => {
    try {
        const data = req.body

        let { userId, otp } = data;
        if (!userId) {
            return res.status(404).send({ status: 0, message: 'please enter user Id' })
        }
        if (!otp) {
            return res.status(404).send({ status: 0, message: 'Please enter otp number' })
        }

        let result = await userModel.findById(userId);
        if (result) {
            if (result.otp == otp) {
                let update = await userModel.findByIdAndUpdate(userId, { phone: result.is_Phone, email: result.is_Email })
                let profile = await CompletedProfile(result)
                result = { ...result._doc, profilePercentage: profile }

                return res.status(200).send({ status: 1, massege: 'Success', data: result })
            }
            else {
                return res.status(200).send({ status: 0, massege: 'Invalid OTP', data: {} })
            }
        }
        return res.status(200).send({ status: 0, massege: 'Invalid User', data: {} })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const updateLocation = async (req, res) => {
    try {

        let data = req.body;

        const { userId, lat, lng } = data
        if (!userId) {
            return res.status(400).send({ status: 0, message: "id is required..!" })
        }

        let obj = {
            location: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] }
        }

        let findAndUpdate = await userModel.findOneAndUpdate({ _id: userId }, obj, { new: true })
        if (findAndUpdate) {
            return res.status(200).send({ status: 1, message: "updated successfully", data: findAndUpdate })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: 0, message: "server error", data: null })
    }
}

const updateUserData = async (req, res) => {
    try {
        let data = req.body;
        let userId = req.body.userId
        let voice_record = req.voice_record

        let { first_name, last_name, email, birth_date, height, gender, phone, weight, city, state, country, looking_for, marital_status,
            about, religion, caste, security_question, security_answer, job_title, company, education, managedBy, mother_tongue,
            marriage_plan, zodiac_sign, education_level, covid_vaccine, health, personality_type, pets, drinking, smoking, workout,
            dietary_preference, social_media, sleeping_habits, goGlobel, go_incognito, is_online, is_showOnCard, show_people_in_range,
            is_age, is_height, is_weight, is_smoke, is_drink, is_diet, is_email, is_push, is_photo_option, username, save_country,
            spotify_id, spotify_username, spotify_playlist, spotify_artistlist, show_me_online } = data


        if (first_name) { first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1); }
        if (last_name) { last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1); }

        let userDetails = {};
        if (!isEmpty(first_name)) { userDetails = { ...userDetails, first_name: first_name } }
        if (!isEmpty(last_name)) { userDetails = { ...userDetails, last_name: last_name } }
        if (!isEmpty(email)) { userDetails = { ...userDetails, email: email } }
        if (!isEmpty(phone)) { userDetails = { ...userDetails, phone: phone } }
        if (!isEmpty(gender)) { userDetails = { ...userDetails, gender: gender } }
        if (!isEmpty(birth_date)) { userDetails = { ...userDetails, birth_date: birth_date } }
        if (!isEmpty(country)) { userDetails = { ...userDetails, country: country } }
        if (!isEmpty(city)) { userDetails = { ...userDetails, city: city } }
        if (!isEmpty(state)) { userDetails = { ...userDetails, state: state } }
        if (!isEmpty(height)) { userDetails = { ...userDetails, height: height } }
        if (!isEmpty(weight)) { userDetails = { ...userDetails, weight: weight } }
        if (!isEmpty(about)) { userDetails = { ...userDetails, about: about } }
        if (!isEmpty(religion)) { userDetails = { ...userDetails, religion: religion } }
        if (!isEmpty(caste)) { userDetails = { ...userDetails, caste: caste } }
        if (!isEmpty(looking_for)) { userDetails = { ...userDetails, looking_for: looking_for } }
        if (!isEmpty(managedBy)) { userDetails = { ...userDetails, managedBy: managedBy } }
        if (!isEmpty(mother_tongue)) { userDetails = { ...userDetails, mother_tongue: mother_tongue } }
        if (!isEmpty(marriage_plan)) { userDetails = { ...userDetails, marriage_plan: marriage_plan } }
        if (!isEmpty(job_title)) { userDetails = { ...userDetails, job_title: job_title } }
        if (!isEmpty(company)) { userDetails = { ...userDetails, company: company } }
        if (!isEmpty(education)) { userDetails = { ...userDetails, education: education } }
        if (!isEmpty(marital_status)) { userDetails = { ...userDetails, marital_status: marital_status } }
        if (!isEmpty(security_question)) { userDetails = { ...userDetails, security_question: security_question } }
        if (!isEmpty(security_answer)) { userDetails = { ...userDetails, security_answer: security_answer } }

        //user Update key 
        if (!isEmpty(zodiac_sign)) { userDetails = { ...userDetails, zodiac_sign: zodiac_sign } }
        if (!isEmpty(education_level)) { userDetails = { ...userDetails, education_level: education_level } }
        if (!isEmpty(covid_vaccine)) { userDetails = { ...userDetails, covid_vaccine: covid_vaccine } }
        if (!isEmpty(health)) { userDetails = { ...userDetails, health: health } }
        if (!isEmpty(personality_type)) { userDetails = { ...userDetails, personality_type: personality_type } }
        if (!isEmpty(pets)) { userDetails = { ...userDetails, pets: pets } }
        if (!isEmpty(drinking)) { userDetails = { ...userDetails, drinking: drinking } }
        if (!isEmpty(smoking)) { userDetails = { ...userDetails, smoking: smoking } }
        if (!isEmpty(workout)) { userDetails = { ...userDetails, workout: workout } }
        if (!isEmpty(dietary_preference)) { userDetails = { ...userDetails, dietary_preference: dietary_preference } }
        if (!isEmpty(social_media)) { userDetails = { ...userDetails, social_media: social_media } }
        if (!isEmpty(sleeping_habits)) { userDetails = { ...userDetails, sleeping_habits: sleeping_habits } }

        // status 

        if (!isEmpty(goGlobel)) { userDetails = { ...userDetails, goGlobel: goGlobel } }
        if (!isEmpty(go_incognito)) { userDetails = { ...userDetails, go_incognito: go_incognito } }
        if (!isEmpty(is_online)) { userDetails = { ...userDetails, is_online: is_online } }
        if (!isEmpty(is_showOnCard)) { userDetails = { ...userDetails, is_showOnCard: is_showOnCard } }
        if (!isEmpty(show_people_in_range)) { userDetails = { ...userDetails, show_people_in_range: show_people_in_range } }

        if (!isEmpty(is_age)) { userDetails = { ...userDetails, is_age: is_age } }
        if (!isEmpty(is_height)) { userDetails = { ...userDetails, is_height: is_height } }
        if (!isEmpty(is_weight)) { userDetails = { ...userDetails, is_weight: is_weight } }
        if (!isEmpty(is_drink)) { userDetails = { ...userDetails, is_drink: is_drink } }
        if (!isEmpty(is_diet)) { userDetails = { ...userDetails, is_diet: is_diet } }
        if (!isEmpty(is_smoke)) { userDetails = { ...userDetails, is_smoke: is_smoke } }
        if (!isEmpty(is_email)) { userDetails = { ...userDetails, is_email: is_email } }
        if (!isEmpty(is_push)) { userDetails = { ...userDetails, is_push: is_push } }
        if (!isEmpty(is_photo_option)) { userDetails = { ...userDetails, is_photo_option: is_photo_option } }
        if (!isEmpty(username)) {
            let checkuser = await userModel.findById(userId)
            if (checkuser.plan == "Free") {
                return res.status(400).send({ status: 0, msg: "You can't select username!" })
            } else {
                userDetails = { ...userDetails, username: username }
            }
        }
        if (!isEmpty(save_country)) { userDetails = { ...userDetails, save_country: save_country } }
        if (!isEmpty(voice_record)) { userDetails = { ...userDetails, voice_record: voice_record } }

        if (!isEmpty(spotify_username)) { userDetails = { ...userDetails, spotify_username: spotify_username } }
        if (!isEmpty(spotify_id)) { userDetails = { ...userDetails, spotify_id: spotify_id } }
        if (spotify_playlist) {
            let Data = spotify_playlist.split(",")
            let d = Data.join(', ').replace(/\[|\]/g, '');
            d = d.split(",")
            console.log("---->>>>", d);
            var resultArray = d.map(function (element) {
                var songAndMovie = element.match(/^(.*?) \(From "(.*?)"\)$/);
                if (songAndMovie) {
                    var songName = songAndMovie[1];
                    var movieName = songAndMovie[2];
                    return songName + ' From ' + movieName;
                }
                return element;
            });
            var ResultArray = resultArray.map(function (element) {
                var cleanedElement = element.trim().replace(/\s+/g, ' ');
                return cleanedElement;
            });
            // console.log("----->>>>>", ResultArray);

            userDetails = { ...userDetails, spotify_playlist: ResultArray }


        }
        if (spotify_artistlist) {
            let Data = spotify_artistlist.split(',');
            let d = Data.join(',').replace(/\[|\]/g, '');
            d = d.split(",")
            var ResultArray = d.map(function (element) {
                var cleanedElement = element.trim().replace(/\s+/g, ' ');
                return cleanedElement;
            });
            userDetails = { ...userDetails, spotify_artistlist: ResultArray }

        }
        if (!isEmpty(show_me_online)) { userDetails = { ...userDetails, show_me_online: show_me_online } }

        let result = await userModel.findByIdAndUpdate(userId, userDetails, { new: true })
        if (result) {

            return res.status(200).send({ status: 1, message: "Success!", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const updateProfile = async (req, res) => {
    try {
        let data = req.body;
        let id = req.body.id
        if (isEmpty(id)) {
            return res.status(400).send({ status: 0, message: "please enter Id" })
        }
        let { zodiac_sign, education_level, covid_vaccine, health, personality_type, pets, drinking, smoking, workout, dietary_preference, social_media, sleeping_habits } = data
        let userDetails = {};
        { userDetails = { ...userDetails, zodiac_sign: zodiac_sign } }
        { userDetails = { ...userDetails, education_level: education_level } }
        { userDetails = { ...userDetails, covid_vaccine: covid_vaccine } }
        { userDetails = { ...userDetails, health: health } }
        { userDetails = { ...userDetails, personality_type: personality_type } }
        { userDetails = { ...userDetails, pets: pets } }
        { userDetails = { ...userDetails, drinking: drinking } }
        { userDetails = { ...userDetails, smoking: smoking } }
        { userDetails = { ...userDetails, workout: workout } }
        { userDetails = { ...userDetails, dietary_preference: dietary_preference } }
        { userDetails = { ...userDetails, social_media: social_media } }
        { userDetails = { ...userDetails, sleeping_habits: sleeping_habits } }

        let result = await userModel.findByIdAndUpdate(id, userDetails, { new: true })
        if (result) {
            return res.status(200).send({ status: 1, message: "Success!", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const getUserProfile = async (req, res) => {
    try {
        let data = req.body;
        let { userId } = data;
        if (!userId) {
            return res.status(200).send({ status: 0, message: "please enter userId" })
        }
        let checkB_date = await userModel.findById(userId)
        let Bdate = checkB_date.birth_date
        let pipeline = []
        pipeline.push(
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $lookup: { from: 'keys', localField: 'zodiac_sign', foreignField: '_id', as: 'zodiac_sign' } },
            { $unwind: { path: '$zodiac_sign', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'covid_vaccine', foreignField: '_id', as: 'covid_vaccine' } },
            { $unwind: { path: '$covid_vaccine', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'pets', foreignField: '_id', as: 'pets' } },
            { $unwind: { path: '$pets', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'dietary_preference', foreignField: '_id', as: 'dietary_preference' } },
            { $unwind: { path: '$dietary_preference', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'education_level', foreignField: '_id', as: 'education_level' } },
            { $unwind: { path: '$education_level', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'sleeping_habits', foreignField: '_id', as: 'sleeping_habits' } },
            { $unwind: { path: '$sleeping_habits', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'social_media', foreignField: '_id', as: 'social_media' } },
            { $unwind: { path: '$social_media', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'workout', foreignField: '_id', as: 'workout' } },
            { $unwind: { path: '$workout', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'personality_type', foreignField: '_id', as: 'personality_type' } },
            { $unwind: { path: '$personality_type', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'health', foreignField: '_id', as: 'health' } },
            { $unwind: { path: '$health', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'drinking', foreignField: '_id', as: 'drinking' } },
            { $unwind: { path: '$drinking', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'smoking', foreignField: '_id', as: 'smoking' } },
            { $unwind: { path: '$smoking', preserveNullAndEmptyArrays: true } },
            {
                $lookup: { from: 'userpreferences', localField: '_id', foreignField: 'userId', as: 'result' }
            },
            {
                $lookup: { from: 'preferences', localField: 'result.preferenceId', foreignField: '_id', as: 'pref' }
            },
            {
                $lookup: { from: 'images', localField: '_id', foreignField: 'userId', as: 'image' }
            },
            { '$addFields': { 'image': { '$first': '$image.image' } } },
            {
                '$addFields': {
                    'c_date': new Date()
                }
            })
        if (Bdate.length > 0) {
            pipeline.push({ '$addFields': { 'DOB': { '$toDate': '$birth_date' } } }, {
                '$addFields': {
                    'age': {
                        '$subtract': [
                            {
                                '$year': '$c_date'
                            }, {
                                '$year': '$DOB'
                            }
                        ]
                    }
                }
            })
        }
        pipeline.push({
            '$project': {
                'first_name': 1, 'last_name': 1, 'email': 1, "birth_date": 1, 'caste': 1, 'age': 1, 'gender': 1, 'city': 1, 'state': 1, 'country': 1, "looking_for": 1, 'minAge': 1, 'maxAge': 1, 'minHeight': 1, 'maxHeight': 1,
                'location': 1, 'marital_status': 1, 'height': 1, 'weight': 1, 'phone': 1, 'plan': 1, 'about': 1, "religion": 1, 'job_title': 1, 'company': 1, 'education': 1, 'managedBy': 1,
                'zodiac_sign': '$zodiac_sign.title', 'covid_vaccine': '$covid_vaccine.title', 'pets': '$pets.title',
                'dietary_preference': '$dietary_preference.title', 'education_level': '$education_level.title',
                'sleeping_habits': '$sleeping_habits.title', 'social_media': '$social_media.title', 'workout': '$workout.title',
                'personality_type': '$personality_type.title', 'health': '$health.title', 'smoking': '$smoking.title',
                'drinking': '$drinking.title', mother_tongue: 1, marriage_plan: 1, goGlobel: 1, go_incognito: 1,
                is_online: 1, is_showOnCard: 1, show_people_in_range: 1, username: 1, is_age: 1, is_height: 1, is_weight: 1, is_smoke: 1, is_drink: 1, is_diet: 1,
                image: 1, preference: "$pref.title", is_verified: 1, is_push: 1, is_email: 1, is_photo_option: 1, save_country: 1,
                voice_record: 1, spotify_id: 1, spotify_username: 1, spotify_playlist: 1, spotify_artistlist: 1, show_me_online: 1
            }
        })

        let result = await userModel.aggregate(pipeline)

        let profile = await CompletedProfile(checkB_date)
        result[0]["profilePercentage"] = profile
        if (result) {
            return res.status(200).send({ status: 1, meesage: 'User deteils!', data: result })
        }
        else {
            return res.status(500).send({ status: 0, meesage: 'Something went wrong' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const getOtherUserProfile = async (req, res) => {
    try {
        let data = req.body;
        let { userId } = data;
        if (!userId) {
            return res.status(200).send({ status: 0, message: "please enter userId" })
        }

        let UserData = await userModel.findById({ _id: userId })
        let Age = UserData.is_age
        let Height = UserData.is_height
        let Weight = UserData.is_weight
        let Diet = UserData.is_diet
        let Drink = UserData.is_drink
        let Smoke = UserData.is_smoke
        let pipeline = []



        pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(userId) } })
        pipeline.push(
            { $lookup: { from: 'keys', localField: 'zodiac_sign', foreignField: '_id', as: 'zodiac_sign' } },
            { $unwind: { path: '$zodiac_sign', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'covid_vaccine', foreignField: '_id', as: 'covid_vaccine' } },
            { $unwind: { path: '$covid_vaccine', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'pets', foreignField: '_id', as: 'pets' } },
            { $unwind: { path: '$pets', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'education_level', foreignField: '_id', as: 'education_level' } },
            { $unwind: { path: '$education_level', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'sleeping_habits', foreignField: '_id', as: 'sleeping_habits' } },
            { $unwind: { path: '$sleeping_habits', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'social_media', foreignField: '_id', as: 'social_media' } },
            { $unwind: { path: '$social_media', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'workout', foreignField: '_id', as: 'workout' } },
            { $unwind: { path: '$workout', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'personality_type', foreignField: '_id', as: 'personality_type' } },
            { $unwind: { path: '$personality_type', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'keys', localField: 'health', foreignField: '_id', as: 'health' } },
            { $unwind: { path: '$health', preserveNullAndEmptyArrays: true } },
            {
                $lookup: { from: 'userpreferences', localField: '_id', foreignField: 'userId', as: 'result' }
            },
            {
                $lookup: { from: 'preferences', localField: 'result.preferenceId', foreignField: '_id', as: 'pref' }
            },
        )
        pipeline.push(
            { $lookup: { from: "images", localField: "_id", foreignField: "userId", as: "image" } },
            { '$addFields': { 'image': { '$first': '$image.image' } } },)


        if (Age == true) {
            pipeline.push(
                { '$addFields': { 'c_date': new Date() } },
                { '$addFields': { 'DOB': { '$toDate': '$birth_date' } } },
                {
                    '$addFields': {
                        'age': {
                            '$subtract': [
                                { '$year': '$c_date' },
                                { '$year': '$DOB' }]
                        }
                    }
                },

            )
        }

        if (Drink == true) {
            pipeline.push({ $lookup: { from: 'keys', localField: 'drinking', foreignField: '_id', as: 'drinking' } },
                { $unwind: { path: '$drinking', preserveNullAndEmptyArrays: true } },)
        }
        if (Smoke == true) {
            pipeline.push({ $lookup: { from: 'keys', localField: 'smoking', foreignField: '_id', as: 'smoking' } },
                { $unwind: { path: '$smoking', preserveNullAndEmptyArrays: true } },)
        }
        if (Diet == true) {
            pipeline.push(
                { $lookup: { from: 'keys', localField: 'dietary_preference', foreignField: '_id', as: 'dietary_preference' } },
                { $unwind: { path: '$dietary_preference', preserveNullAndEmptyArrays: true } },)
        }

        if (Height == true) {
            pipeline.push(
                {
                    $addFields: {
                        Height: { $toDouble: "$height" }
                    }
                },
                {
                    $addFields: {
                        Height: {
                            $divide: ["$Height", 30.48] // 1 foot = 30.48 centimeters
                        }
                    }
                },
                {
                    $addFields: {
                        Height: {
                            $round: [{ $toDouble: "$Height" }, 1]
                        }
                    }
                },)
        }
        if (Weight == true) {
            pipeline.push({
                $addFields: {
                    Weight: '$weight'
                }
            })
        }
        pipeline.push({
            '$project': {
                'first_name': 1, 'last_name': 1, 'email': 1, "birth_date": 1, 'caste': 1, 'gender': 1, 'city': 1, 'state': 1, 'country': 1,
                'marital_status': 1, 'plan': 1, 'about': 1, "religion": 1, age: 1, height: '$Height', weight: '$Weight',
                'zodiac_sign': '$zodiac_sign.title', 'covid_vaccine': '$covid_vaccine.title', 'pets': '$pets.title',
                'dietary_preference': '$dietary_preference.title', 'education_level': '$education_level.title',
                'sleeping_habits': '$sleeping_habits.title', 'social_media': '$social_media.title', 'workout': '$workout.title',
                'personality_type': '$personality_type.title', 'health': '$health.title', 'smoking': '$smoking.title',
                'drinking': '$drinking.title', 'marriage_plan': 1, ' mother_tongue': 1, 'image': 1, 'preference': "$pref.title",
            }
        })

        let Result = await userModel.aggregate(pipeline)
        if (Result) {
            return res.status(200).send({ status: 1, meesage: 'User deteils!', data: Result })
        }
        else {
            return res.status(500).send({ status: 0, meesage: 'Something went wrong' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }
}

const profile = async (req, res) => {
    try {
        let { id } = req.body;
        if (!id) {
            return res.status(400).send({ status: 0, msg: "please enter userId!" })
        }
        let q = [
            {
                '$match': {
                    '_id': new mongoose.Types.ObjectId(id)
                }
            }, {
                '$lookup': {
                    'from': 'images',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'image'
                }
            }, {
                '$addFields': {
                    'image': {
                        '$first': '$image.image'
                    },
                    'imageId': {
                        $first: "$image._id"
                    },
                    Age: {
                        $subtract: [
                            { $year: new Date() },
                            { $year: { $toDate: "$birth_date" } }
                        ]
                    }

                }
            }, {
                '$project': {
                    'first_name': 1,
                    'last_name': 1,
                    'city': 1,
                    'country': 1,
                    'state': 1,
                    'is_verified': 1,
                    'image': 1,
                    'Age': 1,
                    'imageId': 1,

                }
            }
        ]
        let user = await userModel.aggregate(q)
        return res.status(200).send({ status: 1, message: "User Profile", data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, msg: "server error" })
    }
}

const deleteAccount = async (req, res) => {
    try {
        let id = req.body.id
        if (!id) {
            return res.status(400).send({ status: 0, message: "id is required...!" })
        }
        let result = await userModel.findByIdAndDelete(id)
        if (result) {
            let deleteImage = await imageModel.deleteMany({ userId: id })
            let deleteMatches = await matchModel.deleteMany({ $or: [{ sendor: id }, { receiver: id }] })
            let deleteUserPref = await userPreferenceModel.deleteMany({ userId: id })
            let deleteVerify = await verifyModel.deleteOne({ userId: id })
            let deleteReport = await userReportModel.deleteMany({ $or: [{ senderId: id }, { userId: id }] })
            return res.status(200).send({ status: 1, message: "delete account", data: result })
        }
        else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, meesage: "server error", data: null })
    }
}

const viewSentRequest = async (req, res) => {
    try {
        let id = req.body.id;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId" })
        }
        let query = [
            {
                '$match': {
                    '$and': [
                        { 'sender': new mongoose.Types.ObjectId(id) },
                        { 'matched': false },
                        { '$or': [{ 'type': 'like' }, { 'type': 'superLike' }] }
                    ]
                }
            },
            { '$lookup': { 'from': 'users', 'localField': 'receiver', 'foreignField': '_id', 'as': 'user' } },
            { '$lookup': { 'from': 'images', 'localField': 'receiver', 'foreignField': 'userId', 'as': 'img' } },
            { '$unwind': { 'path': '$user' } },
            {
                '$addFields': {
                    'age': { '$dateDiff': { 'startDate': { '$dateFromString': { 'dateString': '$user.birth_date' } }, 'endDate': '$$NOW', 'unit': 'year' } },
                    'image': { '$first': '$img.image' }
                }
            },
            {
                '$project': {
                    'name': '$user.first_name',
                    'age': 1,
                    'userId': '$user._id',
                    'createdAt': 1,
                    'image': 1,
                    'type': 1
                }
            },
            { $sort: { 'createdAt': -1 } }
        ]

        let result = await matchModel.aggregate(query)
        if (result) {
            return res.status(200).send({ status: 1, message: "success", data: result })
        } else {
            return res.status(500).send({ status: 0, message: "Something went wrong", data: null })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const topPics = async (req, res) => {
    try {
        let userId = req.body.userId
        if (!userId) {
            return res.status(400).send({ status: 0, message: "please enter userId!" })
        }
        let deta = await matchModel.find({ $and: [{ sender: userId }, { type: { $in: ['like', 'superLike', 'disLike'] } }] }).select({ receiver: 1, _id: 0 })
        var ids = []
        ids.push(new mongoose.Types.ObjectId(userId))
        deta.map((i) => ids.push(i.receiver))

        let Data = await userModel.findById(userId)
        let LookingFor = Data.looking_for

        let q = [
            { '$match': { $and: [{ is_Blocked: false }, { _id: { $nin: ids } }, { is_showOnCard: true }, { gender: LookingFor }, { birth_date: { $nin: [''] } }] } },
            { '$lookup': { 'from': 'images', 'localField': '_id', 'foreignField': 'userId', 'as': 'img' } },
            {
                '$addFields': {
                    'age': { '$dateDiff': { 'startDate': { '$dateFromString': { 'dateString': '$birth_date' } }, 'endDate': '$$NOW', 'unit': 'year' } },
                    'image': { '$first': '$img.image' }
                }
            },
            { '$project': { 'name': '$first_name', 'age': 1, 'createdAt': 1, 'image': 1 } },
            { $limit: 20 }
        ]

        let userData = await userModel.aggregate(q)
        return res.status(200).send({ status: 1, meesage: "success!", data: userData })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const setRangeForHnA = async (req, res) => {
    try {
        let { id, minAge, maxAge, minHeight, maxHeight } = req.body
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId!" })
        }
        let Obj = {};

        if (minAge) { Obj.minAge = minAge }
        if (maxAge) { Obj.maxAge = maxAge }
        if (minHeight) { Obj.minHeight = minHeight }
        if (maxHeight) { Obj.maxHeight = maxHeight }



        let update = await userModel.findByIdAndUpdate(id, Obj, { new: true })
        return res.status(200).send({ status: 1, message: "success!", data: update })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const updateUserName = async (req, res) => {
    try {
        let { id, username } = req.body
        if (!id) {
            res.status(400).send({ status: 0, message: "please enter userId!" })
        }
        let checkName = await userModel.findOne({ username: username })
        if (checkName) {
            return res.status(400).send({ status: 0, message: "This user name is already exist!" })
        }
        else {
            res.status(200).send({ status: 1, message: "This username is available!" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 0, message: "server error" })
    }
}

const profileCompleted = async (req, res) => {
    try {
        let { id } = req.body;
        let Data = await userModel.findById(id)
        let profile = await CompletedProfile(Data)

        if (profile >= 80) {
            let obj = {
                is_verified: true
            }
            let update = await userModel.findByIdAndUpdate(id, obj, { new: true })
            return res.status(200).send({ status: 1, message: "verified!", data: update })
        } else {
            return res.status(200).send({ status: 1, message: "Complete at least 80% of your profile to become eligible for account verification!" })

        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const checkVerify = async (req, res, next) => {
    try {
        let { id } = req.body;
        if (!id) {
            return res.status(400).send({ status: 0, message: "please enter userId!" })
        }
        let checkName = await verifyModel.findOne({ userId: id })
        if (checkName) {
            if (checkName.status == 0) {
                return res.status(400).send({ status: 0, message: "Request already sent!" })
            }
            else if (checkName.status == 1) {
                return res.status(400).send({ status: 0, message: "Profile already verified!" })
            }
        }
        else {
            next()
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const ForVerify = async (req, res) => {
    try {
        let { id } = req.body
        let image = req.fileUrl;
        if (!image) {
            res.status(400).send({ status: 0, message: "please enter image!" })
        }

        let obj = {
            userId: id,
            image: image,
            status: 0
        }
        if (image.length > 0) {
            let update = await verifyModel.create(obj)
            let userUpdate = await userModel.findByIdAndUpdate(id, { is_verified: 1 }, { new: true })
            res.status(200).send({ status: 1, message: "success!", data: update })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 0, message: "server error" })
    }
}

const updateEmail = async (req, res) => {
    try {

        let { id, is_Email } = req.body
        if (!id) {
            res.status(400).send({ status: 0, message: "please enter userId!" })
        }
        if (!is_Email) {
            res.status(400).send({ status: 0, message: "please enter email!" })
        }
        let checkName = await userModel.findOne({ email: is_Email })
        if (checkName) {
            return res.status(400).send({ status: 0, message: "This email is already exits!" })
        }
        else {
            let findUser = await userModel.findById(id)
            const otp = Math.floor(1000 + Math.random() * 9000)

            let obj = {
                is_Email: is_Email,
                name: findUser.first_name,
                otp: otp
            }
            await verifyEmail(obj)
            let update = await userModel.findByIdAndUpdate(id, { is_Email: is_Email, otp: otp }, { new: true })
            res.status(200).send({ status: 1, message: "otp send your email address!", data: update._id })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 0, message: "server error" })
    }
}

const updatePhone = async (req, res) => {
    try {
        const data = req.body
        let { id, phone } = data;
        if (!id) {
            return res.status(400).send({ message: 'please enter a userId!' })
        }
        if (!phone) {
            return res.status(400).send({ message: 'please enter a phone number!' })
        }
        if (phone.length !== 10) {
            return res.status(400).send({ message: 'please enter 10 digit!' })
        }

        // const otp = Math.floor(1000 + Math.random() * 9000)
        const otp = 1234
        let userdata = await userModel.find({ phone: phone });

        if (userdata.length > 0) {
            return res.status(400).send({ message: 'This phone number is already exist!' })
        }
        else {
            let obj = {
                is_Phone: phone,
                otp: otp
            }
            let otpsend = await send_mobile_otp(phone, otp)
            let updatedUser = await userModel.findByIdAndUpdate(id, obj, { new: true });
            return res.status(200).send({ status: 1, massege: 'otp send to your mobile', data: updatedUser._id })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error" })
    }
}

const usersList = async (req, res) => {
    try {
        let data = req.body;
        let { id, other_user, my_id, fcm_token } = data;
        // let distance = 500

        if (!id) {
            return res.status(200).send({ status: 0, message: "please enter userId!" })
        }

        if (fcm_token) {
            let findData = await fcmTokenModel.find({ userId: id })
            if (findData.length > 0) {
                let update = await fcmTokenModel.findOneAndUpdate({ userId: id }, { fcm_token: fcm_token }, { new: true })
            } else {
                let create = await fcmTokenModel.create({ userId: id, fcm_token: fcm_token })
            }
        }
        let lastUser = await matchModel.find({ sender: my_id }).sort({ createdAt: -1 }).limit(1)
        let q = []
        let receiver = []
        lastUser.map((i) => receiver.push(i.receiver))

        if (lastUser.length > 0) {
            q.push({
                $match: {
                    _id: { $in: receiver }
                },
            }
            )
        } else {
            q.push({
                $match: {
                    _id: new mongoose.Types.ObjectId(other_user)
                },
            }
            )
        }
        q.push({ $lookup: { from: "images", localField: "_id", foreignField: "userId", as: "image" } },
            { '$addFields': { 'image': { '$first': '$image.image' } } },
            {
                $addFields: {
                    Age: {
                        $subtract: [
                            { $year: new Date() },
                            { $year: { $toDate: "$birth_date" } }
                        ]
                    }
                }
            },
            {
                $project: {
                    "_id": 1, "first_name": 1, "last_name": 1, "Age": 1, "height": 1, "weight": 1,
                    "city": 1, "marital_status": 1, "caste": 1, "country": 1, "distance": 1, 'religion': 1,
                    "dob": { $dateFromString: { dateString: "$birth_date" } }, "image": 1, 'state': 1
                }
            }
        )

        let other_User = await userModel.aggregate(q)

        // console.log("--->>>", other_User);
        let deta = await matchModel.find({ $and: [{ sender: id }, { type: { $in: ['like', 'superLike', 'disLike'] } }] }).select({ receiver: 1, _id: 0 })
        let P = await matchModel.find({ $and: [{ receiver: id }, { type: { $in: ['like', 'superLike'] } }, { matched: true }] }).select({ sender: 1, _id: 0 })

        var ids = []

        ids.push(new mongoose.Types.ObjectId(id))
        if (other_user) {
            ids.push(new mongoose.Types.ObjectId(other_user))
        }

        deta.map((i) => ids.push(i.receiver))
        P.map((i) => ids.push(i.sender))

        console.log("--->>>", ids)
        let Data = await userModel.findById(id);
        let LookingFor = Data.looking_for
        let minAge = Data.minAge
        let maxAge = Data.maxAge
        let minHeight = Data.minHeight
        let maxHeight = Data.maxHeight
        let goGlobel = Data.goGlobel
        //let Range = Data.show_people_in_range
        let cd = Data.location
        let coordinates = cd.coordinates
        // console.log("--->>>", coordinates);
        let pipeline = [];
        var obj = {}

        if (goGlobel == true) {
            if (Data.save_country == "") {
                pipeline.push({
                    $match: { $and: [{ _id: { $nin: ids } }] }
                })
            } else {
                pipeline.push({
                    $match: { $and: [{ _id: { $nin: ids } }, { country: Data.save_country }] }
                })
            }
        } else {
            if (coordinates) {
                pipeline.push({
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: coordinates,
                        },
                        distanceField: "distance",
                        distanceMultiplier: 0.001,
                        maxDistance: 100000,
                        spherical: true,
                    },
                },)
                // if (distance) {
                //     obj["distance"] = { $lte: distance }
                // }

            }
        }
        // console.log("===>>>", minAge, maxAge, minHeight, maxHeight);

        if (LookingFor == 'male' || LookingFor == 'female') {
            pipeline.push({
                $match: { $and: [{ _id: { $nin: ids } }, { gender: LookingFor }, { is_showOnCard: true }, { is_Blocked: false }, { birth_date: { $nin: [''] } }] }
            })
        }
        else {
            pipeline.push({
                $match: { $and: [{ _id: { $nin: ids } }, { gender: { $in: ['male', 'female'] } }, { is_Blocked: false }, { is_showOnCard: true }, { birth_date: { $nin: [''] } }] }
            })
        }

        pipeline.push(
            { $lookup: { from: "images", localField: "_id", foreignField: "userId", as: "image" } },
            { '$addFields': { 'image': { '$first': '$image.image' } } }
        )

        pipeline.push(
            {
                $addFields: {
                    Age: {
                        $subtract: [
                            { $year: new Date() },
                            { $year: { $toDate: "$birth_date" } }
                        ]
                    }
                }
            },
        )
        if (Data.show_people_in_range == true) {
            pipeline.push(
                {
                    $match: {
                        Age: {
                            $gte: minAge, // Replace minAge with the minimum age value
                            $lte: maxAge  // Replace maxAge with the maximum age value
                        }
                    }
                }
            )
        }
        pipeline.push(
            {
                $addFields: {
                    height: { $toDouble: "$height" }
                }
            },
            {
                $addFields: {
                    Height: {
                        $divide: ["$height", 30.48] // 1 foot = 30.48 centimeters
                    }
                }
            },
            {
                $addFields: {
                    Height: {
                        $round: [{ $toDouble: "$Height" }, 1]
                    }
                }
            },)
        if (Data.show_people_in_range == true) {
            pipeline.push(
                {
                    $match: {
                        Height: {
                            $gte: minHeight, // Replace minAge with the minimum age value
                            $lte: maxHeight  // Replace maxAge with the maximum age value
                        }
                    }
                }

            )
        }

        pipeline.push({
            $project: {
                "_id": 1, "first_name": 1, "last_name": 1,
                "city": 1, "marital_status": 1, "caste": 1, "country": 1, "distance": 1, 'religion': 1,
                "dob": { $dateFromString: { dateString: "$birth_date" } }, "image": 1, 'state': 1,
                height: { $cond: { if: "$is_height", then: "$Height", else: "$$REMOVE" } },
                weight: { $cond: { if: "$is_weight", then: "$weight", else: "$$REMOVE" } },
                Age: { $cond: { if: "$is_age", then: "$Age", else: "$$REMOVE" } },
                show_me_online: 1


            }
        })

        let result = await userModel.aggregate(pipeline)

        let Result = other_User.concat(result)
        if (result) {
            return res.status(200).send({ status: 1, meesage: "success", data: Result })
        } else {
            return res.status(500).send({ status: 0, meesage: "Something went wrong", data: result })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 0, message: "server error", data: null })
    }

}

const RtcTokenBuilder = require('agora-access-token').RtcTokenBuilder;
const RtcRole = require('agora-access-token').RtcRole;
const ChangeliveStatus = async (req, res) => {
    try {
        const { status, userId, channelName } = req.body;
        const appId = 'c21ae17d2d9046478dafcaf516e68b3c'; // Replace with your Agora App ID
        const appCertificate = 'ce478f8a13ce48d19bc01c934e6e9ae2'; // Replace with your Agora App Certificate
        // const channelName = channelName; // Replace with your channel name
        const uid = userId; // Replace with the user ID for whom you are generating the token
        const role = RtcRole.PUBLISHER

        const expirationTimeInSeconds = 3600; // Token expiration time in seconds

        const key = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, expirationTimeInSeconds);


        console.log({ key })
        const changeStatus = await liveStreamingModel.findOneAndUpdate(
            { userId: userId },
            { $set: { isLive: status, token: key, channelName: channelName } },
            { new: true, upsert: true }
        );

        console.log(changeStatus)

        if (changeStatus) {

            if (status === "true") {
                return res.status(200).send({ status: true, message: "You are live now", data: key });
            } else if (status === "false") {
                return res.status(200).send({ status: true, message: "You have left the live stream", data: null });
            } else {
                return res.status(200).send({ status: false, message: "Invalid request", data: null });
            }
        } else {
            return res.status(200).send({ status: false, message: "Invalid request", data: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: "Server error", data: null });
    }
};



const getLiveUsers = async (req, res) => {
    try {
        var page = req.body.page;
        if (page == 0 || !page) {
            page = 1
        }
        const count = await liveStreamingModel.find({ isLive: true }).count();
        const findLiveUsers = await liveStreamingModel.find({ isLive: true }).sort({ createdAt: -1 })
        .limit(10 * 1)
        .skip((page - 1) * 10)
        .exec();

        return res.status(200).send({status:true, message : "Live Users", page : parseInt(page), totalRow : count, data :findLiveUsers })





    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: "server error", data: null })
    }
}

module.exports = {
    userLogin, verifyOTP, updateUserData, getUserProfile, updateProfile,
    usersList, viewSentRequest, loginWithFacebook, loginWithGoogle, recoverAcounnt,
    deleteAccount, updateLocation, profile, topPics, setRangeForHnA, updateUserName, profileCompleted,
    checkVerify, ForVerify, updateEmail, getOtherUserProfile, updatePhone, ChangeliveStatus, getLiveUsers

}
