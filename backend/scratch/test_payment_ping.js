import 'dotenv/config';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const userId = '69d46c9b0b88fb683b0b2673';
const role = 'user';
const secret = process.env.JWT_SECRET;

const token = jwt.sign({ userId, role }, secret, { expiresIn: '1h' });

const testPayment = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/v1/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: 1000, // $10.00
                currency: 'usd',
                metadata: {
                    bookingId: 'test_booking_123',
                    tourId: 'test_tour_456'
                }
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));
        
        if (data.clientSecret) {
            console.log('SUCCESS: Payment intent created successfully!');
        } else {
            console.log('FAILED: Payment intent creation failed.');
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

testPayment();
