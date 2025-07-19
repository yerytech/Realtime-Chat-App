/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useForm } from "../../hooks/useForm";
import "./LoginScreen.css";
import { AlertCustom } from "../../components/AlertCustom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LoginScreen = () => {
  const { formData, handleChange, resetValues, errors, validateForm } = useForm(
    {
      email: [
        (value) => (value ? null : "Email is required"),
        (value) => (/\S+@\S+\.\S+/.test(value) ? null : "Email is invalid"),
      ],
      password: [
        (value) => (value ? null : "Password is required"),
        (value) =>
          value.length >= 6 ? null : "Password must be at least 6 characters",
      ],
    }
  );
  const { fetchData, error, data, loading } = useApi({
    url: "/auth/login",
    method: "POST",
    body: formData,
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validateForm();
    await fetchData();
  };
  useEffect(() => {
    if (error !== null) {
      console.error("Login error:", error);
      AlertCustom({
        title: "Error!",
        text: error,
        icon: "error",
      });
    }
  }, [error]);

  useEffect(() => {
    if (data !== null) {
      resetValues();
      login(data);
      navigate("/chat"); // Uncomment this line if you want to navigate after login
    }
  }, [data]);

  return (
    <div className="LoginScreen">
      <div className="LoginBox">
        <h2>Login to ChatApp</h2>
        <form onSubmit={handleSubmit} noValidate className="LoginForm">
          <input
            value={formData.email || ""}
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
          />
          {errors.email && <span className="ErrorMessage">{errors.email}</span>}
          <input
            value={formData.password || ""}
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
          />
          {errors.password && (
            <span className="ErrorMessage">{errors.password}</span>
          )}
          <button disabled={loading} type="submit">
            {loading ? <span>Loading...</span> : "Login"}
          </button>
          <h5 className="LoginLink">
            Don't have an account? <a href="/register">Register</a>
          </h5>
        </form>
      </div>
    </div>
  );
};
