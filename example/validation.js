const OrangeCommand = require('../src/orange-command')

/**
 * Provide both arguments:
 * node ./example/validation.js --arg1=10 --arg2=2
 *
 * Provide just one argument (--arg2 has default value)
 * node ./example/validation.js --arg1=10
 *
 * Provide just one argument (--arg1 doesn't have default value, so error will be returned)
 * node ./example/validation.js --arg2=10
 *
 * Wrong types (2 errors will be returned)
 * node ./example/validation.js --arg1=ten --arg2
 *
 * Help will be printed
 * node ./example/validation.js --help
 */

class ValidationAndHelp extends OrangeCommand {
  get validationRules () {
    return {
      '--arg1': {
        required: true,
        type: 'integer',
        min: 0
      },
      '--arg2': {
        required: true,
        type: 'integer',
        min: 0,
        default: 1
      }
    }
  }

  get argumentsDescription () {
    return {
      '--arg1': 'First argument for logic operations',
      '--arg2': 'Second argument for logic operations'
    }
  }

  async action () {
    const a1 = this.params['--arg1']
    const a2 = this.params['--arg2']
    this.headline('Conjunction')
    this.c.line(`${a1} AND ${a2} = ${a1 & a2}`)
    this.headline('Disjunction')
    this.c.line(`${a1} OR ${a2} = ${a1 | a2}`)
  }
}

ValidationAndHelp.run().then()
