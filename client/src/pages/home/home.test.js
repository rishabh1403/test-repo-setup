import React from 'react';
import { shallow } from 'enzyme';
import { Grid } from 'semantic-ui-react';
import CenterColumn from '../../components/common/alignedColumn/AlignedColumn';
import Home from './Home';

describe('<Home />', () => {
  const wrapper = shallow(<Home />);

  it('should render a div', () => {
    expect(wrapper.find('div').length).toBe(1);
  });

  it('should render a grid', () => {
    expect(wrapper.find(Grid).length).toBe(1);
  });

  it('should render a two grid rows', () => {
    expect(wrapper.find(Grid.Row).length).toBe(2);
  });

  it('should render a five centered columns', () => {
    expect(wrapper.find(CenterColumn).length).toBe(5);
  });
});
