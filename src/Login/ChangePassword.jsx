import React, { useState } from "react";
import { Button, Form, message } from "antd";
import URLS from "../urils/URLS";
import CustomInput from "../commonComponents/CustomInput";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const headers = {
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  const handleChangePassword = async (data) => {
    try {
      if (data?.confirmPassword !== data?.newPassword) {
        message.error("Passwords do not match.");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("password", data?.confirmPassword);

      const response = await fetch(`${URLS.baseUrl}/change-password`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        message.success("Password changed successfully!");
        form.resetFields();
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
        form={form}
        onFinish={handleChangePassword}
        layout="vertical"
        autoComplete="off"
      >
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <CustomInput
            name="newPassword"
            label={"New Password:"}
            placeholder="Password"
            maxLength={15}
            autoComplete="off"
            isPassword={true}
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters.",
              },
            ]}
            className={"mt-2"}
          />
          <CustomInput
            name="confirmPassword"
            label={"Confirm Password:"}
            placeholder="Password"
            maxLength={15}
            autoComplete="off"
            isPassword={true}
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters.",
              },
            ]}
            className={"mt-2"}
          />
          {/* <div>
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
          </div> */}
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
