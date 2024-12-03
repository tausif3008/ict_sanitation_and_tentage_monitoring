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
  showTime = false, // showing date with time
  size = "default",
  format = "DD/MM/YYYY", //   format="hh:mm:ss A"
  ...rest
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <DatePicker
        placeholder={placeholder}
        className={`rounded-none ${className}`}
        format={format}
        allowClear={allowClear}
        onChange={(date, dateString) => {
          if (onChange) {
            onChange(date, dateString); // pass both moment object and formatted string
          }
        }}
        disabled={disabled}
        showTime={showTime} // Enable time selection
        size={size}
        {...rest}
      />
    </Form.Item>
  );
};

export default CustomDatepicker;
