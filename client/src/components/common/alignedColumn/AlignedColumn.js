import React from 'react';
import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AlignedColumn = ({ children, align }) => (
  <Grid.Column textAlign={align}>
    {children}
  </Grid.Column>
);

AlignedColumn.defaultProps = {
  children: [],
  align: 'left',
};

AlignedColumn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  align: PropTypes.string,
};
export default AlignedColumn;
