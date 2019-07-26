import {
  IGenerateRoomMessage,
  IEnterQueueMessage,
  ISocketMessage,
  ITextMessage,
  ISocketFile,
} from '../interfaces';
import { MESSAGE_TYPES } from '../config';
import { IReconnectMessage } from '../interfaces/IReconnectMessage';

const { QUEUE_LIST, LEAVE_CHAT, GENERATE_ROOM, TEXT, RECONNECT } = MESSAGE_TYPES;

const createMessage = (
  payload: ITextMessage | IEnterQueueMessage | IGenerateRoomMessage | {},
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

class ReconnectMessage {
  private readonly oldUniqueID: string;
  private readonly uniqueID: string;
  private readonly roomIDs: string[];

  public constructor(reconnectMessageBuilder: ReconnectMessageBuilder) {
    this.oldUniqueID = reconnectMessageBuilder.oldUniqueID;
    this.uniqueID = reconnectMessageBuilder.uniqueID;
    this.roomIDs = reconnectMessageBuilder.roomIDs;
  }

  public get createMessage(): ISocketMessage {
    const msg: IReconnectMessage = {
      oldUniqueID: this.oldUniqueID,
      uniqueID: this.uniqueID,
      roomIDs: this.roomIDs
    };
    return createMessage(msg, RECONNECT);
  }
}

export class ReconnectMessageBuilder {
  private readonly _uniqueID: string;
  private _oldUniqueID: string;
  private _roomIDs: string[];

  public constructor(uniqueID: string) {
    this._uniqueID = uniqueID;
    return this;
  }


  public withOldUniqueID(value: string): ReconnectMessageBuilder {
    this._oldUniqueID = value;
    return this;
  }

  public withRoomIDs(value: string[]): ReconnectMessageBuilder {
    this._roomIDs = value;
    return this;
  }

  public build(): ReconnectMessage {
    return new ReconnectMessage(this);
  }


  public get uniqueID(): string {
    return this._uniqueID;
  }

  public get oldUniqueID(): string {
    return this._oldUniqueID;
  }

  public get roomIDs(): string[] {
    return this._roomIDs;
  }
}

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

  public constructor(textMessageBuilder: TextMessageBuilder) {
    this.roomID = textMessageBuilder.roomID;
    this.message = textMessageBuilder.message;
    this.uniqueID = textMessageBuilder.uniqueID;
  }

  public get createMessage(): {
    textMessage: ITextMessage;
    socketMessage: ISocketMessage;
  } {
    const msg: ITextMessage = {
      author: 'student',
      uniqueID: this.uniqueID,
      roomID: this.roomID,
      message: this.message,
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

  public build(): TextMessage {
    return new TextMessage(this);
  }

  public get roomID(): string {
    return this._roomID;
  }

  public get uniqueID(): string {
    return this._uniqueID;
  }

  public get message(): string {
    return this._message;
  }
}
