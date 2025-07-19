/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import "./chatStyles.css";

import { useForm } from "../../hooks/useForm";
import { useSignalR } from "../../service/SignalRServices";
import { AlertCustom } from "../../components/AlertCustom";

import { SelectUser } from "../../components/SelectUser";

type Message = {
  id: number;
  date: string; // ISO 8601 format, por ejemplo: "2025-07-19T21:00:00Z"
  content: string;
  sender: {
    id: number;
    username: string;
    email: string;
  };
  receiver: {
    id: number;
    username: string;
    email: string;
  };
};

type MessageResponse = {
  data: Message[];
  length: number;
};

export const ChatScreen = () => {
  const { logout, userId } = useAuth();
  const { connection } = useSignalR();
  const { formData, handleChange, resetValues } = useForm({
    msj: [(value) => (value ? null : "Message content is required")],
  });
  const [error, setError] = useState<string | null>(null);
  const {
    fetchData: getMessages,
    data: messages,
    // error,
    loading,
  } = useApi<MessageResponse>({
    url: "/message/chat/" + userId,
    method: "GET",
  });

  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          // console.log("Conectado a SignalR");

          connection.on("ReceiveMessage", (message) => {
            console.log("Nuevo mensaje recibido:", message);
            getMessages(); // recarga los mensajes
          });
        } else {
          console.log("La conexión ya está iniciada o en proceso.");
        }
      } catch (err) {
        console.error("Error al conectar:", err);
      }
    };

    startConnection();

    return () => {
      connection.off("ReceiveMessage");
    };
  }, [userId]);

  const { fetchData: sendMessage } = useApi({
    url: `/message/${userId}`,
    method: "POST",
    body: {
      content: formData.msj,
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.msj.trim()) {
      console.error("Message content cannot be empty");

      return;
    }
    if (!userId) {
      console.error("User ID is not defined");

      return;
    }
    await sendMessage();
    await getMessages();
    resetValues();
  };

  useEffect(() => {
    getMessages();
  }, [userId]);

  useEffect(() => {
    if (error !== null) {
      AlertCustom({
        title: "Error!",
        text: error,
        icon: "error",
      });
      setError(null);
    }
  }, [error]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-screen">
      <div className="chat-container">
        <div className="chat-header-container">
          <h2 className="chat-title">Chat Room</h2>
          <div>
            <h3 className="chat-users-title">Users</h3>

            <SelectUser />
          </div>

          <button onClick={logout} className="chat-out-button">
            Logout
          </button>
        </div>
        <div className="messages-container">
          <div className="messages">
            {loading && <p>Loading messages...</p>}
            {messages &&
              messages.data.map((e) => {
                return (
                  <div className="messageReversed" key={e.id}>
                    <h4
                      className={`${
                        e.sender.id !== userId
                          ? "message-sent"
                          : "message-received"
                      }`}
                    >
                      {e.content}
                    </h4>
                  </div>
                );
              })}
            <div ref={messagesEndRef} className="messages-end"></div>
          </div>
          <div className="footer">
            <form
              className="footer-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (formData.msj === undefined || formData.msj.trim() === "") {
                  console.error("Message content cannot be empty");
                  setError("Message content cannot be empty");
                  return;
                }
                if (!userId) {
                  console.error("User ID is not defined");
                  setError("User ID is not defined");
                  return;
                }
                handleSubmit(e);
              }}
            >
              <input
                name="msj"
                onChange={handleChange}
                value={formData.msj || ""}
                className="chat-input"
                type="text"
                placeholder="Type your message..."
              />
              <button type="submit" className="chat-send-button">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Chat components will go here */}
    </div>
  );
};
