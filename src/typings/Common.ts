export interface Route {
  path: string;
  component: React.ComponentType<any>;
  label: string;
}

export interface Column {
  title: string;
  dataIndex: string;
  width?: string;
  editable?: boolean;
  render?: Function;
}
