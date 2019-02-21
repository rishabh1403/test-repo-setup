import React from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';

const EmailField = ({ placeholder }) => (
  <InputField type="email" fluid icon="user" iconPosition="left" placeholder={placeholder} />
);

EmailField.propTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default EmailField;
