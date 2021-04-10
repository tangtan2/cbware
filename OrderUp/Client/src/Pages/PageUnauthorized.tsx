import { withRouter } from "react-router-dom";
import { RowSpacer } from "../Shared/Spacers";

export const PageUnauthorized = withRouter(({ history }) => {
  return (
    <div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        401: Unauthorized
      </div>
      <RowSpacer size="large" />
      <div>
        Please check that you have logged in and your account is verified. If
        your account is not verified, please ask an administrator to verify your
        account.
      </div>
      <RowSpacer size="large" />
      <button onClick={() => history.push("/login")}>Go to Dashboard</button>
    </div>
  );
});
