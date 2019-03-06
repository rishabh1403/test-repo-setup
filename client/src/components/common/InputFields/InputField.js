import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const InputField = props => <Form.Input {...props} />;
InputField.defaultProps = {
  fluid: false,
  icon: null,
  iconPosition: null,
  type: 'text',
};

InputField.propTypes = {
  fluid: PropTypes.bool,
  icon: PropTypes.string,
  iconPosition: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};
export default InputField;
