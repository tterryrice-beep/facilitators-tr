import { ToastContainer } from "react-toastify";

import { Layout } from "./containers/Layout";
import { Providers } from "./containers/Providers";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Providers>
        <Layout />
      </Providers>
    </>
  );
}

export default App;
