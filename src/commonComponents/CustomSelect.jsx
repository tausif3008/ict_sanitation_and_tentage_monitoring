import React from "react";
import { Form, Select } from "antd";

const CustomSelect = ({
  name,
  label,
  placeholder,
  className,
  handleSelect,
  rules = [],
  options = [],
  search = true,
  disabled = false,
  size = "default",
  ...rest
}) => {
  return (
    <>
      <Form.Item label={label} name={name} rules={rules}>
        <Select
          placeholder={placeholder}
          allowClear
          showSearch={search}
          filterOption={
            search
              ? (input, option) => {
                  return option?.children
                    ?.toLowerCase()
                    ?.includes(input?.toLowerCase());
                }
              : undefined
          }
          className={`rounded-none ${className}`}
          onSelect={(value) => {
            if (handleSelect) {
              handleSelect(value);
            }
          }}
          disabled={disabled}
          size={size}
          {...rest}
        >
          {options?.map((option) => (
            <Select.Option key={option?.value} value={option?.value}>
              {option?.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default CustomSelect;
