import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'semantic-ui-react';
import Modal from './Modal';

describe('<Modal />', () => {
  const closeModal = jest.fn();
  const isModalVisible = true;
  const modalType = 'create';
  const wrapper = shallow(<Modal {...{ closeModal, isModalVisible, modalType }} />);

  it('should close Modal on Click', () => {
    wrapper.find(Button).simulate('click');
    expect(closeModal).toBeCalled();
  });
});
