import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";

const CustomNumericCaptcha = ({
  form,
  placeholder = "Enter a Captcha",
  className,
  rules = [
    {
      required: true,
      message: "Please enter Captcha!",
    },
  ],
  disabled = true,
  size = "default",
  type = "text",
  accept = null,
  captchaBgColor = "bg-gray-200",
  ...rest
}) => {
  const [captcha, setCaptcha] = useState("");

  const generateCaptcha = () => {
    const randomCaptcha = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    form.setFieldValue("captcha", randomCaptcha);
    setCaptcha(randomCaptcha?.split("").join(" "));
  };
  // console.log("captcha", captcha);
  // console.log("captcha", form.getFieldValue("captcha"));

  useEffect(() => {
    generateCaptcha();
  }, []);

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
  };

  return (
    <div className="flex gap-2 justify-end mb-2">
      <div className="flex gap-2 h-fit">
        <div className={`text-lg px-2 -p-1 ${captchaBgColor} font-bold`}>
          {captcha?.split("").join(" ")}
        </div>
      </div>
      <Form.Item name="captcha">
        <Input type="hidden" />
      </Form.Item>
      <Form.Item name={"enter_captcha"} rules={rules} className="mt-1">
        <Input
          type={type}
          placeholder={placeholder}
          className={`rounded-md ${className}`}
          size={size}
          maxLength={6}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      </Form.Item>{" "}
    </div>
  );
};

export default CustomNumericCaptcha;
