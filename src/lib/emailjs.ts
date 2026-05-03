import emailjs from '@emailjs/browser';

const serviceId = 'service_s481rtv';
const templateId = 'template_771ecr6';
const publicKey = 'L7o6hZUmFJQ_Jbqu0';

if (publicKey) {
  emailjs.init(publicKey);
}

export interface EmailPayload {
  to_email: string;
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

export const emailService = {
  async sendEmail(payload: EmailPayload) {
    try {
      const response = await emailjs.send(serviceId, templateId, {
        to_email: payload.to_email,
        from_name: payload.from_name,
        from_email: payload.from_email,
        subject: payload.subject,
        message: payload.message,
      });
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
};
