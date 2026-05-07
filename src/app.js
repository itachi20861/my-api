const express = require('express');
const os = require('os');

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/joke', async (req, res) => {
  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    const joke = await response.json();
    res.json(joke);
  } catch (error) {
    res.status(502).json({ error: 'Failed to fetch joke' });
  }
});

app.get('/info', (req, res) => {
  res.json({
    version: process.env.APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV || 'development',
    hostname: os.hostname(),
  });
});

module.exports = app;
