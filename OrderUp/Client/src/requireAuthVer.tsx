import { RouteComponentProps } from "react-router-dom";
import React from "react";
import { UserRoleType } from "./globalTypes";
import apiClient from "./api/apiClient";

type State = { redirect: boolean };

export const requireAuthVer = (requiredAccessLevels: Array<UserRoleType>) => <
  Props extends Object
>(
  Component: React.ComponentType<Props>
) => {
  class AuthenticatedComponent extends React.Component<
    Props & RouteComponentProps
  > {
    state: State = { redirect: false };

    handleAuthenticateAndVerifyWebSession = async () => {
      // if there's no session id, the user needs to login
      if (!apiClient.webSessionId) {
        return this.props.history.push("/login");
      }

      // check if the web session is authenticated
      const authenticatedUserResponse = await apiClient.getAuthenticateAndVerifyWebSession();
      if (authenticatedUserResponse.responseType === "401") {
        return this.props.history.push("/401");
      } else if (authenticatedUserResponse.responseType === "400") {
        return this.props.history.push("/400");
      } else {
        // if the user is not an administrator then the user needs to be verified
        if (
          authenticatedUserResponse.responseData.userRole !== "administrator" &&
          authenticatedUserResponse.responseData.verified === null
        ) {
          return this.props.history.push("/401");
        }

        // if the user's role isn't one of the required access levels, then they
        // don't have the top secret clearance to see this page
        if (
          !requiredAccessLevels.find(
            (access_level) =>
              authenticatedUserResponse.responseData.userRole === access_level
          )
        ) {
          // note - for some crazy reason, history.back() isn't recognized as a function, possibly due to
          // incompatibilities between react-router v4 and the browser's history implementation
          return this.props.history.push("/401");
        }
      }
    };

    componentDidMount = () => {
      this.handleAuthenticateAndVerifyWebSession();
    };

    render = () => {
      return <Component {...this.props} />;
    };
  }
  return AuthenticatedComponent;
};
