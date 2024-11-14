import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import loginImage from "../assets/Images/loginImage.jpg";
import { useNavigate } from "react-router";
import { DICT } from "../urils/dictionary";
import { loginFetch } from "../Fetch/Axios";
import BeforeLoginUserTypeDropDown from "../register/user/BeforeLoginUserTypeDropDown";
import "./login.css";
import URLS from "../urils/URLS";

const headers = {
  "x-api-key": "YunHu873jHds83hRujGJKd873",
  "x-api-version": "1.0.1",
  "x-platform": "Web",
  "x-access-token": localStorage.getItem("sessionToken") || "",
};

const Login = () => {
  const localLang = localStorage.getItem("lang");
  const [lang, setLang] = useState(localLang || "en");
  const [canProceed, setCanProceed] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpStep, setOtpStep] = useState(false);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("user_type_id", values.user_type_id);
    formData.append("username", values.username);
    formData.append("platform", "Web");
    formData.append("password", values.password);
    setLoading(true);

    const res = await loginFetch(formData, setCanProceed);
    console.log(res);

    if (res) {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const formData = new FormData();
      formData.append("phone", phone);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(`${URLS.baseUrl}/resetpasswordrequest`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success("OTP sent successfully!");
        setOtpStep(true);
      } else {
        message.error(result.message || "Failed to send OTP.");
      }
    } catch (error) {
      message.error("Error in OTP request.");
      console.error("Error details:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("otp", otp);
      formData.append("password", newPassword);

      const response = await fetch(`${URLS.baseUrl}/resetpassword`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success("Password reset successfully!");
        setForgotPasswordVisible(false);
        setOtpStep(false);
        form.resetFields(); // Reset form fields
      } else {
        message.error("Failed to reset password.");
      }
    } catch (error) {
      message.error("Error resetting password.");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        clearInterval(intervalId);
        navigate("/sanitation-dashboard");
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [canProceed, navigate]);

  return (
    <div className="flex m-auto bg-gray-100">
      <div className="h-screen m-auto flex w-10/12 flex-col justify-center">
        <div className="grid md:grid-cols-2 grid-cols-1 w-full h-96 shadow-xl ">
          <div className="w-full h-96 hidden md:flex">
            <img src={loginImage} alt="login" className="w-full h-full" />
          </div>
          <div className="flex h-full flex-col w-full items-center">
            <div className="text-center font-merriweather p-2 font-semibold text-lg flex flex-col items-center w-full m-auto justify-center">
              <div className="text-center font-semibold text-xl w-full col-span-2 flex m-auto justify-center">
                <div className="flex flex-col">
                  <div className="text-orange-500">{DICT.title1[lang]}</div>
                  <hr className="mt-1 mb-1 text-yellow-900" />
                  <div
                    className="text-green-800"
                    style={{ paddingBottom: "50px" }}
                  >
                    {DICT.title2[lang]}
                  </div>
                </div>
              </div>
              <div className="w-10/12">
                <div className="flex w-full gap-4">
                  <Form
                    className="w-full gap-5"
                    form={form}
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <BeforeLoginUserTypeDropDown form={form} />

                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your mobile number!",
                        },
                      ]}
                      style={{ marginTop: "15px", marginBottom: "30px" }}
                    >
                      <Input
                        autoComplete="off"
                        prefix={<UserOutlined />}
                        placeholder="Mobile Number"
                        className="rounded-none"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        autoComplete="off"
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        className="rounded-none"
                      />
                    </Form.Item>
                    <Form.Item noStyle>
                      <div className="flex justify-between">
                        <Button
                          type="primary"
                          onClick={() => setForgotPasswordVisible(true)}
                          className="bg-orange-400 text-white ml-2"
                        >
                          Forget Password ?
                        </Button>
                        <Button
                          loading={loading}
                          type="primary"
                          htmlType="submit"
                          className="bg-orange-400 text-white ml-2"
                        >
                          Login
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {/ Forgot Password Modal /} */}
      <Modal
        title="Forgot Password"
        visible={forgotPasswordVisible}
        onCancel={() => {
          setForgotPasswordVisible(false);
          form.resetFields(); // Reset form fields when modal is closed
        }}
        footer={null}
      >
        {!otpStep ? (
          <>
            <Input
              title="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <Button
              type="primary"
              onClick={handleForgotPassword}
              className="w-full"
            >
              Get OTP
            </Button>
          </>
        ) : (
          <>
            <Input
              title="OTP"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <Input.Password
              title="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <Button
              type="primary"
              onClick={handleResetPassword}
              className="w-full"
            >
              Save
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Login;
