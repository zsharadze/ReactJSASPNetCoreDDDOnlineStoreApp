import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProductConnector } from './product/ProductConnector';
import { dataStore } from './data/datastore'
import { Provider } from "react-redux";
import { AuthProviderImpl } from "./auth/AuthProviderImpl";

function App() {
  return (
    <Provider store={dataStore}>
      <BrowserRouter>
        <AuthProviderImpl>
          <Routes>
            <Route path="*" element={<ProductConnector />} />
            <Route path="/products/*" element={<ProductConnector />} />
          </Routes>
        </AuthProviderImpl>
      </BrowserRouter>
    </Provider >
  );
}

export default App;
