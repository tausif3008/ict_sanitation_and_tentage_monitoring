import React, { useEffect, useState } from "react";
import { Avatar, Button, Upload, message, Input, Select, Form } from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { basicUrl } from "../Axios/commonAxios";

const { Option } = Select;

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [originalUserData, setOriginalUserData] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  const headerstopost = {
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${basicUrl}/profile`, {
          method: "GET",
          headers: headers,
        });
        const result = await response.json();

        if (result.success) {
          setUserData(result.data);
          setOriginalUserData(result.data);
          setProfilePic(result.data.image || "https://via.placeholder.com/150");
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${basicUrl}/country`, {
          method: "GET",
          headers: headers,
        });
        const result = await response.json();
        if (result.success) {
          setCountries(result.data.countries || []);
        } else {
          message.error("Failed to load countries.");
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      }
    };

    fetchUserData();
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (userData.country_id) {
        try {
          const response = await fetch(
            `${basicUrl}/state?country_id=${userData?.country_id}`,
            {
              method: "GET",
              headers: headers,
            }
          );
          const result = await response.json();
          if (result.success) {
            setStates(result.data.states || []);
          } else {
            message.error("Failed to load states.");
          }
        } catch (error) {
          message.error("Error fetching states.");
        }
      }
    };

    fetchStates();
  }, [userData.country_id]);

  useEffect(() => {
    const fetchCities = async () => {
      if (userData.state_id) {
        try {
          const response = await fetch(
            `${basicUrl}/city?country_id=${userData.country_id}&state_id=${userData.state_id}`,
            {
              method: "GET",
              headers: headers,
            }
          );
          const result = await response.json();
          if (result.success) {
            setCities(result.data.cities || []);
          } else {
            message.error("Failed to load cities.");
          }
        } catch (error) {
          message.error("Error fetching cities.");
        }
      }
    };

    fetchCities();
  }, [userData.state_id]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setProfilePic(originalUserData.image || "https://via.placeholder.com/150");
    setIsEditing(false);
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setProfilePic(previewUrl);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("company", userData.company);
    formData.append("country_id", userData.country_id);
    formData.append("state_id", userData.state_id);
    formData.append("city_id", userData.city_id);
    formData.append("address", userData.address);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch(`${basicUrl}/profile`, {
        method: "POST",
        headers: headerstopost,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success("Profile updated successfully!");
        setOriginalUserData(userData);
        setIsEditing(false);
        setSelectedImage(null);
      } else {
        message.error(result.message || "Failed to update profile.");
      }
    } catch (error) {
      message.error("Error updating profile.");
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (value) => {
    setUserData({ ...userData, country_id: value, state_id: "", city_id: "" });
    setStates([]);
    setCities([]);
  };

  const handleStateChange = (value) => {
    setUserData({ ...userData, state_id: value, city_id: "" });
    setCities([]);
  };

  const handleCityChange = (value) => {
    setUserData({ ...userData, city_id: value });
  };

  const displayProfilePic = profilePic.includes("blob:")
    ? profilePic
    : `${basicUrl}/${profilePic}`;

  return (
    <div className="mt-3 mx-auto p-3 bg-white shadow-md rounded-lg w-full relative">
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={toggleEditMode}
        className="absolute right-4 top-4"
      />
      <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
        <div className="font-bold mb-5">User Profile</div>
      </div>

      <div className="flex gap-40">
        <div className="flex ml-6 flex-col items-center">
          <Avatar
            size={250}
            src={displayProfilePic || "https://via.placeholder.com/150"}
            alt="Profile Picture"
          />
          {isEditing && (
            <Upload
              name="profilePic"
              showUploadList={false}
              customRequest={() => {}}
              onChange={handleImageChange}
            >
              <Button
                icon={<UploadOutlined />}
                loading={loading}
                className="mt-4"
              >
                Upload New Picture
              </Button>
            </Upload>
          )}
        </div>
        <Form>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            <div>
              <span className="font-semibold">Name:</span>
              <Input
                className="rounded-none"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <span className="font-semibold">Mobile Number:</span>
              <Input
                className="rounded-none"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <span className="font-semibold">Email:</span>
              <Input
                className="rounded-none"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <span className="font-semibold">Company:</span>
              <Input
                className="rounded-none"
                name="company"
                value={userData.company}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              {" "}
              <span className="font-semibold">Country:</span>
              <Select
                value={userData.country_id || undefined}
                onChange={handleCountryChange}
                disabled={!isEditing}
              >
                {countries.map((country) => (
                  <Option key={country.country_id} value={country.country_id}>
                    {country.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <span className="font-semibold">State:</span>
              <Select
                value={userData.state_id || undefined}
                onChange={handleStateChange}
                disabled={!isEditing}
              >
                {states.map((state) => (
                  <Option key={state.state_id} value={state.state_id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <span className="font-semibold">City:</span>
              <Select
                value={userData.city_id || undefined}
                onChange={handleCityChange}
                disabled={!isEditing}
              >
                {cities.map((city) => (
                  <Option key={city.city_id} value={city.city_id}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <span className="font-semibold">Address:</span>
              <Input
                className="rounded-none"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </Form>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              onClick={handleSave}
              className="w-fit rounded-none bg-5c"
            >
              Save Changes
            </Button>
            <Button
              type="danger"
              onClick={handleCancel}
              className="w-fit rounded-none"
            >
              Cancel
            </Button>
          </Form.Item>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
