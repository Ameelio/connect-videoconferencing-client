import React from "react";
import { Dropdown, Menu, Button } from "antd";
import PDFDownloadButton from "src/components/Dashboard/PDFDownloadButton";
import { CSVLink } from "react-csv";
import { Call } from "src/typings/Call";
import {
  DownOutlined,
  FilePdfOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { callsToCsvLogs } from "src/utils";

interface Props {
  facilityName: string;
  calls: Call[];
  filename: string;
}

const DownloadScheduleMenu = ({ calls, facilityName, filename }: Props) => {
  const scheduleOptionsMenu = (
    <Menu>
      <Menu.Item key="1" icon={<FilePdfOutlined />}>
        <PDFDownloadButton
          calls={calls}
          facilityName={facilityName}
          canViewDetails={true}
          filename={filename}
        />
      </Menu.Item>
      <Menu.Item key="2" icon={<FilePdfOutlined />}>
        <PDFDownloadButton
          calls={calls}
          facilityName={facilityName}
          canViewDetails={false}
          filename={filename}
        />
      </Menu.Item>
      <Menu.Item key="3" icon={<UnorderedListOutlined />}>
        <CSVLink
          data={callsToCsvLogs(calls)}
          target="_blank"
          filename={filename}
        >
          Data Dump (CSV)
        </CSVLink>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={scheduleOptionsMenu}>
      <Button>
        Download Schedule <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default DownloadScheduleMenu;
