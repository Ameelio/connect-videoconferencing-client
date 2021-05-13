export interface GroupDataNode {
  id: string;
  name: string;
  children: GroupDataNode[];
}

export interface Group {
  id: string;
  name: string;
}
