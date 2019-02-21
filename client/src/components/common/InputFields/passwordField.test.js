import React from 'react';
import { shallow } from 'enzyme';
import PasswordField from './PasswordField';
import InputField from './InputField';

describe('<PasswordField />', () => {
  const wrapper = shallow(<PasswordField placeholder="dummy" />);

  it('should render a Input Field', () => {
    expect(wrapper.find(InputField).length).toBe(1);
  });

  it('should render with the supplied placeholder', () => {
    expect(wrapper.find(InputField).props().placeholder).toBe('dummy');
  });

  it('should render with the password type', () => {
    expect(wrapper.find(InputField).props().type).toBe('password');
  });
});
