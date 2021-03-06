import React from 'react';
import { Switch, Route, BrowserRouter as HashRouter } from 'react-router-dom';
import Login from './paginas/LogIn';
import Principal from './paginas/principal';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" component={Login} exact={true}/>
        <Route path="/principal" component={Principal} exact={true}/>
      </Switch>
    </HashRouter>
  );
}

export default App;
