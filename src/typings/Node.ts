interface Metadata {
  id: number;
  administrative: boolean;
  autoapprove: boolean;
  callTimes: string;
  createdAt: string;
  messageTypes: string;
  name: string;
  parentId: number;
  requireMonitors: boolean;
  type: string;
  updatedAt: string;
  zone: string;
}

export interface AmeelioNode {
  title: string;
  key: string;
  metadata: Metadata;
  children: AmeelioNode[];
}
