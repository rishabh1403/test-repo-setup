import React from 'react';
import { shallow } from 'enzyme';
import {
  Grid, GridColumn, GridRow, Header,
} from 'semantic-ui-react';
import Leaderboard from './Leaderboard';
import ScoreTable from './ScoreTable';

describe('<Leaderboard /> Page', () => {
  const wrapper = shallow(<Leaderboard />);

  it('should render a div', () => {
    expect(wrapper.find('div').length).toBe(1);
  });

  it('should render 2 <Grid />', () => {
    expect(wrapper.find(Grid).length).toBe(2);
  });

  it('should render <GridColumn />', () => {
    expect(wrapper.find(GridColumn).length).toBe(1);
  });

  it('should render 3 <GridRow />', () => {
    expect(wrapper.find(GridRow).length).toBe(3);
  });

  it('should render 2 <Header />', () => {
    expect(wrapper.find(Header).length).toBe(2);
  });

  it('should render <ScoreTable />', () => {
    expect(wrapper.find(ScoreTable).length).toBe(1);
  });

  it('should pass users as props to <ScoreTable />', () => {
    expect(wrapper.find(ScoreTable).props()).toHaveProperty('users');
  });

  it('should pass pageCount as props to <ScoreTable />', () => {
    expect(wrapper.find(ScoreTable).props()).toHaveProperty('pageCount');
  });
});
