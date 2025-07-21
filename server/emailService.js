// Email service configuration
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.setupEmailService();
  }

  setupEmailService() {
    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid for production
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.provider = 'sendgrid';
      console.log('✅ Email service: SendGrid configured');
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      // Use Nodemailer for development/alternative
      this.transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      this.provider = 'nodemailer';
      console.log('✅ Email service: Nodemailer configured');
    } else {
      this.provider = 'console';
      console.log('⚠️ Email service: Console logging (development mode)');
    }
  }

  async sendVerificationEmail(email, code) {
    const subject = 'UniPi Chat - Email Verification';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3182ce; margin-bottom: 10px; }
          .code { font-size: 32px; font-weight: bold; color: #2d3748; background-color: #edf2f7; padding: 15px; border-radius: 8px; text-align: center; letter-spacing: 4px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 UniPi Chat</div>
            <h2>Email Verification</h2>
          </div>
          
          <p>Hello University of Pisa student!</p>
          
          <p>Your verification code for UniPi Chat is:</p>
          
          <div class="code">${code}</div>
          
          <p>This code will expire in 10 minutes for security reasons.</p>
          
          <p>If you didn't request this verification, please ignore this email.</p>
          
          <div class="footer">
            <p>UniPi Chat - Private video chat for University of Pisa students</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      UniPi Chat - Email Verification
      
      Hello University of Pisa student!
      
      Your verification code is: ${code}
      
      This code will expire in 10 minutes.
      
      If you didn't request this verification, please ignore this email.
    `;

    try {
      switch (this.provider) {
        case 'sendgrid':
          await this.sendWithSendGrid(email, subject, htmlContent, textContent);
          break;
        case 'nodemailer':
          await this.sendWithNodemailer(email, subject, htmlContent, textContent);
          break;
        default:
          console.log(`📧 [CONSOLE EMAIL] To: ${email}, Code: ${code}`);
          return true;
      }
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWithSendGrid(email, subject, htmlContent, textContent) {
    const msg = {
      to: email,
      from: {
        email: process.env.EMAIL_FROM || 'noreply@unipi-chat.com',
        name: 'UniPi Chat'
      },
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(`📧 Email sent via SendGrid to: ${email}`);
  }

  async sendWithNodemailer(email, subject, htmlContent, textContent) {
    const mailOptions = {
      from: {
        name: 'UniPi Chat',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: email,
      subject: subject,
      text: textContent,
      html: htmlContent
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`📧 Email sent via Nodemailer to: ${email}`);
  }
}

module.exports = EmailService;
