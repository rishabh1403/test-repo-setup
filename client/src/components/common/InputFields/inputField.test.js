import React from 'react';
import { shallow } from 'enzyme';
import { Form } from 'semantic-ui-react';
import InputField from './InputField';

describe('<InputField />', () => {
  const wrapper = shallow(<InputField placeholder="dummy" />);

  it('should render a Input Field', () => {
    expect(wrapper.find(Form.Input).length).toBe(1);
  });

  it('should render with the supplied placeholder', () => {
    expect(wrapper.find(Form.Input).props().placeholder).toBe('dummy');
  });

  it('should render with the text type by deafult', () => {
    expect(wrapper.find(Form.Input).props().type).toBe('text');
  });

  it('should render with the email type if type is provided', () => {
    const typeWrapper = shallow(<InputField placeholder="dummy" type="email" />);
    expect(typeWrapper.find(Form.Input).props().type).toBe('email');
  });
});
