const axios = require('axios').default;
const cheerio = require('cheerio');

const baseURL = 'https://blitz.gg/lol/champions/overview?queue=ranked-solo-duo&rank=platinum_plus&region=world&role=';
const champData = {};

const fetchChampsByRole = async (roles) => {
  const remainingRoles = [...roles];
  const currentRole = remainingRoles.shift();
  console.log('fetchChampsByRole', currentRole)

  const { data } = await axios.get(`${baseURL}${currentRole}`);

  const $page = cheerio.load(data);

  const champLinks = $page('a').toArray();

  champLinks.forEach((link) => {
    console.log(link.attribs.href);
  });

  if (remainingRoles.length) return fetchChampsByRole(remainingRoles);
  return true;
};

const getChampionsList = async (roles) => {
  console.log('getChampionsList')
  // await fetchChampsByRole(roles);

  const { data } = await axios.get('https://blitz.gg/lol/champions/overview');

  const $page = cheerio.load(data);

  const champLinks = $page('a').toArray();

  champLinks.forEach((link) => {
    console.log(link.attribs.href);
  });
};

const getData = async (config) => {
  console.log('getData')
  const { roles, buildPath } = config;

  await getChampionsList(roles, buildPath);
};

module.exports = { getData };
