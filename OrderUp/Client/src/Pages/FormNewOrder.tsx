import React from "react";
import Dropdown, { Option } from "react-dropdown";
import { HandleNewOrderChanges, OrderType } from "../globalTypes";
import { ColumnSpacer, RowSpacer } from "../Shared/Spacers";
import "./StylePages.css";

type Props = {
  handlers: HandleNewOrderChanges;
  orderId: number;
  onDelete: (orderKey: number) => void;
  allParts: string[];
  allUserNames: string[];
};
type State = {
  partFieldValue: string;
  quantityFieldValue: number;
  notesFieldValue: string;
  ordererFieldValue: string;
  workOrderField1Value: string;
  workOrderField2Value: string;
};

export default class FormNewOrder extends React.Component<Props, State> {
  state: State = {
    partFieldValue: this.props.handlers.getPart(),
    quantityFieldValue: this.props.handlers.getQuantity(),
    notesFieldValue: this.props.handlers.getNotes(),
    ordererFieldValue: this.props.handlers.getOrderer(),
    workOrderField1Value: this.props.handlers.getWorkOrder1(),
    workOrderField2Value: this.props.handlers.getWorkOrder2(),
  };

  componentDidMount = async () => {
    this.props.handlers.setPart(this.props.allParts[0]);
    this.props.handlers.setOrderer(this.props.allUserNames[0]);
  };

  handlePartFieldChange = (args: Option) => {
    this.props.handlers.setPart(args.value);
    this.setState({ partFieldValue: args.value });
  };

  handleQuantityFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.props.handlers.setQuantity(parseInt(event.target.value));
    this.setState({ quantityFieldValue: parseInt(event.target.value) });
  };

  handleNotesFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.props.handlers.setNotes(event.target.value);
    this.setState({ notesFieldValue: event.target.value });
  };

  handleOrdererFieldChange = (args: Option) => {
    this.props.handlers.setOrderer(args.value);
    this.setState({ ordererFieldValue: args.value });
  };

  handleWorkOrderField1Change = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    if (event.target.value === "" || !isNaN(parseInt(event.target.value))) {
      this.props.handlers.setWorkOrder1(event.target.value);
      this.setState({ workOrderField1Value: event.target.value });
    }
  };

  handleWorkOrderField2Change = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    if (event.target.value === "" || !isNaN(parseInt(event.target.value))) {
      this.props.handlers.setWorkOrder2(event.target.value);
      this.setState({ workOrderField2Value: event.target.value });
    }
  };

  render() {
    return (
      <div
        className="order-container"
        style={{ marginLeft: "20px", marginRight: "20px" }}
      >
        <div className="flex-row">
          <div className="flex-column">
            <div className="flex-row" style={{ alignItems: "center" }}>
              <div className="list-header">Part:</div>
              <div style={{ flex: 1 }} />
              <Dropdown
                options={this.props.allParts}
                value={this.props.allParts[0]}
                onChange={this.handlePartFieldChange}
              />
            </div>
            <RowSpacer size={"medium"} />
            <div className="flex-row" style={{ alignItems: "center" }}>
              <div className="list-header">Quantity:</div>
              <div style={{ flex: 1 }} />
              <input
                className="form-input"
                style={{ width: "69%" }}
                type="number"
                value={this.state.quantityFieldValue}
                onChange={this.handleQuantityFieldChange}
                name="quantity"
              />
            </div>
            <RowSpacer size={"medium"} />
            <div className="flex-row" style={{ alignItems: "center" }}>
              <div className="list-header">Orderer:</div>
              <div style={{ flex: 1 }} />
              <Dropdown
                options={this.props.allUserNames}
                value={this.props.allUserNames[0]}
                onChange={this.handleOrdererFieldChange}
              />
            </div>
            <RowSpacer size={"medium"} />
            <div className="flex-row" style={{ alignItems: "center" }}>
              <div className="list-header">WO:</div>
              <div style={{ flex: 1 }} />
              <div style={{ fontFamily: "Helvetica" }}>W</div>
              <ColumnSpacer size="small" />
              {this.props.handlers.getWorkOrder1Error() === false ? (
                <input
                  className="form-input"
                  style={{ width: "15%", textAlign: "center" }}
                  type="text"
                  value={this.state.workOrderField1Value}
                  onChange={this.handleWorkOrderField1Change}
                  name="quantity"
                  maxLength={5}
                />
              ) : (
                <input
                  className="form-input"
                  style={{
                    width: "15%",
                    textAlign: "center",
                    borderColor: "red",
                  }}
                  type="text"
                  value={this.state.workOrderField1Value}
                  onChange={this.handleWorkOrderField1Change}
                  name="quantity"
                  maxLength={5}
                />
              )}
              <ColumnSpacer size="small" />
              <div style={{ fontFamily: "Helvetica" }}>-</div>
              <ColumnSpacer size="small" />
              {this.props.handlers.getWorkOrder2Error() === false ? (
                <input
                  className="form-input"
                  style={{ width: "9%", textAlign: "center" }}
                  type="text"
                  value={this.state.workOrderField2Value}
                  onChange={this.handleWorkOrderField2Change}
                  name="quantity"
                  maxLength={3}
                />
              ) : (
                <input
                  className="form-input"
                  style={{
                    width: "9%",
                    textAlign: "center",
                    borderColor: "red",
                  }}
                  type="text"
                  value={this.state.workOrderField2Value}
                  onChange={this.handleWorkOrderField2Change}
                  name="quantity"
                  maxLength={3}
                />
              )}
            </div>
            <RowSpacer size={"medium"} />
            <div className="flex-row" style={{ alignItems: "center" }}>
              <div className="list-header">Notes:</div>
              <div style={{ flex: 1 }} />
              <input
                className="form-input"
                style={{ width: "69%" }}
                type="text"
                value={this.state.notesFieldValue}
                onChange={this.handleNotesFieldChange}
                name="quantity"
              />
            </div>
          </div>
          <ColumnSpacer size="large" />
          <button
            className="minus-button"
            onClick={() => this.props.onDelete(this.props.orderId)}
          />
        </div>
      </div>
    );
  }
}
