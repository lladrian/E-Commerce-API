import axios from 'axios';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



async function checkout() {
    try {
        const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Node.js and Express book'
                            },
                            unit_amount: 50 * 100
                        },
                        quantity: 1
                    },
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'JavaScript T-Shirt'
                            },
                            unit_amount: 20 * 100
                        },
                        quantity: 2
                    }            
                ],
                mode: 'payment',
                shipping_address_collection: {
                    allowed_countries: ['US', 'BR']
                },
                success_url: `${process.env.BASE_URL}/stripe/complete_order?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.BASE_URL}/stripe/cancel_order`
        })
        
        return session.url;
    } catch (error) {
        return error;
    }
}
async function order(session_id) {
  try {
    const [session, lineItems] = await Promise.all([
      stripe.checkout.sessions.retrieve(session_id, {
        expand: ['payment_intent.payment_method'],
      }),
      stripe.checkout.sessions.listLineItems(session_id),
    ]);

    return { session, lineItems };
  } catch (error) {
    return { error };
  }
}

// ✅ Exporting as default object
export default {
  order,
  checkout
};
