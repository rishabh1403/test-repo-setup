import React from 'react';
import { shallow } from 'enzyme';
import { Grid } from 'semantic-ui-react';
import AlignedColumn from './AlignedColumn';

describe('<AlignedColumn />', () => {
  let wrapper = shallow(<AlignedColumn align="center" />);

  it('should render a Column', () => {
    expect(wrapper.find(Grid.Column).length).toBe(1);
  });

  it('should render Column with text aligned to center', () => {
    expect(wrapper.find(Grid.Column).props().textAlign).toBe('center');
  });

  it('should render passed children', () => {
    const child = <span />;
    wrapper = shallow(<AlignedColumn>{child}</AlignedColumn>);
    expect(wrapper.find(Grid.Column).props().children).toBe(child);
  });
});
