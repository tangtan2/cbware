import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React from "react";
import { OrderType, UserType } from "../globalTypes";
import apiClient from "../api/apiClient";
import { Header } from "../Shared/Header";
import { requireAuthVer } from "../requireAuthVer";
import { compose } from "lodash/fp";
import { ColumnSpacer, RowSpacer } from "../Shared/Spacers";
import FormActiveOrder from "./FormActiveOrder";
import "./StylePages.css";
import { Redirect } from "react-router-dom";

type State = {
  activeOrders: OrderType[];
  groupBy: "part" | "user" | null;
  unauthorizedRedirect: boolean;
  badRequestRedirect: boolean;
};

class PageWarehouseDashboard extends React.Component<State> {
  state: State = {
    activeOrders: new Array<OrderType>(),
    groupBy: null,
    unauthorizedRedirect: false,
    badRequestRedirect: false,
  };

  userRole = "";
  connection: HubConnection | null = null;
  userMap: { [id: string]: string } = {};

  componentDidMount = async () => {
    if (await this.handleGetUserDetails()) {
      return;
    }
    if (await this.handleGetAllUsers()) {
      return;
    }
    if (await this.handleGetActiveOrders()) {
      return;
    }
    this.connection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_URL + `/api/hubs/order`)
      .withAutomaticReconnect()
      .build();
    await this.connection.start();
    this.connection.on("ReceiveNewOrders", (newOrders: OrderType[]) => {
      this.setState({
        activeOrders: this.state.activeOrders.concat(newOrders),
      });
    });
  };

  componentWillUnmount = async () => {
    await this.connection?.stop();
  };

  handleGetUserDetails = async (): Promise<boolean> => {
    const userDetailsResponse = await apiClient.getUserDetails();
    if (userDetailsResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
      return true;
    } else if (userDetailsResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
      return true;
    } else {
      this.userRole = userDetailsResponse.responseData.userRole;
      return false;
    }
  };

  handleGetAllUsers = async (): Promise<boolean> => {
    const allUsersResponse = await apiClient.getAllUsers();
    if (allUsersResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
      return true;
    } else if (allUsersResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
      return true;
    } else {
      allUsersResponse.responseData.map((user: UserType) => {
        this.userMap[user.id] = user.username;
      });
      return false;
    }
  };

  handleGetActiveOrders = async (): Promise<boolean> => {
    const activeOrdersResponse = await apiClient.getAllActiveOrders();
    if (activeOrdersResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
      return true;
    } else if (activeOrdersResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
      return true;
    } else {
      this.setState({
        activeOrders:
          activeOrdersResponse.responseData ?? new Array<OrderType>(),
      });
      return false;
    }
  };

  handleCompleteOrder = (orderId: string) => {
    const updatedOrders = this.state.activeOrders.filter(
      (activeOrder) => activeOrder.id !== orderId
    );
    this.setState({ activeOrders: updatedOrders });
  };

  handleGroupByUser = () => {
    this.setState({ groupBy: "user" });
  };

  handleGroupByPart = () => {
    this.setState({ groupBy: "part" });
  };

  handleNoGroup = () => {
    this.setState({ groupBy: null });
  };

  filterActiveOrdersByGroupId = (id: string) => {
    if (this.state.groupBy === "part") {
      return this.state.activeOrders.filter((order) => order.part === id);
    } else if (this.state.groupBy === "user") {
      return this.state.activeOrders.filter(
        (order) => this.userMap[order.userId] === id
      );
    } else {
      return this.state.activeOrders;
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
      <div className="page-container">
        {this.userRole === "administrator" ? (
          <Header
            showLogout={true}
            showAdminDashboard={true}
            showUserDashboard={true}
            showWarehouseDashboard={false}
          />
        ) : (
          <Header
            showLogout={true}
            showAdminDashboard={false}
            showUserDashboard={false}
            showWarehouseDashboard={false}
          />
        )}
        <div className="content-container">
          <div style={{ height: "133px" }}></div>
          <div style={{ padding: "20px" }}>
            <div
              className="flex-column"
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                maxHeight: "79vh",
                borderWidth: "1.5px",
                borderColor: "lightgrey",
                borderStyle: "solid",
              }}
            >
              <div className="container-header">All active orders</div>
              <RowSpacer size="large" />
              <div className="flex-row">
                <ColumnSpacer size="large" />
                <button
                  className="button"
                  style={{ width: "150px" }}
                  onClick={() => {
                    this.handleGroupByPart();
                  }}
                >
                  <span>Group by part</span>
                </button>
                <ColumnSpacer size="medium" />
                <button
                  className="button"
                  style={{ width: "150px" }}
                  onClick={() => {
                    this.handleGroupByUser();
                  }}
                >
                  <span>Group by user</span>
                </button>
                <ColumnSpacer size="medium" />
                <button
                  className="button"
                  style={{ width: "150px" }}
                  onClick={() => {
                    this.handleNoGroup();
                  }}
                >
                  <span>View all orders</span>
                </button>
              </div>
              <RowSpacer size="large" />
              <div
                className="scrollable-flex-column"
                style={{ padding: "0px 20px 0px 20px" }}
              >
                {this.state.activeOrders
                  .map((activeOrder) => {
                    if (this.state.groupBy === "part") {
                      return activeOrder.part;
                    } else if (this.state.groupBy === "user") {
                      return this.userMap[activeOrder.userId];
                    } else {
                      return "";
                    }
                  })
                  .reduce<Array<string>>((prev, curr) => {
                    if (prev.includes(curr)) {
                      return prev;
                    } else {
                      prev.push(curr);
                      return prev;
                    }
                  }, [])
                  .map((id) => {
                    return (
                      <div>
                        <div
                          className="flex-row"
                          style={{
                            borderWidth: "1.5px",
                            borderStyle: "solid",
                            borderColor: "lightgrey",
                            borderRadius: "10px",
                            padding: "20px 20px 0px 20px",
                          }}
                        >
                          {this.state.groupBy !== null ? (
                            <div
                              className="group-header"
                              style={{ padding: "10px 40px 0px 20px" }}
                            >
                              {id}
                            </div>
                          ) : (
                            <div className="group-header"></div>
                          )}
                          <div
                            className="flex-column"
                            style={{ width: "100%" }}
                          >
                            {this.filterActiveOrdersByGroupId(id).map(
                              (activeOrder: OrderType) => {
                                return (
                                  <div>
                                    <FormActiveOrder
                                      activeOrder={activeOrder}
                                      username={
                                        this.userMap[activeOrder.userId]
                                      }
                                      key={activeOrder.id}
                                      onComplete={this.handleCompleteOrder}
                                    />
                                    <RowSpacer size={"large"} />
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <RowSpacer size="large" />
                        </div>
                        <RowSpacer size="large" />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default compose(requireAuthVer(["administrator", "warehouse"]))(
  PageWarehouseDashboard
);
