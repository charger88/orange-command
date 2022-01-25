const readline = require('readline')

/**
 * Collection of static methods for CLI interactions
 */
class ConsoleUtils {
  /**
     * New line
     * @returns {string}
     */
  static get NL () {
    return '\n'
  }

  /**
     * Red color
     * @returns {string}
     */
  static get RED () {
    return '\x1b[0;31m'
  }

  /**
     * Yellow color
     * @returns {string}
     */
  static get YELLOW () {
    return '\x1b[0;33m'
  }

  /**
     * Green color
     * @returns {string}
     */
  static get GREEN () {
    return '\x1b[0;32m'
  }

  /**
     * Light grey color
     * @returns {string}
     */
  static get LIGHT_GREY () {
    return '\x1b[0;37m'
  }

  /**
     * Dark grey color
     * @returns {string}
     */
  static get DARK_GREY () {
    return '\x1b[0;30m'
  }

  /**
     * Light blue color
     * @returns {string}
     */
  static get LIGHT_BLUE () {
    return '\x1b[0;34m'
  }

  /**
     * Light grey background
     * @returns {string}
     */
  static get LIGHT_GREY_BG () {
    return '\x1b[0;47m'
  }

  /**
     * Green background
     * @returns {string}
     */
  static get GREEN_BG () {
    return '\x1b[0;42m'
  }

  /**
     * Yellow background
     * @returns {string}
     */
  static get YELLOW_BG () {
    return '\x1b[0;43m'
  }

  /**
     * Red background
     * @returns {string}
     */
  static get RED_BG () {
    return '\x1b[0;41m'
  }

  /**
     * End color character
     * @returns {string}
     */
  static get END_COLOR () {
    return '\x1b[0;0m'
  }

  /**
     * Calculates maximal length of lines in the provided array
     * @param {string[]} lines
     * @param {number} min
     * @param {number} offset
     * @returns
     */
  static _maxLengthOfList (lines, min, offset = 0) {
    return Math.max(min - offset * 2, lines.reduce((a, c) => c ? Math.max(a, c.length) : a, 0))
  }

  /**
     * Requests user input
     * @param {string} prompt Prompt text
     * @returns {Promise<string>}
     */
  static getInputLine (prompt = '') {
    return new Promise(resolve => {
      const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      r.question(prompt, input => {
        r.close()
        resolve(input)
      })
    })
  }

  /**
     * Prints text
     * @param {string} input Text
     * @param {?string} color Color of text
     * @param {boolean} newline Defines if new line required at the end
     */
  static write (input, color = null, newline = false) {
    process.stdout.write(this.colorText(input && (typeof input === 'object') ? JSON.stringify(input, null, 2) : input.toString(), color) + (newline ? this.NL : ''))
  }

  /**
     * Prints line of text
     * @param {string} input Text
     * @param {?string} color Color of text
     */
  static line (input, color = null) {
    this.write(input, color, true)
  }

  /**
     * Prints line of text with tab indent
     * @param {string} input Text
     * @param {number} tab Number of tabs
     * @param {?string} color Color of text
     */
  static tabLine (input, tab = 1, color = null) {
    this.write('\t'.repeat(tab) + input, color, true)
  }

  /**
     * Colorizes text
     * @param {string} input Text
     * @param {string} color Color of text
     * @returns {string}
     */
  static colorText (input, color = null) {
    return color ? `${color}${input}${this.END_COLOR}` : input
  }

  /**
     * Breaks line of text into multiple lines and prints them
     * @param {*} text Text
     * @param {?string} color Color of text
     * @param {number} max Maximal length of the line
     */
  static paragraph (text, color = null, max = 80) {
    const words = text.split(' ')
    let formattedText = ''
    let lineLength = 0
    let wordsSeparator = ''
    for (const w of words) {
      if (lineLength) {
        formattedText += wordsSeparator
        if (wordsSeparator !== this.NL) {
          lineLength += wordsSeparator.length
        }
      }
      if ((lineLength + w.length) > max) {
        if (lineLength) {
          formattedText += this.NL
          formattedText += w
          lineLength = w.length
          wordsSeparator = ' '
        } else {
          formattedText += w
          formattedText += this.NL
          lineLength = 0
        }
      } else {
        formattedText += w
        lineLength += w.length
        wordsSeparator = ' '
      }
    }
    this.write(formattedText, color, true)
  }

  /**
     * Prints decorated block with border
     * @param {string[]} lines Line of text
     * @param {?string} font_color Color of text
     * @param {?string} border_color Color of border
     * @param {number} min Minimal widrh of the block
     */
  static block (lines, font_color = null, border_color = null, min = 80) {
    const max = this._maxLengthOfList(lines, min, 2)
    this.write(`╔${'═'.repeat(max + 2)}╗`, border_color, true)
    for (const l of lines) {
      if (l === null) {
        this.write(`╟${'─'.repeat(max + 2)}╢`, border_color, true)
      } else {
        this.write('║', border_color)
        this.write(` ${l}${' '.repeat(max - l.length)} `, font_color)
        this.write('║', border_color, true)
      }
    }
    this.write(`╚${'═'.repeat(max + 2)}╝`, border_color, true)
  }

  /**
     * Prints horizontal line
     * @param {number} length
     */
  static hr (length = 80) {
    this.write('─'.repeat(length), null, true)
  }

  /**
     * Hides cursor
     */
  static hideCursor () {
    this.write('\x1b[?25l')
  }

  /**
     * Show cursor
     */
  static showCursor () {
    this.write('\x1b[?25h')
  }

  /**
     * Renders progress bar
     * @param {number} pc Percentage (between 0 and 1). If 1 provided, progress bar will be finished
     * @param {string} label Progress bar label
     * @param {number} length Length of the progress bar
     */
  static progressBar (pc, label = 'Processing', length = 25) {
    if (pc === 0) {
      this.hideCursor()
    }
    const _loaderLabel = label.length ? `${label} ` : ''
    const full = Math.floor(pc * length)
    const bar = '█'.repeat(full) + '░'.repeat(length - full)
    this.write('\b'.repeat(_loaderLabel.length + length) + _loaderLabel + bar)
    if (pc === 1) {
      this.showCursor()
      this.write('', null, true)
    }
  }

  /**
     * Renders spinner (it doesn't really spins though)
     * @param {string|null} label Spinner label. Provide null to hide spinner.
     */
  static spinner (label = 'Processing') {
    const max = 9
    if (label !== null) {
      this.hideCursor()
      this._loaderLabel = label.length ? `${label} ` : ''
      this._loaderN = 0
      const next = () => {
        const loaderN = (this._loaderN + 1) % (max + 1)
        this.write('\b'.repeat(this._loaderLabel.length + 1 + max) + this._loaderLabel + '▹'.repeat(loaderN) + '▶' + '▹'.repeat(max - loaderN))
        this._loaderN = loaderN
        this._loader = setTimeout(next, 50)
      }
      next()
    } else {
      if (this._loader) {
        clearTimeout(this._loader)
      }
      this.write('\b'.repeat(this._loaderLabel.length + 1 + max) + ' '.repeat(this._loaderLabel.length + 1 + max), null, true)
      this.showCursor()
    }
  }
}

module.exports = ConsoleUtils
