const OrangeCommand = require('../src/orange-command')

class MenuCommand extends OrangeCommand {
  async action () {
    this.headline('Welcome to MenuCommand example - step 1')
    await this.menu1()
    this.headline('Welcome to MenuCommand example - step 2')
    await this.menu2()
  }

  async menu1 () {
    await this.menu({
      method: {
        label: 'Call async class method and repeat menu',
        function: 'my1'
      },
      arrow: {
        label: 'Call async arrow function and go to the next step',
        function: async (input) => {
          this.c.line(`Selected option is: ${input}`)
          this.c.line('Let\'s try array mode of the menu')
        }
      }
    })
  }

  async menu2 () {
    await this.menu([
      {
        label: 'Call async class method and repeat menu',
        function: 'my2'
      },
      {
        label: 'Call async arrow function and exit',
        function: async (input) => {
          this.c.line(`Selected option is: ${input}`)
          this.c.line('Thank you for using this command')
        }
      }
    ])
  }

  async my1 () {
    this.c.line('Work started')
    this.sleep(500)
    this.c.line('Work finished')
    await this.menu1()
  }

  async my2 () {
    this.c.line('Work started')
    this.sleep(500)
    this.c.line('Work finished')
    await this.menu2()
  }
}

MenuCommand.run().then()
