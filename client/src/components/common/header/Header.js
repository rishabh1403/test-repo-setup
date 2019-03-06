import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './header.css';

export default class Header extends Component {
  state = {
    activeItem: 'home',
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleLogout = () => {
    localStorage.removeItem('authToken');
  };

  render() {
    const { activeItem } = this.state;
    const { children } = this.props;

    return (
      <div className="main-container">
        <Menu size="massive" fixed="top">
          <Link to="/">
            <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleItemClick}>
              Sneaky Snakes
            </Menu.Item>
          </Link>
          {localStorage.getItem('authToken') ? (
            <Link to="/">
              <Menu.Item name="logout" onClick={this.handleLogout}>
                Logout
              </Menu.Item>
            </Link>
          ) : null}
        </Menu>
        <div className="container">{children}</div>
      </div>
    );
  }
}

Header.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
