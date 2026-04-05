"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TestServer () {
        return TestServer;
    },
    get createTestServer () {
        return createTestServer;
    }
});
const _app = require("../../app");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let TestServer = class TestServer {
    async start() {
        this.app = new _app.App(this.routes);
        this.server = this.app.getServer().listen(0);
        await new Promise((resolve, reject)=>{
            const timeout = setTimeout(()=>{
                reject(new Error('Server startup timeout'));
            }, 5000);
            this.server.on('listening', ()=>{
                clearTimeout(timeout);
                resolve();
            });
            this.server.on('error', (err)=>{
                clearTimeout(timeout);
                reject(err);
            });
        });
    }
    async stop() {
        if (this.server) {
            return new Promise((resolve)=>{
                this.server.removeAllListeners();
                this.server.close(()=>{
                    this.server = null;
                    resolve();
                });
                setTimeout(()=>{
                    if (this.server) {
                        this.server.unref();
                        this.server = null;
                        resolve();
                    }
                }, 100);
            });
        }
    }
    getServer() {
        return this.server;
    }
    getApp() {
        return this.app;
    }
    constructor(routes){
        _define_property(this, "app", void 0);
        _define_property(this, "server", void 0);
        _define_property(this, "routes", void 0);
        this.routes = routes;
    }
};
const createTestServer = async (routes)=>{
    const testServer = new TestServer(routes);
    await testServer.start();
    return testServer;
};

//# sourceMappingURL=test-server.js.map