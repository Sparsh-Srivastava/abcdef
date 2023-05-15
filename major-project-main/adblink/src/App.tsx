import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { Home, Landing, Onboard, Posts } from "./modules";
import { APIService } from "./shared/services/apiService";
import { AuthStore as AuthStoreContext } from "./shared/stores";
import PrivateRoute from "./shared/utils/PrivateRoute";

const lightTheme = {
  "--primary": "#3AABA7",
  "--secondary": "#E35E6A",
  "--tertiary": "#FBCD44",
  "--text-primary": "#000000",
  "--background-primary": "#ffffff",
  "--background-secondary": "#F0F4F3",
} as React.CSSProperties;

const darkTheme = {
  "--primary": "#3AABA7",
  "--secondary": "#E35E6A",
  "--tertiary": "#FBCD44",
  "--text-primary": "#ffffff",
  "--background-primary": "#000000",
  "--background-secondary": "#4E4E4E",
} as React.CSSProperties;

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const authStore = useContext(AuthStoreContext);
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    (async () => {
      try {
        await APIService.getInstance().getUser();
        authStore.setAuthenticated(true);
      } catch (error) {
        console.error(error);
        authStore.removeAuthorization();
      } finally {
        setLoading(false);
      }
    })();
  }, [authStore]);

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <div className="App" style={theme === "dark" ? darkTheme : lightTheme}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* @ts-ignore */}
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <PrivateRoute redirectTo="/onboard" path="/home" loading={loading}>
            <Home />
          </PrivateRoute>
          <PrivateRoute redirectTo="/onboard" path="/posts" loading={loading}>
            <Posts />
          </PrivateRoute>
          <Route path="/onboard">
            <Onboard />
          </Route>
          <Redirect to={{ pathname: "/" }} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default observer(App);
