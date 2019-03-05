import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StyledButton = ({
  url, link, text, ...props
}) => {
  const buttonProps = {
    to: url,
    as: link ? Link : Button,
  };
  return (
    <Button {...buttonProps} {...props}>
      {text}
    </Button>
  );
};

StyledButton.defaultProps = {
  url: '',
  size: 'massive',
  color: 'violet',
  link: false,
  fluid: false,
  inverted: false,
  onClick: null,
};

StyledButton.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  link: PropTypes.bool,
  fluid: PropTypes.bool,
  inverted: PropTypes.bool,
  onClick: PropTypes.func,
};
export default StyledButton;
