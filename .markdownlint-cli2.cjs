module.exports = {
  globs: ["**/*.md", ".github/**/*.md"],
  ignores: ["node_modules/**", ".specify/**", ".github/skills/speckit-*/**"],
  config: {
    default: true,
    MD013: false,
    MD024: {
      siblings_only: true,
    },
  },
};
