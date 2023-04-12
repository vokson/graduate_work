import { reactive } from "vue";

class NotImplementedError extends Error { }

class AbstractTimer {
  constructor(period) {
    this._callback = () => {
      throw new NotImplementedError();
    };
    this._period = period;
    this._timer = null;
  }

  set_callback = (f) => {
    this._callback = f;
  };

  start = () => {
    if (!this._timer) {
      this._timer = setInterval(this._callback, this._period);
      // console.log('START TIMER', this._timer, this._period)
    }
  };

  stop = () => {
    // console.log('STOP TIMER', this._timer, this._period)
    clearInterval(this._timer);
    this._timer = null;
  };
}

class UploadProgressTimer extends AbstractTimer {
  constructor(period) {
    super(period);
    this._folder_id = null;
    this._ids = [];
  }

  start = () => {
    if (this._ids.length !== 0)
      this._timer = setInterval(this._callback, this._period);
  };

  add = (id) => {
    if (!this._ids.includes(id)) {
      this._ids.push(id);
    }
    if (this._timer === null) this.start();
  };

  remove = (id) => {
    this._ids = this._ids.filter((x) => x !== id);
    if (this._ids.length === 0) this.stop();
  };
}

class WaitSecondsTimer {
  constructor(period = 1000) {
    this._timer = null;
    this._period = period;
    this._seconds = reactive({});

    this._decrease_seconds = () => {
      Object.keys(this._seconds).forEach((key) => {
        if (this._seconds[key] > 0) this._seconds[key]--;
      });

      if (Object.values(this._seconds).reduce((s, x) => s + x, 0) === 0)
        this.stop();
    };
  }

  start = () => {
    this._timer = setInterval(this._decrease_seconds, this._period);
  };

  stop = () => {
    clearInterval(this._timer);
    this._timer = null;
  };

  get = (id) => this._seconds[id] || 0;

  set = (id, count) => {
    this._seconds[id] = count;
    if (this._timer === null) this.start();
  };
}

export { AbstractTimer, UploadProgressTimer, WaitSecondsTimer };
