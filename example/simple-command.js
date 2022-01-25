const OrangeCommand = require('../src/orange-command')

class MySimpleCommand extends OrangeCommand {
  get TITLE_COLOR () {
    return this.c.YELLOW
  }

  async action () {
    this.c.line(this.params)
  }
}

MySimpleCommand.run().then()
