var PassThrough = require('readable-stream').PassThrough
var Writable = require('readable-stream').Writable
var defined = require('defined')
var inherits = require('inherits')

function prependStream (stream, opts) {
  opts = defined(opts, {})
  var factory
  if (typeof stream === 'function') {
    factory = stream
  } else {
    stream.pause()
    factory = function () {
      return stream
    }
  }
  return new Prependee(factory, opts)
}

prependStream.obj = function obj (stream, opts) {
  opts = defined(opts, {})
  opts.objectMode = true
  return prependStream(stream, opts)
}

function Prependee(factory, opts) {
  PassThrough.call(this, opts)
  this.factory = factory
  this.opts = opts
  this.hasPrepended = false
}
inherits(Prependee, PassThrough)

Prependee.prototype._transform = function (chunk, enc, cb) {
  var done = function () { cb(null, chunk )}
  if (!this.hasPrepended) {
    var self = this
    var stream = this.factory()
    stream.pipe(new Prepender(this, this.opts))
      .on('finish', function () {
        self.hasPrepended = true
        done()
      })
  } else {
    done()
  }
}

function Prepender (target, opts) {
  Writable.call(this, opts)
  this.target = target
}
inherits(Prepender, Writable)

Prepender.prototype._write = function (chunk, enc, cb) {
  this.target.push(chunk)
  cb()
}

module.exports = prependStream
