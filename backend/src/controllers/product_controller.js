import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
import Product from '../models/product.js';
import Cart from '../models/cart.js';


//const JWT_SECRET = process.env.JWT_SECRET; // Replace with your own secret key
const JWT_SECRET = 'test'; // Replace with your own secret key


function storeCurrentDate(expirationAmount, expirationUnit) {
    // Get the current date and time in Asia/Manila timezone
    const currentDateTime = moment.tz("Asia/Manila");
    // Calculate the expiration date and time
    const expirationDateTime = currentDateTime.clone().add(expirationAmount, expirationUnit);

    // Format the current date and expiration date
    const formattedExpirationDateTime = expirationDateTime.format('YYYY-MM-DD HH:mm:ss');

    // Return both current and expiration date-time
    return formattedExpirationDateTime;
}

export const create_product = asyncHandler(async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;
        // Check if all required fields are provided
        if (!name || !price || !description || !stock) {
            return res.status(400).json({ error: "Please provide all fields (name, price, description, stock)." });
        }

        const newProduct = new Product({
            name: name,
            price: price,
            description: description,
            stock: stock,
            created_at: storeCurrentDate(0, 'hours'),
        });

        await newProduct.save();

        return res.status(200).json({ data : 'New product successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create post.' });
    }
});

export const get_all_product = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    const checkedOutCarts = await Cart.find({ is_checked_out: true });

    const productSalesMap = {};

    // Calculate total sold per product
    checkedOutCarts.forEach(cart => {
      cart.items.forEach(item => {
        const productId = item.product.toString();
        if (!productSalesMap[productId]) {
          productSalesMap[productId] = 0;
        }
        productSalesMap[productId] += item.quantity;
      });
    });

    // Merge total sold into products
    const result = products.map(product => ({
      ...product._doc,
      total_sold: productSalesMap[product._id.toString()] || 0
    }));

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get all products.' });
  }
});




export const get_specific_product = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // Get the meal ID from the request parameters
        const product = await Product.findById(id);
        
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ data: product });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific product.' });
    }
});


export const update_product = asyncHandler(async (req, res) => {    
    try {
        const { id } = req.params; // Get the meal ID from the request parameters
        const { name, price, description, stock } = req.body;


         // Check if all required fields are provided
        if (!name || !price || !description || !stock) {
            return res.status(400).json({ error: "Please provide all fields (name, price, description, stock)." });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        product.name = name;
        product.price = price;
        product.description = description;
        product.stock = stock;

        await product.save();

        return res.status(200).json({ data: 'Product successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update product.' });
    }
});


export const delete_product = asyncHandler(async (req, res) => {    
    try {
        const { id } = req.params; // Get the meal ID from the request parameters
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        await product.deleteOne();

        return res.status(200).json({ message: 'Product successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete product.' });
    }
});


