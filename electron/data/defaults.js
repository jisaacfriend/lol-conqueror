module.exports = {
  leagueClient: {
    defaultPath: {
      win32: 'C:/Riot Games/League Of Legends/LeagueClient.exe',
      darwin: '/Applications/League of Legends.app',
      linux: '',
    },
  },
  supportedSources: ['probuilds.net'],
  sources: {
    "probuilds.net": true,
    "blitz.gg": false,
    "champion.gg": false,
    "op.gg": false,
    "u.gg": false,
  },
  options: {
    includeTrinkets: true,
    includeConsumables: true,
    showBuildPath: true
  },
};
