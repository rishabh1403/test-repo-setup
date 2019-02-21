import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StyledButton = ({
  text, url, size, color, link, inverted, fluid,
}) => {
  const buttonProps = {
    text,
    fluid,
    size,
    color,
    to: url,
    inverted,
    as: link ? Link : Button,
  };
  return (
    <Button {...buttonProps}>
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
};

StyledButton.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  link: PropTypes.bool,
  fluid: PropTypes.bool,
  inverted: PropTypes.bool,
};
export default StyledButton;
