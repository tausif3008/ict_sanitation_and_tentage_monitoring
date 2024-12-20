import { Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import optionsMaker from "../urils/OptionMaker";

const CountryStateCity = ({ form, country_id, state_id, city_id }) => {
  const [selectedCountryId, setSelectedCountryId] = useState();
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState();
  const [villageOptions, setVillageOptions] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState([]);

  useEffect(() => {
    optionsMaker(
      "country",
      "countries",
      "name",
      setCountryOptions,
      "",
      "country_id"
    );
  }, []);

  // update if the country id is present
  useEffect(() => {
    if (country_id) {
      form.setFieldsValue({ country_id });
      setSelectedCountryId(country_id);
    }
  }, [country_id, form]);

  useEffect(() => {
    if (state_id) {
      setSelectedStateId(state_id);
    }
  }, [state_id]);

  useEffect(() => {
    if (city_id) {
      setSelectedCityId(city_id);
    }
  }, [city_id]);

  useEffect(() => {
    if (selectedCountryId) {
      const params = "?country_id=" + selectedCountryId;
      optionsMaker(
        "state",
        "states",
        "name",
        setStateOptions,
        params,
        "state_id"
      );

      form.setFieldsValue({ state_id });
    }
  }, [selectedCountryId, form, state_id]);

  useEffect(() => {
    if (selectedStateId) {
      const params =
        "?country_id=" + selectedCountryId + "&state_id=" + selectedStateId;
      optionsMaker(
        "city",
        "cities",
        "name",
        setVillageOptions,
        params,
        "city_id"
      );
    }
  }, [selectedCountryId, selectedStateId]);

  useEffect(() => {
    if (countryOptions.length) {
      form.setFieldsValue({ country_id: "82" });
      setSelectedCountryId("82");
    }
  }, [form, countryOptions]);

  return (
    <>
      <Form.Item
        label={<div className="font-semibold">Select Country</div>}
        name="country_id"
        className="mb-4"
      >
        <Select
          showSearch
          placeholder="Select a country"
          optionFilterProp="children"
          onChange={(val) => setSelectedCountryId(val)}
        >
          {countryOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={<div className="font-semibold">State</div>}
        name="state_id"
        className="mb-4"
      >
        <Select
          showSearch
          optionFilterProp="children"
          onChange={(val) => setSelectedStateId(() => val)}
          placeholder="Select state"
          className="rounded-none"
        >
          {stateOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={<div className="font-semibold">City</div>}
        name="city_id"
        className="mb-4"
      >
        <Select
          showSearch
          optionFilterProp="children"
          placeholder="Select city"
          className="rounded-none"
        >
          {villageOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default CountryStateCity;
const { Option } = Select;
