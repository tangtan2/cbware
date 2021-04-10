export type UserRoleType = "administrator" | "user" | "warehouse";

export type UserType = {
  id: string;
  name: string;
  userRole: UserRoleType;
  username: string;
  email: string;
  verified: Date | null;
  verifierUserId: string | null;
};

export type OrderType = {
  id: string;
  part: string;
  userId: string;
  quantity: number;
  notes: string | null;
  placed: Date;
  completed: Date | null;
  completedNotes: string | null;
  orderer: string;
  workOrder: string;
};

export type APIResponseType = {
  responseType: "401" | "400" | "200";
  responseData: any;
};

export type PostUserLoginType = {
  username: string;
  password: string;
};

export type PostNewOrdersType = {
  part: string;
  quantity: number;
  notes: string | null;
  orderer: string;
  workOrder: string;
};

export type PostOrderUpdateType = {
  id: string;
  completedNotes: string | null;
};

export type PostVerifyUserType = {
  username: string;
  webSessionId: string;
};

export type PostNewUserType = {
  username: string;
  name: string;
  email: string;
  userRole: string;
  password: string;
};

export type HandleNewOrderChanges = {
  getPart: () => string;
  setPart: (newPart: string) => void;
  getQuantity: () => number;
  setQuantity: (newQuantity: number) => void;
  getNotes: () => string;
  setNotes: (newNotes: string) => void;
  getOrderer: () => string;
  setOrderer: (newOrderer: string) => void;
  getWorkOrder1: () => string;
  setWorkOrder1: (newWorkOrder1: string) => void;
  getWorkOrder1Error: () => boolean;
  setWorkOrder1Error: (newWorkOrder1Error: boolean) => void;
  getWorkOrder2: () => string;
  setWorkOrder2: (newWorkOrder2: string) => void;
  getWorkOrder2Error: () => boolean;
  setWorkOrder2Error: (newWorkOrder2Error: boolean) => void;
  getId: () => number;
};
