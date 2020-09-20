export type RawData = typeof import('@/../public/json/session.json')
const _rawData = ({} as RawData)

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
export type SessionData = ArrayElement<typeof _rawData.sessions>
export type TypeData = ArrayElement<typeof _rawData['session_types']>
export type SpeakerData = ArrayElement<typeof _rawData.speakers>
export type RoomData = ArrayElement<typeof _rawData.rooms>
export type TagData = ArrayElement<typeof _rawData.tags>

export type Day = [number, number, number]

export interface SessionBase {
  id: string;
  start: string;
  end: string;
  room: string;
}
export interface Session extends Omit<SessionData, 'type' | 'room' | 'speakers' | 'tags' | 'start' | 'end'> {
  start: Date;
  end: Date;
  type: TypeData;
  room: RoomData;
  speakers: SpeakerData[];
  tags: TagData[];
}

export type TableCellType = 'Blank' | 'Span' | 'Session'
interface TableCellBase {
  type: TableCellType;
}

export interface TableCellBlank extends TableCellBase {
  type: 'Blank';
  rowSpan: 1;
}

export interface TableCellSpan extends TableCellBase {
  type: 'Span';
}

export interface TableCellSession extends TableCellBase {
  type: 'Session';
  sessionId: string;
  rowSpan: number;
}

export type TableCell = TableCellBlank | TableCellSpan | TableCellSession

export interface AgendaTableData {
  rooms: string[];
  rows: TableCell[][];
}

export interface AgendaListData {
  sections: {
    start: Date;
    sessions: string[];
  }[];
}
