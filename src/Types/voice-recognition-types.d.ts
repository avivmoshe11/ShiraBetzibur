declare module 'vosk' {
  export class Recognizer {
    constructor(options: RecognizerOptions);
  }

  interface RecognizerOptions {
    model: string;
  }
}
