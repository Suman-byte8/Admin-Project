import React from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page dark:bg-page px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-text-primary p-4">
            Forgot Your Password?
          </h2>
          <p className="text-[var(--text-secondary)] dark:text-text-secondary p-2">
            No problem. Just fill in your email address or username below
            and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6 p-2">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-muted mb-1 py-2"
              htmlFor="email_username"
            >
              Email or Username
            </label>
            <input
              className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-card dark:text-text-primary"
              id="email_username"
              name="email_username"
              placeholder="Email or Username"
              required=""
              type="text"
            />
          </div>
          <div>
            <button
              className="button_primary w-full bg-blue-500 hover:bg-accent/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        {/* Confirmation message */}
        <div className="block mt-6 text-center" id="confirmation-message">
          <div className="inline-flex items-center bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-lg">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fillRule="evenodd"
              ></path>
            </svg>
            <span>A password reset link has been sent to your email.</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            className="text-sm text-[var(--text-secondary)] dark:text-text-secondary hover:underline"
            to={"/log-in"}
          >
            <span aria-hidden="true">←</span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
