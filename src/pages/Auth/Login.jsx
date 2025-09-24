import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const adminContext = useContext(AdminContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      const result = await adminContext.login(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page dark:bg-page px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-card p-8 shadow-lg">
        <h1 className="p-2 text-center text-3xl font-bold text-[var(--text-primary)] dark:text-text-primary">
          Admin Login
        </h1>
        <p className="p-2 text-center text-[var(--text-secondary)] dark:text-text-secondary">
          Welcome back! Please enter your details.
        </p>
        {/* <p className="text-center text-sm text-[var(--text-secondary)] dark:text-text-secondary mb-6">
            Or{" "}
            <Link
              className="font-medium text-[var(--text-secondary)] dark:text-text-secondary hover:underline"
              to="/admin/signup"
            >
              Create a new account
            </Link>
          </p> */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 py-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700 dark:text-muted"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
              id="email"
              name="email"
              placeholder="admin@hotel.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-bold text-gray-700 dark:text-muted"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              className="button_primary w-full bg-blue-500 hover:bg-accent/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={adminContext.loading}
            >
              {adminContext.loading ? "Signing In..." : "Login"}
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link
              className="text-sm text-[var(--text-secondary)] dark:text-text-secondary hover:underline"
              to={"/forgot-password"}
            >
              Forgot Password?
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
