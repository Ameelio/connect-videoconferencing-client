import { Space, Typography } from "antd";
import { format } from "date-fns";
import React from "react";
import { Inmate } from "src/typings/Inmate";
import { genFullName } from "src/utils";

interface Props {
  inmate: Inmate;
  navigate: (path: string) => void;
}

const InmateCell = ({ inmate, navigate }: Props) => {
  return (
    <Space direction="vertical">
      <Typography.Text>Name: {genFullName(inmate)}</Typography.Text>
      <Typography.Text>
        Unique ID: {inmate.inmateIdentification}
      </Typography.Text>
      <Typography.Text>
        DOB: {format(new Date(inmate.dateOfBirth), "dd/mm/yy")}
      </Typography.Text>
      <Typography.Link onClick={() => navigate(`/members/${inmate.id}`)}>
        View Full Profile
      </Typography.Link>
    </Space>
  );
};

export default InmateCell;
