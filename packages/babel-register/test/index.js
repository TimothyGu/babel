import chai from "chai";
import path from "path";
import assign from "lodash/assign";

const DATA_ES2015 = require.resolve("./__data__/es2015");

describe("babel-register", function () {
  let babelRegister;
  let oldCompiler;

  function setupRegister(config) {
    babelRegister = require("..");
    babelRegister(assign({
      presets: [path.join(__dirname, "../../babel-preset-es2015")],
      babelrc: false,
      only: "__data__"
    }, config));
  }

  function revertRegister() {
    if (babelRegister) {
      babelRegister.revert();
      babelRegister = null;
    }
  }

  before(() => {
    const js = require("default-require-extensions/js");
    oldCompiler = require.extensions[".js"];
    require.extensions[".js"] = js;
  });

  after(() => {
    require.extensions[".js"] = oldCompiler;
  });

  afterEach(() => {
    revertRegister();
    delete require.cache[DATA_ES2015];
  });

  it("registers correctly", () => {
    setupRegister();

    chai.expect(require(DATA_ES2015)).to.be.ok;
  });

  it("reverts correctly", () => {
    setupRegister();
    revertRegister();

    chai.expect(() => { require(DATA_ES2015); }).to.throw(SyntaxError);
  });
});