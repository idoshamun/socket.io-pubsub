'use strict';

const Code = require('code');
const Lab = require('lab');

const http = require('http').Server;
const io = require('socket.io');
const ioc = require('socket.io-client');
const gcloudPubsub = require('@google-cloud/pubsub');
const pubsub = gcloudPubsub({
    projectId: 'socketio-pubsub-testing',
    keyFilename: 'key.json'
});
const adapter = require('..');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

describe('socket.io-pubsub', () => {

    it('broadcasts', (done) => {
        create((server1, client1) => {
            create((server2, client2) => {
                client1.on('woot', (a, b) => {
                    expect(a).to.equal([]);
                    expect(b).to.equal({ a: 'b' });
                    client1.disconnect();
                    client2.disconnect();
                    done();
                });
                server2.on('connection', c2 => {
                    c2.broadcast.emit('woot', [], { a: 'b' });
                });
            });
        });
    });

    it('broadcasts to rooms', done => {
        create((server1, client1) => {
            create((server2, client2) => {
                create((server3, client3) => {
                    server1.on('connection', c1 =>
                        c1.join('woot')
                    );

                    server2.on('connection', c2 => {
                        // does not join, performs broadcast
                        c2.on('do broadcast', () =>
                            c2.broadcast.to('woot').emit('broadcast')
                        );
                    });

                    server3.on('connection', c3 => {
                        // does not join, signals broadcast
                        client2.emit('do broadcast');
                    });

                    client1.on('broadcast', () => {
                        client1.disconnect();
                        client2.disconnect();
                        client3.disconnect();
                        done();
                    });

                    client2.on('broadcast', () => {
                        throw new Error('Not in room');
                    });

                    client3.on('broadcast', () => {
                        throw new Error('Not in room');
                    });
                });
            });
        });
    });

    it('doesn\'t broadcast to left rooms', (done) => {
        create((server1, client1) => {
            create((server2, client2) => {
                create((server3, client3) => {
                    server1.on('connection', c1 => {
                        c1.join('woot');
                        c1.leave('woot');
                    });

                    server2.on('connection', c2 => {
                        c2.on('do broadcast', () => {
                            c2.broadcast.to('woot').emit('broadcast');

                            setTimeout(() => {
                                client1.disconnect();
                                client2.disconnect();
                                client3.disconnect();
                            }, 2000);
                        });
                    });

                    server3.on('connection', c3 =>
                        client2.emit('do broadcast')
                    );

                    client1.on('broadcast', () => {
                        throw new Error('Not in room');
                    });
                });
            });
        });
    });

    it('deletes rooms upon disconnection', done => {
        create((server, client) => {
            server.on('connection', c => {
                c.join('woot');
                c.on('disconnect', () => {
                    expect(c.adapter.sids[c.id] || {}).to.be.empty();
                    expect(c.adapter.rooms || []).to.be.empty();
                    client.disconnect();
                });
                c.disconnect();
            });
        });
    });

    // create a pair of socket.io server+client
    function create(nsp, callback) {
        if ('function' == typeof nsp) {
            callback = nsp;
            nsp = '';
        }

        const srv = http();
        const sio = io(srv);
        sio.adapter(adapter(pubsub));
        srv.listen(err => {
            if (err) {
                throw err;
            }
            nsp = nsp || '/';
            const addr = srv.address();
            const url = `http://localhost:${addr.port}${nsp}`;
            callback(sio.of(nsp), ioc(url));
        });
    }

});
