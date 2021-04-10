import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { compose } from "lodash/fp";
import React from "react";
import apiClient from "../api/apiClient";
import { HandleNewOrderChanges, OrderType, UserType } from "../globalTypes";
import { Header } from "../Shared/Header";
import { requireAuthVer } from "../requireAuthVer";
import { ColumnSpacer, RowSpacer } from "../Shared/Spacers";
import FormActiveOrder from "./FormActiveOrder";
import FormNewOrder from "./FormNewOrder";
import "./StylePages.css";
import { Redirect } from "react-router-dom";

type State = {
  newOrders: HandleNewOrderChanges[];
  activeOrders: OrderType[];
  unauthorizedRedirect: boolean;
  badRequestRedirect: boolean;
};

class PageUserDashboard extends React.Component<State> {
  state: State = {
    newOrders: new Array<HandleNewOrderChanges>(),
    activeOrders: new Array<OrderType>(),
    unauthorizedRedirect: false,
    badRequestRedirect: false,
  };

  username = "";
  userRole = "";
  connection: HubConnection | null = null;
  allUserNames: string[] = [];
  allParts: string[] = [];

  componentDidMount = async () => {
    const allUsersResponse = await apiClient.getAllUsers();
    if (allUsersResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
    } else if (allUsersResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
    } else {
      this.allUserNames = allUsersResponse.responseData.map(
        (x: UserType) => x.name
      );
    }
    const allPartsResponse = await apiClient.getAllOrderParts();
    if (allPartsResponse.responseData === "401") {
      this.setState({ unauthorizedRedirect: true });
    } else if (allPartsResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
    } else {
      this.allParts = allPartsResponse.responseData;
    }
    this.handleCreateNewOrder();
    if (await this.handleGetUserDetails()) {
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
    this.connection.on(
      "ReceiveOrderCompletionUpdate",
      (completedOrder: OrderType) => {
        const updatedOrders = this.state.activeOrders.filter(
          (activeOrder) => activeOrder.id !== completedOrder.id
        );
        this.setState({ activeOrders: updatedOrders });
      }
    );
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
      this.username = userDetailsResponse.responseData.username;
      this.userRole = userDetailsResponse.responseData.userRole;
      return false;
    }
  };

  handleGetActiveOrders = async (): Promise<boolean> => {
    const activeUsersResponse = await apiClient.getActiveOrdersPerUser();
    if (activeUsersResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
      return true;
    } else if (activeUsersResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
      return true;
    } else {
      this.setState({
        activeOrders:
          activeUsersResponse.responseData ?? new Array<OrderType>(),
      });
      return false;
    }
  };

  handleCreateNewOrder = () => {
    const updatedNewOrders = this.state.newOrders.concat(
      (() => {
        let _part = "";
        const _getPart = () => {
          return _part;
        };
        const _setPart = (newPart: string) => {
          _part = newPart;
        };
        let _quantity = 0;
        const _getQuantity = () => {
          return _quantity;
        };
        const _setQuantity = (newQuantity: number) => {
          _quantity = newQuantity;
        };
        let _notes = "";
        const _getNotes = () => {
          return _notes;
        };
        const _setNotes = (newNotes: string) => {
          _notes = newNotes;
        };
        let _orderer = "";
        const _getOrderer = () => {
          return _orderer;
        };
        const _setOrderer = (newOrderer: string) => {
          _orderer = newOrderer;
        };
        let _workOrder1 = "00000";
        const _getWorkOrder1 = () => {
          return _workOrder1;
        };
        const _setWorkOrder1 = (newWorkOrder1: string) => {
          _workOrder1 = newWorkOrder1;
        };
        let _workOrder1Error = false;
        const _getWorkOrder1Error = () => {
          return _workOrder1Error;
        };
        const _setWorkOrder1Error = (newWorkOrderError1: boolean) => {
          _workOrder1Error = newWorkOrderError1;
        };
        let _workOrder2 = "000";
        const _getWorkOrder2 = () => {
          return _workOrder2;
        };
        const _setWorkOrder2 = (newWorkOrder2: string) => {
          _workOrder2 = newWorkOrder2;
        };
        let _workOrder2Error = false;
        const _getWorkOrder2Error = () => {
          return _workOrder2Error;
        };
        const _setWorkOrder2Error = (newWorkOrderError1: boolean) => {
          _workOrder2Error = newWorkOrderError1;
        };
        const _id = Math.floor((1 + Math.random()) * 100000);
        const _getId = () => {
          return _id;
        };
        return {
          getPart: _getPart,
          setPart: _setPart,
          getQuantity: _getQuantity,
          setQuantity: _setQuantity,
          getNotes: _getNotes,
          setNotes: _setNotes,
          getOrderer: _getOrderer,
          setOrderer: _setOrderer,
          getWorkOrder1: _getWorkOrder1,
          setWorkOrder1: _setWorkOrder1,
          getWorkOrder1Error: _getWorkOrder1Error,
          setWorkOrder1Error: _setWorkOrder1Error,
          getWorkOrder2: _getWorkOrder2,
          setWorkOrder2: _setWorkOrder2,
          getWorkOrder2Error: _getWorkOrder2Error,
          setWorkOrder2Error: _setWorkOrder2Error,
          getId: _getId,
        };
      })()
    );
    this.setState({ newOrders: updatedNewOrders });
  };

  handleDeleteNewOrder = (orderId: number) => {
    const updatedOrders = this.state.newOrders.filter(
      (newOrder) => newOrder.getId() !== orderId
    );
    this.setState({ newOrders: updatedOrders });
  };

  handlePostNewOrders = async () => {
    let validation = false;
    const postNewOrders = this.state.newOrders.map((handlers) => {
      if (handlers.getWorkOrder1().length !== 5) {
        validation = true;
        handlers.setWorkOrder1Error(true);
      } else {
        handlers.setWorkOrder1Error(false);
      }
      if (handlers.getWorkOrder2().length !== 3) {
        validation = true;
        handlers.setWorkOrder2Error(true);
      } else {
        handlers.setWorkOrder2Error(false);
      }
      return {
        part: handlers.getPart(),
        quantity: handlers.getQuantity(),
        notes: handlers.getNotes() !== "" ? handlers.getNotes() : null,
        orderer: handlers.getOrderer(),
        workOrder:
          "W" + handlers.getWorkOrder1() + "-" + handlers.getWorkOrder2(),
      };
    });
    if (validation) {
      this.setState({});
      return;
    }
    const newOrdersResponse = await apiClient.postNewOrders(postNewOrders);
    if (newOrdersResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
    } else if (newOrdersResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
    } else {
      this.setState({
        newOrders: new Array<HandleNewOrderChanges>(),
        activeOrders: this.state.activeOrders.concat(
          newOrdersResponse.responseData
        ),
      });
      this.handleCreateNewOrder();
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
            showUserDashboard={false}
            showWarehouseDashboard={true}
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
          <div
            className="flex-row"
            style={{
              padding: "20px",
            }}
          >
            <div className="flex-column" style={{ flex: 0.5 }}>
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
                <div className="container-header">New orders</div>
                <RowSpacer size={"large"} />
                <div className="flex-row" style={{ justifyContent: "center" }}>
                  <button
                    className="plus-button"
                    onClick={this.handleCreateNewOrder}
                  />
                </div>
                <RowSpacer size={"large"} />
                <div
                  className="scrollable-flex-column"
                  style={{ alignItems: "center", flex: 1 }}
                >
                  {this.state.newOrders.map(
                    (handlers: HandleNewOrderChanges) => {
                      return (
                        <div>
                          <FormNewOrder
                            handlers={handlers}
                            allParts={this.allParts}
                            allUserNames={this.allUserNames}
                            orderId={handlers.getId()}
                            onDelete={this.handleDeleteNewOrder}
                            key={handlers.getId()}
                          />
                          <RowSpacer size="large" />
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="flex-row" style={{ justifyContent: "center" }}>
                  <button className="button" onClick={this.handlePostNewOrders}>
                    <span>Submit</span>
                  </button>
                </div>
                <RowSpacer size={"large"} />
              </div>
              <div style={{ flex: 1 }}></div>
            </div>
            <ColumnSpacer size="large" />
            <div className="flex-column" style={{ flex: 1 }}>
              <div
                className="flex-column"
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  maxHeight: "75vh",
                  borderWidth: "1.5px",
                  borderColor: "lightgrey",
                  borderStyle: "solid",
                }}
              >
                <div className="container-header">Your active orders</div>
                <div
                  className="scrollable-flex-column"
                  style={{ padding: "20px 20px 0px 20px" }}
                >
                  {this.state.activeOrders.map((activeOrder: OrderType) => {
                    return (
                      <div>
                        <FormActiveOrder
                          activeOrder={activeOrder}
                          username={this.username}
                          key={activeOrder.id}
                          onComplete={null}
                        />
                        <RowSpacer size={"large"} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ flex: 1 }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default compose(requireAuthVer(["administrator", "user"]))(
  PageUserDashboard
);
