import React from "react";
import { Form, DatePicker } from "antd";

const CustomDatepicker = ({
  name,
  label,
  placeholder,
  className,
  onChange,
  rules = [],
  allowClear = false,
  disabled = false,
  size = "default",
  format = "DD/MM/YYYY",
  ...rest
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <DatePicker
        placeholder={placeholder}
        className={`rounded-none ${className}`}
        format={format}
        allowClear={allowClear}
        disabled={disabled}
        size={size}
        {...rest}
      />
    </Form.Item>
  );
};

export default CustomDatepicker;
