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

/*

rm -rf ~/.cache/thumbnails/fail/*
nautilus -q

sysctl kernel.apparmor_restrict_unprivileged_userns
kernel.apparmor_restrict_unprivileged_userns=0


sudo aa-status | grep -i nautilus
sudo aa-status | grep -E 'bwrap|unprivileged'
ls -l /etc/apparmor.d/ | grep -i nautilus
grep -R "profile.*nautilus" /etc/apparmor.d/ 2>/dev/null

*/