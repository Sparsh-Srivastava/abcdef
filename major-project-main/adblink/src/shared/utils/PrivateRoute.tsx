import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Redirect, Route } from "react-router-dom";
import { Loading } from "../components";
import { AuthStore as AuthStoreContext } from "../stores";

interface Props {
  children: React.ReactNode;
  path: string;
  redirectTo: string;
  loading: boolean;
}

const PrivateRoute = (props: Props) => {
  const authStore = useContext(AuthStoreContext);

  useEffect(() => {
    console.log(
      "At private route - authenticated -> ",
      authStore.authenticated
    );
  }, [authStore]);

  return props.loading ? (
    <Loading />
  ) : (
    <Route
      path={props.path}
      // @ts-ignore
      render={() => {
        return authStore.authenticated ? (
          props.children
        ) : (
          <Redirect
            to={{
              pathname: props.redirectTo,
            }}
          />
        );
      }}
    ></Route>
  );
};

export default observer(PrivateRoute);
