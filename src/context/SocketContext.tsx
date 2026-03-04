import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import socketio from "socket.io-client";
import { SOCKET_URL, ChefSocketEventEnum } from "../constants";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null;
  connected: boolean;
}>({
  socket: null,
  connected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, tenantId } = useAuth();
  const socketRef = useRef<ReturnType<typeof socketio> | null>(null);
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null,
  );
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // No token — disconnect any existing socket and bail
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Already have a live connection
    if (socketRef.current?.connected) return;

    const s = socketio(SOCKET_URL, {
      withCredentials: true,
      auth: { token },
      extraHeaders: {
        "x-tenant-id": tenantId ?? "",
      },
    });

    socketRef.current = s;

    // Fix #3: resolve connected state only once the handshake completes
    s.on("connect", () => {
      setSocket(s);
      setConnected(true);
    });

    s.on("disconnect", () => {
      setConnected(false);
    });

    s.on("connect_error", (err) => {
      console.error("[Socket] connection error:", err.message);
    });

    s.on(ChefSocketEventEnum.SOCKET_ERROR_EVENT, (data) => {
      console.log("[Socket] SOCKET_ERROR_EVENT data:", data);
      alert(
        "⚠️ Socket error event received.\n\n" +
        "Check the console for the data payload.\n\n" +
        "👉 Write the handler in:\n" +
        "src/context/SocketContext.tsx → SOCKET_ERROR_EVENT listener"
      );
    });

    s.on(ChefSocketEventEnum.ORDER_PLACED_EVENT, (data) => {
      console.log("[Socket] ORDER_PLACED_EVENT data:", data);
      alert(
        "🆕 New order placed event received.\n\n" +
        "Server sends only the order ID. Check the console for the raw payload.\n\n" +
        "👉 Write the handler in:\n" +
        "src/context/SocketContext.tsx → ORDER_PLACED_EVENT listener\n\n" +
        "Steps:\n" +
        "1. Extract the order ID from data\n" +
        "2. Fetch the full order from the API using that ID\n" +
        "3. Call addOrder(fullOrder) from useOrders()"
      );
    });

    s.on(ChefSocketEventEnum.ORDER_IN_PROGRESS_EVENT, (data) => {
      console.log("[Socket] ORDER_IN_PROGRESS_EVENT data:", data);
      alert(
        "🔄 Order in progress event received.\n\n" +
        "Server sends: { orderId, chefId } — the order ID and the chef who accepted it.\n" +
        "Check the console for the raw payload.\n\n" +
        "👉 Write the handler in:\n" +
        "src/context/SocketContext.tsx → ORDER_IN_PROGRESS_EVENT listener\n\n" +
        "Context: multiple chefs may see the same order. When one accepts it,\n" +
        "all others should have it removed from their dashboard.\n\n" +
        "Steps:\n" +
        "1. Get the current chef's ID from AuthContext\n" +
        "2. If data.chefId === currentChefId → this chef accepted it, update status to 'cooking'\n" +
        "3. If data.chefId !== currentChefId → another chef took it, remove it from this dashboard\n" +
        "   Hint: you'll need a removeOrder(orderId) function in OrdersContext"
      );
    });

    s.on(ChefSocketEventEnum.ORDER_CANCELLED_EVENT, (data) => {
      console.log("[Socket] ORDER_CANCELLED_EVENT data:", data);
      alert(
        "❌ Order cancelled event received.\n\n" +
        "Server sends only the order ID. Check the console for the raw payload.\n\n" +
        "👉 Write the handler in:\n" +
        "src/context/SocketContext.tsx → ORDER_CANCELLED_EVENT listener\n\n" +
        "Steps:\n" +
        "1. Extract the order ID from data\n" +
        "2. Call updateOrderStatus(orderId, 'cancelled') from useOrders()\n" +
        "   (No need to fetch full order — ID is enough to update status)"
      );
    });

    // Fix #2: disconnect and clean up when this effect re-runs or component unmounts
    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [token]); // Fix #5: re-runs automatically when token changes (login/logout)

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
