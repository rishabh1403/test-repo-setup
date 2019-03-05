import React, { useState } from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import StyledButton from '../../components/common/styledButton/StyledButton';
import 'semantic-ui-css/semantic.min.css';
import './dashboard.css';
import Modal from './modal/Modal';

const Dashboard = () => {
  const [isModalVisible, setModalVisibility] = useState(false);
  const [modalType, setModalType] = useState('create');

  const showCreateGame = () => {
    setModalType('create');
    setModalVisibility(true);
  };

  const showJoinGame = () => {
    setModalType('join');
    setModalVisibility(true);
  };
  return (
    <React.Fragment>
      <div className="dashboard-container">
        <Grid centered columns={2} verticalAlign="middle">
          <Grid.Row>
            <GridColumn textAlign="center">
              <StyledButton inverted text="Create Game" onClick={showCreateGame} />
            </GridColumn>
            <GridColumn textAlign="center">
              <StyledButton inverted text="Join Game" onClick={showJoinGame} />
            </GridColumn>
          </Grid.Row>
          <Grid.Row>
            <GridColumn textAlign="center">
              <StyledButton link inverted text="Leaderboard" url="/leaderboard" />
            </GridColumn>
          </Grid.Row>
        </Grid>
      </div>
      <Modal
        {...{ isModalVisible, modalType }}
        closeModal={() => {
          setModalVisibility(false);
        }}
      />
    </React.Fragment>
  );
};

export default Dashboard;
