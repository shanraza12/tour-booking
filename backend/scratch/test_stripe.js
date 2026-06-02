import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const testStripe = async () => {
    try {
        const balance = await stripe.balance.retrieve();
        console.log('Stripe connection successful!');
        console.log('Available balance (first entry):', balance.available[0]?.amount, balance.available[0]?.currency);
    } catch (error) {
        console.error('Stripe connection failed:', error.message);
    }
};

testStripe();
