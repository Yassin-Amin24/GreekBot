require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
// const bodyParser = require('body-parser'); // Not used, commented out
const fs = require('fs');

const detect_openAI = require('./openai_detector.js');
const { post_data, get_data } = require('./cosmosDB.js');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


app.use(express.static(path.join(__dirname, 'public')));

const filePath = path.join(__dirname, './prompt.json');
let promptData;
try {
  promptData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (error) {
  console.error('Error reading prompt.json:', error);
  promptData = [{ role: 'system', content: 'You are a helpful assistant specializing in Greek mythology.' }];
}


io.on('connection', async function (socket) {
  const ipAddress = socket.handshake.address;
  let fallbackCount = 0;

  try{
    DB_history = await get_data(ipAddress);
  } catch (err) {
    DB_history = null;
  }
  if(!DB_history){
    socket.memory = [JSON.parse(JSON.stringify(promptData))];
  } else {
    console.log("Chat was loaded from DB for the user");
    socket.memory = DB_history;
    socket.emit('message_history', DB_history);
  }
  console.log('User connected:', socket.id, ipAddress);


  socket.on('user_message', async function (msg) {
    if (!msg) return;
    socket.memory.push({ role: 'user',content: msg.toString() });

    const reply = await detect_openAI(socket.memory);

    if (reply.trim().toUpperCase().startsWith("*FALLBACK*")) {
      fallbackCount++;
      console.log("Fallback Case:", fallbackCount);

      if (fallbackCount >= 3) {
        console.log("Hard Reseting");
        fallbackCount = 0;
        socket.memory = [JSON.parse(JSON.stringify(promptData))];
        socket.emit('fallback_hard_reset', 'The conversation was reset due to multiple fallback responses. Please feel free to ask anything related GREEK MYTHOLOGY');
        return;
      }
    } else {
      fallbackCount = 0;
    }  

    socket.emit('chatbot_reply', reply);
    socket.memory.push({ role: 'assistant', content: reply.toString() });
  });

  socket.on('disconnect', async function () {
    try{
      await post_data(ipAddress, socket.memory);
    } catch (err) {
      console.log("Error while saving data to db", err);
    }
    console.log('User disconnected:', socket.id, ipAddress);
  })
});

// Serve the main page for all routes (SPA routing)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all other routes by serving the main page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 8080;
server.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', function(err) {
  console.error('Server failed to start:', err);
  process.exit(1);
});

