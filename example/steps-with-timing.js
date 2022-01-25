const OrangeCommand = require('../src/orange-command')

class StepsWithTiming extends OrangeCommand {
  async action () {
    this.newStep('Step 1')
    await this.sleep(500)
    this.newStep('Step 2')
    await this.sleep(250)
    this.addTimestamp('Step 2.5')
    await this.sleep(250)
    this.newStep('Step 3')
    await this.sleep(500)
    this.newStep('Step 4')
    await this.sleep(250)
    this.addTimestamp('Step 4.5')
    await this.sleep(250)
    this.newStep('Step 5')
    await this.sleep(500)
  }
}

StepsWithTiming.run().then()
