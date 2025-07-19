import { useForm } from "../../hooks/useForm";
import { useApi } from "../../hooks/useApi";
import { useEffect } from "react";
import { AlertCustom } from "../../components/AlertCustom";
import { useNavigate } from "react-router-dom";

export const RegisterScreen = () => {
  const { formData, handleChange, resetValues, errors, validateForm } = useForm(
    {
      username: [
        (value) => (value ? null : "Username is required"),
        (value) =>
          value.length >= 3 ? null : "Username must be at least 3 characters",
      ],
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
  const navigation = useNavigate();
  const { fetchData, error, data, loading } = useApi({
    url: "/auth/register",
    method: "POST",
    body: formData,
  });

  useEffect(() => {
    if (error) {
      console.error("Registration error:", error);
      AlertCustom({
        title: "Error!",
        text: error,
        icon: "error",
      });
    }

    if (data !== null) {
      console.log("User registered successfully:", data);

      AlertCustom({
        title: "Success!",
        text: "User registered successfully.",
        icon: "success",
      });
      navigation("/login");
      resetValues();
    }
  }, [data, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // resetValues();
    validateForm();
    await fetchData();
  };

  return (
    <div className="LoginScreen">
      <div className="LoginBox">
        <h2>Register to ChatApp</h2>
        <form onSubmit={handleSubmit} noValidate className="LoginForm">
          <input
            value={formData.username || ""}
            name="username"
            onChange={handleChange}
            type="text"
            placeholder="Username"
            required
          />
          {errors.username && (
            <span className="ErrorMessage">{errors.username}</span>
          )}
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
            {loading ? <span>Loading...</span> : "Register"}
          </button>
          <h5 className="LoginLink">
            Already have an account? <a href="/login">Login</a>
          </h5>
        </form>
        <div>{error && <span className="ErrorMessage">{error}</span>}</div>
      </div>
    </div>
  );
};
