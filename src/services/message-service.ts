import {
  IGenerateRoomMessage,
  IEnterQueueMessage,
  ISocketMessage,
  ITextMessage,
  ISocketFile,
  IStudent,
  IChat,
  IFile,
  IJoin,
  IReconnectMessage,
  IVolunteer,
} from '../interfaces';
import { MESSAGE_TYPES } from '../config';

const {
  QUEUE_LIST,
  LEAVE_CHAT,
  GENERATE_ROOM,
  TEXT,
  RECONNECT,
  JOIN_CHAT,
  PING,
  AVAILABLE_CHAT,
  SET_VOLUNTEER,
} = MESSAGE_TYPES;

const createMessage = (
  payload:
    | ITextMessage
    | IEnterQueueMessage
    | IGenerateRoomMessage
    | IReconnectMessage
    | IJoin
    | {},
  type: string,
): ISocketMessage => {
  return {
    payload,
    msgType: type,
  };
};

export const createGetQueueMessage = (): ISocketMessage => {
  return createMessage({}, QUEUE_LIST);
};

export const createPingMessage = (): ISocketMessage => {
  return createMessage({}, PING);
};

export const createVolunteerMessage = (volunteer: IVolunteer): ISocketMessage => {
  return createMessage(volunteer, SET_VOLUNTEER);
}
export const createGetAvailableQueueMessage = (roomID: string): ISocketMessage => {
  return createMessage({'roomID' : roomID}, AVAILABLE_CHAT);
};

export const createJoinChatMessage = (
  studentInfo: IStudent,
  uniqueID: string,
  chatHistory: ITextMessage[],
  roomID: string,
) => {
  const msg: IJoin = {
    studentInfo,
    uniqueID,
    chatHistory,
    roomID,
  };
  return createMessage(msg, JOIN_CHAT);
};

class JoinChatMessage {
  private readonly studentInfo: IStudent;
  private readonly uniqueID: string;
  private readonly chatHistory: ITextMessage[];
  private readonly roomID: string;

  public constructor(joinChatMessageBuilder: JoinChatMessageBuilder) {
    this.studentInfo = joinChatMessageBuilder.studentInfo;
    this.uniqueID = joinChatMessageBuilder.uniqueID;
    this.chatHistory = joinChatMessageBuilder.chatHistory;
    this.roomID = joinChatMessageBuilder.roomID;
  }

  public createMessage(): ISocketMessage {
    return createMessage(
      {
        studentInfo: this.studentInfo,
        uniqueID: this.uniqueID,
        chatHistory: this.chatHistory,
        roomID: this.roomID,
      },
      JOIN_CHAT,
    );
  }
}

export class JoinChatMessageBuilder {
  private _studentInfo: IStudent;
  private _uniqueID: string;
  private _chatHistory: ITextMessage[];
  private _roomID: string;

  public build(): JoinChatMessage {
    return new JoinChatMessage(this);
  }

  public withStudentInfo(value: IStudent) {
    this._studentInfo = value;
    return this;
  }

  public withUniqueID(value: string) {
    this._uniqueID = value;
    return this;
  }

  public withChatHistory(value: ITextMessage[]) {
    this._chatHistory = value;
    return this;
  }

  public withRoomID(value: string) {
    this._roomID = value;
    return this;
  }

  public get studentInfo(): IStudent {
    return this._studentInfo;
  }

  public get chatHistory(): ITextMessage[] {
    return this._chatHistory;
  }

  public get uniqueID(): string {
    return this._uniqueID;
  }

  public get roomID(): string {
    return this._roomID;
  }
}
export const createReconnectMessage = (uniqueID: string): ISocketMessage => {
  const msg: IReconnectMessage = { uniqueID };
  return createMessage(msg, RECONNECT);
};

class LeaveChatMessage {
  private readonly roomID: string;
  private readonly uniqueID: string;

  public constructor(leaveChatMessageBuilder: LeaveChatMessageBuilder) {
    this.roomID = leaveChatMessageBuilder.roomID;
    this.uniqueID = leaveChatMessageBuilder.uniqueID;
  }
  public get createMessage(): ISocketMessage {
    return createMessage(
      { roomID: this.roomID, uniqueID: this.uniqueID },
      LEAVE_CHAT,
    );
  }
}

export class LeaveChatMessageBuilder {
  private readonly _uniqueID: string;
  private _roomID: string;

  public constructor(uniqueID: string) {
    this._uniqueID = uniqueID;
    return this;
  }

  public toRoom(value: string): LeaveChatMessageBuilder {
    this._roomID = value;
    return this;
  }

  public build(): LeaveChatMessage {
    return new LeaveChatMessage(this);
  }

  public get uniqueID(): string {
    return this._uniqueID;
  }

  public get roomID(): string {
    return this._roomID;
  }
}

class GenerateRoomMessage {
  private readonly uniqueID: string;
  private readonly studentID: string;
  private readonly nickname: string;
  private readonly grade: string;
  private readonly introText: string;
  private readonly course: string;

  public constructor(generateRoomMessageBuilder: GenerateRoomMessageBuilder) {
    this.uniqueID = generateRoomMessageBuilder.uniqueID;
    this.studentID = generateRoomMessageBuilder.studentID;
    this.nickname = generateRoomMessageBuilder.nickname;
    this.grade = generateRoomMessageBuilder.grade;
    this.introText = generateRoomMessageBuilder.introText;
    this.course = generateRoomMessageBuilder.course;
  }

  public get createMessage(): ISocketMessage {
    const generateRoomMessage: IGenerateRoomMessage = {
      uniqueID: this.uniqueID,
      studentID: this.studentID,
      nickname: this.nickname,
      grade: this.grade,
      introText: this.introText,
      course: this.course,
    };
    return createMessage(generateRoomMessage, GENERATE_ROOM);
  }
}

export class GenerateRoomMessageBuilder {
  private readonly _uniqueID: string;
  private _studentID: string;
  private _nickname: string;
  private _grade: string;
  private _introText: string;
  private _course: string;

  public constructor(uniqueID: string) {
    this._uniqueID = uniqueID;
    return this;
  }

  public withStudentID(value: string): GenerateRoomMessageBuilder {
    this._studentID = value;
    return this;
  }

  public withNickname(value: string): GenerateRoomMessageBuilder {
    this._nickname = value;
    return this;
  }

  public withGrade(value: string): GenerateRoomMessageBuilder {
    this._grade = value;
    return this;
  }

  public withIntroText(value: string): GenerateRoomMessageBuilder {
    this._introText = value;
    return this;
  }

  public withCourse(value: string): GenerateRoomMessageBuilder {
    this._course = value;
    return this;
  }

  public build(): GenerateRoomMessage {
    return new GenerateRoomMessage(this);
  }

  public get uniqueID(): string {
    return this._uniqueID;
  }

  public get studentID(): string {
    return this._studentID;
  }

  public get nickname(): string {
    return this._nickname;
  }

  public get grade(): string {
    return this._grade;
  }

  public get introText(): string {
    return this._introText;
  }

  public get course(): string {
    return this._course;
  }
}

class TextMessage {
  private readonly roomID: string;
  private readonly uniqueID: string;
  private readonly message: string;
  private readonly author: string;
  private readonly imgUrl: string;
  private readonly files: IFile[];

  public constructor(textMessageBuilder: TextMessageBuilder) {
    this.roomID = textMessageBuilder.roomID;
    this.message = textMessageBuilder.message;
    this.uniqueID = textMessageBuilder.uniqueID;
    this.files = textMessageBuilder.files;
    this.author = textMessageBuilder.author;
    this.imgUrl = textMessageBuilder.imgUrl;
  }

  public get createMessage(): {
    textMessage: ITextMessage;
    socketMessage: ISocketMessage;
  } {
    const msg: ITextMessage = {
      author: this.author,
      uniqueID: this.uniqueID,
      roomID: this.roomID,
      message: this.message,
      imgUrl: this.imgUrl,
      files: this.files,
    };
    return {
      textMessage: msg,
      socketMessage: createMessage(msg, TEXT),
    };
  }
}

export class TextMessageBuilder {
  private readonly _uniqueID: string;
  private _roomID: string;
  private _message: string;
  private _author: string;
  private _imgUrl: string;
  private _files: IFile[];

  public constructor(uniqueID: string) {
    this._uniqueID = uniqueID;
    return this;
  }

  public withMessage(message: string): TextMessageBuilder {
    this._message = message;
    return this;
  }

  public toRoom(roomID: string): TextMessageBuilder {
    this._roomID = roomID;
    return this;
  }

  public withFiles(files: IFile[]): TextMessageBuilder {
    this._files = files;
    return this;
  }

  public build(): TextMessage {
    return new TextMessage(this);
  }

  public get roomID(): string {
    return this._roomID;
  }

  public get imgUrl(): string {
    return this._imgUrl;
  }
  public get uniqueID(): string {
    return this._uniqueID;
  }

  public get message(): string {
    return this._message;
  }

  public get files(): IFile[] {
    return this._files;
  }

  public get author(): string {
    return this._author;
  }
  public withAuthor(author: string): TextMessageBuilder {
    this._author = author;
    return this;
  }

  public withImg(imgUrl: string): TextMessageBuilder {
    this._imgUrl = imgUrl;
    return this;
  }
}
