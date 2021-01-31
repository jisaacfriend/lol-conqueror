module.exports = {
  leagueClient: {
    defaultPath: {
      win32: 'C:/Riot Games/League Of Legends/LeagueClient.exe',
      darwin: '/Applications/League of Legends.app',
      linux: '',
    },
  },
  supportedSources: ['champion.gg'],
  sources: {
    "blitz.gg": true,
    "champion.gg": false,
    "op.gg": false,
    "u.gg": false,
  },
  options: {
    'Include Trinkets': true,
    'Include Consumables': true,
    'Show Build Path': true,
    'Show Skill Order': true,
  },
};
