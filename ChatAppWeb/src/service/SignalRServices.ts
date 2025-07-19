// signalr.ts
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "../context/AuthContext";

export const useSignalR = () => {
  const { token } = useAuth();
  if (!token) {
    throw new Error("Token is required to establish SignalR connection");
  }

  const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5249/chatHub", {
      withCredentials: true,
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  return { connection };
};
