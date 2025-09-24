import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const { register, loading } = useContext(AdminContext);
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });

      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-page dark:bg-page px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-card p-8 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-text-primary text-center mb-2">
            Create your account
          </h2>
          <p className="text-center text-sm text-[var(--text-secondary)] dark:text-text-secondary mb-6">
            Or{" "}
            <a
              className="font-medium text-[var(--text-secondary)] dark:text-text-secondary hover:underline"
              href="/log-in"
            >
              sign in to your existing account
            </a>
          </p>
        </div>
        <form className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-muted mb-1"
                  htmlFor="first-name"
                >
                  First Name
                </label>
                <input
                  className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
                  id="first-name"
                  name="firstName"
                  placeholder="John"
                  required=""
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-muted mb-1"
                  htmlFor="last-name"
                >
                  Last Name
                </label>
                <input
                  className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
                  id="last-name"
                  name="lastName"
                  placeholder="Doe"
                  required=""
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-muted mb-1"
                htmlFor="email-address"
              >
                Email address
              </label>
              <input
                autoComplete="email"
                className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
                id="email-address"
                name="email"
                placeholder="john.doe@example.com"
                required=""
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-muted mb-1"
                htmlFor="phone-number"
              >
                Phone Number
              </label>
              <input
                className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
                id="phone-number"
                name="phoneNumber"
                placeholder="+1 (555) 123-4567"
                required=""
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-muted mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                autoComplete="new-password"
                className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
                id="password"
                name="password"
                placeholder="••••••••"
                required=""
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-muted mb-1"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                autoComplete="new-password"
                className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
                id="confirm-password"
                name="confirmPassword"
                placeholder="••••••••"
                required=""
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

          </div>
          <div>
            <button
              className="button_primary w-full bg-blue-500 hover:bg-accent/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
