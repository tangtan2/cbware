import {
  APIResponseType,
  PostNewOrdersType,
  PostNewUserType,
  PostOrderUpdateType,
  PostUserLoginType,
  PostVerifyUserType,
} from "../globalTypes";

export default class OrderUpAPI {
  private _webSessionId: string;

  constructor() {
    this._webSessionId = localStorage.getItem("@order-up-session-id") ?? "";
  }

  get webSessionId() {
    return this._webSessionId;
  }

  set webSessionId(authenticatedId: string) {
    this._webSessionId = authenticatedId;
  }

  private _getEndpoint = async (endpoint: string): Promise<APIResponseType> => {
    const baseURL = process.env.REACT_APP_API_URL;
    const fullURL = baseURL + endpoint;
    const response = await fetch(fullURL, {
      method: "GET",
      headers: {
        "X-websession": this._webSessionId,
      },
    });
    if (response.status === 401) {
      return { responseType: "401", responseData: await response.json() };
    }
    if (response.status === 400) {
      return { responseType: "400", responseData: await response.json() };
    }
    if (response.status !== 200) {
      const json = await response.json();
      throw json;
    }
    return { responseType: "200", responseData: await response.json() };
  };

  private _postEndpoint = async (
    endpoint: string,
    data: object
  ): Promise<APIResponseType> => {
    const baseURL = process.env.REACT_APP_API_URL;
    const fullURL = baseURL + endpoint;
    const response = await fetch(fullURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-websession": this._webSessionId,
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      return { responseType: "401", responseData: await response.json() };
    }
    if (response.status === 400) {
      return { responseType: "400", responseData: await response.json() };
    }
    if (response.status !== 200) {
      const json = await response.json();
      throw json;
    }
    return { responseType: "200", responseData: await response.json() };
  };

  public getAuthenticateAndVerifyWebSession = () => {
    return this._getEndpoint(`/api/user/authenticate-verify`);
  };

  public postUserLogin = (data: PostUserLoginType) => {
    return this._postEndpoint("/api/user/login", data);
  };

  public postUserLogout = () => {
    return this._postEndpoint("/api/user/logout", {});
  };

  public postNewUser = (data: PostNewUserType) => {
    return this._postEndpoint("/api/user/new", data);
  };

  public getActiveOrdersPerUser = () => {
    return this._getEndpoint(`/api/order/active`);
  };

  public getAllActiveOrders = () => {
    return this._getEndpoint("/api/order/active/all");
  };

  public postNewOrders = (data: PostNewOrdersType[]) => {
    return this._postEndpoint(`/api/order/new`, data);
  };

  public postUpdatedOrder = (data: PostOrderUpdateType) => {
    return this._postEndpoint(`/api/order/update`, data);
  };

  public getAllOrderParts = () => {
    return this._getEndpoint("/api/order/parts");
  };

  public getAllUsers = () => {
    return this._getEndpoint("/api/user/all");
  };

  public getUserDetails = () => {
    return this._getEndpoint(`/api/user/details`);
  };

  public postVerifyUser = (data: PostVerifyUserType) => {
    return this._postEndpoint("/api/user/verify", data);
  };
}
