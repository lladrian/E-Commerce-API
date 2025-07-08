import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
import Payment from '../models/payment.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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
export const checkout = asyncHandler(async (req, res) => {
    const { array_cart, cart_id } = req.body;

     try { 
        const line_items = array_cart.map(item => ({
            price_data: {
            currency: 'usd',
            product_data: {
                name: item.product.name,
                images: [item.product.filename], // Stripe expects an array
            },
            unit_amount: Math.round(item.product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
                line_items,
                mode: 'payment',
                shipping_address_collection: {
                    allowed_countries: ['US', 'BR']
                },
                success_url: `${process.env.BASE_URL}/payments/complete_order?session_id={CHECKOUT_SESSION_ID}&cart_id=${cart_id}`,
                cancel_url: `${process.env.BASE_URL}/payments/cancel_order`
        })
        

        return res.status(200).json({ data: session.url });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to checkout.' });
    }
});

export const complete_order = asyncHandler(async (req, res) => {
    try {
        const [session, lineItems] = await Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, {
            expand: ['payment_intent.payment_method'],
        }),
        stripe.checkout.sessions.listLineItems(req.query.session_id),
        ]);

        const cart = await Cart.findById(req.query.cart_id);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            product.stock -= item.quantity;
            await product.save();
        }
        
        cart.payment_id = session.payment_intent.id;
        cart.is_checked_out = true;
        cart.paid_at = storeCurrentDate(0, 'hours');
        
        await cart.save();
    
        return res.status(200).json({ data:  { session, lineItems }, message: 'Product purchased successfully'});
    } catch (error) {
        return res.status(500).json({ error: 'Failed to order.' });
    }
});

export const cancel_order = asyncHandler(async (req, res) => {
    res.redirect('/')
});


export const create_payment = asyncHandler(async (req, res) => {
    const { array_cart, user_id, amount, method } = req.body;

    try {
        if (!array_cart || !user_id || !amount || !method) {
            return res.status(400).json({ message: "Please provide all fields (array_cart, user_id, amount, method)." });
        }    

        const newPayment = new Payment({
            cart: array_cart,
            user: user_id,
            amount: amount,
            method: method,
            created_at: storeCurrentDate(0, 'hours'),
        });

        await newPayment.save();

        return res.status(200).json({ data : 'New payment successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create payment.' });
    }
});


export const get_all_payment_specific_user = asyncHandler(async (req, res) => {  
    const { user_id } = req.params; // Get the meal ID from the request parameters
  
    try {
        const payments = await Payment.findOne({ 
            user: user_id, 
        }).populate('cart');

        return res.status(200).json({ data: payments });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all payments.' });
    }
});


export const get_all_payment = asyncHandler(async (req, res) => {  
    const { user_id } = req.params; // Get the meal ID from the request parameters
  
    try {
        const payments = await Payment.find().populate('cart');

        return res.status(200).json({ data: payments });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all payments.' });
    }
});

export const get_specific_payment = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const payment = await Payment.findById(id).populate('cart');
        
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        res.status(200).json({ data: payment });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific payment.' });
    }
});


export const update_payment_status = asyncHandler(async (req, res) => {   
    const { id } = req.params; // Get the meal ID from the request parameters
    const { status} = req.body;
 
    try {
        if (!status) {
            return res.status(400).json({ message: "Please provide all fields (status)." });
        }    

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        if(status == "paid") {
            payment.status = status;
            payment.transactionId = 123;
            payment.paid_at = storeCurrentDate(0, 'hours');
        } else {
            payment.status = status;
            payment.transaction_id = NULL;
            payment.paid_at = NULL;
        }

        await payment.save();

        return res.status(200).json({ data: 'Payment successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update payment.' });
    }
});



