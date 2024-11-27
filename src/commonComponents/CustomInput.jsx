import React from "react";
import { Form, Input } from "antd";

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
  ...rest
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input
        type={type}
        placeholder={placeholder}
        className={`rounded-none ${className}`}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
        disabled={disabled}
        size={size}
        {...rest}
      />
    </Form.Item>
  );
};

export default CustomInput;
