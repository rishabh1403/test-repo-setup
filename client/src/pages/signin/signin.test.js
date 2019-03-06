import React from 'react';
import { shallow } from 'enzyme';
import SignIn from './Signin';
import PasswordField from '../../components/common/InputFields/PasswordField';
import StyledButton from '../../components/common/styledButton/StyledButton';
import EmailField from '../../components/common/InputFields/EmailField';

describe('<SignIn />', () => {
  const wrapper = shallow(<SignIn />);

  it('should render a Email Input Field', () => {
    expect(wrapper.find(EmailField).length).toBe(1);
  });

  it('should render a Password Field', () => {
    expect(wrapper.find(PasswordField).length).toBe(1);
  });

  it('should render a sign in button', () => {
    expect(wrapper.find(StyledButton).length).toBe(1);
  });
});
