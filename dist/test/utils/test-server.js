"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestServer = exports.TestServer = void 0;
const app_1 = require("@/app");
class TestServer {
    constructor(routes) {
        this.routes = routes;
    }
    async start() {
        this.app = new app_1.App(this.routes);
        this.server = this.app.getServer().listen(0);
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Server startup timeout'));
            }, 5000);
            this.server.on('listening', () => {
                clearTimeout(timeout);
                resolve();
            });
            this.server.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }
    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                // Remove all listeners to prevent memory leaks
                this.server.removeAllListeners();
                this.server.close(() => {
                    this.server = null;
                    resolve();
                });
                setTimeout(() => {
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
}
exports.TestServer = TestServer;
const createTestServer = async (routes) => {
    const testServer = new TestServer(routes);
    await testServer.start();
    return testServer;
};
exports.createTestServer = createTestServer;
//# sourceMappingURL=test-server.js.map