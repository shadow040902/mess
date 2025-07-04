// Lấy tên người dùng từ localStorage hoặc prompt
let sender = localStorage.getItem('chatUser') || prompt('Nhập tên của bạn:');
localStorage.setItem('chatUser', sender);

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');

// Hiển thị tin nhắn từ CSDL
async function loadMessages() {
  const res = await fetch('http://localhost:3000/messages');
  const messages = await res.json();
  messagesDiv.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message' + (msg.sender === sender ? ' me' : '');
    div.textContent = `${msg.sender}: ${msg.content}`;
    messagesDiv.appendChild(div);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
loadMessages();
setInterval(loadMessages, 2000); // Tự động reload tin nhắn

// Gửi tin nhắn mới
sendBtn.onclick = async () => {
  const content = messageInput.value.trim();
  if (!content) return;
  await fetch('http://localhost:3000/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, content })
  });
  messageInput.value = '';
  loadMessages();
};

// Emoji picker
emojiBtn.onclick = () => {
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
};
emojiPicker.addEventListener('emoji-click', e => {
  messageInput.value += e.detail.unicode;
  emojiPicker.style.display = 'none';
});
