import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import getUniqueKey from '../../utils/unique_key';

const TableBody = ({ users }) => {
  let firstTenUsers = users;
  const LIST_LENGTH = 10;
  // If users array length is less than required, fill it with empty string
  if (users.length <= LIST_LENGTH) {
    const emptyLength = LIST_LENGTH - users.length;
    const emptyUsersArray = [...new Array(emptyLength)].map(() => ({
      name: '',
      score: '',
      rank: '_',
    }));
    firstTenUsers = [...users, ...emptyUsersArray];
  }

  return firstTenUsers.map(user => (
    <Table.Row key={getUniqueKey(user)}>
      <Table.Cell textAlign="center">{user.rank}</Table.Cell>
      <Table.Cell textAlign="center">{user.name}</Table.Cell>
      <Table.Cell textAlign="center">{user.score}</Table.Cell>
    </Table.Row>
  ));
};

TableBody.defaultProps = {
  users: [],
};

TableBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

export default TableBody;
