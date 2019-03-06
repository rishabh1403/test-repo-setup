import React from 'react';
// import PropTypes from 'prop-types';
import InputField from './InputField';

const PasswordField = props => (
  <InputField
    type="password"
    placeholder="password"
    fluid
    icon="lock"
    iconPosition="left"
    {...props}
  />
);

// PasswordField.propTypes = {
//   placeholder: PropTypes.string.isRequired,
// };
export default PasswordField;
