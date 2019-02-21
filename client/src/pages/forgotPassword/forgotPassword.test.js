import React from 'react';
import { shallow } from 'enzyme';
import ForgotPassword from './ForgotPassword';
import StyledButton from '../../components/common/styledButton/StyledButton';
import EmailField from '../../components/common/InputFields/EmailField';

describe('<ForgotPassword />', () => {
  const wrapper = shallow(<ForgotPassword />);

  it('should render two Email Field', () => {
    expect(wrapper.find(EmailField).length).toBe(1);
  });

  it('should render a sign in button', () => {
    expect(wrapper.find(StyledButton).length).toBe(1);
  });
});
