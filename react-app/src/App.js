import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { ProductConnector } from './product/ProductConnector';
import { Redirect } from 'react-router';
import { dataStore } from './data/datastore'
import { Provider } from "react-redux";
import { AuthProviderImpl } from "./auth/AuthProviderImpl";

function App() {
  return (
    <Provider store={dataStore}>
      <BrowserRouter>
        <AuthProviderImpl>
          <Switch>
            <Route path={["/"]} component={ProductConnector} />
            <Redirect to="/" />
          </Switch>
        </AuthProviderImpl>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
