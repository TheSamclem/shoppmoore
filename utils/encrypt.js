const crypto = require("crypto");

const jwt = require('jsonwebtoken');
const { resolve } = require("path");
const algorithm = "aes-256-cbc"; 
const dotenv = require( 'dotenv' );
const secretKey = 'Hehaslighbrain12345butcannotofferfullninesubject98765'; // 32-byte secret key
dotenv.config();
const iv = crypto.randomBytes(16); // 16-byte initialization vector
const axios = require('axios');
// console.log("your key is ", key);

module.exports = {
  encrypt_3des:function(payload) {
    const text = JSON.stringify(payload);
    const forge = require("node-forge");
    const cipher = forge.cipher.createCipher(
        "3DES-ECB",
        forge.util.createBuffer(process.env.FLUTTERWAVEENC_KEY)
    );
    cipher.start({iv: ""});
    cipher.update(forge.util.createBuffer(text, "utf-8"));
    cipher.finish();
    const encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
},
pin_payment:function(payloads){
    return new Promise((resolve, reject) => { 
      const paymentEndpoint = 'https://api.flutterwave.com/v3/charges?type=card';
      const paylod1 = this.encrypt_3des(process.env.FLUTTERWAVEENC_KEY, payloads);
      const plds1 = {
        "client": paylod1
      };
      const config1 = {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVESEC_KEY}`,
        },
      };
  
      axios.post(paymentEndpoint, plds1, config1)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('PIN Payment Error:', error.response.data);
          reject(error.response.data.message);
        });
    });
  },
  encryption:function (text) {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(process.env.FLUTTERWAVEENC_KEY).digest();
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;  },

    decryption:function (encryptedText) {
      const [ivHex, encryptedHex] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const key = crypto.createHash('sha256').update(process.env.FLUTTERWAVEENC_KEY).digest();
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    },
    generate_token:function(userId,ip_address,name,email,phone){
      return new Promise((resolve,reject) =>{
        const authkeysecret = this.encryption(secretKey);
        //check if the user is valid
        const payload = {
          user: {
            id: userId,
            ip:ip_address,
            name:name,
            email:email,
            phone:phone
          },
        };
      
        // Token expiration time (e.g., 1 hour)
        const expiresIn = '20h';
        // console.log(payload);
        const ret = jwt.sign(payload, secretKey, { expiresIn });
        // console.log(ret);
        resolve(ret);

        //format of the final token
          //username|user_id|user_email|dob|today_date
      })
    },
    generate_token_register:function(conf_type,conf_value,name,otp){
      return new Promise((resolve,reject) =>{
        const authkeysecret = this.encryption(secretKey);
        //check if the user is valid
        const payload = {
          user: {
            conf_type: conf_type,
            conf_value:conf_value,
            name:name,
            otp:otp
          },
        };
      
        // Token expiration time (e.g., 1 hour)
        const expiresIn = '0.5h';
        // console.log(payload);
        const ret = jwt.sign(payload, secretKey, { expiresIn });
        // console.log(ret);
        resolve(ret);

        
      })
    },

    auth_timer:function(auth_code){
      return new Promise((resolve,reject) =>{
        const now = new Date();
        const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

        const options = { hour12: false, timeZone: 'UTC' };
        const currentTime = now.toLocaleString('en-US', options);
        const twoHoursLaterTime = twoHoursLater.toLocaleString('en-US', options);
        
        console.log('Current Time:', currentTime);
        console.log('Two Hours Later:', twoHoursLaterTime);
        resolve({"currentTime":currentTime,"nextTime":twoHoursLaterTime});
      });
    }
    
    
}

