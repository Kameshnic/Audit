require('dotenv').config();
const express = require('express');
const mong = require('mongoose')
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({ origin: ['http://localhost:5173', 'https://audit-liart.vercel.app'] }));
app.use(express.json());

mong.connect(process.env.MONGOURL)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

const userSchema = new mong.Schema({
    username: String,
    password: String,
    name: String,
    contact_info: String,
    email:String
  });

const User = mong.model('User', userSchema);

const auditSchema = new mong.Schema({
  name: String,
  location: String,
  coordinates: [String],
  time: String,
  regstatus: String,
  registrations: [{
    name:String,
    status:String,
    chat:[String],
  }]
});

const Audit = mong.model('Audit', auditSchema);

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ found: true, id:user._id });
        } else {
            res.status(404).json({ found: false });
        }
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.post('/user_details', async (req, res) => {
  const { id } = req.body;
  try {
      const user = await User.findById(id);
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).send();
      }
  } 
  catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user' });
  }
});

app.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const user = await User.findByIdAndDelete(id);
      if (user) {
          res.status(200).json({ message: 'Audit deleted successfully' });
      } else {
          res.status(404).json({ message: 'Audit not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting audit' });
  }
});

app.post('/insert_user', async (req, res) => {
  const { username, password, name, contact_info,email } = req.body;
  if (!username || !password || !name || !contact_info || !email) {
    return res.status(400).json({ message: 'Please provide all fields (username, password, name, contact_info)' });
  }
  try {
    const newUser = new User({ username, password, name, contact_info,email });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
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
  
  app.post('/insert_audit', async (req, res) => {
    const { name, location, coordinates, time,regstatus,registrations } = req.body;
    if (!name || !location || !coordinates || !time || !regstatus) {
      return res.status(400).json({ 
        message: 'Please provide all fields (name, location, coordinates, time)' 
      });
    }
    try {
      const newAudit = new Audit({ name, location, coordinates, time,regstatus,registrations });
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
  
  app.put('/update_audit/:id', async (req, res) => {
    const { id } = req.params;
    const { newRegistration } = req.body;
    try {
      const audit = await Audit.findById(id);
      if (!audit) {
        return res.status(404).json({ 
          message: 'Audit not found' 
        });
      }
      audit.registrations.push(newRegistration);
      const updatedAudit = await audit.save();
      res.status(200).json({ 
        message: 'Audit updated successfully', 
        audit: updatedAudit 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Error updating audit' 
      });
    }
  });  

  app.put('/update_aureg/:id', async (req, res) => {
    const { id } = req.params;
    const { regstatus } = req.body;
    try {
      const audit = await Audit.findById(id);
      if (!audit) {
        return res.status(404).json({ 
          message: 'Audit not found' 
        });
      }
      audit.regstatus = regstatus;
      const updatedAudit = await audit.save();
      res.status(200).json({ 
        message: 'Audit updated successfully', 
        audit: updatedAudit 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Error updating audit' 
      });
    }
  });  

  app.delete('/delete_audit/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedAudit = await Audit.findByIdAndDelete(id);
      if (!deletedAudit) {
        return res.status(404).json({
          message: 'Audit not found'
        });
      }
      res.status(200).json({
        message: 'Audit deleted successfully',
        audit: deletedAudit
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error deleting audit'
      });
    }
  });  

  app.get('/search_audits', async (req, res) => {
    const { name } = req.query; 
    try {
        const audit = await Audit.find({ 
          "registrations.name": name 
      });
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

  app.put('/update_chat', async (req, res) => {
    const { auditId, registrationId, text } = req.body;
    try {
      const audit = await Audit.findById(auditId);
      if (!audit) {
        return res.status(404).json({ error: 'Audit not found' });
      }
      const registration = audit.registrations.id(registrationId);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      registration.chat.push(text);
      await audit.save();
      res.status(200).json({ message: 'Registration status updated successfully' });
    } catch (error) {
      console.error('Error updating registration status:', error);
      res.status(500).json({ error: 'Failed to update registration status' });
    }
  });

  app.put('/update_registration', async (req, res) => {
    const { auditId, registrationId, status } = req.body;
    try {
      const audit = await Audit.findById(auditId);
      if (!audit) {
        return res.status(404).json({ error: 'Audit not found' });
      }
      const registration = audit.registrations.id(registrationId);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      registration.status = status;
      await audit.save();
      res.status(200).json({ message: 'Registration status updated successfully' });
    } catch (error) {
      console.error('Error updating registration status:', error);
      res.status(500).json({ error: 'Failed to update registration status' });
    }
  });

  app.put('/update_reg',async(req,res) => {
    const { auditId } = req.body;
    try {
      const audit = await Audit.findById(auditId);
      if (!audit) {
        return res.status(404).json({ message: 'Audit not found' });
      }
      audit.registrations = audit.registrations.map((registration) => {
        if (registration.status === 'registered') {
          return { ...registration, status: 'pending' };
        }
        return registration;
      });
      await audit.save();
      res.status(200).json({ message: 'Registrations updated successfully', audit });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/audit/:auditId/registration/:registrationId', async (req, res) => {
    const { auditId, registrationId } = req.params;
    try {
        const audit = await Audit.findOneAndUpdate(
            { _id: auditId },
            { $pull: { registrations: { _id: registrationId } } },
            { new: true }
        );
        if (audit) {
            res.status(200).json(audit);
        } else {
            res.status(404).json({ message: 'Audit not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting registration' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});