import React, { useEffect, useState } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import api from "./api";

const Profile = () => {
  const emptyAddress = {
    street: "",
    apt: "",
    state: "",
    zip: "",
    country: "Bangladesh",
  };

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    nickname: "",
    dob: "",
    default_address_type: "billing",
    billing: emptyAddress,
    shipping: emptyAddress,
  });

  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ------------------------------------------------
  // Load Profile
  // ------------------------------------------------
  useEffect(() => {
    api
      .get("profile/")
      .then((res) => {
        setProfile(res.data);
        setFormData(buildForm(res.data));
        setLoading(false);
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  // ------------------------------------------------
  // Convert profile → form fields
  // ------------------------------------------------
  const parseAddress = (addr) => {
    if (!addr) return { ...emptyAddress };
    const parts = addr.split(",");
    return {
      street: parts[0]?.trim() || "",
      apt: parts[1]?.trim() || "",
      state: parts[2]?.trim() || "",
      zip: parts[3]?.trim() || "",
      country: "Bangladesh",
    };
  };

  const buildForm = (data) => ({
    first_name: data.user?.first_name || "",
    last_name: data.user?.last_name || "",
    username: data.user?.username || "",
    email: data.user?.email || "",
    phone_number: data.phone_number || "",
    nickname: data.nickname || "",
    dob: data.dob || "",
    default_address_type: data.default_address_type || "billing",

    billing: parseAddress(data.billing_address),
    shipping: parseAddress(data.shipping_address),
  });

  // ------------------------------------------------
  // Edit / Save handlers
  // ------------------------------------------------
  const handleEdit = (field) => setEditingField(field);
  const handleCancel = () => setEditingField(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Address field
    if (editingField?.includes("_")) {
      const [type, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const convertAddressToString = (addr) =>
    `${addr.street}, ${addr.apt}, ${addr.state}, ${addr.zip}`;

  const handleSave = async () => {
    const payload = {
      user: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      },
      phone_number: formData.phone_number,
      nickname: formData.nickname,
      dob: formData.dob,
      billing_address: convertAddressToString(formData.billing),
      shipping_address: convertAddressToString(formData.shipping),
      default_address_type: formData.default_address_type,
    };

    try {
      const res = await api.patch("profile/", payload);
      setProfile(res.data);
      setFormData(buildForm(res.data));
      setEditingField(null);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // ------------------------------------------------
  // Upload Profile Picture
  // ------------------------------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("profile_picture", file);

    setUploading(true);

    try {
      const res = await api.patch("profile/", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-8 text-gray-500">Loading profile...</p>
    );

  // ------------------------------------------------
  // Render
  // ------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">

      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6 relative group">
        <img
          src={
            profile.profile_picture
              ? `http://localhost:8000${profile.profile_picture}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          className="w-24 h-24 rounded-full border-2 object-cover border-indigo-500"
          alt="Profile"
        />

        <label className="absolute bottom-1 right-[40%] bg-indigo-600 text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100">
          <input type="file" className="hidden" onChange={handleImageUpload} />
          <FiEdit2 size={16} />
        </label>

        {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
      </div>

      <h2 className="text-xl font-semibold text-center">
        {formData.first_name} {formData.last_name}
      </h2>
      <p className="text-center text-gray-500 mb-6">@{formData.username}</p>

      {/* Normal Fields */}
      {[
        { label: "First Name", name: "first_name" },
        { label: "Last Name", name: "last_name" },
        { label: "Email", name: "email" },
        { label: "Phone Number", name: "phone_number" },
        { label: "Nickname", name: "nickname" },
        { label: "Date of Birth", name: "dob", type: "date" },
      ].map((field) => (
        <FieldRow
          key={field.name}
          field={field}
          formData={formData}
          editingField={editingField}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={handleChange}
        />
      ))}

      {/* Address Section */}
      <h3 className="text-md font-semibold mt-6 mb-3">Address Information</h3>

      {["billing", "shipping"].map((type) => {
        const addr = formData[type] || emptyAddress;

        return (
          <div key={type} className="border-b py-3">
            <div className="flex justify-between">
              <p className="font-medium capitalize">{type} Address</p>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(`${type}_address`)}>
                  <FiEdit2 className="text-gray-500 hover:text-indigo-500" />
                </button>

                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="default_address"
                    checked={formData.default_address_type === type}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        default_address_type: type,
                      }))
                    }
                    className="accent-indigo-600"
                  />
                  Default
                </label>
              </div>
            </div>

            {editingField === `${type}_address` ? (
              <div className="mt-3 space-y-2">
                {["street", "apt", "state", "zip"].map((f) => (
                  <input
                    key={f}
                    type="text"
                    name={`${type}.${f}`}
                    placeholder={f.toUpperCase()}
                    value={addr[f]}
                    onChange={handleChange}
                    className="border w-full p-2 rounded text-sm"
                  />
                ))}

                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 text-white rounded mt-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-400 text-white rounded mt-2 ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-gray-700 mt-2">
                {addr.street}, {addr.apt}, {addr.state}, {addr.zip},{" "}
                {addr.country}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------
// FIELD COMPONENT
// ------------------------------------------------
const FieldRow = ({
  field,
  formData,
  editingField,
  onEdit,
  onCancel,
  onSave,
  onChange,
}) => (
  <div className="flex justify-between items-center border-b py-2">
    <div className="w-full">
      <p className="text-sm text-gray-500">{field.label}</p>

      {editingField === field.name ? (
        <input
          type={field.type || "text"}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={onChange}
          className="mt-1 w-full border p-2 rounded text-sm"
        />
      ) : (
        <p className="text-md font-medium">{formData[field.name] || "N/A"}</p>
      )}
    </div>

    {editingField === field.name ? (
      <div className="flex gap-2 ml-2">
        <button onClick={onSave}>
          <FiCheck className="text-green-500" />
        </button>
        <button onClick={onCancel}>
          <FiX className="text-red-500" />
        </button>
      </div>
    ) : (
      <button onClick={() => onEdit(field.name)}>
        <FiEdit2 className="text-gray-500 hover:text-indigo-500" />
      </button>
    )}
  </div>
);

export default Profile;
