import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSync } from "react-icons/fa";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    file: null,
  });
  const [filter, setFilter] = useState("All");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewItem({ ...newItem, file: e.target.files[0] });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setMenuItems([...menuItems, newItem]);
    setNewItem({ name: "", category: "", description: "", price: "", file: null });
  };

  const handleDeleteItem = (index) => {
    const actualIndex = filter === "All" 
      ? index 
      : menuItems.findIndex(item => item === filteredItems[index]);
    const updatedItems = menuItems.filter((_, i) => i !== actualIndex);
    setMenuItems(updatedItems);
  };

  const filteredItems = filter === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - you can add actual refresh logic here if needed
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="w-full p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#2b4c5b]">Menu Management</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 font-medium"
        >
          <FaSync className={`text-sm ${refreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>
      <form onSubmit={handleAddItem} className="mt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={newItem.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Drinks">Drinks</option>
            <option value="Veg & Non-Veg">Veg & Non-Veg</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={newItem.description}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newItem.price}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 p-2 rounded-lg text-white flex items-center gap-2">
          <FaPlus /> Add Menu Item
        </button>
      </form>

      {/* Filter buttons */}
      <div className="flex gap-3 mt-4">
        {["All", "Veg", "Non-Veg", "Drinks", "Veg & Non-Veg"].map((label) => (
          <button
            key={label}
            className={`px-5 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === label 
                ? "bg-[#2b4c5b] text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto mt-6">
        {filteredItems.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              {filter !== "All" && ` in ${filter} category`}
            </p>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-400 bg-gray-300">
                  <th className="text-left text-gray-600 py-2">ITEM NAME</th>
                  <th className="text-left text-gray-600 py-2">CATEGORY</th>
                  <th className="text-left text-gray-600 py-2">PRICE</th>
                  <th className="text-left text-gray-600 py-2">DESCRIPTION</th>
                  <th className="text-left text-gray-600 py-2">IMAGE</th>
                  <th className="text-left text-gray-600 py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-gray-800">{item.name}</td>
                    <td className="py-3 text-gray-800">{item.category}</td>
                    <td className="py-3 text-gray-800">{item.price}</td>
                    <td className="py-3 text-gray-800">{item.description}</td>
                    <td className="py-3">
                      {item.file ? (
                        <img src={URL.createObjectURL(item.file)} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="py-3 flex gap-4 text-gray-400">
                      <FaEdit className="cursor-pointer hover:text-blue-600" />
                      <FaTrash className="cursor-pointer hover:text-red-600" onClick={() => handleDeleteItem(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {menuItems.length === 0 
                ? "No menu items added yet. Add your first item above!"
                : `No items found in ${filter} category. Try selecting a different category.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
