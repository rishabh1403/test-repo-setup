import sgMail from '@sendgrid/mail';
import { sendGridApiKey } from './index';
import { getClientBaseUrlWith } from '../utils/functions';

sgMail.setApiKey(sendGridApiKey);

export const sendWelcomeEmailWithToken = ({ mailTo, token }) => {
  const tokenUrl = getClientBaseUrlWith(`/auth/token/${token}`);
  const msg = {
    to: mailTo,
    from: {
      name: 'Sneaky Snakes Team',
      email: 'sneakysnakesgame@gmail.com',
    },
    subject: 'Email Account Verification',
    html: `<p>
    <div>Hi,</div>
    <div>Glad that you signed up for our App</div>
    <div>Click <a href="${tokenUrl}">here</a> to verify your email account and proceed.</div>
    <div>Please ignore this message if you didn't signup.</div>
    </p>`,
  };
  sgMail.send(msg);
};

export default sgMail;
