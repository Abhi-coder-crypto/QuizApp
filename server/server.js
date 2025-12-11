require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const adminRoutes = require('./routes/admin');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);

// Serve React build files
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Server + Database Startup
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.log('⚠️ MONGO_URI not set. Running without database connection.');
  app.listen(PORT, HOST, () =>
    console.log(`🚀 Server running on http://${HOST}:${PORT}`)
  );
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('🔥 MongoDB Connected Successfully!');
      app.listen(PORT, HOST, () =>
        console.log(`🚀 Server running on http://${HOST}:${PORT}`)
      );
    })
    .catch(err => console.error('❌ MongoDB Connection Failed:', err));
}

// Error Handling
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('🔒 Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

// For Vercel (optional)
module.exports = app;
