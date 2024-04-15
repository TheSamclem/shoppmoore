// controllers/ProductController.js

const express = require('express');
const route = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

route.get('/all', async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
route.get('/banners', async(req,res)=>{
  try {
    const{slug_in} = req.query;
    const products = await Product.getAllBanners(slug_in);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
route.get('/recommended', async(req,res)=>{
  try {
    
    const products = await Product.getRecommendedProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

route.get('/detail', async (req, res) => {
  try {
      const ids = req.query.id_in;
      const productList = [];

      // Use map instead of forEach to create an array of promises
      // const productPromises = ids.map(async id => {
          const products = await Product.getProductsById(ids);
      //     return products[0]; // Assuming getProductsById returns an array, get the first element
      // });

      // // Wait for all promises to resolve
      // const products = await Promise.all(productPromises);

      // // Push resolved products into productList
      // productList.push(...products);

      // console.log(productList);
      res.json(products);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/find', async (req, res) => {
  try {
      const {query,limit} = req.query;
      const products = await Product.getSearchedProducts(query,limit);
      res.json(products);
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/order', authMiddleware, async(req,res)=>{
  console.log(req.user);

  const orderList = await Product.getOrderList(req.user.email);
  
  res.json(orderList);
 
});
route.get('/orderadmin', async(req,res)=>{
  

  const orderList = await Product.getOrderListAdmin();
  console.log(orderList);
  res.json(orderList);
 
});


route.get('/category', async(req,res)=>{
  try {
    const {slug_in} = req.query;  
    const products = await Product.getProductsByCategory(slug_in);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

route.get('/products/popular', async (req, res) => {
  try {
    const popularProducts = await Product.getPopularProducts();
    res.json(popularProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/newest', async (req, res) => {
  try {
    const newestProducts = await Product.getNewestProducts();
    res.json(newestProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
route.post('/process-order', async (req, res) => {
  try {
    const newestProducts = await Product.processOrder(req.body);
    res.json(newestProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/products/recommended', async (req, res) => {
  try {
    const recommendedProducts = await Product.getRecommendedProducts();
    res.json(recommendedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/products/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const productsByCategory = await Product.getProductsByCategory(category);
    res.json(productsByCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = route;
