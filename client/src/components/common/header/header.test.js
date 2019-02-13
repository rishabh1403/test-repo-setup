import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('<App />', () => {
  const wrapper = shallow(<Header><span /></Header>);

  it('should render a menu', () => {
    expect(wrapper.find('Menu').length).toBe(1);
  });

  it('should render a div', () => {
    expect(wrapper.find('div').length).toBe(1);
  });

  it('should render passed children', () => {
    expect(wrapper.find('span').length).toBe(1);
  });
});
