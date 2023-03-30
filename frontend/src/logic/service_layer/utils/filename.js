const get_extension_of_file = (filename) => {
  return filename.split('.').pop() || "";
}

export { get_extension_of_file };
