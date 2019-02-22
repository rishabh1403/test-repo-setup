import React from 'react';
import PropTypes from 'prop-types';
import { Label, Table } from 'semantic-ui-react';
import getUniqueKey from '../../utils/unique_key';

// To style the Top Scorer's name
const getUserNameStyle = (index, name) => (index === 0 ? (
  <Label size="large" color="orange" tag>
    {name}
  </Label>
) : (
  name
));

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

  return firstTenUsers.map((user, index) => (
    <Table.Row key={getUniqueKey(user)}>
      <Table.Cell textAlign="center">{user.rank}</Table.Cell>
      <Table.Cell textAlign="center">{getUserNameStyle(index, user.name)}</Table.Cell>
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
