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

<<<<<<< HEAD
// API Routes
=======
// Routes
>>>>>>> 8cdfd016ca582f6ac8ec53a9432fa8bb490dbc9f
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);

<<<<<<< HEAD
// -----------------------------
// Serve React build only in PRODUCTION
// -----------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// -----------------------------
// Server + Database Startup
// -----------------------------
=======
// Serve React build files
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve index.html for any route (SPA support)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

>>>>>>> 8cdfd016ca582f6ac8ec53a9432fa8bb490dbc9f
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.log('⚠️ MONGO_URI not set. Running without database connection.');
<<<<<<< HEAD
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

// -----------------------------
// Error Handling
// -----------------------------
=======
  app.listen(PORT, HOST, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));
} else {
  mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🔥 MongoDB Connected Successfully!');
    app.listen(PORT, HOST, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB Connection Failed:', err));
}

// Handle uncaught exceptions
>>>>>>> 8cdfd016ca582f6ac8ec53a9432fa8bb490dbc9f
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

<<<<<<< HEAD
=======
// Handle unhandled promise rejections
>>>>>>> 8cdfd016ca582f6ac8ec53a9432fa8bb490dbc9f
process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

<<<<<<< HEAD
// -----------------------------
// Graceful Shutdown
// -----------------------------
=======
// Graceful shutdown
>>>>>>> 8cdfd016ca582f6ac8ec53a9432fa8bb490dbc9f
process.on('SIGINT', async () => {
  console.log('🔒 Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

<<<<<<< HEAD
// For Vercel (optional)
=======
// Export for Vercel serverless
>>>>>>> 8cdfd016ca582f6ac8ec53a9432fa8bb490dbc9f
module.exports = app;
