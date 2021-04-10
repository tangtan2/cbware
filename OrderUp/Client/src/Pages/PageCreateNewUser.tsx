import React from "react";
import FormCreateNewUser from "./FormCreateNewUser";

export default class PageCreateNewUser extends React.Component {
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
        <FormCreateNewUser />
      </div>
    );
  };
}
