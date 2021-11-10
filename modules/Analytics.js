const Sentry = require("@sentry/electron");
const Tracing = require("@sentry/tracing");
const path = require("path");

class Analytics {
    constructor(app) {
        this.app = app;
    }

    initSentry() {
        return new Promise(resolve => {
            require('dotenv').config({ path: this.app.isPackaged ? path.join(this.app.getAppPath(), ".env") : path.resolve(process.cwd(), '.env') });
            if (process.argv[2] === '--dev' && !process.argv.includes("--sentry")) resolve("Sentry disabled in dev mode, pass --sentry to enable.");
            Sentry.init({
                dsn: "https://32ee3fa672804aa592a9b6a085a436b7@o564437.ingest.sentry.io/5895094",
                release: "youtubify@" + this.app.getVersion(),
                sendDefaultPii: true,
                environment: process.argv[2] === '--dev' ? "development" : "production",
                integrations: [new Tracing.Integrations.BrowserTracing()],
                tracesSampleRate: 0.01,
                autoSessionTracking: true
            });
            resolve("Sentry initialized");
        });
    }

    async sendReport(id) {
        //Legacy code, no longer used.
        //Await axios.post('http://backend.alexandrus21.com/youtubedl/errorreport.php/', querystring.stringify({ id: id, version: this.version, code: err.error.code, description: err.error.description, platform: process.platform, url: err.url, type: err.type, quality: err.quality}));
        return id;
    }
}

module.exports = Analytics;