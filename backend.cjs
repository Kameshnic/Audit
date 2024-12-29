require('dotenv').config();
const express = require('express');
const mong = require('mongoose')
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mong.connect(process.env.MONGOURL)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

const userSchema = new mong.Schema({
    username: String,
    password: String,
    name: String,
    contact_info: String
  });
  
const User = mong.model('User', userSchema);

const auditSchema = new mong.Schema({
  name: String,
  location: String,
  coordinates: [String],
  time: String
});

const Audit = mong.model('Audit', auditSchema);

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ found: true });
        } else {
            res.status(404).json({ found: false });
        }
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/audits', async (req, res) => {
  try {
      const audit = await Audit.find();
      if (audit) {
          res.status(200).json(audit);
      } else {
          res.status(404).json("no");
      }
  } 
  catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
  }
});

app.post('/insert_user', async (req, res) => {
    const { username, password, name, contact_info } = req.body;
    if (!username || !password || !name || !contact_info) {
      return res.status(400).json({ message: 'Please provide all fields (username, password, name, contact_info)' });
    }
    try {
      const newUser = new User({ username, password, name, contact_info });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  
  app.post('/insert_audit', async (req, res) => {
    const { name, location, coordinates, time } = req.body;
    if (!name || !location || !coordinates || !time) {
      return res.status(400).json({ 
        message: 'Please provide all fields (name, location, coordinates, time)' 
      });
    }
    try {
      const newAudit = new Audit({ name, location, coordinates, time });
      await newAudit.save();
      res.status(201).json({ 
        message: 'Audit created successfully', 
        audit: newAudit 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating audit' });
    }
  });  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});