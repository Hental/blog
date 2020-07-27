import React from 'react';
import App from './App';

// import { render } from 'react-dom';
import { render } from './my_render';

console.log('render app');
render(<App />, document.getElementById('root') as HTMLElement);
