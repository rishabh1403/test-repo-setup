import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu } from 'semantic-ui-react';
import getUniqueKey from '../../utils/unique_key';

const PaginationMenu = ({ pageCount }) => (
  <Menu pagination>
    <Menu.Item as="a" icon>
      <Icon name="chevron left" />
    </Menu.Item>
    {[...new Array(pageCount)].map((_, index) => (
      <Menu.Item key={getUniqueKey({})} as="a">
        {index + 1}
      </Menu.Item>
    ))}
    <Menu.Item as="a" icon>
      <Icon name="chevron right" />
    </Menu.Item>
  </Menu>
);

PaginationMenu.propTypes = {
  pageCount: PropTypes.number.isRequired,
};

export default PaginationMenu;
