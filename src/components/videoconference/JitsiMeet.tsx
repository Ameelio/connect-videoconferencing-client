import React from "react";
import Jitsi from "react-jitsi";

const JitsiMeet = () => {
  const handleAPI = (api: any) => {
    api.executeCommand("toggleVideo");
  };

  return (
    <Jitsi
      domain="meet.jit.si"
      onAPILoad={handleAPI}
      roomName={"Colorado State Penitentiary"}
      displayName={"DOC Colorado"}
      interfaceConfig={interfaceConfig}
      config={config}
      containerStyle={{ width: "100%" }}
    />
  );
};

const interfaceConfig = {
  LANG_DETECTION: false,
  lang: "en",
  APP_NAME: "Ameelio",
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
  HIDE_INVITE_MORE_HEADER: true,
  MOBILE_APP_PROMO: false,
  SHOW_CHROME_EXTENSION_BANNER: false,
  SHOW_JITSI_WATERMARK: false,
  SHOW_WATERMARK_FOR_GUESTS: false,
  SHOW_BRAND_WATERMARK: false,
  filmStripOnly: true,
  DISABLE_TRANSCRIPTION_SUBTITLES: false,
  VIDEO_LAYOUT_FIT: "both",
};

const config = {
  defaultLanguage: "en",
  prejoinPageEnabled: false,
};

export default JitsiMeet;
