// models/Product.js

const db = require('../config/mysqlDB');

const Product = {
    getAllProducts: async () => {
        try {
          const connection = await db();  
          const [rows] = await connection.query('SELECT * FROM products');
          // // connection.end(); 
          const response = [];
          for(let each of rows){
            // console.log(each.image1);
              // const imageData = await getImage(each.image1);
              const cols = await connection.query(`SELECT * FROM images WHERE id = '${each.image1}' `);
              response.push({...each,images:cols[0][0]});
          }
          return response;
        } catch (error) {
          console.error('Error fetching all products:', error);
          throw error;
        }
      },
      getOrderListAdmin:async()=>{
        try{
          const connection = await db();  
           
          const [rows] = await connection.query(`SELECT * FROM transactions   `);
          // // connection.end(); 
          console.log(rows);
          const response = [];
          for(let each of rows){
            console.log(`SELECT * FROM cart_items WHERE transaction_id ='${each.order_id}'`);
            const orderId = each.order_id;
            const carts = await connection.query(`SELECT * FROM cart_items WHERE transactions_id ='${orderId}'`);
            response.push({product:each,items:carts[0]});
          }
          return(response);
        }catch(err){
  
        }
      },
    getOrderList:async(email)=>{
      try{
        const connection = await db();  
        console.log(email);
        const [rows] = await connection.query(`SELECT * FROM transactions WHERE form_email = '${email}'  `);
        // // connection.end(); 
        // console.log(rows);
        const response = [];
        for(let each of rows){
          console.log(`SELECT * FROM cart_items WHERE transaction_id ='${each.order_id}'`);
          const orderId = each.order_id;
          const carts = await connection.query(`SELECT * FROM cart_items WHERE transactions_id ='${orderId}'`);
          response.push({product:each,items:carts[0]});
        }
        return(response);
      }catch(err){

      }
    },
    getSearchedProducts: async (query,limit) => {
        try {
          const connection = await db();  
          console.log(`SELECT * FROM products WHERE name LIKE '%${query}%' LIMIT ${limit} `);
          const [rows] = await connection.query(`SELECT * FROM products WHERE name LIKE '%${query}%' LIMIT ${limit} `);
          // // connection.end(); 
          const response = [];
          for(let each of rows){
            // console.log(each.image1);
              // const imageData = await getImage(each.image1);
              const cols = await connection.query(`SELECT * FROM images WHERE id = '${each.image1}' `);
              response.push({...each,images:cols[0][0]});
          }
          return response;
        } catch (error) {
          console.error('Error fetching all products:', error);
          throw error;
        }
      }
      ,
      getAllBanners: async (query) => {
        try {
          const connection = await db();  
          const [rows] = await connection.query(`SELECT * FROM banners WHERE slug_in = '${query}' `);
          // connection.end();
          const response = [];
          for(let each of rows){
            // console.log(each.image_id);
            const [cols] = await connection.query(`SELECT * FROM images WHERE id = '${each.image_id}' `);
            // const brn = {...each,images:cols};
            response.push({...each,images:cols});
          } 
          return response;
        } catch (error) {
          console.error('Error fetching all products:', error);
          throw error;
        }
      },
    getImage:async (image_id)=>{
      try{
          
            const cols = await connection.query(`SELECT * FROM images WHERE id = '${each.image_id}' `);
            // const brn = {...each,images:cols};
            return cols;
          
      }catch(err){

      }
    },
  getPopularProducts: async () => {
    const [rows] = await db.query('SELECT * FROM products WHERE popularity > 50');
    return rows;
  },
  getNewestProducts: async () => {
    try {
      const connection = await db();  
      const [rows] = await connection.query(`SELECT * FROM products order by id desc limit 2`);
      // console.log(`SELECT * FROM products WHERE recommended = 'true'`);
      const response = [];
      for(let each of rows){
        // console.log(each.image1);
          // const imageData = await getImage(each.image1);
          const cols = await connection.query(`SELECT * FROM images WHERE id = '${each.image1}' `);
          response.push({...each,images:cols[0][0]});
      }
      connection.end(); 
      return response;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },
  getRecommendedProducts: async () => {
    try {
      const connection = await db();  
      const [rows] = await connection.query(`SELECT * FROM products WHERE recommended = 'true'`);
      // console.log(`SELECT * FROM products WHERE recommended = 'true'`);
      const response = [];
      for(let each of rows){
        // console.log(each.image1);
          // const imageData = await getImage(each.image1);
          const cols = await connection.query(`SELECT * FROM images WHERE id = '${each.image1}' `);
          response.push({...each,images:cols[0][0]});
      }
      connection.end(); 
      return response;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
    
   
  },
  getProductsByCategory: async (category) => {
    try {
      const connection = await db();  
      const [rows] = await connection.query(`SELECT * FROM products WHERE category = '${category}'`);
      // console.log(`SELECT * FROM products WHERE recommended = 'true'`);
      const response = [];
      for(let each of rows){
        // console.log(each.image1);
          // const imageData = await getImage(each.image1);
          const cols = await connection.query(`SELECT * FROM images WHERE id = '${each.image1}' `);
          response.push({...each,images:cols[0][0]});
      }
      connection.end(); 
      return response;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },
  getProductsById: async (id) => {
    try {
      const connection = await db();  
      const [rows] = await connection.query(`SELECT * FROM products WHERE id = '${id}'`);
      // console.log(rows);
      // console.log(`SELECT * FROM products WHERE recommended = 'true'`);
      const response = [];
      for(let each of rows){
        // console.log(each);
        // console.log(each.image1);
          // const imageData = await getImage(each.image1);
          const cols = await connection.query(`SELECT * FROM images WHERE id = '${each.image1}' `);
          response.push({...each,images:cols[0][0]});
      }
      connection.end(); 
      return response;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },
  getProductsCategory:async()=>{
    try {
        const connection = await db();  
        const [rows] = await connection.query('SELECT * FROM category');
        connection.end(); 
        return rows;
      } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
      }
  },
  
  processOrder: async (orderData, product) => {
    try {
        function generateTransactionID(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let transactionID = '';
        
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                transactionID += characters.charAt(randomIndex);
            }
        
            return transactionID;
        }
        
        const connection = await db();
        const order_id = generateTransactionID(4);
        const delivery_status = 'paid not delivered';
        const {
            amount,
            transaction_id,
            transaction_ref,
            flw_ref,
            firstname,
            lastname,
            country,
            address,
            town,
            state,
            form_phone,
            form_email,
            form_message,
            product
        } = orderData;

        // Insert transaction data into the transactions table
        const transactionQuery = `
            INSERT INTO transactions 
                (amount, transaction_id, transaction_ref, flw_ref, order_id, firstname, lastname, country, address, town, state, form_phone, form_email, form_message, delivery_status) 
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const transactionParams = [
            amount,
            transaction_id,
            transaction_ref,
            flw_ref,
            order_id,
            firstname,
            lastname,
            country,
            address,
            town,
            state,
            form_phone,
            form_email,
            form_message,
            delivery_status
        ];
    

        // // Execute transaction query
        await connection.query(transactionQuery, transactionParams);
        console.log(orderData.product);
        // // Fetch product data and insert into the cart_items table
        // const {
        //     id,
        //     name,
        //     description,
        //     price,
        //     sale_price,
        //     rating,
        //     popularity,
        //     created_at,
        //     recommended,
        //     category,
        //     image1,
        //     badge
        // } = product;
        for(let each of orderData.product){
              //  const image_url = each.product.images.url;
              // const image_id = product.images.id;
              const quantity = each.quantity;
                      const cartItemQuery = `
            INSERT INTO cart_items 
                (product_id, product_name, product_description, price, sale_price, rating, popularity, created_at, recommended, category, image_id, badge, image_url, quantity, transactions_id) 
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
                const cartItemParams = [
            each.product.id,
            each.product.name,
            each.product.description,
            each.product.price,
            each.product.sale_price,
            each.product.rating,
            each.product.popularity,
            each.product.created_at,
            each.product.recommended,
            each.product.category,
            each.product.image_id,
            each.product.badge,
            each.product.image1,
            each.quantity,
            order_id 
        ];
        await connection.query(cartItemQuery, cartItemParams);
        }
      

        connection.end();
    } catch (error) {
        console.error('Error processing order:', error);
        throw error;
    }
}

};

module.exports = Product;
