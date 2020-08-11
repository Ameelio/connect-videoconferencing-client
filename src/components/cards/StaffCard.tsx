import React, { ReactElement } from "react";
import { Image } from "react-bootstrap";
import { genFullName } from "src/utils/utils";

interface Props {
  member: Staff;
  fontColor: string;
}

export default function StaffCard({ member, fontColor }: Props): ReactElement {
  return (
    <div className="d-flex flex-row">
      <Image src={member.imageUri} roundedCircle className="small-image" />
      <div className="d-flex flex-column ml-3">
        <span className={fontColor}>{genFullName(member)}</span>
        <span>
          {member.isActive ? (
            <span className="green p6">Active</span>
          ) : (
            <span className="p6 ">Last active 10 min ago</span>
          )}
        </span>
      </div>
    </div>
  );
}
