import React, { useState, useEffect } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { genDirectoryStyle } from "antd/es/tree/style";

const NumericCaptcha = ({
  setisInvalidCaptcha,
  isInvalidCaptcha,
  captcha,
  setCaptcha,
  userInput,
  setUserInput,
  setErrorMessage,
  errorMessage,
}) => {
  const generateCaptcha = () => {
    const randomCaptcha = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    setCaptcha(randomCaptcha);
    setUserInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (isInvalidCaptcha) {
      generateCaptcha();
      setisInvalidCaptcha(false);
    }
  }, [isInvalidCaptcha]);

  return (
    <div className="flex gap-2 justify-end mb-2">
      <div className="flex gap-2 h-fit">
        <div className="text-lg px-2 -p-1 bg-white  ">
          {captcha.split("").join(" ")}
        </div>
      </div>

      <div className="flex flex-col w-28">
        <Input
          size="small"
          type="text"
          placeholder="Enter CAPTCHA"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            setErrorMessage("");
          }}
        />

        {errorMessage && (
          <div className="flex w-full" style={{ color: "red" }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default NumericCaptcha;
