const User = require("../models/user");
const bcrypt = require("bcrypt");
const otp = require("../utils/twilio");
const dotenv = require("dotenv");
const helpers = require("../services/auth.helpers");
const {
  RecordingSettingsContext,
} = require("twilio/lib/rest/video/v1/recordingSettings");
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);
let serviceId;



exports.login = async (req, res, next) => {
  if (req.query.id) {
    req.session.myUrl = req.headers.referer
  
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(200).json({ message: 'invalid email',condition:true});
    } else {
      bcrypt.compare(req.body.password, user.password, (err, match) => {
        if (match) {
          req.session.user = user;
          res.status(200).json({condition:false});
         
        } else {
          res.status(200).json({ message: 'invalid password',condition:true});
          
        }
      });
    }
  }
  else {
  
    
    let user = await User.findOne({email: req.body.email });
    if (!user) {
    
    req.session.loginEmail = true;
    res.redirect("/login");
  } else {
    bcrypt.compare(req.body.password, user.password, (err, match) => {
      if (match) {
        req.session.user = user;
        res.redirect(req.session.myUrl);
      } else {
        req.session.loginPassword = true;
        res.redirect("/login");
      }
    });
  }
 };
  }
  

exports.signup = async (req, res, next) => {
  // let password = await bcrypt.hash(req.body.password, 10);
  //       const newUser = new User({
  //         email: req.body.email,
  //         phone_number: req.body.phone_number,
  //         password: password,
  //       });
  //       newUser.save().then((err) => {
  //         res.redirect("/"):
  //       });
  if (req.body.password === req.body.password2) {
    helpers.finderUser(req.body).then((response) => {
      if (response.status) {
        req.session.emailExist = true;
        res.redirect("/sign-up");
      } else {
        req.session.tempUser = req.body;
        otp.createServer().then((ser) => {
          res.redirect("/otpverify");
          serviceId = ser.sid;
          console.log(req.body.phone_number);
          otp.createOtp(ser.sid, req.body.phone_number);
        });
      }
    });
  }
  else {
    req.session.samepassword = true;
    res.redirect("/sign-up");
  }
  

  // console.log(req.session.tempUser);
  // res.redirect("/otpverify");
  // console.log(ser.sid);
  // console.log(req.body.phone_number);

  // client.verify.v2
  //   .services(ser.sid)
  //   .verifications.create({ to: `+91${req.body.phone_number}`, channel: "sms" })
  //   .then((verification) => console.log(verification.status));
};
exports.verify = (req, res, next) => {
  otp.validateOtp(serviceId, req.session.tempUser.phone_number, req.body.otp)
    .then(async (status) => {
      if (status) {
        console.log(status);
        let password = await bcrypt.hash(req.session.tempUser.password, 10);
        let newUser = new User({
          email: req.session.tempUser.email,
          phone_number: req.session.tempUser.phone_number,
          password: password,
        });

        try {
         let result= await newUser.save();
          req.session.user = result;

          res.redirect("/");
        } catch (error) {
          req.session.emailExist = true;
          res.redirect("/sign-up");
        }
      } else {
        req.session.otpStatus = true;
        res.redirect("/otpverify");
      }
    });

  // client.verify.v2
  //   .services(ser.sid)
  //   .verificationChecks.create({
  //   to: `+91${req.session.tempUser.phone_number}`,
  //   code: `${req.body.otp}`,
  // })
  // .then(async (verification_check) => {
  //   if (verification_check.status) {
  //     console.log(verification_check.status);
  //     let password = await bcrypt.hash(req.session.tempUser.password, 10);
  //     const newUser = new User({
  //       email: req.session.tempUser.email,
  //       phone_number: req.session.tempUser.phone_number,
  //       password: password,
  //     });
  //     newUser.save().then((err) => {
  //       res.redirect("/");
  //     });
  //   } else {
  //       req.session.otpStatus = true;
  //       res.redirect("/otpverify")
  //   }
  // });
};
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
