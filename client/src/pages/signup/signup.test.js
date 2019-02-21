import React from 'react';
import { shallow } from 'enzyme';
import SignUp from './SignUp';
import InputField from '../../components/common/InputFields/InputField';
import PasswordField from '../../components/common/InputFields/PasswordField';
import StyledButton from '../../components/common/styledButton/StyledButton';
import EmailField from '../../components/common/InputFields/EmailField';

describe('<SignUp />', () => {
  const wrapper = shallow(<SignUp />);

  it('should render a User Input Field', () => {
    expect(wrapper.find(InputField).length).toBe(1);
  });

  it('should render two Password Field', () => {
    expect(wrapper.find(PasswordField).length).toBe(2);
  });

  it('should render two Email Field', () => {
    expect(wrapper.find(EmailField).length).toBe(2);
  });

  it('should render a sign in button', () => {
    expect(wrapper.find(StyledButton).length).toBe(1);
  });
});
