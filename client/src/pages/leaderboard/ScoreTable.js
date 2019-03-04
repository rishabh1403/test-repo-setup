import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import TableFooter from './TableFooter';
import TableBody from './TableBody';

const ScoreTable = ({ users, ...props }) => (
  <Table celled size="large" color="teal" unstackable fixed>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell textAlign="center">Rank</Table.HeaderCell>
        <Table.HeaderCell textAlign="center">Username</Table.HeaderCell>
        <Table.HeaderCell textAlign="center">Score</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <TableBody {...{ users }} />
    </Table.Body>
    <Table.Footer>
      <TableFooter {...props} />
    </Table.Footer>
  </Table>
);

ScoreTable.defaultProps = {
  users: [],
};

ScoreTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

export default ScoreTable;
