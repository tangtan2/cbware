import React from "react";
import { Link, Redirect } from "react-router-dom";
import apiClient from "../api/apiClient";
import { UserRoleType, UserType } from "../globalTypes";
import { RowSpacer } from "../Shared/Spacers";
import Dropdown, { Option } from "react-dropdown";
import "./StylePages.css";

type Props = {};
type State = {
  usernameFieldValue: string;
  nameFieldValue: string;
  emailFieldValue: string;
  userRoleFieldValue: string;
  passwordFieldValue: string;
  checkUsernameValid: boolean;
  checkNameValid: boolean;
  checkEmailValid: boolean;
  checkPasswordValid: boolean;
  unauthorizedRedirect: boolean;
  badRequestRedirect: boolean;
};

export default class FormCreateNewUser extends React.Component<Props, State> {
  state: State = {
    usernameFieldValue: "",
    nameFieldValue: "",
    emailFieldValue: "",
    userRoleFieldValue: "",
    passwordFieldValue: "",
    checkUsernameValid: true,
    checkNameValid: true,
    checkEmailValid: true,
    checkPasswordValid: true,
    unauthorizedRedirect: false,
    badRequestRedirect: false,
  };

  allUsernames: string[] = [];
  userRoles = ["user", "warehouse"];

  componentDidMount = async () => {
    const allUsersResponse = await apiClient.getAllUsers();
    if (allUsersResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
    } else if (allUsersResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
    } else {
      this.allUsernames = allUsersResponse.responseData.map(
        (x: UserType) => x.username
      );
    }
  };

  handleUsernameFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (this.allUsernames.includes(event.target.value)) {
      this.setState({
        usernameFieldValue: event.target.value,
        checkUsernameValid: false,
      });
    } else {
      this.setState({
        usernameFieldValue: event.target.value,
        checkUsernameValid: true,
      });
    }
  };

  handleNameFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ nameFieldValue: event.target.value, checkNameValid: true });
  };

  handleEmailFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({
      emailFieldValue: event.target.value,
      checkEmailValid: true,
    });
  };

  handleUserRoleFieldChange = (args: Option) => {
    this.setState({ userRoleFieldValue: args.value });
  };

  handlePasswordFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({
      passwordFieldValue: event.target.value,
      checkPasswordValid: true,
    });
  };

  handlePostNewUser = async () => {
    let checkValid = true;
    if (this.state.usernameFieldValue === "") {
      this.setState({ checkUsernameValid: false });
      checkValid = false;
    }
    if (this.state.nameFieldValue === "") {
      this.setState({ checkNameValid: false });
      checkValid = false;
    }
    if (this.state.emailFieldValue === "") {
      this.setState({ checkEmailValid: false });
      checkValid = false;
    }
    if (this.state.passwordFieldValue === "") {
      this.setState({ checkPasswordValid: false });
      checkValid = false;
    }
    if (checkValid) {
      const newUserResponse = await apiClient.postNewUser({
        username: this.state.usernameFieldValue,
        name: this.state.nameFieldValue,
        email: this.state.emailFieldValue,
        userRole: this.state.userRoleFieldValue,
        password: this.state.passwordFieldValue,
      });
      if (newUserResponse.responseType === "401") {
        this.setState({ unauthorizedRedirect: true });
      } else if (newUserResponse.responseType === "400") {
        this.setState({ badRequestRedirect: true });
      } else {
        this.allUsernames.push(newUserResponse.responseData.username);
        this.setState({
          usernameFieldValue: "",
          nameFieldValue: "",
          emailFieldValue: "",
          userRoleFieldValue: "user",
          passwordFieldValue: "",
          checkUsernameValid: true,
          checkNameValid: true,
          checkEmailValid: true,
          checkPasswordValid: true,
        });
      }
    }
  };

  render = () => {
    if (this.state.unauthorizedRedirect) {
      return <Redirect to="/401" />;
    }
    if (this.state.badRequestRedirect) {
      return <Redirect to="/400" />;
    }
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
          maxWidth: "400px",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <Link
          style={{
            fontFamily: "Helvetica",
            fontSize: "14px",
            color: "#1f618d",
            textDecoration: "none",
          }}
          to="/login"
        >
          Back to Login
        </Link>
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
          Enter your details
        </div>
        <RowSpacer size="large" />
        <div
          className="flex-row"
          style={{ alignItems: "center", width: "100%" }}
        >
          <div className="list-header">Username:</div>
          <div style={{ flex: 1 }} />
          {this.state.checkUsernameValid ? (
            <input
              className="form-input"
              style={{ width: "70%" }}
              type="text"
              value={this.state.usernameFieldValue}
              onChange={this.handleUsernameFieldChange}
              name="username"
            />
          ) : (
            <input
              className="form-input-error"
              style={{ width: "70%" }}
              type="text"
              value={this.state.usernameFieldValue}
              onChange={this.handleUsernameFieldChange}
              name="username"
            />
          )}
        </div>
        <RowSpacer size="large" />
        <div
          className="flex-row"
          style={{ alignItems: "center", width: "100%" }}
        >
          <div className="list-header">Name:</div>
          <div style={{ flex: 1 }} />
          {this.state.checkNameValid ? (
            <input
              className="form-input"
              style={{ width: "70%" }}
              type="text"
              value={this.state.nameFieldValue}
              onChange={this.handleNameFieldChange}
              name="name"
            />
          ) : (
            <input
              className="form-input-error"
              style={{ width: "70%" }}
              type="text"
              value={this.state.nameFieldValue}
              onChange={this.handleNameFieldChange}
              name="name"
            />
          )}
        </div>
        <RowSpacer size="large" />
        <div
          className="flex-row"
          style={{ alignItems: "center", width: "100%" }}
        >
          <div className="list-header">Email:</div>
          <div style={{ flex: 1 }} />
          {this.state.checkEmailValid ? (
            <input
              className="form-input"
              style={{ width: "70%" }}
              type="text"
              value={this.state.emailFieldValue}
              onChange={this.handleEmailFieldChange}
              name="email"
            />
          ) : (
            <input
              className="form-input-error"
              style={{ width: "70%" }}
              type="text"
              value={this.state.emailFieldValue}
              onChange={this.handleEmailFieldChange}
              name="email"
            />
          )}
        </div>
        <RowSpacer size="large" />
        <div
          className="flex-row"
          style={{ alignItems: "center", width: "100%" }}
        >
          <div className="list-header">User Role:</div>
          <div style={{ flex: 1 }} />
          <Dropdown
            options={this.userRoles}
            onChange={this.handleUserRoleFieldChange}
            value={this.userRoles[0]}
          />
        </div>
        <RowSpacer size="large" />
        <div
          className="flex-row"
          style={{ alignItems: "center", width: "100%" }}
        >
          <div className="list-header">Password:</div>
          <div style={{ flex: 1 }} />
          {this.state.checkPasswordValid ? (
            <input
              className="form-input"
              style={{ width: "70%" }}
              type="text"
              value={this.state.passwordFieldValue}
              onChange={this.handlePasswordFieldChange}
              name="password"
            />
          ) : (
            <input
              className="form-input-error"
              style={{ width: "70%" }}
              type="text"
              value={this.state.passwordFieldValue}
              onChange={this.handlePasswordFieldChange}
              name="password"
            />
          )}
        </div>
        <RowSpacer size="large" />
        <div
          className="flex-row"
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <button className="button" onClick={this.handlePostNewUser}>
            <span>Submit</span>
          </button>
        </div>
      </div>
    );
  };
}
