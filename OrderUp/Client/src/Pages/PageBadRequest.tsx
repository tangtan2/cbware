import { withRouter } from "react-router-dom";
import { RowSpacer } from "../Shared/Spacers";

export const PageBadRequest = withRouter(({ history }) => {
  return (
    <div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        400: Bad request
      </div>
      <RowSpacer size="large" />
      <div>Please try again.</div>
      <RowSpacer size="large" />
      <button onClick={() => history.go(-1)}>Back</button>
    </div>
  );
});
