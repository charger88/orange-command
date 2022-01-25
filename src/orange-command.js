const ConsoleUtils = require('./console-utils')
const validate = require('orange-dragonfly-validator')

/**
 * Generic CLI command class
 */
class OrangeCommand {
  /**
     * Parses command line arguments
     * @returns {object}
     */
  static get commandLineArguments () {
    return process.argv.slice(2).reduce((a, c) => {
      const eqPos = c.indexOf('=')
      if (eqPos < 0) {
        a[c] = true
      } else {
        const key = c.slice(0, eqPos)
        const v = c.slice(eqPos + 1)
        a[key] = /^(\d+)$/.test(v) ? parseInt(v) : v
      }
      return a
    }, {})
  }

  /**
     * Runs the command
     * @param {object?} params Invocation parameters (command line arguments will be used by default)
     * @returns {Promise<OrangeCommand>}
     */
  static async run (params = null) {
    const commandParams = params || this.commandLineArguments
    return await (new this(commandParams))._runAction()
  }

  /**
     * Constructor
     * @param {object} params Invocation parameters
     */
  constructor (params) {
    this.params = params
    this._success = false
    this._timestamps = []
  }

  /**
     * Returns Console Utils class. It can be overloaded if some methods of ConsoleUtils needs to be overloaded.
     * @returns {ConsoleUtils}
     */
  get c () {
    return ConsoleUtils
  }

  /**
     * Returns list of validation rules in Orange Dragonfly Validator format
     * https://github.com/charger88/orange-dragonfly-validator
     * @returns {object|null} No validation will be invoked if not overloaded
     */
  get validationRules () {
    return null
  }

  /**
     * Arguments description (for "help" functionality)
     * @returns {object}
     */
  get argumentsDescription () {
    return {}
  }

  /**
     * Says if "help" functionality is allowed
     * @returns {boolean}
     */
  get allowHelp () {
    return true
  }

  /**
     * Title color
     * @returns {string|null}
     */
  get TITLE_COLOR () {
    return null
  }

  /**
     * Headline color
     * @returns {string}
     */
  get HEADLINE_COLOR () {
    return this.c.YELLOW
  }

  /**
     * Comment color
     * @returns {string}
     */
  get COMMENT_COLOR () {
    return this.c.LIGHT_BLUE
  }

  /**
     * Error color
     * @returns {string}
     */
  get ERROR_COLOR () {
    return this.c.RED
  }

  /**
     * Success message color
     * @returns {string}
     */
  get SUCCESS_COLOR () {
    return this.c.GREEN
  }

  /**
     * Execution error color
     * @returns {string}
     */
  get EXECUTION_ERROR_COLOR () {
    return this.c.RED_BG
  }

  /**
     * Execution success color
     * @returns {string}
     */
  get EXECUTION_SUCCESS_COLOR () {
    return this.c.GREEN_BG
  }

  /**
     * Execution result (return value of the action)
     * @returns {*}
     */
  get executionResult () {
    return this._executionResult
  }

  /**
     * Defines if system output should be printed
     * @returns {boolean}
     */
  get showSystemOutput () {
    return true
  }

  /**
     * Returns current timestamp in milliseconds
     * @returns {number}
     */
  get now () {
    return Date.now()
  }

  /**
     * Author name (used in automatically generated system output)
     * @returns {string}
     */
  get author () {
    return null
  }

  /**
     * Prints text colored with defined success color
     * @param {string} input Text
     */
  success (input) {
    this.c.line(input, this.SUCCESS_COLOR)
  }

  /**
     * Prints text colored with defined headline color
     * @param {string} input Text
     */
  headline (input) {
    this.c.line(input, this.HEADLINE_COLOR)
  }

  /**
     * Prints text colored with defined error color
     * @param {string} input Text
     */
  error (input) {
    this.c.line(input, this.ERROR_COLOR)
  }

  /**
     * Prints text colored with defined execution success color
     * @param {string} input Text
     */
  executionSuccess (input) {
    this.c.line(input, this.EXECUTION_SUCCESS_COLOR)
  }

  /**
     * Prints text colored with defined execution error color
     * @param {string} input Text
     */
  executionError (input) {
    this.c.line(input, this.EXECUTION_ERROR_COLOR)
  }

  /**
     * Pauses script execution
     * @param {number} ms Sleep time in milliseconds
     */
  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
     * Defines new step of the command execution - prints headline and saves timestamp for execution report
     * @param {string} label
     */
  newStep (label) {
    this.addTimestamp(label)
    this.headline(label)
  }

  /**
     * Saves timestamp for execution report
     * @param {string} label
     */
  addTimestamp (label) {
    const ts = this.now
    this._timestamps.push({ label, ts })
  }

  /**
     * Formats time
     * @param {number} tsMs Unix timestamp in milliseconds
     * @returns {string}
     */
  formatTime (tsMs) {
    return (new Date(tsMs)).toISOString()
  }

  /**
     * Prints generic system output before command execution
     * @private
     */
  _preActionOutput () {
    this.c.block([
      this.constructor.name,
      null,
            `Started at: ${this.formatTime(this._timestamps[0].ts)}`
    ], this.TITLE_COLOR, this.TITLE_COLOR)
    this.c.line('')
  }

  /**
     * Prints generic execution report
     * @private
     */
  _timestampsOutput () {
    const data = ['Command execution time report', null]
    const total = this._timestamps.length
    for (let i = 0; i < this._timestamps.length; i++) {
      const t = this._timestamps[i]
      const lineData = [this.formatTime(t.ts), t.label]
      if (i < (total - 1)) {
        lineData.push(`${(this._timestamps[i + 1].ts - t.ts) / 1000}s`)
      }
      data.push(lineData.join(' - '))
    }
    this.c.block(data)
  }

  /**
     * Prints generic system output after command execution
     * @private
     */
  _postActionOutput () {
    this.c.line('')
    const s = (this._timestamps[this._timestamps.length - 1].ts - this._timestamps[0].ts) / 1000
    if (this._success) {
      this.executionSuccess(`Command finished successfully in ${s}s`)
    } else {
      this.executionError(`Command execution failed after ${s}s`)
    }
  }

  /**
     * Processes error
     * @param {Promise<Error>} e
     */
  async processError (e) {
    this.error(e.stack)
  }

  /**
     * Processes input validation error
     * @param {Error} e
     * @returns {Promise}
     */
  async processInputError (e) {
    this.error(`Input parameters error${e.info ? ':' : ''}`)
    if (e.info) {
      for (const [key, value] of Object.entries(e.info)) {
        this.error(`\t${key}: ${value.join(', ')}`)
      }
    }
    this.c.line('')
    if (this.allowHelp) {
      this.c.line('Run this command with the --help flag to read some documentation')
      this.c.line('')
    }
  }

  /**
     * Requests
     * @param {string} prompt Prompt
     * @param {RegExp?} pattern Regexp pattern to validate input
     * @param {string|boolean} errorMessage Error message for input error
     * @param {string} separator Separator between prompt and input
     * @returns {Promise<string>}
     */
  async input (prompt = '', pattern = null, errorMessage = true, separator = ': ') {
    let input
    do {
      input = await this.c.getInputLine(prompt ? `${prompt}${separator}` : '')
      if (pattern && !pattern.test(input)) {
        input = null
        let error
        if (errorMessage === true) {
          error = `Incorrect input: required pattern is ${pattern.toString()}`
        } else if (errorMessage === false) {
          error = null
        } else {
          error = errorMessage
        }
        if (error) {
          this.c.line(error, this.ERROR_COLOR)
        }
      }
    } while (input == null)
    return input
  }

  /**
     * Runs menu functionality
     * @param {Array|object} menu List of objects with "label" and "function" arguments to be used as menu. Function can be function or string (in that case method of the command object will be called)
     */
  async menu (menu) {
    for (const k of Object.keys(menu)) {
      this.c.line(`${this.c.colorText(k, this.COMMENT_COLOR)} - ${menu[k].label}`)
    }
    let selected = null
    let input = null
    do {
      input = await this.input('Please provide menu key')
      if (menu[input]) {
        selected = menu[input].function
      } else {
        this.c.line(`Incorrect input! Allowed values: ${Object.keys(menu).join(', ')}.`, this.ERROR_COLOR)
      }
    } while (selected === null)
    await (typeof selected === 'string' ? this[selected] : selected).call(this, input)
  }

  /**
     * Runs command logic
     * @returns {Promise<OrangeCommand>}
     */
  async _runAction () {
    if (this.allowHelp && (this.params['--help'] === true)) {
      this._printHelp()
      return this
    }
    this.addTimestamp('Command started')
    if (this.showSystemOutput) {
      this._preActionOutput()
    }
    this.addTimestamp('Action started')
    let inputValidationPassed = true
    const validationRules = this.validationRules
    if (validationRules) {
      try {
        validate(validationRules, this.params)
      } catch (e) {
        inputValidationPassed = false
        await this.processInputError(e)
      }
    }
    if (inputValidationPassed) {
      try {
        this._executionResult = await this.action() || null
        this._success = true
      } catch (e) {
        await this.processError(e)
      }
    }
    this.addTimestamp('Finished')
    if (this.showSystemOutput) {
      if (this._timestamps.length > 3) {
        this._timestampsOutput()
      }
      this._postActionOutput()
    }
    return this
  }

  /**
     * Prints help
     */
  _printHelp () {
    const validationRules = this.validationRules
    const argumentsDescription = this.argumentsDescription
    this.c.line('')
    this.c.line(this.constructor.name)
    this.c.hr()
    if (validationRules) {
      for (const [key, rule] of Object.entries(validationRules)) {
        const text = []
        if (rule.required && !Object.prototype.hasOwnProperty.call(rule, 'default')) {
          text.push(this.c.colorText('[required]', this.c.RED))
        }
        const rTypes = rule.type ? (Array.isArray(rule.type) ? rule.type : [rule.type]) : []
        if ((rTypes.length === 1) && (rTypes[0] === 'boolean')) {
          text.push(this.c.colorText('[flag]', this.c.LIGHT_BLUE))
        } else if (rTypes.length) {
          text.push(this.c.colorText('[' + rTypes.join('|') + ']', this.c.LIGHT_BLUE))
        }
        if (Object.prototype.hasOwnProperty.call(argumentsDescription, key)) {
          text.push(argumentsDescription[key] + '.')
        }
        if (Object.prototype.hasOwnProperty.call(rule, 'min')) {
          text.push(`Minimal ${rTypes.includes('integer') || rTypes.includes('float') ? 'value' : 'length'} is ${rule.min}.`)
        }
        if (Object.prototype.hasOwnProperty.call(rule, 'max')) {
          text.push(`Maximal ${rTypes.includes('integer') || rTypes.includes('float') ? 'value' : 'length'} is ${rule.max}.`)
        }
        if (Object.prototype.hasOwnProperty.call(rule, 'default')) {
          text.push(`Default value: ${rule.default === null ? 'null' : `[${typeof rule.default}] ${rule.default}`}.`)
        }
        // TODO Add other rules to be converted
        this.c.line(`${this.c.colorText(key, this.c.YELLOW)} - ${text.join(' ')}`)
      }
    } else {
      this.c.line('Help not found')
    }
    this.c.line('')
  }

  /**
     * Command logic. Needs to be overloaded.
     * @abstract
     */
  async action () {
    this.error('Reimplement "async action()" method')
  }
}

module.exports = OrangeCommand
