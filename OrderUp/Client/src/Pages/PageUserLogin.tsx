import { RouteComponentProps } from "react-router-dom";
import React from "react";
import FormUserLogin from "./FormUserLogin";
import { RowSpacer } from "../Shared/Spacers";
import apiClient from "../api/apiClient";

export default class PageUserLogin extends React.Component<RouteComponentProps> {
  componentDidMount = async () => {
    if (localStorage.getItem("@order-up-session-id") !== null) {
      const userDetailsResponse = await apiClient.getUserDetails();
      if (userDetailsResponse.responseType === ("401" || "400")) {
        this.props.history.push("/login");
      } else {
        if (userDetailsResponse.responseData.userRole === "user") {
          this.props.history.push("/user");
        } else if (userDetailsResponse.responseData.userRole === "warehouse") {
          this.props.history.push("/warehouse");
        } else {
          this.props.history.push("/admin");
        }
      }
    }
  };

  onAuthenticateSuccess = async (webSessionId: string) => {
    localStorage.setItem("@order-up-session-id", webSessionId);
    apiClient.webSessionId = webSessionId;
    const userDetailsResponse = await apiClient.getUserDetails();
    if (userDetailsResponse.responseType === ("401" || "400")) {
      this.props.history.push("/login");
    } else {
      if (userDetailsResponse.responseData.userRole === "user") {
        this.props.history.push("/user");
      } else if (userDetailsResponse.responseData.userRole === "warehouse") {
        this.props.history.push("/warehouse");
      } else {
        this.props.history.push("/admin");
      }
    }
  };

  render = () => {
    return (
      <div
        className="page-container"
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormUserLogin onSuccessfulLogin={this.onAuthenticateSuccess} />
        <RowSpacer size={"small"} />
      </div>
    );
  };
}
