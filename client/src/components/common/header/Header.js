import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './header.css';

export default class Header extends Component {
  state = {
    activeItem: 'home',
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    const { children } = this.props;

    return (
      <div className="main-container">
        <Menu size="massive" fixed="top">
          <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>
            Sneaky Snakes
          </Menu.Item>
        </Menu>
        <div className="container">{children}</div>
      </div>
    );
  }
}

Header.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
