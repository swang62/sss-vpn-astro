export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [(commit) => ["PUSH:", "wip:"].some((w) => commit.includes(w))],
};
