import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('<App />', () => {
  const wrapper = shallow(<App />);

  it('should render the Browser Router', () => {
    expect(wrapper.find('BrowserRouter').length).toBe(1);
  });

  describe('rendered browser router component', () => {
    it('should render header component', () => {
      const headerWrapper = wrapper.find('BrowserRouter').find('Header');
      expect(headerWrapper.length).toBe(1);
    });
  });

  describe('rendered header cpomponent', () => {
    it('should render switch component', () => {
      const switchWrapper = wrapper.find('Header').find('Switch');
      expect(switchWrapper.length).toBe(1);
    });
  });
});
