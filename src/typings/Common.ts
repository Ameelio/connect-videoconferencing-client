export interface Route {
  path: string;
  component: React.ComponentType<any>;
  label: string;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  width?: string;
  editable?: boolean;
  render?: Function;
}
