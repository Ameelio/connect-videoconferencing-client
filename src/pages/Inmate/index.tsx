import React from "react";
import { useSelector } from "react-redux";
import { CardType } from "src/utils/constants";
import { selectAllInmates } from "src/redux/selectors";
import { genFullName } from "src/utils/utils";

const InmateContainer: React.FC = ({}) => {
  const inmates = useSelector(selectAllInmates);

  return (
    <div className="d-flex flex-row">
      {inmates.map((inmate) => (
        <p>{genFullName(inmate)}</p>
      ))}
    </div>
  );
};

export default InmateContainer;
