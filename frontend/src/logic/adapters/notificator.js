import Noty from "noty";

class NotImplementedError extends Error {}

class AbstractNotificator {
  success = () => {
    throw new NotImplementedError();
  };

  info = () => {
    throw new NotImplementedError();
  };

  warning = () => {
    throw new NotImplementedError();
  };

  error = () => {
    throw new NotImplementedError();
  };
}

class ConsoleNotificator extends AbstractNotificator {
  success = (message) => {
    console.log("[SUCCESS]: " + message);
  };

  info = (message) => {
    console.log("[INFO]: " + message);
  };

  warning = (message) => {
    console.log("[WARNING]: " + message);
  };

  error = (message) => {
    console.log("[ERROR]: " + message);
  };
}

class NotyNotificator extends AbstractNotificator {
  constructor () {
    super();
    this.default = {
      layout: "topRight",
      theme: "relax",
      timeout: "3000",
      progressBar: false
    }
  }

  do = (type, text) => {
    new Noty(Object.assign(this.default, {
      type: type,
      text: text,
    })).show();
  }

  success = (message) => {
    this.do('success', message);
  };

  info = (message) => {
    this.do('info', message);
  };

  warning = (message) => {
    this.do('warning', message);
  };

  error = (message) => {
    this.do('error', message);
  };
}

export { ConsoleNotificator, NotyNotificator };
