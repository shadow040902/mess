const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname)));

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/?directConnection=true', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Định nghĩa Schema và Model
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});
const MessageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

app.use(cors());
app.use(bodyParser.json());

// API đăng nhập
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.status(200).json({ message: 'Đăng nhập thành công', email });
  } else {
    res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
  }
});

// API lấy tin nhắn
app.get('/messages', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.status(200).json(messages);
});

// API gửi tin nhắn
app.post('/messages', async (req, res) => {
  const { sender, content } = req.body;
  const message = new Message({ sender, content });
  await message.save();
  res.status(201).json({ message: 'Tin nhắn đã được gửi' });
});

// API đăng ký
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = new User({ firstName, lastName, email, password });
  await user.save();
  res.status(201).json({ message: 'Đăng ký thành công' });
});

app.listen(3000, () => console.log('Server chạy trên cổng 3000'));