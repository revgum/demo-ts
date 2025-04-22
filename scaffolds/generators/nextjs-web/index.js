// biome-ignore lint/style/noVar: <explanation>
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('appname', { type: String, required: true });
    this.name = this.options.appname || 'myapp';
  }

  initializing() {}

  async prompting() {}

  configuring() {}

  default() {}

  get writing() {
    return {
      appStaticFiles() {
        const src = `${this.sourceRoot()}/**`;
        const dest = this.destinationPath(this.name);

        const files = [
          'Bruno/Todo/Create Todo.bru',
          'Bruno/Todo/Delete Todo.bru',
          'Bruno/Todo/Get All Todo.bru',
          'Bruno/Todo/Get Todo.bru',
          'Bruno/Todo/Update Todo.bru',
          'Bruno/bruno.json',
          'package.json',
          'docker-compose.debug.yaml',
          'docker-compose.migrations.yaml',
          'docker-compose.yaml',
        ];

        const copyOpts = {
          globOptions: {
            ignore: [],
          },
        };

        this.fs.copy(src, dest, copyOpts);
        this.fs.copy(this.templatePath('.*'), dest, copyOpts);

        const opts = {
          name: this.name,
        };

        for (const f of files) {
          this.fs.copyTpl(this.templatePath(f), this.destinationPath(`${this.name}/${f}`), opts, copyOpts);
        }

        this.fs.move(
          this.destinationPath(`${this.name}`, 'gitignore'),
          this.destinationPath(`${this.name}`, '.gitignore'),
        );
      },
    };
  }

  conflicts() {}

  install() {}

  end() {}
};
