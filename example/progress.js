const OrangeCommand = require('../src/orange-command')

class Progress extends OrangeCommand {
  async action () {
    this.headline('Some actions')
    for (let i = 1; i <= 100; i++) {
      await this.sleep(5)
      const nl = (i % 80) === 0
      if (Math.random() < 0.1) {
        this.c.write('E', this.ERROR_COLOR, nl)
      } else {
        this.c.write('.', null, nl)
      }
    }
    this.c.line('')

    this.headline('Just show "spinner"')
    this.c.spinner()
    await this.sleep(5000)
    this.c.spinner(null)

    this.headline('Progress bar')
    for (let i = 0; i <= 100; i++) {
      await this.sleep(10)
      this.c.progressBar(i / 100)
    }
  }
}

Progress.run().then()
