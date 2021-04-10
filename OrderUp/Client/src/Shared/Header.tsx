import { ColumnSpacer } from "./Spacers";
import "./StyleShared.css";
import apiClient from "../api/apiClient";
import { useHistory } from "react-router";

function SubmitButton() {
  let history = useHistory();

  async function handleLogOut() {
    localStorage.clear();
    const logoutResponse = await apiClient.postUserLogout();
    if (logoutResponse.responseType === "401") {
      history.push("/401");
    } else if (logoutResponse.responseType === "400") {
      history.push("/400");
    } else {
      history.push("/login");
    }
  }

  return (
    <button className="button" onClick={handleLogOut}>
      <span>Log out</span>
    </button>
  );
}

function UserDashboardButton() {
  let history = useHistory();

  async function handleNavigate() {
    history.push("/user");
  }

  return (
    <button
      className="button"
      style={{ width: "150px" }}
      onClick={handleNavigate}
    >
      <span>User Dashboard</span>
    </button>
  );
}

function WarehouseDashboardButton() {
  let history = useHistory();

  async function handleNavigate() {
    history.push("/warehouse");
  }

  return (
    <button
      className="button"
      style={{ width: "200px" }}
      onClick={handleNavigate}
    >
      <span>Warehouse Dashboard</span>
    </button>
  );
}

function AdminDashboardButton() {
  let history = useHistory();

  async function handleNavigate() {
    history.push("/admin");
  }

  return (
    <button
      className="button"
      style={{ width: "150px" }}
      onClick={handleNavigate}
    >
      <span>Admin Dashboard</span>
    </button>
  );
}

type Props = {
  showLogout: boolean;
  showUserDashboard: boolean;
  showWarehouseDashboard: boolean;
  showAdminDashboard: boolean;
};

export const Header = (props: Props) => {
  return (
    <div className="header-container">
      <ColumnSpacer size="large" />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <img height="90px" src={"./logo.png"} />
        <ColumnSpacer size="large" />
        <div
          style={{
            fontFamily: "Helvetica",
            fontSize: "45px",
            color: "#303030",
          }}
        >
          cbware
        </div>
      </div>
      <ColumnSpacer size="flex" />
      {props.showAdminDashboard ? (
        <div>
          {AdminDashboardButton()} <ColumnSpacer size="large" />
        </div>
      ) : (
        <div />
      )}
      {props.showUserDashboard ? (
        <div>
          {UserDashboardButton()} <ColumnSpacer size="large" />
        </div>
      ) : (
        <div />
      )}
      {props.showWarehouseDashboard ? (
        <div>
          {WarehouseDashboardButton()} <ColumnSpacer size="large" />
        </div>
      ) : (
        <div />
      )}
      {props.showLogout ? (
        <div>
          {SubmitButton()} <ColumnSpacer size="large" />
        </div>
      ) : (
        <div />
      )}
      <ColumnSpacer size="large" />
    </div>
  );
};
