declare global {
  namespace NodeJS {
    interface Global {
      myGlobalProp: boolean;
    }
  }

  interface Window {
    myWindowProp: () => void;
  }

  type MyGlobalType = {};
}

global.myGlobalProp = true;
window.myWindowProp = () => { };

export {}
