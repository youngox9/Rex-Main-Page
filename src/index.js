import React from 'react';
import { render } from 'react-dom';
import App from './App';


function Main(props) {
    return <App />;
}

render(<Main />, document.getElementById('app'));
