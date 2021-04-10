import React from "react";
import { Redirect } from "react-router";
import apiClient from "../api/apiClient";
import { OrderType } from "../globalTypes";
import { RowSpacer } from "../Shared/Spacers";
import "./StylePages.css";

type Props = {
  activeOrder: OrderType;
  onComplete: any;
  username: string;
};

type State = {
  completedNotesFieldValue: string;
  unauthorizedRedirect: boolean;
  badRequestRedirect: boolean;
};

export default class FormActiveOrder extends React.Component<Props, State> {
  state: State = {
    completedNotesFieldValue: "",
    unauthorizedRedirect: false,
    badRequestRedirect: false,
  };

  handleCompletedNotesFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    this.setState({ completedNotesFieldValue: event.target.value });
  };

  handlePostOrderUpdate = async () => {
    const updatedOrderResponse = await apiClient.postUpdatedOrder({
      id: this.props.activeOrder.id,
      completedNotes:
        this.state.completedNotesFieldValue !== ""
          ? this.state.completedNotesFieldValue
          : null,
    });
    if (updatedOrderResponse.responseType === "401") {
      this.setState({ unauthorizedRedirect: true });
    } else if (updatedOrderResponse.responseType === "400") {
      this.setState({ badRequestRedirect: true });
    } else {
      this.props.onComplete(updatedOrderResponse.responseData.id);
    }
  };

  render() {
    if (this.state.unauthorizedRedirect) {
      return <Redirect to="/401" />;
    }
    if (this.state.badRequestRedirect) {
      return <Redirect to="/400" />;
    }
    return (
      <div className="order-container">
        <div className="flex-row">
          <div className="flex-column" style={{ width: "110px" }}>
            <div className="list-header">Ordered by: </div>
            <div className="list-header">Orderer name: </div>
            <div className="list-header">Part: </div>
            <div className="list-header">Work order: </div>
            <div className="list-header">Quantity: </div>
            <div className="list-header">Notes: </div>
            <div className="list-header">Placed at: </div>
          </div>
          <div className="flex-column" style={{ flex: 1 }}>
            <div className="list-item">{this.props.username}</div>
            <div className="list-item">{this.props.activeOrder.orderer}</div>
            <div className="list-item">{this.props.activeOrder.part}</div>
            <div className="list-item">{this.props.activeOrder.workOrder}</div>
            <div className="list-item">{this.props.activeOrder.quantity}</div>
            <div className="list-item">{this.props.activeOrder.notes}</div>
            <div className="list-item">
              {new Date(this.props.activeOrder.placed).toLocaleDateString(
                "en-US"
              ) +
                " " +
                new Date(this.props.activeOrder.placed).toLocaleTimeString(
                  "en-US"
                )}
            </div>
          </div>
          {this.props.onComplete !== null ? (
            <div
              className="flex-column"
              style={{
                justifyContent: "center",
                alignItems: "end",
                flex: 0.8,
              }}
            >
              <div>
                <form>
                  <label>
                    <div className="list-header">Notes:</div>
                    <input
                      style={{
                        fontFamily: "Helvetica",
                        fontSize: "14px",
                        padding: "5px 8px",
                      }}
                      type="text"
                      value={this.state.completedNotesFieldValue}
                      onChange={this.handleCompletedNotesFieldChange}
                      name="username"
                    />
                  </label>
                </form>
              </div>
              <RowSpacer size="large" />
              <div>
                <button
                  className="button"
                  onClick={() => this.handlePostOrderUpdate()}
                >
                  <span>Complete</span>
                </button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}
