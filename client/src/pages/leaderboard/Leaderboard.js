import React from 'react';
import {
  Grid, GridColumn, GridRow, Header,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import ScoreTable from './ScoreTable';

const users = [
  { name: 'first', score: 40, rank: 1 },
  { name: 'second', score: 30, rank: 2 },
  { name: 'third', score: 20, rank: 3 },
];

const pageCount = 5;

const Leaderboard = () => (
  <div className="leaderboard">
    <Grid centered padded columns={1}>
      <GridColumn computer={6} tablet={8} mobile={14}>
        <Grid divided>
          <GridRow centered>
            <Header textAlign="center" as="h1">
              Leaderboard
            </Header>
          </GridRow>
          <GridRow>
            <ScoreTable {...{ users, pageCount }} />
          </GridRow>
          <GridRow centered>
            <Header textAlign="center" as="h1">
              Your High Score: 40
            </Header>
          </GridRow>
        </Grid>
      </GridColumn>
    </Grid>
  </div>
);

export default Leaderboard;
