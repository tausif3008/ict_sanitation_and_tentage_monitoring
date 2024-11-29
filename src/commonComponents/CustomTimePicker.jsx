import React from "react";
import { Form, TimePicker } from "antd";

const CustomTimepicker = ({
  name,
  label,
  placeholder,
  className,
  onChange,
  rules = [],
  allowClear = false,
  disabled = false,
  size = "default",
  format = "hh:mm:ss A", // Format for time only
  ...rest
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <TimePicker
        placeholder={placeholder}
        className={`rounded-none ${className}`}
        format={format}
        allowClear={allowClear}
        onChange={(time, timeString) => {
          if (onChange) {
            onChange(time, timeString); // pass both moment and formatted string
          }
        }}
        disabled={disabled}
        size={size}
        {...rest}
      />
    </Form.Item>
  );
};

export default CustomTimepicker;
