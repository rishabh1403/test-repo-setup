import React from 'react';
import { shallow } from 'enzyme';
import EmailField from './EmailField';
import InputField from './InputField';

describe('<EmailField />', () => {
  const wrapper = shallow(<EmailField placeholder="dummy" />);

  it('should render a Input Field', () => {
    expect(wrapper.find(InputField).length).toBe(1);
  });

  it('should render with the supplied placeholder', () => {
    expect(wrapper.find(InputField).props().placeholder).toBe('dummy');
  });

  it('should render with the email type', () => {
    expect(wrapper.find(InputField).props().type).toBe('email');
  });
});
