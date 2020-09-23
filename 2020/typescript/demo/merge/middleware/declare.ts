declare module 'http' {
  interface IncomingMessage {
    myRequestProp: number;
  }

  interface ServerResponse {
    myResponseProp: string;
  }
}

export { };
