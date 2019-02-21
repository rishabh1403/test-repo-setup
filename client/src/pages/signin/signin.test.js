import React from 'react';
import { shallow } from 'enzyme';
import SignIn from './Signin';
import InputField from '../../components/common/InputFields/InputField';
import PasswordField from '../../components/common/InputFields/PasswordField';
import StyledButton from '../../components/common/styledButton/StyledButton';

describe('<SignIn />', () => {
  const wrapper = shallow(<SignIn />);

  it('should render a User Input Field', () => {
    expect(wrapper.find(InputField).length).toBe(1);
  });

  it('should render a Password Field', () => {
    expect(wrapper.find(PasswordField).length).toBe(1);
  });

  it('should render a sign in button', () => {
    expect(wrapper.find(StyledButton).length).toBe(1);
  });
});
