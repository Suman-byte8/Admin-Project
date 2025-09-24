import React from "react";
import { FaTrash } from "react-icons/fa";

export default function DeleteConfirmationDialog({
  deleteDialog,
  confirmDeleteUser,
  cancelDelete
}) {
  if (!deleteDialog.show) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <FaTrash className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteDialog.userName}</span>?
          This action cannot be undone and will permanently remove the user from the database.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteUser}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
