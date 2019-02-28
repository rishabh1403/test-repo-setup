import sgMail from '@sendgrid/mail';
import { sendGridApiKey } from './index';

sgMail.setApiKey(sendGridApiKey);

export default sgMail;
