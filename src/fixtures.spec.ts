import path = require("path");

const mainDirectory = path.dirname(__dirname);
const sampleDirectory = path.join(mainDirectory, "sample");

export const fixturesImages = {
  me: path.join(sampleDirectory, "me.jpg"),
};
