export enum MessageType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  CONFIRM = 'confirm',
}

export interface Message {
  id: string;
  type: MessageType;
  msg?: string;
  okCallback?: () => void;
  cancelCallback?: () => void;
}
