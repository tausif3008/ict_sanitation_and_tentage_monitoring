import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import URLS from "../urils/URLS";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  const handleChangePassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        message.error("Please enter both password fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        message.error("Passwords do not match.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("password", newPassword);

      const response = await fetch(`${URLS.baseUrl}/change-password`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success("Password changed successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        message.error("Failed to change password.");
      }
    } catch (error) {
      message.error("Error changing password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 mx-auto p-3 bg-white shadow-md rounded-lg w-full relative">
      <div className="text-2xl font-bold mb-4">Change Password</div>

      <Form
        onFinish={handleChangePassword}
        layout="vertical"
        autoComplete="off"
      >
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <span className="font-semibold">New Password:</span>
            <Input.Password
              className="rounded-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <span className="font-semibold">Confirm Password:</span>
            <Input.Password
              className="rounded-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <br></br>
        <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-fit rounded-none bg-5c"
            >
              Save Changes
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;
