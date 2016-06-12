# socket.io-pubsub

[![Build Status](https://travis-ci.org/elegantmonkeys/socket.io-pubsub.svg?branch=master)](https://travis-ci.org/elegantmonkeys/socket.io-pubsub)
[![Code Climate](https://codeclimate.com/github/elegantmonkeys/socket.io-pubsub/badges/gpa.svg)](https://codeclimate.com/github/elegantmonkeys/socket.io-pubsub)
[![Test Coverage](https://codeclimate.com/github/elegantmonkeys/socket.io-pubsub/badges/coverage.svg)](https://codeclimate.com/github/elegantmonkeys/socket.io-pubsub/coverage)

## How to use

```js
const gcloud = require('gcloud')();
const pubsub = gcloud.pubsub();
const io = require('socket.io')(3000);
const pubsubAdapter = require('socket.io-pubsub');
io.adapter(pubsubAdapter(pubsub));
```

By running socket.io with the `socket.io-pubsub` adapter you can run
multiple socket.io instances in different processes or servers that can
all broadcast and emit events to and from each other using Google Cloud Pub/Sub.

If you need to emit events to socket.io instances from a non-socket.io
process, you should use [socket.io-emitter](https://github.com/socketio/socket.io-emitter).

## API

### adapter(pubsub[, opts])

`pubsub` is a [gcloud](https://googlecloudplatform.github.io/gcloud-node/#/docs/gcloud) [pubsub](https://googlecloudplatform.github.io/gcloud-node/#/docs/pubsub) object. 

The following options are allowed:

- `key`: the topic name of the pub/sub events (`socket.io`)


### PubsubAdapter

The pub/sub adapter instances expose the following properties
that a regular `Adapter` does not

- `uid`
- `prefix`
- `pubsub`

## License

MIT
