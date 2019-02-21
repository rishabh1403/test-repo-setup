import React from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';

const PasswordField = ({ placeholder }) => (
  <InputField type="password" fluid icon="lock" iconPosition="left" placeholder={placeholder} />
);

PasswordField.propTypes = {
  placeholder: PropTypes.string.isRequired,
};
export default PasswordField;
