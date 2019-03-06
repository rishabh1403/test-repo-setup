import React from 'react';
// import PropTypes from 'prop-types';
import InputField from './InputField';

const EmailField = props => (
  <InputField
    type="email"
    autoComplete="off"
    placeholder="Email"
    fluid
    icon="user"
    iconPosition="left"
    {...props}
  />
);

// EmailField.propTypes = {
//   placeholder: PropTypes.string.isRequired,
// };

export default EmailField;
