
var nodemailer = require('nodemailer');
let mongoose = require('mongoose');
var axios = require('axios');
const xml2js = require('xml2js');

var fs = require('fs')
const handlebars = require('handlebars');
const templateHtml = fs.readFileSync('email-template.html', 'utf-8');
const template = handlebars.compile(templateHtml);

const verifyEmail = async (data) => {
  let { is_Email, otp, name } = data;
  const replacements = {
    name: name,
    otp: otp // Replace with the actual OTP value
    // Add other dynamic data if needed
  };
  const htmlToSend = template(replacements);
  console.log(is_Email, name, "=====================")
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sportimoapk@gmail.com',
      pass: 'aeostmjgocsmztis'
    }
  });

  var mailOptions = {
    from: 'ankittale720@gmail.com',
    to: is_Email,
    subject: "Otp verification",
    //text: 'Your otp is '+otp,
    html: htmlToSend
  }


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('email error line 34 ===  ', error);
      return false;
    } else {
      console.log('Email sent: ' + info.messageId);
      return info.messageId;
    }

  });
}

const sentEmail = async (data) => {
  let { subject, html, emailArr } = data;
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sportimoapk@gmail.com',
      pass: 'aeostmjgocsmztis'
    }
  });

  var mailOptions = {
    from: 'saportimoapk@gmail.com',
    subject: subject,
    html: html
  }
  emailArr.forEach(function (to, index) {
    mailOptions.to = to
    setTimeout(() => {
      transporter;
    }, 1000 * index);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('email error line 34 ===  ', to, error);
        return false;
      } else {
        console.log('Email sent: ' + info.messageId, to);
        return info.messageId;
      }
    });
  });
}

// function gen_str(length) {
//   var result = '';
//   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() *
//       charactersLength));
//   }
//   return result;


// }

// const getTime = () => {
//   return new Date().toTimeString().slice(0, 8);
// }

// const getcurntDate = () => {
//   let date = new Date();
//   //  console.log("getcurntDate",date)
//   var dd = date.getDate();
//   var mm = date.getMonth() + 1; //January is 0!
//   var yyyy = date.getFullYear();
//   if (dd < 10) {
//     dd = '0' + dd;
//   }
//   if (mm < 10) {
//     mm = '0' + mm;
//   }
//   //return dd + '/' + mm + '/' + yyyy;
//   return yyyy + '-' + mm + '-' + dd;
// }

// const getLocalDateTime = (data) => {
//   let date_utc = (data.date_utc);
//   let daystr = date_utc.getDate().toString();
//   let day = daystr.length < 2 ? "0" + daystr : daystr;
//   let monthstr = (date_utc.getMonth() + 1).toString();
//   let month = monthstr.length < 2 ? "0" + monthstr : monthstr;
//   //console.log({daystr,monthstr})
//   let year = date_utc.getFullYear().toString();
//   let time = data.time_utc;
//   let dateTimeStr = year + "-" + month + "-" + day + "T" + time + ".000Z";
//   let zone = (data.zone == undefined ? '' : data.zone);
//   let str = ''
//   if (zone == "GMT") { str = new Date(dateTimeStr).toLocaleString('en-GB', { timeZone: 'Europe/London' }); } else
//     if (zone == "IST") { str = new Date(dateTimeStr).toLocaleString('en-GB', { timeZone: 'Asia/kolkata' }); } else { str = new Date(dateTimeStr).toLocaleString('en-GB', { timeZone: 'Asia/dubai' }); }

//   let yyyy = str.substring(6, 10)
//   let mm = str.substring(3, 5)
//   let dd = str.substring(0, 2)
//   let t = yyyy + "-" + mm + "-" + dd + "T" + str.substring(12, 20) + ".000Z"
//   local_date = new Date(t)
//   local_time = str.substring(12, 20)
//   //console.log({date_utc,dateTimeStr,str,t,local_date,day,month,year})

//   return { local_date, local_time }
// }

const sendEmail = async (data) => {
  let { subject, html, email, otp } = data;
  console.log(otp, email, "=====================")
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sportimoapk@gmail.com',
      pass: 'aeostmjgocsmztis'
    }
  });

  var mailOptions = {
    from: 'saportimoapk@gmail.com',
    to: email,
    subject: "Otp verification",
    //text: 'Your otp is '+otp,
    html: 'your otp is ' + otp
  }


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('email error line 34 ===  ', error);
      return false;
    } else {
      console.log('Email sent: ' + info.messageId);
      return info.messageId;
    }

  });
}

const before_after_Date_old = (days) => {
  var date = new Date();
  date.setDate(date.getDate() + parseInt(days));
  console.log(date)
  var finalDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  return finalDate;
}

const before_after_Date = (days) => {
  var date = new Date();
  date.setDate(date.getDate() + parseInt(days));
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = (date.getDate()).toString();
  month = month.length > 1 ? month : '0' + month;
  day = day.length > 1 ? day : '0' + day;

  //console.log({year,month,day})
  var finalDate = year + '-' + month + '-' + day;
  return finalDate;
}

// const send_mobile_otp_new = async (req, res) => {
//   try {

//     let myFenOTP = 0;
//     let mobile = req.mobile;
//     console.log("otp modal mobile  ", mobile);
//     let url = "https://mbc.mobc.com/PinCodeAPI/PinCodeAPI.asmx";

//     let xml_parm = `
//                 <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//                         xmlns:tem="http://tempuri.org/">
//                         <soapenv:Header/>
//                         <soapenv:Body>
//                         <tem:SendPinCode>
//                         <tem:MSISDN>${mobile}</tem:MSISDN>
//                         <tem:ServiceID>8</tem:ServiceID>
//                         <tem:Lang>EN</tem:Lang>
//                         </tem:SendPinCode>
//                         </soapenv:Body>
//                         </soapenv:Envelope>`;
//     let ssdd = await axios.post(url, xml_parm, {
//       headers: { 'Content-Type': 'text/xml' }
//     }).then(async (response) => {
//       return await xml2js.parseString(response.data, (err, result) => {
//         if (err) { console.log("modal, otp  api call :- server error ", err); return false; } else {
//           var Gen_otp = result['soap:Envelope']['soap:Body'][0]['SendPinCodeResponse'][0]['SendPinCodeResult'][0]['Response'][0]['GeneratePinCode'][0]['PinCode'][0];
//           console.log('ss opt === ', Gen_otp);
//           myFenOTP = Gen_otp;
//           return Gen_otp;
//         }
//       });
//     }).catch((error) => { console.log(error); return false; })

//     return myFenOTP;

//   } catch (error) { console.log('modal, otp :- server error ', error); return false; }

// }

const send_mobile_otp = async (mobile, otp) => {

  // let msg = `your OTP is  ${otp}  do not share this otp` ;

  let url = `http://sms.bulksmsind.in/v2/sendSMS?username=d49games&message=Dear+user+your+registration+OTP+for+D49+is+${otp}+GLDCRW&sendername=GLDCRW&smstype=TRANS&numbers=${mobile}&apikey=b1b6190c-c609-4add-b03d-ab3a22e9d635&peid=1701165034632151350&%20templateid=1707165155715063574`;


  try {
    return await axios.get(url).then(function (response) {
      //console.log(response);
      return response;
    });
  } catch (error) {
    console.log(error);

  }

}

const isEmpty = (value) => (
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)
)

const isArray = function (a) {
  return (!!a) && (a.constructor === Array);
};

const isObject = function (a) {
  return (!!a) && (a.constructor === Object);
};

const FulldateTime = () => {
  var dt = new Date();
  var timeString = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
  return timeString;

}

const user_logs_add = async (user_id, type) => {
  try {
    let date = FulldateTime();
    console.log(user_id + " == user_logs_add is call == " + type);
    let whr = (type == 'logout') ? { 'logout_date': date } : { 'login_date': date };
    let login = new logins({ user_id });
    let logsave = await login.save()
    user_logs.findOneAndUpdate({ user_id: user_id }, { $set: whr }, { new: true }, (err, updatedUser) => {
      if (err) { console.log(err); return false; }
      if (isEmpty(updatedUser)) {
        //return res.status(200).send({"status":false,"msg":'Invalid user '}) ;  
        let add = new user_logs({ "user_id": user_id, "login_date": date, "logout_date": date, });
        add.save((err, datas) => {
          if (err) { console.log(err); } else { console.log("add data ==", datas); }

        });
        return true;
      } else {
        return true;
      }

    });
  } catch (error) { console.log(error); }




}

const rows_count = async (tbl, whr) => {
  try {
    let count = await tbl.find(whr).countDocuments();
    let sendData = (count > 0) ? count : 0;
    return sendData;
  } catch (error) {
    return 0;
  }
  ///   let dd = await rows_count(poll_result_tbl,{});

}

const ArrChunks = async (array, size = 1) => {
  let results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
};


const my_utc_time = (date = false) => {
  let mydate = '';
  mydate = (date) ? date.toUTCString() : new Date().toUTCString();
  let time_u = Math.floor(new Date(mydate).getTime() / 1000);
  return time_u;
}

const CompletedProfile = async (profile) => {
  try {
    let REQUIRED_FIELDS = [
      "first_name",
      "last_name",
      "birth_date",
      "phone",
      "gender",
      "city",
      "height",
      "weight",
      "email",
      "marital_status",
      "country",
      "location",
      "caste",
      "state",
      "religion",
      "looking_for",
    ]

    function calculateProfileCompletion(profile) {
      let filledFields = 0;

      for (const field of REQUIRED_FIELDS) {
        if (profile[field]) {
          filledFields++;
        }
      }

      const completionPercentage = (filledFields / REQUIRED_FIELDS.length) * 100;
      return completionPercentage;
    }

    const profileCompletionPercentage = calculateProfileCompletion(profile);

    return Math.round(profileCompletionPercentage)
    // console.log("====>>>>",profileCompletionPercentage);
    // if (profileCompletionPercentage >= 80) {
    //     let obj = {
    //         is_verified: true
    //     }
    //     let update = await userModel.findByIdAndUpdate(id, obj, { new: true })
    //     return res.status(200).send({ status: 1, message: "verified!", data: update })
    // } else {
    //     return res.status(200).send({ status: 1, message: "Complete at least 80% of your profile to become eligible for account verification!" })

    // }

  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 0, message: "server error" })
  }
}




module.exports = {
  send_mobile_otp, isEmpty, isArray, isObject, sentEmail, before_after_Date, before_after_Date_old, sendEmail,
  CompletedProfile, verifyEmail
};
