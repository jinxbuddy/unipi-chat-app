# UniPi Chat - Private Video Chat for University of Pisa Students

A secure, anonymous video chat application exclusively for verified University of Pisa students. Connect with fellow students for study sessions, language practice, or casual conversations.

## 🎯 Features

- **Email Verification**: Only @studenti.unipi.it emails allowed
- **Anonymous Chat**: No personal data stored, users get random anonymous names
- **WebRTC Video/Audio**: Peer-to-peer encrypted communication
- **Real-time Matchmaking**: Automatic pairing with available students
- **Safety Features**: Report system and quick disconnect options
- **Privacy-First**: GDPR compliant with minimal data storage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Frontend (Next.js + React)
- Modern React with TypeScript
- Tailwind CSS for styling
- WebRTC for peer-to-peer video/audio
- Socket.IO client for real-time communication
- Responsive design with mobile support

### Backend (Node.js + Express)
- Express.js REST API
- Socket.IO for real-time signaling
- Email verification system
- Rate limiting and security middleware
- In-memory storage (easily replaceable with database)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Start the development environment**:
   ```bash
   npm run dev:full
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:3001

### Alternative: Start services separately

**Frontend**:
```bash
npm run dev
```

**Backend**:
```bash
npm run server
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Frontend
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_STUN_SERVERS=stun:stun.l.google.com:19302

# Backend (create server/.env)
PORT=3001
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## 📱 Usage

1. **Email Verification**: 
   - Enter your @studenti.unipi.it email
   - Check your email for the verification code
   - Enter the 6-digit code to verify

2. **Start Chatting**:
   - Click "Start Chat" to join the queue
   - Wait to be matched with another student
   - Enjoy your anonymous video chat!

3. **Safety Features**:
   - Use "Skip" to find a new partner
   - Use "Report" for inappropriate behavior
   - Use "End Chat" to disconnect

## 🔒 Security Features

- **Email Domain Validation**: Server-side validation for @studenti.unipi.it
- **Rate Limiting**: Prevents spam and abuse
- **CAPTCHA Ready**: Easy to integrate for additional bot protection
- **Encrypted Connections**: WebRTC provides encrypted peer-to-peer communication
- **No Data Storage**: Minimal personal data retention
- **Anonymous Names**: Random generated names for privacy

## 🛡️ Privacy & Safety

- **No Recording**: Conversations are not recorded or stored
- **Anonymous Identity**: Users only see randomly generated names
- **Temporary Sessions**: All session data is ephemeral
- **Report System**: Built-in reporting for inappropriate behavior
- **GDPR Compliant**: Minimal data collection and processing

## 🔧 Technical Details

### WebRTC Configuration
- Uses Google's public STUN servers by default
- Supports TURN servers for users behind strict firewalls
- Automatic fallback for connection issues

### Supported Browsers
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Mobile Support
- Responsive design works on all screen sizes
- Touch-friendly controls
- Mobile camera/microphone access

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Heroku/Railway/Render)
```bash
cd server
npm start
```

### Environment Variables for Production
Update the following for production:
- `NEXT_PUBLIC_SOCKET_URL`: Your backend URL
- `CLIENT_URL`: Your frontend URL  
- `NODE_ENV=production`

## 📊 Monitoring

The server includes basic monitoring endpoints:
- `GET /api/health` - Health check
- Console logging for connections and errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is intended for educational use at the University of Pisa.

## 🎓 University of Pisa

Made with ❤️ for the University of Pisa student community.

**Disclaimer**: This is an independent project and is not officially affiliated with the University of Pisa.
