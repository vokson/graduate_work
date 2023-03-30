module.exports = {
  // Было добавлено при переходе от Webpack 4 к 5
  configureWebpack: {
    resolve: {
      fallback: {
        util: require.resolve("util/"),
        stream: require.resolve("stream-browserify")
      },
    },
  },
  // Необходимо, чтобы build VueJS содержал исходные имена классов
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer("terser").tap((args) => {
        const { terserOptions } = args[0];
        terserOptions.keep_classnames = true;
        terserOptions.keep_fnames = true;
        return args;
      });
    }
  },
};
