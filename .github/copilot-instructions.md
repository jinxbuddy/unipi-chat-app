# Copilot Instructions for University of Pisa Chat App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a private Omegle-style video chat application specifically designed for University of Pisa students. The app features:

- Email verification for @studenti.unipi.it domains only
- Anonymous peer-to-peer video/audio chat using WebRTC
- Real-time matchmaking system
- Privacy-focused design with minimal data storage
- React.js frontend with Next.js framework
- Node.js backend with Socket.IO for real-time communication

## Code Guidelines
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement WebRTC for peer-to-peer communication
- Use Tailwind CSS for styling
- Ensure all email validation is server-side
- Maintain user anonymity and privacy
- Implement proper error handling for WebRTC connections
- Use environment variables for sensitive configuration
- Follow GDPR compliance for minimal data storage

## Security Considerations
- Validate @studenti.unipi.it email domains server-side
- Use HTTPS and secure WebSocket connections
- Implement rate limiting to prevent abuse
- Add CAPTCHA for bot protection
- Encrypt all video/audio streams (WebRTC default)
- Never store personal data beyond email verification

## Architecture Notes
- Frontend handles WebRTC peer connections
- Backend manages user queue and matchmaking
- Socket.IO for signaling between peers
- STUN servers for NAT traversal
- Minimal database usage for privacy
