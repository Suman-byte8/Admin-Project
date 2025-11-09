import React, { useState, useEffect, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, IconButton, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import { addFacility, updateFacility } from "../../services/facilities";
import { AdminContext } from "@/context/AdminContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function EditFacilityModal({ isOpen, onClose, onSave, facility }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { getToken } = useContext(AdminContext);

  useEffect(() => {
    if (isOpen && facility) {
      setFormData({
        title: facility.title || "",
        subtitle: facility.subtitle || "",
        description: facility.description || ""
      });
    }
  }, [isOpen, facility]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const token = getToken();
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('subtitle', formData.subtitle);
    submitData.append('description', formData.description);
    if (image) {
      submitData.append('image', image);
    }

    try {
      const updatedFacility = await updateFacility(facility._id, submitData, token);
      if (onSave) {
        onSave(updatedFacility);
      }
      handleClose();
    } catch (error) {
      console.error("Error updating facility:", error);
      alert("Error updating facility");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: ""
    });
    setImage(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Edit Facility
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField
            label="Title *"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
          />
          
          <TextField
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            fullWidth
          />
          
          <TextField
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            fullWidth
          />
          
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="edit-facility-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="edit-facility-image">
              <Button variant="outlined" component="span">
                {image ? "Change Image" : "Upload New Image"}
              </Button>
            </label>
            {image && (
              <Box mt={1}>
                <small>Selected: {image.name}</small>
              </Box>
            )}
            {facility?.image && !image && (
              <Box mt={1}>
                <small>Current image will be kept</small>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Update Facility"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
