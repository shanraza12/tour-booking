import fetch from 'node-fetch';

const testChat = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/v1/sky/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Hello, are you working?'
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

testChat();
