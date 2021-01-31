const axios = require('axios').default;
const cheerio = require('cheerio');

const getChampionsList = async () => {
  const champDeDuped = new Set();
  const champData = new Map();

  const { data } = await axios.get('https://champion.gg');
  const $main = cheerio.load(data);

  const champs = $main('a, div[class^="ChampGrid"]').toArray();

  champs.forEach((champ) => {
    const href = champ.attribs.href;

    if (href && href.startsWith('/champion/')) {
      champDeDuped.add(href)
    }
  });

  champDeDuped.forEach((link) => {
    const [, , champ, role] = link.split('/');
    const existingChampData = champData.get(champ) || [];
    champData.set(champ, [...existingChampData, role]);
  });

  const sortedChampData = new Map([...champData.entries()].sort());

  sortedChampData.forEach((role, champ) => console.log(champ, role));
  console.log(sortedChampData.size);

  return sortedChampData;
}

const getData = async (config) => {
  const championList = await getChampionsList();
};

module.exports = { getData };
