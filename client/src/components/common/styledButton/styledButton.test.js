import React from 'react';
import { shallow } from 'enzyme';
import StyledButton from './StyledButton';

describe('<StyledButton />', () => {
  const text = 'test';
  const url = '/home';
  const wrapper = shallow(<StyledButton text={text} url={url} />);

  it('should render a Button', () => {
    expect(wrapper.find('Button').length).toBe(1);
  });

  it('should render a Button with supplied text', () => {
    expect(wrapper.find('Button').props().children).toBe(text);
  });

  it('should render a Button with supplied url as its link', () => {
    expect(wrapper.find('Button').props().to).toBe(url);
  });
});
