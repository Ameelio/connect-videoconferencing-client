export interface AmeelioNode {
  id: number;
  name: string;
  administrative: boolean;
  autoapprove: boolean;
  parentId: number;
  zone: string;
  requireMonitors: boolean;
}
