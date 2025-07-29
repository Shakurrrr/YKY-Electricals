import nodemailer from 'nodemailer';


// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send booking notification
const sendBookingNotification = async (booking) => {
  try {
    const transporter = createTransporter();

    const statusText = booking.status === 'approved' ? 'Approved' : 'Rejected';
    const statusColor = booking.status === 'approved' ? '#10B981' : '#EF4444';

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@ykyelectricals.com',
      to: booking.email,
      subject: `Booking ${statusText} - YKY Electricals`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking ${statusText}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">YKY Electricals</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Electrical Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: ${statusColor}; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
              <h2 style="margin: 0; font-size: 24px;">Booking ${statusText}</h2>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${booking.name},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your service booking request has been <strong>${booking.status}</strong>.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Booking Details:</h3>
              <p style="margin: 8px 0;"><strong>Service Type:</strong> ${booking.service_type}</p>
              <p style="margin: 8px 0;"><strong>Preferred Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString()}</p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${booking.phone}</p>
            </div>
            
            ${booking.admin_comment ? `
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1e40af;">Message from YKY Electricals:</h4>
                <p style="margin-bottom: 0; color: #1e40af;">${booking.admin_comment}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+15551234567" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Call Us: +1 (555) 123-4567
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Thank you for choosing YKY Electricals<br>
              Professional electrical services you can trust
            </p>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking notification sent to ${booking.email}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send contact confirmation
const sendContactConfirmation = async (contact) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@ykyelectricals.com',
      to: contact.email,
      subject: 'Thank you for contacting YKY Electricals',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for contacting us</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">YKY Electricals</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Electrical Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1e40af; margin-top: 0;">Thank you for reaching out!</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${contact.name},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We have received your message and will get back to you within 24 hours.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Your Message:</h3>
              <p style="margin-bottom: 0; font-style: italic;">"${contact.message}"</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; margin-bottom: 15px;">Need immediate assistance?</p>
              <a href="tel:+15551234567" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Call Us: +1 (555) 123-4567
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Thank you for choosing YKY Electricals<br>
              Professional electrical services you can trust
            </p>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact confirmation sent to ${contact.email}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export { sendBookingNotification, sendContactConfirmation };
