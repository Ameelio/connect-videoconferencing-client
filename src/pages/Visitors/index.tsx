import React, { useEffect } from "react";
import Visitors from "src/components/Visitors";
import { useAppDispatch, useAppSelector } from "src/redux";
import { selectAllContacts } from "src/redux/selectors";

import { push } from "connected-react-router";
import { fetchContacts } from "src/redux/modules/contact";

const VisitorsPage = () => {
  const visitors = useAppSelector(selectAllContacts);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.contacts.loading);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <Visitors
      visitors={visitors}
      navigateToProfile={(id: string) => dispatch(push(`/contacts/${id}`))}
      loading={loading}
    />
  );
};

export default VisitorsPage;
