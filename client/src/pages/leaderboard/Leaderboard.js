import React, { useState, useEffect } from 'react';
import {
  Grid, GridColumn, GridRow, Header,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import ScoreTable from './ScoreTable';
import {
  getUsersAndPageCount,
  getPersonalScore,
  getPersonalRank,
} from '../../utils/leaderboard_api';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [personalScore, setPersonalScore] = useState('loading...');
  const [personalRank, setPersonalRank] = useState('loading...');
  const [currentPage, setPage] = useState(1);
  const [backNavigation, setBackNavigation] = useState(true);
  const [forwardNavigation, setForwardNavigation] = useState(true);

  const updateList = async () => {
    const [fetchedUsers, fetchedPageCount] = await getUsersAndPageCount({ currentPage });
    setUsers(fetchedUsers);
    setPageCount(fetchedPageCount);
  };

  const getPageInfo = async () => {
    const score = await getPersonalScore();
    setPersonalScore(score);
    const rank = await getPersonalRank();
    setPersonalRank(rank);
  };

  // Runs on Mount & Page change
  useEffect(() => {
    updateList();
  }, [currentPage]);

  // Runs on Mount
  useEffect(() => {
    getPageInfo();
  }, []);

  // Runs after every update to enable or disable navigation buttons
  useEffect(() => {
    if (currentPage === pageCount) {
      setForwardNavigation(false);
    } else {
      setForwardNavigation(true);
    }
    if (currentPage === 1) {
      setBackNavigation(false);
    } else {
      setBackNavigation(true);
    }
  });

  return (
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
              <ScoreTable
                {...{
                  users,
                  pageCount,
                  backNavigation,
                  forwardNavigation,
                  currentPage,
                  setPage,
                }}
              />
            </GridRow>
            <GridRow centered>
              <Header textAlign="center" as="h3">
                {`You: High Score- ${personalScore} Rank- ${personalRank}`}
              </Header>
            </GridRow>
          </Grid>
        </GridColumn>
      </Grid>
    </div>
  );
};

export default Leaderboard;
