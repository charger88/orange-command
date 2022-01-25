# Orange.Command

This library provides generic functionality for command-line scripts.

## How to

```javascript
const {OrangeCommand} = require('orange-command')

class HelloWorld extends OrangeCommand {
  async action () {
    this.c.line('Hello world!')
  }
}

HelloWorld.run().then()
```