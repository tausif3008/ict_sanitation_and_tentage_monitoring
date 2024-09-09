import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./dropdown.css";

const DropDown = ({ items, name }) => {
  return (
    <Dropdown
      className="h-full flex items-center justify-center no-underline"
      menu={{
        items,
      }}
    >
      <Link onClick={(e) => e.preventDefault()}>
        <Space className="text-black">
          {name} <DownOutlined width="15" height="15" />
        </Space>
      </Link>
    </Dropdown>
  );
};

export default DropDown;
