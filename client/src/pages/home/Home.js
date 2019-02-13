import React from 'react';
import { Grid } from 'semantic-ui-react';
import StyledButton from '../../components/common/styledButton/StyledButton';
import AlignedColumn from '../../components/common/alignedColumn/AlignedColumn';
import './home.css';

const Home = () => (
  <div className="home-container">
    <Grid>
      <Grid.Row centered columns={4}>
        <AlignedColumn />
        <AlignedColumn align="center">
          <StyledButton link inverted text="Sign Up" url="/signup" />
        </AlignedColumn>
        <AlignedColumn align="center">
          <StyledButton link inverted text="Sign In" url="/signin" />
        </AlignedColumn>
        <AlignedColumn />
      </Grid.Row>
      <Grid.Row centered columns={1}>
        <AlignedColumn align="center">
          <StyledButton link inverted text="Play as Guest" url="/guest" />
        </AlignedColumn>
      </Grid.Row>
    </Grid>
  </div>
);

export default Home;
