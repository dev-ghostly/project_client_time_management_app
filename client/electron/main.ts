import { app, BrowserWindow, Tray, Menu } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
 
createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null
let isQuitting = false

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    width: 1280,
    height: 720,
    minHeight: 720,
    minWidth: 1280,
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  tray = new Tray(path.join(process.env.VITE_PUBLIC, 'electron.png'))

  tray.on('click', () => {
    if (win?.isVisible()) {
      win?.hide()
    } else {
      win?.show()
    }
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', type: 'normal', click: () => {
      isQuitting = true
      win?.destroy()
      app.quit()
    }},
  ])

  tray.setToolTip('Electron Vite')
  tray.setContextMenu(contextMenu)

  win.on('close', (event) => {// Only prevent if user is hiding, not quitting
    if (!isQuitting) {
      event.preventDefault()
      win?.hide()
    }
  })

  app.on('before-quit', () => {
    isQuitting = true
  })
  

  win.on('closed', () => {
    win = null
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Set a custom cache directory to avoid permission issues
const cachePath = path.join(os.homedir(), 'AppData', 'Local', 'MyElectronApp', 'Cache');

app.commandLine.appendSwitch('disk-cache-dir', cachePath);
app.commandLine.appendSwitch('no-sandbox'); // Helps avoid permission issues
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-gpu-process-crash-limit');

app.whenReady().then(createWindow)
