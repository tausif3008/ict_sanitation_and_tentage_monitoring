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
                    dropFields.map((el) => (
                      <Col key={el.name} xs={24} sm={12} md={6} lg={5}>
                        <Form.Item name={el.name} label={el.label}>
                          <Select
                            placeholder="Select Main Type"
                            className="rounded-none"
                          >
                            {el.options.map((opt) => (
                              <Select.Option key={opt.value} value={opt.name}>
                                {opt.label}
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

                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    lg={4}
                    className="flex justify-end gap-2"
                  >
                    <Button
                      type="primary"
                      className="rounded-none bg-5c"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="rounded-none bg-green-300 text-black"
                    >
                      Search
                    </Button>
                  </Col>
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
