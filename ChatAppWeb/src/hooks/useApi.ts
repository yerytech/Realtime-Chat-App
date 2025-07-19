import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  url: string;
  method?: string; // 'GET', 'POST', etc.
  body?: unknown;
  headers?: Record<string, string>;
}

export const useApi = <T>({ url, method = "GET", body, headers }: Props) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { token } = useAuth();
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios({
        url: `${baseUrl}${url}`,
        method,
        data: body,
        headers: {
          "Content-Type": "application/json",
          ...headers,
          Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, error, data, loading };
};
