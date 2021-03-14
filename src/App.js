import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, BrowserRouter as HashRouter } from 'react-router-dom';
import store from './store/store';
import Login from './paginas/LogIn';
import Principal from './paginas/principal';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route path="/" component={Login} exact={true}/>
          <Route path="/principal" component={Principal} exact={true}/>
        </Switch>
      </HashRouter>
    </Provider>
  );
}

export default App;
