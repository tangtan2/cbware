import { withRouter } from "react-router-dom";
import { RowSpacer } from "../Shared/Spacers";

export const PageNotFound = withRouter(({ history }) => {
  return (
    <div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        404: Not found
      </div>
      <RowSpacer size="large" />
      <button onClick={() => history.push("/login")}>Go to Dashboard</button>
    </div>
  );
});
