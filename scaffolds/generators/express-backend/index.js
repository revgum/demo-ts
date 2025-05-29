var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("appname", { type: String, required: true });
    this.name = this.options.appname || "myapp";
    this.schema = this.name.replace("-", "_");
  }

  initializing() {}

  async prompting() {}

  configuring() {}

  default() {}

  get writing() {
    return {
      appStaticFiles() {
        const src = `${this.sourceRoot()}/**`;
        const destAppDir = this.destinationPath(`app/${this.name}`);

        const files = [
          "Bruno/Todo/Create Todo.bru",
          "Bruno/Todo/Delete Todo.bru",
          "Bruno/Todo/Get All Todo.bru",
          "Bruno/Todo/Get Todo.bru",
          "Bruno/Todo/Update Todo.bru",
          "Bruno/bruno.json",
          "package.json",
          "docker-compose.debug.yaml",
          "docker-compose.yaml",
          "src/lib/instrumentation.ts",
        ];

        const copyOpts = {
          globOptions: {
            ignore: [],
          },
        };

        this.fs.copy(src, destAppDir, copyOpts);
        this.fs.copy(this.templatePath(".*"), destAppDir, copyOpts);

        const opts = {
          name: this.name,
          schema: this.schema,
        };

        for (const f of files) {
          this.fs.copyTpl(
            this.templatePath(f),
            `${destAppDir}/${f}`,
            opts,
            copyOpts
          );
        }

        this.fs.move(`${destAppDir}/gitignore`, `${destAppDir}/.gitignore`);
      },
    };
  }

  conflicts() {}

  install() {}

  end() {}
};
