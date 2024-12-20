import React, { useEffect } from "react";
import {
  Collapse,
  Form,
  Input,
  Button,
  Select,
  notification,
  Row,
  Col,
} from "antd";
import search from "../assets/Dashboard/icon-search.png";
import { generateSearchQuery } from "../urils/getSearchQuery";

const CommonSearchForm = ({
  fields,
  dropFields,
  searchQuery,
  setSearchQuery,
  setForm,
  dropdown,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (setForm) {
      setForm(form);
    }
  }, [setForm, form]);

  const [api, contextHolder] = notification.useNotification({ top: 100 });
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Note",
      duration: 7,
      description: "Please enter some information to perform the search.",
    });
  };

  const onFinishForm = (values) => {
    const searchParams = generateSearchQuery(values);
    if (searchParams === "&") {
      openNotificationWithIcon("info");
    }
    setSearchQuery(searchParams);
  };

  const resetForm = () => {
    form.resetFields();
    setSearchQuery("&");
  };

  return (
    <div>
      <Collapse
        defaultActiveKey={["1"]}
        size="small"
        className="rounded-none mt-3"
        items={[
          {
            key: 1,
            label: (
              <div className="flex items-center h-full">
                <img src={search} className="h-5" alt="Search Icon" />
              </div>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinishForm}
                key="1"
              >
                <Row gutter={[16, 16]} align="middle">
                  {dropFields &&
                    dropFields?.map((el) => (
                      <Col key={el.name} xs={24} sm={12} md={6} lg={5}>
                        <Form.Item name={el?.name} label={el?.label}>
                          <Select
                            placeholder="Select Main Type"
                            className="rounded-none"
                          >
                            {el?.options?.map((opt) => (
                              <Select.Option
                                key={opt?.value}
                                value={opt?.value}
                              >
                                {opt?.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    ))}
                  {fields &&
                    fields.map((el) => (
                      <Col key={el.name} xs={24} sm={12} md={6} lg={5}>
                        <Form.Item name={el.name} label={el.label}>
                          <Input
                            placeholder={el.label}
                            className="rounded-none w-full"
                          />
                        </Form.Item>
                      </Col>
                    ))}
                  {dropdown && (
                    <Col xs={24} sm={12} md={6} lg={5}>
                      {dropdown}
                    </Col>
                  )}
                  <div className="flex justify-start mt-4 space-x-2 ml-3">
                    <div>
                      <Button
                        type="button"
                        className="w-fit rounded-none text-white bg-orange-400 hover:bg-orange-600"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    </div>
                    <div>
                      <Button
                        type="button"
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </Row>
              </Form>
            ),
          },
        ]}
      />
      {contextHolder}
    </div>
  );
};

export default CommonSearchForm;
