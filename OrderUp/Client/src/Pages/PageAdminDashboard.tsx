import { compose } from "lodash/fp";
import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import apiClient from "../api/apiClient";
import { UserType } from "../globalTypes";
import { requireAuthVer } from "../requireAuthVer";
import { Header } from "../Shared/Header";
import { ColumnSpacer } from "../Shared/Spacers";
import "./StylePages.css";

type State = {
  users: Array<UserType>;
  unauthorizedRedirect: boolean;
  badRequestRedirect: boolean;
};

class PageAdminDashboard extends React.Component<RouteComponentProps, State> {
  state: State = {
    users: new Array<UserType>(),
    unauthorizedRedirect: false,
    badRequestRedirect: false,
  };

  componentDidMount = async () => {
    const allUsersResponse = await apiClient.getAllUsers();
    if (allUsersResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
    } else if (allUsersResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
    } else {
      const nonAdminUsers = allUsersResponse.responseData.filter(
        (user: UserType) => user.userRole !== "administrator"
      );
      this.setState({
        users: nonAdminUsers.sort(
          (a: UserType, b: UserType) =>
            (a.verified != null ? Infinity : 1) -
            (b.verified != null ? Infinity : 1)
        ),
      });
    }
  };

  handleVerifyUser = async (username: string) => {
    const verifyUserResponse = await apiClient.postVerifyUser({
      username: username,
      webSessionId: apiClient.webSessionId,
    });
    if (verifyUserResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
    } else if (verifyUserResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
    } else {
      this.setState({
        users: this.state.users
          .filter((user) => user.username !== username)
          .concat(verifyUserResponse.responseData)
          .sort(
            (a, b) =>
              (a.verified != null ? Infinity : 1) -
              (b.verified != null ? Infinity : 1)
          ),
      });
    }
  };

  checkVerificationStatus = (username: string) => {
    return (
      this.state.users.find((user) => user.username === username)?.verified !==
      null
    );
  };

  render() {
    if (this.state.unauthorizedRedirect) {
      return <Redirect to="/401" />;
    }
    if (this.state.badRequestRedirect) {
      return <Redirect to="/400" />;
    }
    return (
      <div className="page-container">
        <Header
          showLogout={true}
          showAdminDashboard={false}
          showUserDashboard={false}
          showWarehouseDashboard={false}
        />
        <div className="content-container">
          <div style={{ height: "133px" }}></div>
          <div className="flex-row" style={{ padding: "20px 20px 0px 20px" }}>
            <button
              className="button"
              style={{
                width: "150px",
              }}
              onClick={() => {
                this.props.history.push("/user");
              }}
            >
              <span>User Dashboard</span>
            </button>
            <ColumnSpacer size="large" />
            <button
              className="button"
              style={{
                width: "200px",
              }}
              onClick={() => {
                this.props.history.push("/warehouse");
              }}
            >
              <span>Warehouse Dashboard</span>
            </button>
          </div>
          <div className="flex-row" style={{ padding: "20px" }}>
            <table style={{ width: "100%", padding: "20px" }}>
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>User Role</th>
                  <th>Verify User</th>
                </tr>
                {this.state.users.map((user) => {
                  return (
                    <tr>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.userRole}</td>
                      <td>
                        <button
                          className="small-button"
                          onClick={() => {
                            this.handleVerifyUser(user.username);
                          }}
                          disabled={this.checkVerificationStatus(user.username)}
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(requireAuthVer(["administrator"]))(PageAdminDashboard);
