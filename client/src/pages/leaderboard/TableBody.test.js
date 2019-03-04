import React from 'react';
import { shallow } from 'enzyme';
import { Table } from 'semantic-ui-react';
import TableBody from './TableBody';

describe('<TableBody />', () => {
  const wrapper = shallow(<TableBody />);
  const rowCount = 10;
  const cellPerRowCount = 3;

  it('should render 10 <Table.Row />', () => {
    expect(wrapper.find(Table.Row).length).toBe(rowCount);
  });

  it('should render 3 <Table.Cell /> for each Row', () => {
    expect(wrapper.find(Table.Cell).length).toBe(rowCount * cellPerRowCount);
  });
});
