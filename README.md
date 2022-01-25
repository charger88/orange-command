# Orange.Command

This library provides generic functionality for command-line scripts.

## Hello world example

```javascript
const {OrangeCommand} = require('orange-command')

class HelloWorld extends OrangeCommand {
  async action () {
    this.c.line('Hello world!')
  }
}

HelloWorld.run().then()
```

## Functionality

Parent class provides functionality to format output, receive input, perform validation, etc.

You can find examples in `example` directory.