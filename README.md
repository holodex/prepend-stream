# prepend-stream

> Prepend the contents of one stream onto another.

Related: [add-stream](https://github.com/wilsonjackson/add-stream)

## Usage

```js
var fs = require('fs');
var es = require('event-stream');
var prependStream = require('prepend-stream');

// Append strings/buffers
fs.createReadStream('1.txt') // 1.txt contains: number1
	.pipe(prependStream(fs.createReadStream('2.txt'))) // 2.txt contains: number2
	.pipe(fs.createWriteStream('appended.txt')); // appended.txt contains: number2number1

// Append object streams
es.readArray([1, 2, 3])
	.pipe(prependStream.obj(es.readArray([4, 5, 6])))
	.pipe(es.writeArray(function (err, array) {
		console.log(array); // [ 4, 5, 6, 1, 2, 3 ]
	}));
```

## API

### var transformStream = prependStream(stream, opts = {})

Create a transform stream that appends the contents of `stream` onto whatever
is piped into it. Options are passed to the transform stream's constructor.

### var transformStream = prependStream.obj(stream, opts = {})

A convenient shortcut for `prependStream(stream, {objectMode: true})`.

## License

ISC
