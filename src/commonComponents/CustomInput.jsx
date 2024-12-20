import React, { useState } from "react";
import { Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const CustomInput = ({
  name,
  label,
  placeholder,
  className,
  onChange,
  rules = [],
  disabled = false,
  size = "default",
  type = "text",
  accept = null,
  isPassword = false,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleKeyDown = (e) => {
    if (type === "number") {
      const validChars = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ".",
        "-",
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
      ];

      if (!validChars.includes(e.key)) {
        e.preventDefault();
      }
    }
    if (accept) {
      const obj = {
        onlyChar: /^[a-zA-Z ]+$/,
        onlyNumber: /^[0-9]*$/,
        onlyNumberWithDot: /^[0-9.]*$/,
        onlyNumberWithSpace: /^[0-9 ]*$/,
        onlyAlphaNumeric: /^[a-zA-Z0-9]*$/,
        onlyAlphaNumericWithSpace: /^[a-zA-Z0-9 ]*$/,
        onlyAlphaNumericWithSpaceAndSpecialChar:
          /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]*$/,
        empIdValidation: /^[a-zA-Z0-9-]*$/,
      };

      const specialKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
      ];

      // Check if the event is a Ctrl+C or Ctrl+V (for copy and paste)
      if (
        (e.ctrlKey || e.metaKey) && // Check if Ctrl or Cmd (metaKey) is pressed
        (e.key === "c" || e.key === "v") // Check if the key is C or V
      ) {
        return; // Allow Ctrl+C and Ctrl+V
      }

      if (!specialKeys.includes(e.key) && !obj[accept].test(e.key)) {
        e.preventDefault();
      }
    }
    if (isPassword) {
      const passKeys = ["'", '"', ",", ";", "`", "-", "\\"];

      if (passKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  // Toggle password visibility
  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Form.Item label={label} name={name} rules={rules}>
      {type === "textarea" ? (
        <Input.TextArea
          type={isPassword && !passwordVisible ? "password" : type}
          placeholder={placeholder}
          className={`rounded-none ${className}`}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
          }}
          disabled={disabled}
          size={size}
          onKeyDown={handleKeyDown}
          {...rest}
          suffix={
            isPassword && (
              <span
                onClick={handlePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            )
          }
        />
      ) : (
        <Input
          type={isPassword && !passwordVisible ? "password" : type}
          placeholder={placeholder}
          className={`rounded-none ${className}`}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
          }}
          disabled={disabled}
          size={size}
          onKeyDown={handleKeyDown}
          {...rest}
          suffix={
            isPassword && (
              <span
                onClick={handlePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            )
          }
        />
      )}
    </Form.Item>
  );
};

export default CustomInput;
