const dotenv=require('dotenv')
dotenv.config()
const express = require('express');
const app = express()
const {MongoClient}= require('mongodb')
const port = process.env.PORT || 3000;
const bodyparser=require('body-parser')
const cors=require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
app.use(bodyparser.json())
app.use(cors())

const url=process.env.MONGO_URI
const client=new MongoClient(url)
client.connect()


const dbName=process.env.DB_NAME;


// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }
        const db = client.db(dbName);
        const users = db.collection('users');

        const existing = await users.findOne({ username });
        if (existing) return res.status(400).json({ success: false, message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        await users.insertOne({ username, password: hashed });
        res.json({ success: true, message: 'Registered! Please log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = client.db(dbName);
        const user = await db.collection('users').findOne({ username });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id.toString(), username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET — this user's passwords
app.get('/', auth, async (req, res) => {
    try {
        const db = client.db(dbName);
        const items = await db.collection('passwords').find({ userId: req.user.id }).toArray();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST — save a password
app.post('/', auth, async (req, res) => {
    try {
        const db = client.db(dbName);
        const data = { ...req.body, userId: req.user.id };
        const result = await db.collection('passwords').insertOne(data);
        res.send({ success: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE — remove a password
app.delete('/', auth, async (req, res) => {
    try {
        const db = client.db(dbName);
        const result = await db.collection('passwords').deleteOne({ id: req.body.id, userId: req.user.id });
        res.send({ success: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})