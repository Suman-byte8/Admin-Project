// src/pages/PageManagement/AdminDistinctivePreview.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Distinctive from "./Distinctive/Distinctive";
import DescLayout from "./Distinctive/DescLayout";
import { FaTrash, FaEdit, FaPlus, FaList, FaEye } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import {
  fetchDistinctives,
  addDistinctive,
  updateDistinctive,
  deleteDistinctive,
} from "../../services/distinctive";
import { AdminContext } from "@/context/AdminContext";
import { toast } from "react-toastify";

const AdminDistinctivePreview = () => {
  const [distinctives, setDistinctives] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // form state (create OR edit)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // create-only: local files + previews
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // edit-only: manage existing URLs (no upload here to keep backend untouched)
  const [existingUrls, setExistingUrls] = useState([]);

  const [selectedLink, setSelectedLink] = useState(null);
  const [activeTab, setActiveTab] = useState("features");
  const [showForm, setShowForm] = useState(false);

  const { getToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    void loadDistinctives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadDistinctives = async () => {
    try {
      const data = await fetchDistinctives(token);
      if (data?.success && Array.isArray(data.data)) {
        setDistinctives(data.data);
        setSelectedLink((prev) => prev ?? data.data[0] ?? null);
      } else {
        setDistinctives([]);
      }
    } catch (err) {
      console.error("Error fetching distinctives:", err);
      setDistinctives([]);
    }
  };

  // =============== CRUD HANDLERS ===============

  const startAdd = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setNewFiles([]);
    setNewPreviews([]);
    setExistingUrls([]); // not used for add
    setShowForm(true);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setExistingUrls(item.images || []);
    setNewFiles([]); // not supported in edit pathway (no upload)
    setNewPreviews([]);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setNewFiles([]);
    setNewPreviews([]);
    setExistingUrls([]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        // UPDATE (JSON ONLY)
        await updateDistinctive(
          editingItem._id,
          { title, description, images: existingUrls },
          token
        );
        toast.success("Feature updated successfully");
      } else {
        // CREATE (multipart)
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        newFiles.forEach((file) => formData.append("images", file));

        await addDistinctive(formData, token);
        toast.success("Feature added successfully");
      }

      await loadDistinctives();
      cancelForm();
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save feature");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this feature?")) return;
    try {
      await deleteDistinctive(id, token);
      toast.success("Feature deleted successfully");
      await loadDistinctives();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete feature");
    }
  };

  // =============== FILE HANDLING (CREATE ONLY) ===============

  const handleCreateFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const compressed = await Promise.all(
        files.map((file) =>
          imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 1920 })
        )
      );

      const asFiles = compressed.map(
        (blob, i) => new File([blob], files[i].name, { type: blob.type })
      );

      setNewFiles((prev) => [...prev, ...asFiles]);
      setNewPreviews((prev) => [
        ...prev,
        ...asFiles.map((f) => URL.createObjectURL(f)),
      ]);
    } catch (err) {
      console.error("Compression failed:", err);
    }
  };

  const removeNewPreview = (i) => {
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  // =============== EDIT IMAGES (URLs ONLY) ===============

  const removeExistingUrl = (i) => {
    setExistingUrls((prev) => prev.filter((_, idx) => idx !== i));
  };

  // =============== UI ===============

  const listGrid = useMemo(
    () =>
      distinctives.map((d) => (
        <div
          key={d._id}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow"
        >
          {d.images?.[0] && (
            <img
              src={d.images[0]}
              alt={d.title}
              className="rounded-lg mb-3 w-full h-32 object-cover"
            />
          )}
          <h3 className="text-lg font-semibold mb-2">{d.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {d.description}
          </p>
          <div className="flex justify-between">
            <button
              className="text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
              onClick={() => startEdit(d)}
            >
              <FaEdit className="text-sm" /> Edit
            </button>
            <button
              className="text-red-600 flex items-center gap-1 hover:text-red-800 transition-colors"
              onClick={() => onDelete(d._id)}
            >
              <FaTrash className="text-sm" /> Delete
            </button>
          </div>
        </div>
      )),
    [distinctives]
  );

  const renderTabContent = () => {
    if (activeTab === "features") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Manage Features</h3>
            <button
              onClick={startAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Add New Feature
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listGrid}

            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <button
                onClick={startAdd}
                className="text-blue-600 flex flex-col items-center gap-2 hover:text-blue-800 transition-colors"
              >
                <FaPlus className="text-2xl" />
                <span>Add New Feature</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "preview") {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Individual Preview</h3>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              {distinctives.map((d) => (
                <button
                  key={d._id}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    selectedLink?._id === d._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedLink(d)}
                >
                  {d.title}
                </button>
              ))}
            </div>

            {selectedLink && (
              <div className="rounded-lg p-4 bg-gray-50">
                <DescLayout desc={selectedLink} isAdminPreview />
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === "fullPreview") {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Full Layout Preview</h3>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="max-h-[75vh] overflow-y-auto rounded-lg">
              <Distinctive distinctives={distinctives} isAdminPreview />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Previous Page
      </button>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Distinctive Features Management
        </h2>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "features"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("features")}
          >
            <FaList /> Features
          </button>
          <button
            className={`px-6 py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "preview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("preview")}
          >
            <FaEye /> Preview
          </button>
          <button
            className={`px-6 py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "fullPreview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("fullPreview")}
          >
            Full Preview
          </button>
        </div>
      </div>

      {renderTabContent()}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? "Edit Feature" : "Add New Feature"}
          </h3>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded p-2 w-full h-28"
                required
              />
            </div>

            {/* CREATE: file upload */}
            {!editingItem && (
              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCreateFiles}
                  className="border rounded p-2 w-full"
                />
                {newPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {newPreviews.map((src, i) => (
                      <div key={i} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${i}`}
                          className="w-full h-24 object-cover rounded-lg shadow"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewPreview(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EDIT: existing image URL management */}
            {editingItem && existingUrls.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Existing Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {existingUrls.map((url, i) => (
                    <div key={url + i} className="relative">
                      <img
                        src={url}
                        alt={`Existing ${i}`}
                        className="w-full h-24 object-cover rounded-lg shadow"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingUrl(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  To keep backend unchanged, editing supports removing images but not uploading new ones.
                  Create a new feature if you need to upload fresh images.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 rounded bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
                {editingItem ? "Update" : "Add"} Feature
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDistinctivePreview;
