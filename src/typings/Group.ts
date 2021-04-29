export interface GroupDataNode {
  id: number;
  name: string;
  children: GroupDataNode[];
}

export interface Group {
  id: number;
  name: string;
}
