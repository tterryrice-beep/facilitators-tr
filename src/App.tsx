import { Layout } from "./containers/Layout";
import { Providers } from "./containers/Providers";
import "./App.css";

function App() {
  return (
    <>
      <Providers>
        <Layout />
      </Providers>
    </>
  );
}

export default App;
