import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'node:dns';
import nodemailer from 'nodemailer';

// Fix Windows DNS SRV lookup ECONNREFUSED issue for MongoDB Atlas
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.log("DNS Override Note:", err.message);
}

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://ratanshakya:9LMdjupbtZ23w2eE@cluster0.4hfa9cj.mongodb.net/easygym?retryWrites=true&w=majority";

console.log("==================================================");
console.log("🚀 Starting EasyGym Express Backend API Server...");
console.log("==================================================");

// --- Email Transporter Setup ---
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log("📧 Email SMTP Transporter Initialized");
} catch (e) {
  console.log("📧 Email setup failed. Is nodemailer installed?");
}

// --- MongoDB Schemas ---

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['Admin', 'Staff', 'Member'], default: 'Admin' },
  gymName: { type: String, default: 'EasyGym Hub' },
  branch: { type: String, default: 'Central Sector 18' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  gymCapacity: { type: Number, default: 300 }
}, { timestamps: true });

const MemberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerEmail: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: String,
  phone: String,
  plan: String,
  status: { type: String, default: 'Active' },
  joinDate: String,
  expiryDate: String,
  paidAmount: Number,
  dueAmount: Number,
  biometricStatus: String,
  avatar: String,
  assignedTrainer: String
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerEmail: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Supplements' },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: String
}, { timestamps: true });

const PlanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerEmail: { type: String, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: String,
  access: String,
  popular: Boolean,
  features: [String]
}, { timestamps: true });

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerEmail: { type: String, index: true },
  memberId: String,
  memberName: String,
  plan: String,
  amount: Number,
  gst: Number,
  total: Number,
  date: String,
  status: String,
  method: String
}, { timestamps: true });

const TrainerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerEmail: { type: String, index: true },
  name: { type: String, required: true },
  specialization: String,
  experience: String,
  fee: Number,
  duration: String,
  activeClients: Number,
  rating: Number,
  avatar: String
}, { timestamps: true });

const PTAssignmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerEmail: { type: String, index: true },
  trainerId: String,
  memberId: String,
  date: String,
  time: String,
  fees: Number,
  paidAmount: Number,
  packageDetails: String
}, { timestamps: true });

const GymSchema = new mongoose.Schema({
  ownerEmail: { type: String, required: true, index: true },
  gymName: { type: String, required: true },
  branch: String,
  address: String,
  city: String,
  gymCapacity: Number,
  gstNo: String,
  phone: String,
  logo: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Member = mongoose.model('Member', MemberSchema);
const Product = mongoose.model('Product', ProductSchema);
const Plan = mongoose.model('Plan', PlanSchema);
const Invoice = mongoose.model('Invoice', InvoiceSchema);
const Trainer = mongoose.model('Trainer', TrainerSchema);
const PTAssignment = mongoose.model('PTAssignment', PTAssignmentSchema);
const Gym = mongoose.model('Gym', GymSchema);

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000
})
  .then(() => {
    console.log("✅ CONNECTED: Connected to MongoDB Atlas Cloud Database (easygym)!");
  })
  .catch((err) => {
    console.error("❌ ERROR: MongoDB Atlas Connection Failed:", err.message);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "EasyGym Backend API Server is Online",
    database: mongoose.connection.readyState === 1 ? "Connected to MongoDB Atlas" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Email Route
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, html, replyTo, fromName } = req.body;
    
    if (!to || !subject) {
      return res.status(400).json({ success: false, message: 'Missing required fields (to, subject)' });
    }

    if (!transporter) {
      return res.status(500).json({ success: false, message: 'Email service is not configured on the backend.' });
    }

    const info = await transporter.sendMail({
      from: `"${fromName || 'EasyGym Support'}" <${process.env.SMTP_USER}>`,
      replyTo: replyTo || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent to:", to, "MessageID:", info.messageId);
    res.status(200).json({ success: true, message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error("❌ Email Send Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Auth Routes
app.post('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
        return res.json({ success: true, exists: true });
      }
    }
    return res.json({ success: true, exists: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, gymName, branch, address, city, gymCapacity } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Owner name, email, and password are required!" });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "This email is already registered in the database! Please log in instead."
        });
      }

      const userRole = role || 'Admin';

      const newUser = new User({
        name,
        email: cleanEmail,
        phone: phone || '',
        password,
        role: userRole,
        gymName: gymName || 'EasyGym Hub',
        branch: branch || 'Central Branch',
        address: address || '',
        city: city || '',
        gymCapacity: gymCapacity || 300
      });

      await newUser.save();

      const newGym = new Gym({
        ownerEmail: cleanEmail,
        gymName: gymName || 'EasyGym Hub',
        branch: branch || 'Central Branch',
        address: address || '',
        city: city || '',
        gymCapacity: gymCapacity || 300,
        phone: phone || ''
      });
      await newGym.save();

      return res.status(201).json({
        success: true,
        message: "Gym & Owner Registration successful! Account created in database.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          gymName: newUser.gymName,
          branch: newUser.branch,
          address: newUser.address,
          city: newUser.city,
          gymCapacity: newUser.gymCapacity
        }
      });
    }

    res.status(201).json({
      success: true,
      message: "Gym Registration completed!",
      user: {
        name,
        email: cleanEmail,
        phone: phone || '',
        role: 'Admin',
        gymName: gymName || 'EasyGym Hub',
        branch: branch || 'Central Branch',
        address: address || '',
        city: city || '',
        gymCapacity: gymCapacity || 300
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required!" });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Account not found in database! Please register your Gym Owner account first."
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password! Please check your password and try again."
        });
      }

      return res.json({
        success: true,
        message: "Login successful!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gymName: user.gymName || 'EasyGym Hub',
          branch: user.branch || 'Central Branch',
          address: user.address || '',
          city: user.city || '',
          gymCapacity: user.gymCapacity || 300
        }
      });
    }

    res.status(404).json({ success: false, message: "Account not found in database! Please register." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Member Routes
app.get('/api/members', async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    const filter = ownerEmail ? { ownerEmail: ownerEmail.trim().toLowerCase() } : {};

    if (mongoose.connection.readyState === 1) {
      const members = await Member.find(filter).sort({ createdAt: -1 });
      console.log(`📋 GET /api/members for owner [${ownerEmail || 'ALL'}]: found ${members.length} records in MongoDB Atlas`);
      return res.json({ success: true, count: members.length, data: members });
    }
    console.log("⚠️ GET /api/members: MongoDB disconnected");
    res.json({ success: true, count: 0, data: [] });
  } catch (error) {
    console.error("❌ GET /api/members Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      if (req.body.ownerEmail) {
        req.body.ownerEmail = req.body.ownerEmail.trim().toLowerCase();
      }

      if (!req.body.id) {
        req.body.id = `MEM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      }

      // Check if existing member with same id exists to avoid E11000 duplicate error
      const existing = await Member.findOne({ id: req.body.id });
      if (existing) {
        const updated = await Member.findOneAndUpdate({ id: req.body.id }, req.body, { new: true });
        console.log(`✅ Updated existing member in MongoDB Atlas: ${req.body.name} (${req.body.id})`);
        return res.status(200).json({ success: true, message: "Member updated in MongoDB Atlas", data: updated });
      }

      const newMember = new Member(req.body);
      await newMember.save();
      console.log(`✅ Saved NEW member to MongoDB Atlas: ${newMember.name} (${newMember.id}) for owner: ${newMember.ownerEmail}`);
      return res.status(201).json({ success: true, message: "Member saved to MongoDB Atlas", data: newMember });
    }
    res.status(201).json({ success: true, message: "Member saved locally", data: req.body });
  } catch (error) {
    console.error("❌ POST /api/members Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const searchId = req.params.id;
    const query = {
      $or: [
        { id: searchId },
        { _id: mongoose.Types.ObjectId.isValid(searchId) ? searchId : null }
      ]
    };
    if (mongoose.connection.readyState === 1) {
      const updated = await Member.findOneAndUpdate(query, req.body, { new: true });
      console.log(`✏️ Updated member in MongoDB Atlas for id [${searchId}]:`, updated?.name);
      return res.json({ success: true, message: "Member updated in MongoDB Atlas", data: updated });
    }
    res.json({ success: true, message: "Member updated locally", data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    const searchId = req.params.id;
    const query = {
      $or: [
        { id: searchId },
        { _id: mongoose.Types.ObjectId.isValid(searchId) ? searchId : null }
      ]
    };
    if (mongoose.connection.readyState === 1) {
      const result = await Member.deleteMany(query);
      console.log(`🗑️ Permanently DELETED member(s) from MongoDB Atlas for id [${searchId}]:`, result);
      return res.json({ success: true, message: "Member deleted from database permanently", deletedCount: result.deletedCount });
    }
    res.json({ success: true, message: "Member deleted" });
  } catch (error) {
    console.error("❌ Delete Member Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POS Product Routes (Gym Store Inventory)
app.get('/api/products', async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    const filter = ownerEmail ? { ownerEmail: ownerEmail.trim().toLowerCase() } : {};

    if (mongoose.connection.readyState === 1) {
      const products = await Product.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, data: products });
    }
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      if (req.body.ownerEmail) {
        req.body.ownerEmail = req.body.ownerEmail.trim().toLowerCase();
      }
      const newProd = new Product(req.body);
      await newProd.save();
      return res.status(201).json({ success: true, message: "Product added to POS Store", data: newProd });
    }
    res.status(201).json({ success: true, message: "Product saved locally", data: req.body });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Product.deleteOne({ id: req.params.id });
      return res.json({ success: true, message: "Product deleted from store" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Plan Routes
app.get('/api/plans', async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    const filter = ownerEmail ? { ownerEmail: ownerEmail.trim().toLowerCase() } : {};

    if (mongoose.connection.readyState === 1) {
      const plans = await Plan.find(filter);
      return res.json({ success: true, data: plans });
    }
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/plans', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      if (req.body.ownerEmail) {
        req.body.ownerEmail = req.body.ownerEmail.trim().toLowerCase();
      }
      const newPlan = new Plan(req.body);
      await newPlan.save();
      return res.status(201).json({ success: true, message: "Plan added to MongoDB Atlas", data: newPlan });
    }
    res.status(201).json({ success: true, message: "Plan added locally", data: req.body });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/plans/:id', async (req, res) => {
  try {
    const searchId = req.params.id;
    const query = {
      $or: [
        { id: searchId },
        { _id: mongoose.Types.ObjectId.isValid(searchId) ? searchId : null }
      ]
    };
    if (mongoose.connection.readyState === 1) {
      const updated = await Plan.findOneAndUpdate(query, req.body, { new: true });
      return res.json({ success: true, message: "Plan updated in MongoDB Atlas", data: updated });
    }
    res.json({ success: true, message: "Plan updated locally", data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/plans/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Plan.deleteOne({ id: req.params.id });
      return res.json({ success: true, message: "Plan deleted from MongoDB Atlas" });
    }
    res.json({ success: true, message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Trainer Routes
app.get('/api/trainers', async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    const filter = ownerEmail ? { ownerEmail: ownerEmail.trim().toLowerCase() } : {};
    if (mongoose.connection.readyState === 1) {
      const trainers = await Trainer.find(filter);
      return res.json({ success: true, data: trainers });
    }
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/trainers', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      if (req.body.ownerEmail) req.body.ownerEmail = req.body.ownerEmail.trim().toLowerCase();
      const newTrainer = new Trainer(req.body);
      await newTrainer.save();
      return res.status(201).json({ success: true, message: "Trainer added to MongoDB Atlas", data: newTrainer });
    }
    res.status(201).json({ success: true, message: "Trainer added locally", data: req.body });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/trainers/:id', async (req, res) => {
  try {
    const searchId = req.params.id;
    const query = {
      $or: [
        { id: searchId },
        { _id: mongoose.Types.ObjectId.isValid(searchId) ? searchId : null }
      ]
    };
    if (mongoose.connection.readyState === 1) {
      const updated = await Trainer.findOneAndUpdate(query, req.body, { new: true });
      return res.json({ success: true, message: "Trainer updated in MongoDB Atlas", data: updated });
    }
    res.json({ success: true, message: "Trainer updated locally", data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/trainers/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Trainer.deleteOne({ id: req.params.id });
      return res.json({ success: true, message: "Trainer deleted from MongoDB Atlas" });
    }
    res.json({ success: true, message: "Trainer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PT Assignment Routes
app.get('/api/pt-assignments', async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    const filter = ownerEmail ? { ownerEmail: ownerEmail.trim().toLowerCase() } : {};
    if (mongoose.connection.readyState === 1) {
      const assignments = await PTAssignment.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, data: assignments });
    }
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/pt-assignments', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      if (req.body.ownerEmail) req.body.ownerEmail = req.body.ownerEmail.trim().toLowerCase();
      const newPT = new PTAssignment(req.body);
      await newPT.save();
      return res.status(201).json({ success: true, message: "PT Assignment saved to MongoDB Atlas", data: newPT });
    }
    res.status(201).json({ success: true, message: "PT Assignment saved locally", data: req.body });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/pt-assignments/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await PTAssignment.deleteOne({ id: req.params.id });
      return res.json({ success: true, message: "PT Assignment deleted from MongoDB Atlas" });
    }
    res.json({ success: true, message: "PT Assignment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.json({ success: true, message: "User updated in MongoDB Atlas", user: updatedUser });
    }
    res.json({ success: true, message: "User updated locally" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Gym Settings Routes
app.get('/api/gyms', async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    if (!ownerEmail) return res.status(400).json({ success: false, message: "ownerEmail required" });
    if (mongoose.connection.readyState === 1) {
      const gym = await Gym.findOne({ ownerEmail: ownerEmail.trim().toLowerCase() });
      return res.json({ success: true, data: gym });
    }
    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/gyms', async (req, res) => {
  try {
    const { ownerEmail } = req.body;
    if (!ownerEmail) return res.status(400).json({ success: false, message: "ownerEmail required" });
    
    if (mongoose.connection.readyState === 1) {
      const updated = await Gym.findOneAndUpdate(
        { ownerEmail: ownerEmail.trim().toLowerCase() },
        req.body,
        { new: true, upsert: true }
      );
      return res.json({ success: true, message: "Gym updated", data: updated });
    }
    res.json({ success: true, message: "Gym updated locally" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Backend Server running on http://localhost:${PORT}`);
  console.log(`📌 Test API Health Check: http://localhost:${PORT}/api/health`);
});
