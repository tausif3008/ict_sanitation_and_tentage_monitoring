import React from "react";
import { Form, Select } from "antd";
import { useDispatch } from "react-redux";

const CustomSelect = ({
  name,
  label,
  placeholder,
  className,
  handleSelect,
  onSearch,
  rules = [],
  options = [],
  search = true,
  disabled = false,

  // use for search find in dropdown
  isOnSearchFind = false,
  apiAction,
  onSearchUrl,
  dispatchTime = 500,

  size = "default",
  ...rest
}) => {
  const dispatch = useDispatch();
  let timeoutId = null;

  // handle search dropdown
  const handleSelectChange = (value) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      dispatch(apiAction(`${onSearchUrl}${value}`));
    }, dispatchTime);
  };
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
          onSearch={(value) => {
            if (isOnSearchFind) {
              handleSelectChange(value);
            }
            if (onSearch) {
              onSearch(value);
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
