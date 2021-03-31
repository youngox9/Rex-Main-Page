import React, { useEffect } from 'react';
import styled from 'styled-components';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const Container = styled.div`
  width: 1200px;
  max-width: 100%;
  padding: 0 12px;
  margin: 0 auto;
  perspective: 2000;
  perspective-origin: center top;
  .content {
    /* transform: translate3d(0px, 5%, 12px) skew(0deg, -4deg) */
  }
`;
function Main() {
  return (
    <div>
      <Link to="/gallery">Gallery</Link>
      <Link to="/Profile">Profile</Link>
      <Link to="/Management">Management</Link>
    </div>
  );
}

export default Main;
