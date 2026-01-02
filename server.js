const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contactmanagement';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

// API Routes

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    message: 'Contact Management API',
    version: '1.0.0',
    endpoints: {
      'GET /api/contacts': 'Fetch all contacts',
      'POST /api/contacts': 'Create a new contact',
      'DELETE /api/contacts/:id': 'Delete a contact by ID',
      'GET /api/health': 'Health check endpoint'
    },
    status: 'running'
  });
});

// GET - Fetch all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts', message: error.message });
  }
});

// POST - Create a new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message: message || ''
    });

    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact', message: error.message });
  }
});

// DELETE - Delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully', contact: deletedContact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact', message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Export for Vercel serverless functions
module.exports = app;

// Start server locally (not used on Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

