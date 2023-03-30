const CountMixin = {
  set_count(obj) {
    this._set_box("__COUNT__", "__COUNT__", obj);
  },

  get_count() {
    return this._get_box("__COUNT__", "__COUNT__");
  },

  is_count_settled() {
    return this._get_box("__COUNT__", "__COUNT__").value !== null;
  },
};

export { CountMixin };
