// controllers/UserController.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/mysqlDB'); 
const authMiddleware = require('../middleware/authMiddleware');
// Registration route
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const connection = await db();  
    
    // // Check if user already exists
    const [rows] = await connection.query(`SELECT * FROM users WHERE email = '${email}'`);
    // const existingUser = await connection.query('SELECT * FROM users ');
    
    if (rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    // // Insert new user into database
    await connection.query('INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)', [firstname, lastname, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await db();  
    // Check if user exists
    const [rows] = await connection.query(`SELECT * FROM users WHERE email = '${email}'`);
    console.log(rows);
    const user_id = rows[0].id;
    // const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }  

    // // Check password
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const [billing] = await connection.query(`SELECT * FROM billing WHERE user_id = '${user_id}'`);
    // // Generate JWT token
    const token = jwt.sign({ user: rows[0] }, process.env.JWT_SECRET, { expiresIn: '20h' });

    res.json({ ...rows[0],authorization:token,billing:billing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/update',authMiddleware,async(req,res)=>{
  try{
    // const{firstname,lastname,email,address,state,phone,city,country} = req.body
    const{firstname,lastname,email,phone} = req.body
    // console.log("firstname");
    const connection = await db();  
    // console.log(`UPDATE users SET firstname = '${firstname}', lastname = '${lastname}', email = '${email}', address = '${address}', state = '${state}', phone = '${phone}', city='${city}', country = '${country}' WHERE id = ${req.user.id}`);
    // console.log(`UPDATE users SET firstname = '${firstname}', lastname = '${lastname}', phone = '${phone}' WHERE email = '${email}' `);
    const [rows] = await connection.query(`UPDATE users SET firstname = '${firstname}', lastname = '${lastname}', phone = '${phone}' WHERE email = '${email}' `);
    res.json({message:"Update successfully"});
  }catch(err){
    console.log(err);   
    res.status(500).json({ error: 'Internal Server Error', message:err });
  }
})

router.post('/update-billing', authMiddleware, async (req, res) => {
  try {
      const { firstname, lastname, email, streetaddress, companyname, state, phone, country, postcode } = req.body;
      const connection = await db();

      // Check if billing record already exists for the user
      const [existingRows] = await connection.query(`SELECT * FROM billing WHERE user_id = ${req.user.id}`);
      
      if (existingRows.length === 0) {
          // If no existing record found, insert a new record
          await connection.query(`
              INSERT INTO billing (user_id, firstname, lastname, email, streetaddress, companyname, state, phone, country, postcode)
              VALUES (${req.user.id}, '${firstname}', '${lastname}', '${email}', '${streetaddress}', '${companyname}', '${state}', '${phone}', '${country}', '${postcode}')
          `);
      } else {
          // If record exists, update the existing record
          await connection.query(`
              UPDATE billing
              SET firstname = '${firstname}', lastname = '${lastname}', email = '${email}', streetaddress = '${streetaddress}',
                  companyname = '${companyname}', state = '${state}', phone = '${phone}', country = '${country}', postcode = '${postcode}'
              WHERE user_id = ${req.user.id}
          `);
      }

      // Fetch updated billing data
      const [updatedRows] = await connection.query(`SELECT * FROM billing WHERE user_id = ${req.user.id}`);
      const updatedBillingData = updatedRows[0];

      res.json({
          message: "Update successful",
          user: updatedBillingData
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});



module.exports = router;
