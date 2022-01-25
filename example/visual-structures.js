const OrangeCommand = require('../src/orange-command')

class VisualStructures extends OrangeCommand {
  get TITLE_COLOR () {
    return this.c.LIGHT_BLUE
  }

  async action () {
    this.headline('List')
    this.c.line('1 List item')
    this.c.tabLine('1.1 List item', 1)
    this.c.tabLine('1.2 List item', 1)
    this.c.line('2 List item')
    this.c.tabLine('2.1 List item', 1)
    this.c.tabLine('2.1.1 List item', 2)
    this.c.tabLine('2.1.2 List item', 2)
    this.c.tabLine('2.1.3 List item', 2)
    this.c.tabLine('2.2 List item', 1)
    this.headline('Quote')
    this.c.paragraph('“I predict future happiness for Americans, if they can prevent the government from wasting the labors of the people under the pretense of taking care of them.”', null, 60)
    this.c.line(' ― Thomas Jefferson')
  }
}

VisualStructures.run().then()
