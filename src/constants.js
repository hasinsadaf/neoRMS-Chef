export const BACKEND_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const ChefSocketEventEnum = Object.freeze({
  // once user is ready to go
  CONNECTED_EVENT: "connected",
  // when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // when user places an order
  ORDER_PLACED_EVENT: "orderPlaced",
  // when order is in progress
  ORDER_IN_PROGRESS_EVENT: "orderInProgress",
  // when user cancels an order
  ORDER_CANCELLED_EVENT: "orderCancelled",
});
