const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/mysqlDB'); 
const authMiddleware = require('../middleware/authMiddleware');
const Flutterwave = require('flutterwave-node-v3');
const encrypt_3des = require('../utils/encrypt');
const dotenv = require( 'dotenv' );
const axios = require('axios');
dotenv.config();
// const open = require('open');
// const flw = new Flutterwave(process.env.FLUTTERWAVEPUB_KEY, process.env.FLUTTERWAVESEC_KEY)

router.post('/flutterwave-payment', async (req, res) => {
    try{
        const{amount,card_number,cvv,expiry_month,expiry_year,email,tx_ref,card_pin} = req.body;
        // 

        const paymentEndpoint = 'https://api.flutterwave.com/v3/charges?type=card';
        // const payload =  `{
        //         "amount":"${amount}",
        //         "currency":"NGN",
        //         "card_number":${card_number},
        //         "cvv":${cvv},
        //         "expiry_month":${expiry_month},
        //         "expiry_year":${expiry_year},
        //         "email":"${email}",
        //         "tx_ref":"MC-3243e  "
        //      }`

             const payload = {
                tx_ref: tx_ref,
                amount: amount,
                currency: "NGN",
                redirect_url: 'https://your-redirect-url.com',
                payment_type: "card",
                card_number: card_number,
                cvv:cvv,
                expiry_month:expiry_month,
                expiry_year:expiry_year,
                email:email,
                
              };
             const encrypt = encrypt_3des.encrypt_3des(payload);
            //  console.log(payload);
             const plds = {
                "client":encrypt
             }
              const config = {
                headers: {
                  Authorization: `Bearer ${process.env.FLUTTERWAVESEC_KEY}`,
                },
              };
              // console.log(encrypt);
              axios.post(paymentEndpoint, plds, config)
              .then(response => {
                // Handle the response here
                console.log(response.data.meta);
                if(response.data.meta.authorization.mode == 'pin'){
                  // console.log("yes");
                  if(card_pin=='' || card_pin ==null){
                    return res.status(200).json({status:"success",message:response.data.message,mode:response.data.meta.authorization.mode});
                  }else{
                    const payload1 = {
                      tx_ref: tx_ref,
                      amount: amount,
                      currency: "NGN",
                      redirect_url: 'https://your-redirect-url.com',
                      payment_type: "card",
                      card_number: card_number,
                      cvv:cvv,
                      expiry_month:expiry_month,
                      expiry_year:expiry_year,
                      email:email,
                      authorization:{
                        mode:"pin",
                        pin:card_pin
                      }};


                      const encrypt = encrypt_3des.encrypt_3des(payload1);
                       
                       const plds = {
                          "client":encrypt
                       }
                        const config = {
                          headers: {
                            Authorization: `Bearer ${process.env.FLUTTERWAVESEC_KEY}`,
                          },
                        };

                        axios.post(paymentEndpoint, plds, config)
                        .then(response => {
                          console.log(response.data);
                          return res.status(200).json(response.data);
                        })
                        .catch(err =>{console.log("y")});

                      // encrypt_3des.pin_payment(payload1)
                      //   .then(pinResponse => {
                      //       // resolve(pinResponse);  
                      //       return res.status(200).json(pinResponse);
                      //   })
                      //   .catch(pinError => {
                      //       console.log(pinError);

                      //       return res.status(400).json({error:"Internal error occured",message: pinError});
                      //   });

                       
                  
                    
                  }

                }
                // return res.status(200).json({})
                // const logTransaction = ;
                // console.log(tx_refs);
                // return res.status(200).json(response);
                // if(response.data.meta.authorization.mode == 'pin'){
                //     // const newpayloads = {
                //     //     tx_ref: tx_ref,
                //     //     amount: amount,
                //     //     currency: "NGN",
                //     //     redirect_url: 'https://your-redirect-url.com',
                //     //     payment_type: "card",
                //     //     card_number: card_number,
                //     //     cvv:cvv,
                //     //     expiry_month:expiry_month,
                //     //     expiry_year:expiry_year,
                //     //     email:email,
                //     //     "authorization": {
                //     //         "mode": "pin", 
                //     //         "pin":  card_pin
                //     //       }
                        
                //     //   };
                        
                //     //   if(card_pin=='' || card_pin ==null){
                //     //     return res.status(200).json({status:"success",message:response.data.message,mode:response.data.meta.authorization.mode});  
                //     //   }else{
                //     //    encrypt_3des.pin_payment(newpayloads)
                //     //     .then(pinResponse => {
                //     //         // resolve(pinResponse);  
                //     //         return res.status(200).json(pinResponse);
                //     //     })
                //     //     .catch(pinError => {
                //     //         console.log(pinError);

                //     //         return res.status(400).json({error:"Internal error occured",message: pinError});
                //     //     });
                //     //   }
                //     // resolve({status:"success",message:response.data.message,mode:response.data.meta.authorization.mode}); 
                // }else if(response.data.meta.authorization.mode == 'avs_noauth'){
        
                // }else{
        
                // }
                // resolve({status:response.data,message:response.data.meta});
              })
              .catch(error => {
                console.error('Payment Error:', error);
                // reject(error.response.data.message);
                return res.status(400).json({error:"Internal error occured",message: error});
              });
             
        
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    // const payload = {
    //     "card_number": "5531886652142950",
    //     "cvv": "564",
    //     "expiry_month": "09",
    //     "expiry_year": "21",
    //     "currency": "NGN",
    //     "amount": "100",
    //     "redirect_url": "https://www.google.com",
    //     "fullname": "Flutterwave Developers",
    //     "email": "developers@flutterwavego.com",
    //     "phone_number": "09000000000",
    //     "enckey": process.env.FLW_ENCRYPTION_KEY,
    //     "tx_ref": "example01",
    // }
})

router.post('/verify-payment', async (req, res) => {
  try{
      const{tx_ref,flw_ref,otp} = req.body;

      let data = JSON.stringify({
        "otp": otp,
        "flw_ref": flw_ref
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.flutterwave.com/v3/validate-charge',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${process.env.FLUTTERWAVESEC_KEY}`
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        return res.status(400).json(error.response.data);
        // console.log(error.response.data);
      });
           
      
  }catch(error){
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
  
})

router.post('/process-order',async(req,res)=>{
  try{
    
  }catch(err){

  }
})


module.exports = router;