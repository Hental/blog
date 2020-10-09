export type Response<T> = T & {
  success: boolean;
  code: number;
}

type GetUserResponse = Response<{
  user: {
    username: string;
    userId: string;
  };
}>

type GetHotelResponse = Response<{
  hotel: {
    hotelId: string;
    hotelName: string;
  };
}>


// React Component Simple Example
type FunctionComponent<P> = (props: P & { children: any }) => Node;
interface ClassComponent<S, P> {
  state: S;
  props: P & { children: any };
  setState(newState: Partial<S>);
  render(): Node;
}


// React Table Component
import React from 'react';
interface TableProps<T> {
  dataSource: T[];
  renderColumn: (col: T) => React.ElementType;
}
const Table = function<T>(props: React.PropsWithChildren<TableProps<T>>): null {
  return null;
};
const el = (
  <Table
    dataSource={[{ key: '1', value: 1 }, { key: '2', value: 2 }]}
    renderColumn={(col) => {
      col.key;
      return null;
    }}
  />);
