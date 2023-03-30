const CurrentMixin = {
  set_current(obj) {
    this._set_box("__CURRENT__", "__CURRENT__", obj);
  },

  get_current() {
    return this._get_box("__CURRENT__", "__CURRENT__");
  },

  is_current_settled() {
    return this._get_box("__CURRENT__", "__CURRENT__").value !== null;
  },
};

export { CurrentMixin };
