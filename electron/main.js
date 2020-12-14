const path = require('path');

const { app, BrowserWindow, Menu, shell } = require('electron');
const Store = require('electron-store');
const isDev = require('electron-is-dev');

const PUBLIC = path.join(__dirname, '../public');

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

const store = new Store({
  defaults: {
    windowBounds: {
      width: 470,
      height: 650,
    }
  },
});

const createMainWindow = () => {
  const { width, height } = store.get('windowBounds');

  const mainWin = new BrowserWindow({
    useContentSize: true,
    center: true,
    redsizable: false,
    backgroundColor: '#010A13',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  mainWin.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${PUBLIC}/index.html)`
  );

  mainWin.setContentSize(470, 650);

  if (isDev) {
    mainWin.webContents.openDevTools({ mode: 'detach' });

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(error => console.log(`An error occurred: , ${error}`));
  }
};

const generateSettingsWindow = () => {
  let settingsWin = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    minimizable: false,
    fullscreenable: false,
    title: 'Settings',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  settingsWin.loadURL(`file://${PUBLIC}/settings.html)`);

  settingsWin.on('closed', () => settingsWin = null);
};

const generateMenu = () => {
  const appName = app.getName();
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click() { app.quit(); },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Settings',
          click() { generateSettingsWindow() },
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          click() {
            shell.openExternal('https://github.com/jisaacfriend/lol-conqueror');
          },
          label: 'Learn More',
        },
        {
          click() {
            shell.openExternal('https://github.com/jisaacfriend/lol-conqueror/issues');
          },
          label: 'File Issue on GitHub'
        },
        {
          label: `About ${appName}`,
          role: 'about'
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.whenReady().then(() => {
  createMainWindow();
  generateMenu();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
