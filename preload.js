const Sentry = require("@sentry/electron");
const Tracing = require("@sentry/tracing");
const version = require('./package.json').version;
const { contextBridge, ipcRenderer } = require('electron')

function initSentry() {
    if (process.argv[2] === '--dev' && !process.argv.includes("--sentry")) return;
    Sentry.init({
        dsn: "https://32ee3fa672804aa592a9b6a085a436b7@o564437.ingest.sentry.io/5895094",
        release: "youtubify@" + version,
        sendDefaultPii: true,
        integrations: [new Tracing.Integrations.BrowserTracing()],
        tracesSampleRate: process.argv[2] === '--dev' ? 1.0 : 0.01,
        environment: process.argv[2] === '--dev' ? "development" : "production",
        autoSessionTracking: true
    });
}

initSentry();

contextBridge.exposeInMainWorld(
    "main", {
        invoke: async(channel, data) => {
            let validChannels = [
                "platform",
                "messageBox",
                "errorReport",
                "titlebarClick",
                "openInputMenu",
                "openCopyMenu",
                "settingsAction",
                "videoAction",
                "cookieFile",
                "downloadFolder",
                "installUpdate",
                "iconProgress",
                "theme",
                "restoreTaskList",
                "getDoneActions",
                "setDoneAction",
                "getSubtitles",
                "getSelectedSubtitles",
                "getLog",
                "saveLog"
            ];
            if (validChannels.includes(channel)) {
                return await ipcRenderer.invoke(channel, data);
            }
        },
        receive: (channel, cb) => {
            let validChannels = [
                "log",
                "error",
                "toast",
                "maximized",
                "videoAction",
                "updateGlobalButtons",
                "updateLinkPlaceholder",
                "totalSize",
                "binaryLock",
                "addShortcut",
                "downloadShortcut"
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, arg) => {
                    cb(arg)
                });
            }
        }
    }
);