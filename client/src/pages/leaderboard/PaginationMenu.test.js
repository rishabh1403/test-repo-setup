import React from 'react';
import { shallow } from 'enzyme';
import { Menu, Icon } from 'semantic-ui-react';
import PaginationMenu from './PaginationMenu';

describe('<PaginationMenu /> for Leaderboard Table', () => {
  const pageCount = 5;
  const wrapper = shallow(<PaginationMenu {...{ pageCount }} />);

  it('should render <Menu />', () => {
    expect(wrapper.find(Menu).length).toBe(1);
  });

  it('should render specified <Menu.Item />', () => {
    const navigationButtonCount = 2;
    const totalMenuItems = pageCount + navigationButtonCount;
    expect(wrapper.find(Menu.Item).length).toBe(totalMenuItems);
  });

  it('should render two <Icon />', () => {
    expect(wrapper.find(Icon).length).toBe(2);
  });
});
