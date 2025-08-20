require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const keywordDetector = require('./keyword_detector.js')
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.use(express.static(path.join(__dirname)))

io.on('connection', function (socket) {
  socket.memory = [];
  console.log('User connected', socket.id)

  socket.on('user_message', async function (msg) {
    if (!msg) return
    console.log('User said:', msg)
    
    try {
      const reply = await keywordDetector.getResponse(msg.toString())
      
      const greetingPatterns = ['hello', 'hi', 'hey', 'greetings', 'welcome'];
      const goodbyePatterns = ['bye', 'goodbye', 'farewell', 'see you', 'exit'];
      const thankPatterns = ['thank', 'thanks', 'appreciate'];
      
      const isSpecial = greetingPatterns.some(p => msg.toLowerCase().includes(p)) ||
                       goodbyePatterns.some(p => msg.toLowerCase().includes(p)) ||
                       thankPatterns.some(p => msg.toLowerCase().includes(p));
      
      let fullReply = reply;
      if (!isSpecial) {
        const suggestion = await keywordDetector.getSuggestions(msg.toString());
        fullReply = reply + '\n\n' + suggestion;
      }

      socket.emit('chatbot_reply', fullReply)
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('chatbot_reply', 'Sorry, I encountered an error. Please try again.')
    }
  })

  socket.on('disconnect', function () {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = 3005
server.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`)
})