import { Layout, PageHeader, Select } from "antd";
import React, { ReactElement } from "react";
import MessageDisplay from "src/components/calls/MessageDisplay";
import { Call, CallMessage } from "src/typings/Call";
import { getFirstNames } from "src/utils";

interface Props {
  setActiveCallChat: (id: string) => void;
  calls: Call[];
  activeCallChat: Call;
  activeChatMessages: CallMessage[];
  collapsed: boolean;
  setChatCollapsed: () => void;
}

// TODO: finish refactoring this component
// https://github.com/Ameelio/connect-doc-client/issues/86
function Chat({
  calls,
  setActiveCallChat,
  activeCallChat,
  activeChatMessages,
  collapsed,
  setChatCollapsed,
}: Props): ReactElement {
  return <div />;
  //     useEffect(() => {
  //         if (!messagesContainerRef.current) return;
  //         messagesContainerRef.current.scroll({
  //           top: messagesContainerRef.current.scrollHeight,
  //           left: 0,
  //           behavior: "smooth",
  //         });
  //       }, [messagesContainerRef, activeMessages]);

  //     return (
  //         <Layout.Sider
  //           theme="light"
  //           width={300}
  //           collapsible
  //           defaultCollapsed
  //           reverseArrow
  //           collapsed={collapsed}
  //           onCollapse={(collapsed) => setChatCollapsed(collapsed)}
  //           className="max-h-screen shadow overflow-y-auto">
  //         <div ref={messagesContainerRef} className="pb-16">
  //         <PageHeader
  //           title="Chat"
  //           extra={[
  //             <Select
  //               value={activeCallChat?.id}
  //               onSelect={(id) => {
  //                 setActiveCallChat(calls.find((v) => v.id === id));
  //               }}
  //             >
  //               {calls.map((call) => (
  //                 <Select.Option
  //                   value={call.id}
  //                   key={call.id}
  //                   className="truncate mw-1/2"
  //                 >
  //                   {getFirstNames(call.inmates)} &{" "}
  //                   {getFirstNames(call.contacts)}
  //                 </Select.Option>
  //               ))}
  //             </Select>,
  //           ]}
  //         />{" "}
  //         <div
  //           className="flex flex-col"
  //           style={{
  //             ...WRAPPER_STYLE,
  //           }}
  //           ref={messagesContainerRef}
  //         >
  //           {
  //             activeChatMessages.map((message) => (
  //               <MessageDisplay
  //                 message={message}
  //                 call={activeCallChat}
  //                 className="mt-4"
  //               />
  //             ))}
  //         </div>
  //       </div>
  //     )}
  //   </Layout.Sider>
}

export default Chat;
