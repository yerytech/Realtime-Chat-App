import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

type User = {
  id: number;
  username: string;
  email: string;
};

type DataUser = {
  data: User[];
  length: number;
};

export const SelectUser = () => {
  const [open, setOpen] = useState(false);
  const { getIdToSendMessage } = useAuth();

  const {
    fetchData: getUsers,
    data: users,
    loading,
  } = useApi<DataUser>({
    url: "/Users",
    method: "GET",
  });

  useEffect(() => {
    if (open && !users) {
      getUsers();
    }
  }, [getUsers, open, users]);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Ver Usuarios
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10 overflow-y-auto max-h-64">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Cargando...</div>
          ) : (
            users?.data.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  getIdToSendMessage(u.id);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
              >
                {u.username}
              </button>
            ))
          )}
          {users?.data.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No hay usuarios
            </div>
          )}
        </div>
      )}
    </div>
  );
};
