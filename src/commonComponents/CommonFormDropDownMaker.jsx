import { Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import optionsMaker from "../urils/OptionMaker";

const CommonFormDropDownMaker = ({
  show = true,
  setSectors,
  mode = "single",
  selectLabel,
  selectName,
  required,
  RequiredMessage,
  uri,
  responseListName,
  responseLabelName,
  responseIdName,
}) => {
  const [options, setOptions] = useState([]);

  // useEffect(() => {
  //   if (options.length) {
  //     setSectors(() => options);
  //   }
  // }, [options, setSectors]);

  useEffect(() => {
    optionsMaker(
      uri,
      responseListName,
      responseLabelName,
      setOptions,
      "",
      responseIdName
    );
  }, []);

  return show ? (
    <Form.Item
      label={<div className="font-semibold">{selectLabel}</div>}
      name={selectName}
      className="p-0 m-0"
      rules={[{ required, message: RequiredMessage }]}
    >
      <Select placeholder="Select Main Asset Type" allowClear mode={mode}>
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  ) : (
    ""
  );
};

export default CommonFormDropDownMaker;
const { Option } = Select;
