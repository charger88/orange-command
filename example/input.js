const OrangeCommand = require('../src/orange-command')

class InputCommand extends OrangeCommand {
  async action () {
    let input = await this.input('Some input')
    this.c.line(`Provided input: ${input}`)
    input = await this.input('Integer only', /^([\d]+)$/)
    this.c.line(`Provided input: ${input}`)
  }
}

InputCommand.run().then()
