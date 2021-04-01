/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactElement } from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;

interface Props {
  setStartDate: (date: number) => void;
  setEndDate: (date: number) => void;
  setDuration: (maxDuration: number) => void;
}

export default function CallFiltersHeader({
  setDuration,
  setStartDate,
  setEndDate,
}: Props): ReactElement {
  const DURATION_FILTERS = [Infinity, 3, 5, 10, 15, 20];

  const DurationFilters = (
    <Menu>
      {DURATION_FILTERS.map((duration) => (
        <Menu.Item key={duration} onClick={() => setDuration(duration)}>
          {"<"}
          {duration}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Space align="center">
      <RangePicker
        onChange={(date) => {
          if (!date) return;
          if (date[0]) setStartDate(date[0].unix() * 1000);
          if (date[1]) setEndDate(date[1].unix() * 1000);
        }}
      />
      {/* TODO: add this back once we feel good about the duration field */}
      {/* https://github.com/Ameelio/connect-doc-client/issues/56 */}
      {/* <Dropdown overlay={DurationFilters} trigger={["click"]}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Call Duration <DownOutlined />
        </a>
      </Dropdown> */}
    </Space>
  );
}
