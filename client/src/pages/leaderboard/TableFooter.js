import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import PaginationMenu from './PaginationMenu';

const TableFooter = ({ pageCount }) => (
  <Table.Row>
    <Table.HeaderCell colSpan="3" textAlign="center">
      <PaginationMenu {...{ pageCount }} />
    </Table.HeaderCell>
  </Table.Row>
);

TableFooter.propTypes = {
  pageCount: PropTypes.number.isRequired,
};

export default TableFooter;
