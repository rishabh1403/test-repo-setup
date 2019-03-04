import React from 'react';
import { Table } from 'semantic-ui-react';
import PaginationMenu from './PaginationMenu';

const TableFooter = props => (
  <Table.Row>
    <Table.HeaderCell colSpan="3" textAlign="center">
      <PaginationMenu {...props} />
    </Table.HeaderCell>
  </Table.Row>
);

export default TableFooter;
