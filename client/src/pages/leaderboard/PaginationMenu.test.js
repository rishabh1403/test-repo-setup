import React from 'react';
import { shallow } from 'enzyme';
import { Menu, Icon } from 'semantic-ui-react';
import PaginationMenu from './PaginationMenu';

describe('<PaginationMenu /> for Leaderboard Table', () => {
  const props = {
    pageCount: 5,
    backNavigation: true,
    forwardNavigation: true,
    currentPage: 2,
    setPage: jest.fn(pageNumber => pageNumber),
  };
  const wrapper = shallow(<PaginationMenu {...props} />);

  it('should render <Menu />', () => {
    expect(wrapper.find(Menu).length).toBe(1);
  });

  it('should render specified <Menu.Item />', () => {
    const navigationButtonCount = 2;
    const { pageCount } = props;
    const totalMenuItems = pageCount + navigationButtonCount;
    expect(wrapper.find(Menu.Item).length).toBe(totalMenuItems);
  });

  it('should render two <Icon />', () => {
    expect(wrapper.find(Icon).length).toBe(2);
  });

  it('should decrement page number on click back', () => {
    const { setPage, currentPage } = props;
    wrapper
      .find(Menu.Item)
      .first()
      .simulate('click');
    expect(setPage).toBeCalledWith(currentPage - 1);
  });

  it('should increment page number on click next', () => {
    const { setPage, currentPage } = props;
    wrapper
      .find(Menu.Item)
      .last()
      .simulate('click');
    expect(setPage).toBeCalledWith(currentPage + 1);
  });

  it('should select desired page on click', () => {
    const { setPage } = props;
    const desiredPageNumber = 2;
    wrapper
      .find(Menu.Item)
      .at(desiredPageNumber)
      .simulate('click');
    expect(setPage).toBeCalledWith(desiredPageNumber);
  });
});
