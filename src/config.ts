export const API_URL = 'http://localhost:8080/';
export const CHAT_URL = 'ws://localhost:3002/events';
export const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const MESSAGE_TYPES = {
  CONNECTION: 'CONNECTION',
  ENTER_QUEUE: 'ENTER_QUEUE',
  DISTRIBUTE_ROOM: 'DISTRIBUTE_ROOM',
  GENERATE_ROOM: 'GENERATE_ROOM',
  QUEUE_LIST: 'QUEUE_LIST',
  TEXT: 'TEXT',
  JOIN_CHAT: 'JOIN_CHAT',
  LEAVE_CHAT: 'LEAVE_CHAT',
  ERROR_LEAVING_CHAT: 'ERROR_LEAVING_CHAT',
};

export const publicAzureToken =
  'BlobEndpoint=https://redcrossstudent.blob.core.windows.net/;QueueEndpoint=https://redcrossstudent.queue.core.windows.net/;FileEndpoint=https://redcrossstudent.file.core.windows.net/;TableEndpoint=https://redcrossstudent.table.core.windows.net/;SharedAccessSignature=sv=2018-03-28&ss=f&srt=sco&sp=rwd&se=2019-08-31T15:42:06Z&st=2019-07-17T07:42:06Z&spr=https&sig=vuhx5O4A8Zk0NbxcJ3HkEgeqP%2BqoUouwf6fKbrmGbH8%3D';
