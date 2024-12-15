import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import loginImage from "../assets/Images/loginImage.jpg";
import { useNavigate } from "react-router";
import { DICT } from "../utils/dictionary";
import { loginFetch } from "../Fetch/Axios";
import BeforeLoginUserTypeDropDown from "../register/user/BeforeLoginUserTypeDropDown";
import "./login.css";
import URLS from "../urils/URLS";
import { checkLoginAvailability } from "../constant/const";
import CustomInput from "../commonComponents/CustomInput";
import { useDispatch } from "react-redux";
import { storeToken } from "./slice/loginSlice";

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
  const [loading, setLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false);

  const [form] = Form.useForm();
  const [forgotForm] = Form.useForm(); // forgot
  const [resetForm] = Form.useForm(); // set new password
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString
    ? JSON.parse(sessionDataString)
    : null;

  useEffect(() => {
    if (sessionData) {
      checkLoginAvailability(sessionData, navigate); // if user is already login then it they should not able to visit login page
    }
  }, [sessionData]);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("user_type_id", values.user_type_id);
    formData.append("username", values.username);
    formData.append("platform", "Web");
    formData.append("password", values.password);
    setLoading(true);

    const res = await loginFetch(formData, setCanProceed);
    const resData = res?.data?.sessionData?.[0];
    dispatch(storeToken(res?.sessionToken));

    setLoading(false);
    if (resData) {
      checkLoginAvailability(resData, navigate);
    }
  };

  // forgot password
  const handleForgotPassword = async (value) => {
    setPhone(value?.phone);
    try {
      const formData = new FormData();
      formData.append("phone", value);

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

  // reset password
  const handleResetPassword = async (value) => {
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("otp", value?.otp);
      formData.append("password", value?.newPassword);

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

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const sessionToken = localStorage.getItem("sessionToken");
  //     const role_id = localStorage.getItem("role_id");
  //     if (sessionToken) {
  //       clearInterval(intervalId);
  //       if (role_id === "8") {
  //         navigate("/vendor-dashboard"); // vendor login
  //       } else {
  //         navigate("/sanitation-dashboard");
  //       }
  //     }
  //   }, 1000);
  //   return () => clearInterval(intervalId);
  // }, [canProceed, navigate]);

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
              <div className="w-8/12">
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
                    {/* <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your mobile number!",
                        },
                        {
                          pattern: /^[0-9]{10}$/,
                          message:
                            "Please enter a valid 10-digit mobile number",
                        },
                      ]}
                      className="my-8"
                    >
                      <Input
                        maxLength={10}
                        autoComplete="off"
                        prefix={<UserOutlined />}
                        placeholder="Mobile Number"
                        className="rounded-none"
                      />
                    </Form.Item> */}
                    <CustomInput
                      name="username"
                      type="number"
                      placeholder="Mobile Number"
                      maxLength={10}
                      autoComplete="off"
                      accept={"onlyNumber"}
                      prefix={<UserOutlined />}
                      isPassword={false}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your mobile number!",
                        },
                        {
                          pattern: /^[0-9]{10}$/,
                          message:
                            "Please enter a valid 10-digit mobile number",
                        },
                      ]}
                      className={"mt-2"}
                    />
                    <CustomInput
                      name="password"
                      placeholder="Password"
                      maxLength={15}
                      autoComplete="off"
                      prefix={<LockOutlined />}
                      isPassword={true}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                        // {
                        //   min: 6,
                        //   message: "Password must be at least 6 characters.",
                        // },
                      ]}
                      className={"mt-2"}
                    />
                    {/* <Form.Item
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
                        onKeyDown={(event) => {
                          const invalidChars = ["'", '"', ";", "-", "\\"];
                          if (invalidChars.includes(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item> */}
                    <Form.Item noStyle>
                      <div className="flex justify-between">
                        <Button
                          loading={loading}
                          type="primary"
                          htmlType="submit"
                          className="bg-orange-400 text-white ml-2"
                        >
                          Login
                        </Button>
                        <a
                          href="#"
                          onClick={(e) => {
                            forgotForm.resetFields();
                            e.preventDefault(); // Prevent default anchor behavior
                            setForgotPasswordVisible(true);
                          }}
                          className="text-blue-500 text-sm underline ml-2"
                        >
                          Forgot Password?
                        </a>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={
          <h5 className="font-semibold mb-2">
            {!otpStep ? "Forgot Password" : "Set New Password"}
          </h5>
        }
        visible={forgotPasswordVisible}
        onCancel={() => {
          setForgotPasswordVisible(false);
          forgotForm.resetFields();
          setOtpStep(false); // Reset OTP step
        }}
        width={400}
        footer={null}
      >
        <Form
          form={otpStep ? resetForm : forgotForm}
          onFinish={otpStep ? handleResetPassword : handleForgotPassword}
          layout="vertical"
        >
          {!otpStep ? (
            <>
              <CustomInput
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number!",
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number!",
                  },
                ]}
                type="number"
                placeholder="Phone Number"
                maxLength={10}
                autoComplete="off"
                accept={"onlyNumber"}
                className={"mt-2"}
              />
              {/* <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number!",
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your phone number"
                  type="Number"
                  className="rounded-none"
                />
              </Form.Item> */}
              <div className="text-center mt-2">
                <Button type="primary" htmlType="submit" className="w-[30%]">
                  Get OTP
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* <Form.Item
                label="One Time Password (OTP)"
                name="otp"
                rules={[{ required: true, message: "Please enter OTP!" }]}
              >
                <Input placeholder="Enter OTP" className="rounded-none" />
              </Form.Item> */}
              <CustomInput
                name="otp"
                label="One Time Password (OTP)"
                placeholder="One Time Password (OTP)"
                rules={[{ required: true, message: "Please enter OTP!" }]}
                className={"mt-2"}
              />
              <CustomInput
                label="New Password"
                name="newPassword"
                placeholder="New Password"
                maxLength={15}
                autoComplete="off"
                isPassword={true}
                rules={[
                  { required: true, message: "Please enter a new password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters.",
                  },
                ]}
                className={"mt-2"}
              />
              {/* <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter a new password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters.",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  className="rounded-none"
                />
              </Form.Item> */}
              <div className="text-center">
                <Button type="primary" htmlType="submit" className="w-[30%]">
                  Save
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
