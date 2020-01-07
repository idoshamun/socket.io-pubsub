# socket.io-pubsub

[![Build Status](https://travis-ci.org/elegantmonkeys/socket.io-pubsub.svg?branch=master)](https://travis-ci.org/elegantmonkeys/socket.io-pubsub)

## How to use

```js
const pubsub = require('@google-cloud/pubsub');
const pubsubClient = pubsub();
const io = require('socket.io')(3000);
const pubsubAdapter = require('socket.io-pubsub');
io.adapter(pubsubAdapter(pubsubClient));
```

By running socket.io with the `socket.io-pubsub` adapter you can run
multiple socket.io instances in different processes or servers that can
all broadcast and emit events to and from each other using Google Cloud Pub/Sub.

If you need to emit events to socket.io instances from a non-socket.io
process, you should use [socket.io-emitter](https://github.com/socketio/socket.io-emitter).

## API

### adapter(pubsub[, opts])

`pubsub` is a [google-cloud](https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud) [pubsub](https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/pubsub) object.

The following options are allowed:

- `key`: the topic name of the pub/sub events (`socket.io`)
- `createSubscriptionOpts`: [options for creating a subscription](https://googleapis.dev/nodejs/pubsub/latest/global.html#CreateSubscriptionRequest)


### PubsubAdapter

The pub/sub adapter instances expose the following properties
that a regular `Adapter` does not

- `uid`
- `prefix`
- `pubsub`

## License

Apache 2.0
