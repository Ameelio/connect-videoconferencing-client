/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactElement, useState } from "react";
// import { Dropdown, DropdownButton, Form, FormControl } from 'react-bootstrap'
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
    <div className="d-flex flex-row">
      <RangePicker
        onChange={(date) => {
          if (!date) return;
          if (date[0]) setStartDate(date[0].unix());
          if (date[1]) setEndDate(date[1].unix());
        }}
      />
      <Dropdown overlay={DurationFilters} trigger={["click"]}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Call Duration <DownOutlined />
        </a>
      </Dropdown>
      {/* <DropdownButton id="dropdown-basic-button" title="Time range">
                <Form>
                <FormControl
                type="text"
                placeholder="Search by Name, Inmate ID, Facility, Pod ID, ..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value) }
                onSubmit={handleSubmission}
                />
                </Form>
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="Call duration">
                {DURATION_FILTERS.map((duration) => <Dropdown.Item onClick={() => filterCalls()}>{duration} minutes </Dropdown.Item>)}
            </DropdownButton> */}
    </div>
  );
}
