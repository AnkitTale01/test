const express = require('express');
const userController = require('../controller/userController');
const commonController = require('../controller/commonController');
const userPreferenceController = require('../controller/userPreferenceController');
const userReportController = require('../controller/userReportController')
const matchController = require("../controller/matchController")
const subscribeController = require('../controller/subscribeController')
const faqController = require("../controller/faqController")
const keyController = require('../controller/KeyController')
const contactusController = require('../controller/contactusController');
const tandcController = require('../controller/termandconditionController');
const cookieController = require('../controller/cookieController');
const privacyController = require('../controller/privacyController');
const listController = require('../controller/listController');


const router = express.Router();

//image Upload

router.post('/upload', commonController.imageUpload)
router.post('/user/uploadImage/:id?', commonController.imageUpload, commonController.userImageUpload)
router.get('/user/images', commonController.viewImage)
router.put('/user/updateImage/:id?', commonController.imageUpload, commonController.updateImage)
router.delete('/user/delete/image', commonController.deleteImages)


//user Apis
router.post("/facebook/login", userController.loginWithFacebook)
router.post("/google/login", userController.loginWithGoogle)
router.post("/login", userController.userLogin);
router.post("/otp-verify", userController.verifyOTP);
router.post("/account/recover", userController.recoverAcounnt);
router.post("/update",commonController.voiceUpload, userController.updateUserData)
router.post("/location", userController.updateLocation)
router.delete("/delete/account", userController.deleteAccount)
router.get("/userDetails", userController.getUserProfile)
router.put("/update/profile", userController.updateProfile)
router.get("/users/list", userController.usersList)
router.post("/sent/req", userController.viewSentRequest)
router.post("/profile", userController.profile)
router.post("/top/pics", userController.topPics)
router.post("/set/range", userController.setRangeForHnA)
router.post("/update/username", userController.updateUserName)
router.post("/profile/copmplete", userController.profileCompleted)
router.post("/profile/verify",userController.checkVerify,commonController.imageUpload, userController.ForVerify)
router.get("/view/profile", userController.getOtherUserProfile)
router.post("/update/email", userController.updateEmail)
router.post("/update/phone", userController.updatePhone)




//user preference
router.get("/user/preference", userPreferenceController.preferenceList)
router.post("/user/addpreference", userPreferenceController.userAddPreference)
router.get("/user/preferenceList", userPreferenceController.userPreferenceList)

//user report
router.post("/user/sendReport", userReportController.userSendReport)
router.get("/user/viewReportStatus", userReportController.userViewReportStatus)
router.delete("/user/deleteReport", userReportController.userDeleteReport)

//user match
router.post("/user/createMatch", matchController.createMatch)
router.delete("/user/deleteMatch", matchController.deleteMatch)
router.get('/all/match', matchController.getAllmatchedUserList)
router.post('/own/matches', matchController.userGetOwnMatch)
router.post('/like', matchController.userGetLike)
router.post('/superlike', matchController.userGetSuperLike)
router.post('/count', matchController.countMatchLikeAndSuperLike)
router.post('/new/match', matchController.getlikeAndSuperLike)


//subscribe api
router.post("/plan/list", subscribeController.planList)
router.post("/subscribePlan", subscribeController.subscriptionAdd);
router.get("/viewPlan", subscribeController.viewSubscription)

//user report
router.post("/user/sendReport",userReportController.userSendReport)
router.get("/user/viewReportStatus",userReportController.userViewReportStatus)
router.delete("/user/deleteReport",userReportController.userDeleteReport)


//FAQ api
router.get('/faqList', faqController.faqList)

//keytype api
router.get('/key/dropdown', keyController.keyTypeListForDropdown)
router.get('/keytype', keyController.getKeyTypeById)

//Privacy api
router.get('/privacy/list', privacyController.privacyList)

//term and Condition
router.get('/termandcondition/list', tandcController.termAndCondition)

//Cookie 
router.get('/cookie/list', cookieController.cookieList)

//Contact Us
router.post("/contactus", contactusController.createContactUs);

// list 
router.post("/country/list", listController.countryList);
router.post("/countryCode/list", listController.listCountryCode);
router.post("/state/list", listController.stateList);
router.post("/city/list", listController.cityList);
router.post("/religion/list", listController.religionList);
router.post("/caste/list", listController.casteList);

//maintain live streaming
router.post("/change_live_status", userController.ChangeliveStatus)
router.post("/get_live_users", userController.getLiveUsers)



module.exports = router;