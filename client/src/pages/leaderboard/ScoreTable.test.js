import React from 'react';
import { shallow } from 'enzyme';
import { Table } from 'semantic-ui-react';
import ScoreTable from './ScoreTable';
import TableFooter from './TableFooter';
import TableBody from './TableBody';

describe('<ScoreTable />', () => {
  const users = [];
  const pageCount = 5;
  const wrapper = shallow(<ScoreTable {...{ users, pageCount }} />);

  it('should render <Table />', () => {
    expect(wrapper.find(Table).length).toBe(1);
  });

  it('should render <Table.Header />', () => {
    expect(wrapper.find(Table.Header).length).toBe(1);
  });

  it('should render <Table.Row />', () => {
    expect(wrapper.find(Table.Row).length).toBe(1);
  });

  it('should render 3 <Table.HeaderCell />', () => {
    expect(wrapper.find(Table.HeaderCell).length).toBe(3);
  });

  it('should render <TableBody />', () => {
    expect(wrapper.find(TableBody).length).toBe(1);
  });

  it('should pass props to <TableBody />', () => {
    expect(wrapper.find(TableBody).props()).toHaveProperty('users');
  });

  it('should render <TableFooter />', () => {
    expect(wrapper.find(TableFooter).length).toBe(1);
  });

  it('should pass props to <TableFooter />', () => {
    expect(wrapper.find(TableFooter).props()).toHaveProperty('pageCount');
  });
});
