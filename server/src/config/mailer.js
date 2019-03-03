import sgMail from '@sendgrid/mail';
import { sendGridApiKey, isProd, isStag } from './index';
import { getClientBaseUrlWith } from '../utils/functions';

sgMail.setApiKey(sendGridApiKey);

const sendMail = ({ to, subject, html }) => {
  const from = {
    name: 'Sneaky Snakes Team',
    email: 'sneakysnakesgame@gmail.com',
  };
  if (isProd && isStag) {
    sgMail.send({
      to,
      from,
      subject,
      html,
    });
  }
};

export const sendWelcomeEmailWithToken = ({ mailTo, token }) => {
  const url = getClientBaseUrlWith(`/confirmUser/token/${token}`);
  sendMail({
    to: mailTo,
    subject: 'Reset Password',
    html: `<p>
    <div>Hi,</div>
    <div>Glad that you signed up for our App</div>
    <div>Click <a href="${url}">here</a> to verify your email account and proceed.</div>
    <div>Please ignore this message if you didn't signup.</div>
    </p>`,
  });
};

export const sendResetPasswordEmailWithToken = ({ mailTo, token }) => {
  const url = getClientBaseUrlWith(`/resetPassword/token/${token}`);
  sendMail({
    to: mailTo,
    subject: 'Reset Password',
    html: `<p>
    <div>Hi,</div>
    <div>Click <a href="${url}">here</a> to reset your password.</div>
    <div>Please ignore this message if you didn't request forget password.</div>
    </p>`,
  });
};

export default sgMail;
