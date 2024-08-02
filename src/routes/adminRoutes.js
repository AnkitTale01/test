const express = require('express');
const adminController = require('../controller/adminController');
const prefrenceController = require('../controller/prefrenceController');
const planController = require("../controller/planController")
const reportController = require("../controller/reportController")
const matchController = require("../controller/matchController")
const dashboardController = require("../controller/dashboardController")
const notificationController = require("../controller/notificationController")
const faqController = require("../controller/faqController")
const commonController = require('../controller/commonController');
const settingController = require('../controller/adminSettingController');
const emailController = require('../controller/emailController')
const subAdminController = require("../controller/subadminController")
const keyController = require('../controller/KeyController')
const cookieController = require('../controller/cookieController');
const privacyController = require('../controller/privacyController');
const tandcController = require('../controller/termandconditionController');
const contactusController = require('../controller/contactusController');
const featureController = require('../controller/featureController');
const verifyController = require('../controller/verificationController');



const router = express.Router();

router.post("/adminImageUpload", commonController.imageUpload, adminController.adminImageUpload)
router.post('/admin', adminController.adminSignup);
router.post('/admin/login', adminController.adminLogin)
router.post('/admin/data', adminController.adminData)
router.put('/profile', adminController.adminprofile)
router.put('/password', adminController.changePassword)

//prefrence apis
router.post('/preferenceAdd', commonController.imageUpload, prefrenceController.preferenceAdd);
router.get('/preferenceList', prefrenceController.preferenceList);
router.put('/preferenceUpdate', commonController.imageUpload, prefrenceController.preferenceUpdate);
router.delete('/preferenceDelete', prefrenceController.preferenceDelete);
router.put('/status/changePref', prefrenceController.blockpref)


//Plan apis
router.post('/planAdd', planController.createPlan);
router.put('/planUpdate', planController.updatePlan);
router.delete('/planDelete', planController.deletePlan);
router.get('/planList', planController.planList);
router.put("/change/plan/status", planController.changePlanStatus)

// Feature Api
router.post('/feature/add', featureController.create);
router.post('/feature/list',featureController.list)
router.put('/feature/update', featureController.update);
router.delete('/feature/delete', featureController.deleteFeature);
router.put('/feature/status', featureController.updateStatus);


//user api
router.get('/userList', adminController.userList);
router.post('/add/user', adminController.addUser)
router.post("/user/image", adminController.userImageUploadByadmin)
router.put('/update/user', adminController.updateUser);
router.delete('/user/delete', adminController.deleteUser)
router.put('/status/update', adminController.userStatusUpdate)
router.post('/userProfile', adminController.viewUserProfile)
router.get('/same/pref', adminController.countSamePref)
router.get('/filterBypref', adminController.filterByPreference);
router.post('/viewUserSubscription', adminController.viewUserSubscription)
router.get('/allSubscription', adminController.viewAllSubscription)
router.post('/viewUserLikes', matchController.userGetLike)
router.post('/user/matches', matchController.userGetOwnMatch)
router.post('/user/superlike', matchController.userGetSuperLike)
router.put('/user/block', adminController.blockUser)
router.put('/user/location', adminController.locationStatus)

//analytics
router.get('/matched/user', adminController.MatchedUsersAnalytics)
router.get('/user/analytics', adminController.userAnalytics)
router.get('/plan/analytics', adminController.planAnalytics)

//report api
router.post('/reportAdd', reportController.reportAdd)
// router.get('/List', reportController.list)
router.get('/reportList', reportController.reportList)
router.delete('/reportDelete', reportController.reportDelete)

//dashBorad api
router.get('/dashboard', dashboardController.dashboardCount)
router.post('/user/graph', dashboardController.userGraph)
router.post('/transection', dashboardController.transectionGraph)
router.post('/user/graph/countrywise', dashboardController.countryWiseUsergraph)


//notification api

router.post("/notification/create",commonController.imageUpload, notificationController.create)
router.get("/notification/list", notificationController.list)
router.delete("/notification/delete", notificationController.remove)

//FAQ api
router.post("/create/faq", faqController.createFaq);
router.get("/faq/list", faqController.faqList);
router.put("/faq/update", faqController.updateFaq);
router.post("/faq", faqController.getFaq)
router.delete("/faq/delete", faqController.deleteFaq)

//adminSetting

router.post('/freeuser/setting', settingController.freeUser)
router.get('/settings/get', settingController.fetchData)
router.put('/settings/update', settingController.updateLimit)

//Email
router.post('/email', emailController.createMail)
router.get('/email/list', emailController.emailList)
router.delete('/email/delete', emailController.deleteEmail)

//sub admin 
router.post('/create/subAdmin', subAdminController.createSubAdmin)
router.put('/update/subAdmin', subAdminController.updateSubAdmin)
router.delete('/delete/subAdmin', subAdminController.deleteSubAdmin)
router.get('/list', subAdminController.subAdminList)
router.put('/update/status', subAdminController.updateSubAdminStatus)

//keyTypes api 
router.post('/create/key', keyController.keyTypeAdd)
router.put('/update/keyType', keyController.keyTypeUpdate)
router.get('/keytypes/list', keyController.keyTypeList)
router.delete('/delete/keytype', keyController.keyTypeDelete)

router.post('/add/key', keyController.keyAdd)
router.put('/update/key', keyController.keyUpdate)
router.get('/key/list', keyController.keyList)
router.delete('/delete/key', keyController.keyDelete)
router.get('/key/dropdown', keyController.keyTypeListForDropdown)

//cookie api

router.post('/add/cookie', cookieController.addCookie)
router.get('/cookie', cookieController.cookieList)
router.put('/update/cookie', cookieController.updateCookie)
router.delete('/delete/cookie', cookieController.deleteCookie)

//privacy api


router.post('/add/privacy', privacyController.createPrivacy)
router.get('/privacy', privacyController.privacyList)
router.put('/update/privacy', privacyController.updatePrivacy)
router.delete('/delete/privacy', privacyController.deletePrivacy)

//term and condition api

router.post('/add/termandcondition', tandcController.createTermAndCondition)
router.get('/termandcondition', tandcController.termAndCondition)
router.put('/update/termandcondition',tandcController.updateTermAndCondition)
router.delete('/delete/termandcondition',tandcController.deleteTermAndCondition)

//Contact Us
router.get('/list/contactus',contactusController.contactusList )
router.delete('/delete/contactus',contactusController.deleteContactUs)
router.post('/reply',contactusController.sendReply)


//VerifyController 
router.get('/list/verification',verifyController.list )
router.put('/update/verification',verifyController.updateVerifyStatus )


module.exports = router