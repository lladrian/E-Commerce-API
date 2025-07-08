import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
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

export const create_cart = asyncHandler(async (req, res) => {
    const { items_array, user_id } = req.body;

    try {
        // Check if all required fields are provided
        if (!items_array || !user_id) {
            return res.status(400).json({ message: "Please provide all fields (user_id, items_array)." });
        }

        let cart = await Cart.findOne({
            user: user_id,
            is_checked_out: false
        }).populate('items.product');

        if (!cart) {
            cart = new Cart({
                user: user_id,
                items: items_array,
                created_at: storeCurrentDate(0, 'hours'),
            });
        } else {
            for (const item of items_array) {
                const index = cart.items.findIndex(i => i.product._id.toString() === item.product);

                if (index > -1) {
                    const total_count = cart.items[index].quantity + item.quantity;

                    if (total_count > cart.items[index].product.stock) {
                        return res.status(400).json({
                            message: `Quantity must be between 1 and ${cart.items[index].product.stock}`
                        });
                    }

                    cart.items[index].quantity += item.quantity;
                } else {
                    cart.items.push(item);
                }
            }
        }

        await cart.save(); // ✅ Make sure you save the cart

        return res.status(200).json({ data: 'New cart successfully created.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create cart.', details: error.message });
    }
});


export const get_all_cart_specific_user = asyncHandler(async (req, res) => {  
    const { user_id } = req.params; // Get the meal ID from the request parameters
  
    try {
        const carts = await Cart.findOne({ 
        user: user_id, 
        is_checked_out: false 
        }).populate('items.product');

        return res.status(200).json({ data: carts });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all carts.' });
    }
});

export const get_all_ordered_cart_specific_user = asyncHandler(async (req, res) => { 
    const { user_id } = req.params; // Get the meal ID from the request parameters
 
    try {
        const carts = await Cart.find({ 
        user: user_id, 
        is_checked_out: true 
        }).populate('items.product')
        .populate('user');

        return res.status(200).json({ data: carts });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all carts.' });
    }
});


export const get_all_ordered_cart = asyncHandler(async (req, res) => {  
    try {
        const carts = await Cart.find({ 
        is_checked_out: true 
        }).populate('items.product')
        .populate('user');

        return res.status(200).json({ data: carts });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all carts.' });
    }
});

export const get_specific_cart = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const cart = await Cart.findById(id);
        
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        res.status(200).json({ data: cart });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific cart.' });
    }
});


export const update_cart = asyncHandler(async (req, res) => {   
    const { items_array, user_id } = req.body;

    try {
        if (!items_array || !user_id) {
        return res.status(400).json({ message: "Please provide all fields (user_id, items_array)." });
        }

        let cart = await Cart.findOne({ 
        user: user_id, 
        is_checked_out: false 
        }).populate('items.product');

        if (!cart) {
        // Create a new cart
        cart = new Cart({
            user: user_id,
            items: items_array,
            created_at: storeCurrentDate(0, 'hours'),
        });
        } else {
            const item = items_array[0];
            const index = cart.items.findIndex(i => i.product._id.toString() === item.product);

            if (index > -1) {
                cart.items[index].quantity = item.quantity; // update quantity
            } else {
                cart.items.push(item); // add new product to cart
            }
        }

        await cart.save();
        return res.status(200).json({ data: 'Cart updated successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update cart.' });
    }
});

export const remove_cart_item = asyncHandler(async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    if (!user_id || !product_id) {
      return res.status(400).json({ message: "Please provide both user_id and product_id." });
    }

    const cart = await Cart.findOne({ user: user_id, is_checked_out: false });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Filter out the item to remove
    cart.items = cart.items.filter(item => item.product.toString() !== product_id);

    await cart.save();

    return res.status(200).json({ data: "Item removed from cart successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to remove item from cart." });
  }
});


export const delete_cart = asyncHandler(async (req, res) => {    
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const cart = await Cart.findById(id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        await cart.deleteOne();

        return res.status(200).json({ data: 'Cart successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete cart.' });
    }
});


