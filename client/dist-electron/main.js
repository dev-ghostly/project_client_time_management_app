import { app, BrowserWindow, Tray, Menu } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let tray;
let isQuitting = false;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    width: 1280,
    height: 720,
    minHeight: 720,
    minWidth: 1280
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  tray = new Tray(path.join(process.env.VITE_PUBLIC, "electron.png"));
  tray.on("click", () => {
    if (win == null ? void 0 : win.isVisible()) {
      win == null ? void 0 : win.hide();
    } else {
      win == null ? void 0 : win.show();
    }
  });
  const contextMenu = Menu.buildFromTemplate([
    { label: "Quit", type: "normal", click: () => {
      isQuitting = true;
      win == null ? void 0 : win.destroy();
      app.quit();
    } }
  ]);
  tray.setToolTip("Electron Vite");
  tray.setContextMenu(contextMenu);
  win.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win == null ? void 0 : win.hide();
    }
  });
  app.on("before-quit", () => {
    isQuitting = true;
  });
  win.on("closed", () => {
    win = null;
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
const cachePath = path.join(os.homedir(), "AppData", "Local", "MyElectronApp", "Cache");
app.commandLine.appendSwitch("disk-cache-dir", cachePath);
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
app.commandLine.appendSwitch("disable-gpu-process-crash-limit");
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
