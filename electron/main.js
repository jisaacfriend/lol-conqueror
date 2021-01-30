const {
  app,
  BrowserWindow,
  Menu,
  shell,
  dialog,
  ipcMain,
} = require('electron');

const isDev = require('electron-is-dev');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');

const Store = require('./store');
const defaultSettings = require('./data/defaults');

const PUBLIC = path.join(__dirname, '../public');
const PLATFORM = process.platform;
const VALID_FILENAMES =new Map([
  ['darwin', 'League of Legends.app'],
  ['win32', 'LeagueClient.exe'],
]);

const store = new Store();

const now = Date.now();

// Conditionally include the dev tools installer to load React Dev Tools
let mainWin; let installExtension; let REACT_DEVELOPER_TOOLS;

if (isDev) {
  // eslint-disable-next-line global-require
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const initLeagueClientData = async () => {
  const { data: { v: clientVersion } } = await axios.get('https://ddragon.leagueoflegends.com/realms/na.json');
  const { data: { data: championsList } } = await axios.get('http://ddragon.leagueoflegends.com/cdn/11.2.1/data/en_US/champion.json');
  const roles = {
    'champion.gg': ['Top', 'Jungle', 'Middle', 'ADC', 'Support'],
    'blitz.gg': [],
    'op.gg': [],
    'probuilds.net': [],
    'u.gg': [],
  };
  const pickThreshold = .5;

  store.setAppSetting('lolClientVersion', clientVersion);
  store.setAppSetting('lastUpdated', now);
  store.setAppSetting('championsList', Object.keys(championsList));
  store.setAppSetting('championRoles', roles);
  store.setAppSetting('minimumPickThreshold', pickThreshold);
};

const verifyInstall = (path) => {
  const fileName = VALID_FILENAMES.get(PLATFORM);

  return path.endsWith(fileName);
};

const initConfig = async () => {
  store.setDefaults(defaultSettings);

  await initLeagueClientData();

  const lolClientVersion = store.getAppSetting('lolClientVersion');
  const lastUpdated = store.getAppSetting('lastUpdated');

  const installPath = store.getUserSetting('installPath') || store.getDefaultSetting(`leagueClient.defaultPath.${PLATFORM}`);
  const installIsValid = fs.existsSync(installPath) && verifyInstall(installPath);
  const supportedSources = store.getDefaultSetting('supportedSources');

  return {
    lolClientVersion,
    lastUpdated,
    installIsValid,
    installPath,
    supportedSources,
  }
};

ipcMain.on('get-install-path', (e) => {
  const extensions = PLATFORM === 'darwin'
    ? ['app']
    : ['exe'];

  const [selectedPath] = dialog.showOpenDialogSync(mainWin, {
    filters: [
      { name: 'Applications', extensions },
    ],
  });

  const isValid = verifyInstall(selectedPath);

  if (isValid) store.setUserSetting('installPath', selectedPath);

  e.returnValue = {
    isValid,
    selectedPath,
  };
});

ipcMain.on('get-settings', (e) => {
  const sources = store.getUserSetting('sources') || store.getDefaultSetting('sources');
  const options = store.getUserSetting('options') || store.getDefaultSetting('options');
  console.log(options)
  e.returnValue = { sources, options };
});

ipcMain.handle('save-settings', async (e, data) => {
  store.setUserSetting('sources', data.sources);
  store.setUserSetting('options', data.options);
  console.log(data.options)
  return 'Settings saved!';
});

ipcMain.handle('restore-options', async () => {
  const sources = store.getUserSetting('sources') || store.getDefaultSetting('sources');
  const options = store.getUserSetting('options') || store.getDefaultSetting('options');
  console.log(options)
  return { sources, options };
});

const simRequest = () => {
  return new Promise((resolve) => setTimeout(resolve, 5000));
};

ipcMain.handle('import-pages', async (e, data) => {
  console.log('Importing pages...', data);
  await simRequest();
  return('Pages imported!');
});

ipcMain.handle('delete-pages', async () => {
  console.log('Deleting pages...');
  await simRequest();
  return ('Pages deleted!');
});

const createMainWindow = async () => {
  mainWin = new BrowserWindow({
    useContentSize: true,
    center: true,
    resizable: false,
    backgroundColor: '#010A13',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
      contextIsolation: false,
    },
  });

  // await initLeagueClientData();

  const initialConfig = await initConfig();

  mainWin.webContents.on('did-finish-load', () => {
    mainWin.webContents.send('init-config', initialConfig);
  });


  mainWin.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${PUBLIC}/index.html)`,
  );

  mainWin.setContentSize(470, 825);

  mainWin.on('ready-to-show', () => {
    mainWin.show();
  });

  mainWin.on('closed', () => {
    mainWin = null;
  });

  if (isDev) {
    mainWin.webContents.openDevTools({ mode: 'detach' });

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }
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
          label: 'File Issue on GitHub',
        },
        {
          label: `About ${appName}`,
          role: 'about',
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
  if (PLATFORM !== 'darwin') {
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
