import React from "react";
import { RowSpacer } from "../Shared/Spacers";
import apiClient from "../api/apiClient";
import "./StylePages.css";
import { Link } from "react-router-dom";

type Props = {
  onSuccessfulLogin: (authSessionId: string) => void;
};

type State = {
  usernameFieldValue: string;
  passwordFieldValue: string;
  checkUsernameValid: boolean;
  checkPasswordValid: boolean;
};

export default class FormUserLogin extends React.Component<Props, State> {
  state: State = {
    usernameFieldValue: "",
    passwordFieldValue: "",
    checkPasswordValid: false,
    checkUsernameValid: false,
  };

  handleUsernameFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ usernameFieldValue: event.target.value });
  };

  handlePasswordFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ passwordFieldValue: event.target.value });
  };

  handleLoginAttempt = async () => {
    if (
      this.state.usernameFieldValue === "" ||
      this.state.passwordFieldValue === ""
    ) {
      if (this.state.usernameFieldValue === "") {
        this.setState({ checkUsernameValid: true });
      } else {
        this.setState({ checkUsernameValid: false });
      }
      if (this.state.passwordFieldValue === "") {
        this.setState({ checkPasswordValid: true });
      } else {
        this.setState({ checkPasswordValid: false });
      }
    } else {
      const userLoginResponse = await apiClient.postUserLogin({
        username: this.state.usernameFieldValue,
        password: this.state.passwordFieldValue,
      });
      if (userLoginResponse.responseType === ("401" || "400")) {
        this.setState({
          usernameFieldValue: "",
          passwordFieldValue: "",
          checkPasswordValid: false,
          checkUsernameValid: false,
        });
      } else {
        this.props.onSuccessfulLogin(userLoginResponse.responseData.id);
      }
    }
  };

  render = () => {
    return (
      <div
        className="flex-column"
        style={{
          alignItems: "center",
          width: "100%",
          fontFamily: "Helvetica",
          borderWidth: "1.5px",
          borderColor: "lightgrey",
          borderStyle: "solid",
          maxWidth: "300px",
          borderRadius: "10px",
        }}
      >
        <RowSpacer size="large" />
        <img height="90px" src={"./logo.png"} />
        <RowSpacer size="large" />
        <div
          style={{
            fontFamily: "Helvetica",
            fontSize: "18px",
            color: "#474747",
          }}
        >
          Enter your credentials
        </div>
        <RowSpacer size="large" />
        {this.state.checkUsernameValid ? (
          <div className="form-input-error-container">
            <input
              className="input"
              placeholder="Username"
              type="text"
              value={this.state.usernameFieldValue}
              onChange={this.handleUsernameFieldChange}
              name="username"
            />
            <RowSpacer size="small" />
            <div className="text">Please enter a username</div>
          </div>
        ) : (
          <input
            className="form-input"
            placeholder="Username"
            type="text"
            value={this.state.usernameFieldValue}
            onChange={this.handleUsernameFieldChange}
            name="username"
          />
        )}
        <RowSpacer size="large" />
        {this.state.checkPasswordValid ? (
          <div className="form-input-error-container">
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={this.state.passwordFieldValue}
              onChange={this.handlePasswordFieldChange}
              name="password"
            />
            <RowSpacer size="small" />
            <div className="text">Please enter a password</div>
          </div>
        ) : (
          <input
            className="form-input"
            placeholder="Password"
            type="password"
            value={this.state.passwordFieldValue}
            onChange={this.handlePasswordFieldChange}
            name="password"
          />
        )}
        <RowSpacer size="large" />
        <RowSpacer size="large" />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <Link
            style={{
              fontFamily: "Helvetica",
              fontSize: "14px",
              color: "#1f618d",
              textDecoration: "none",
            }}
            to={"/create-new-user"}
          >
            Create account
          </Link>
          <button className="button" onClick={this.handleLoginAttempt}>
            <span>Log in</span>
          </button>
        </div>
        <RowSpacer size="large" />
      </div>
    );
  };
}
