import { App } from '@/app';
import { Routes } from '@interfaces/routes.interface';

export class TestServer {
  private app: App;
  private server: any;
  private routes: Routes[];

  constructor(routes: Routes[]) {
    this.routes = routes;
  }

  async start(): Promise<void> {
    this.app = new App(this.routes);
    this.server = this.app.getServer().listen(0);

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 5000);

      this.server.on('listening', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.server.on('error', (err: any) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      return new Promise<void>((resolve) => {
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

  getServer(): any {
    return this.server;
  }

  getApp(): App {
    return this.app;
  }
}

export const createTestServer = async (routes: Routes[]): Promise<TestServer> => {
  const testServer = new TestServer(routes);
  await testServer.start();
  return testServer;
}; 