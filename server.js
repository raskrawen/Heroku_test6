// server.js  test simple hello world from openAI server. virker med nodefetch v2
const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware til at håndtere JSON og tjene statiske filer
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API-rute til at sende prompten "skriv hello world" til OpenAI
app.post('/api/chat', async (req, res) => {
    const messages = [{ role: 'user', content: 'skriv hello world' }];

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // API-nøgle til test
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
            }),
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        // Send OpenAI's svar til frontend
        res.json({ reply: botMessage });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Der opstod en fejl med API-opkaldet.' });
    }
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});
