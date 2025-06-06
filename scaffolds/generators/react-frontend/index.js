var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("appname", { type: String, required: true });
    this.name = this.options.appname || "myapp";
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

        const files = ["package.json", "docker-compose.yaml"];

        const copyOpts = {
          globOptions: {
            dot: true,
            ignore: [],
          },
        };

        this.fs.copy(src, destAppDir, copyOpts);
        this.fs.copy(this.templatePath(".*"), destAppDir, copyOpts);

        const opts = {
          name: this.name,
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
