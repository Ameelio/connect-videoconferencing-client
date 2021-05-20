import React, { ReactElement, useEffect, useState } from "react";
import { RootState, useAppDispatch } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
  getCallsInfo,
  selectContactById,
  selectInmateCallsById,
} from "src/redux/selectors";
import { push } from "connected-react-router";
import { useContactConnections } from "src/hooks/useConnections";
import Profile from "src/components/Profile";
import { fetchContactIdImages } from "src/redux/modules/contact";
import { IdentificationImages } from "src/typings/IdentificationImage";

type TParams = { id: string };

const mapStateToProps = (
  state: RootState,
  ownProps: RouteComponentProps<TParams>
) => ({
  calls: getCallsInfo(
    state,
    selectInmateCallsById(state, ownProps.match.params.id) || []
  ),
});

const mapDispatchToProps = { push };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function ContactPage({
  calls,
  match,
}: PropsFromRedux & RouteComponentProps<TParams>): ReactElement {
  const [idImages, setIdImages] = useState<IdentificationImages>({
    frontIdFile: null,
    backIdFile: null,
    selfieIdFile: null,
  });
  const facilityName = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  const dispatch = useAppDispatch();

  const contact = useSelector((state: RootState) =>
    selectContactById(state, match.params.id)
  );

  useEffect(() => {
    const getContactImages = async () => {
      if (contact) {
        const images = await dispatch(fetchContactIdImages(contact.id));
        if (images.payload) {
          setIdImages(images.payload as IdentificationImages);
        }
      }
    };
    getContactImages();
  }, [contact, dispatch]);

  const connections = useContactConnections(contact?.id || "");

  if (!contact || !facilityName) return <div />;

  return (
    <Profile
      connections={connections}
      persona={contact}
      facilityName={facilityName}
      idImages={idImages}
      calls={calls}
      type="contact"
      navigate={(path: string) => dispatch(push(path))}
    />
  );
}

export default connector(ContactPage);
