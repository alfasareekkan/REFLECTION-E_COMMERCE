const dotenv = require("dotenv");
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

module.exports = {
  createServer: () => {
    return new Promise((resolve, reject) => {
      let ser;
      client.verify.v2.services
        .create({ friendlyName: "REFLECTION" })
        .then((service) => {
          console.log(service);
          console.log(service.sid);
          ser = service;
          var serviceId = ser.sid;
          resolve(ser);
        });
    });
  },
  createOtp: (sid, phone_number) => {
    return new Promise((resolve, reject) => {
      client.verify.v2
        .services(sid)
        .verifications.create({ to: `+91${phone_number}`, channel: "sms" })
        .then((verification) => {
          console.log();
          console.log(verification.status);
          resolve();
        });
    });
  },
  validateOtp: (serviceId, phone_number, otp) => {
    return new Promise((resolve, reject) => {
      client.verify.v2
        .services(serviceId)
        .verificationChecks.create({
          to: `+91${phone_number}`,
          code: `${otp}`,
        })
        .then((verification_check) => {
          resolve(verification_check.valid);
          
        });
    });
  }, 
};
