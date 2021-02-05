const { link } = require('fs');
const puppeteer = require('puppeteer');

const overviewURL = 'https://blitz.gg/lol/champions/overview';
const baseChampURL = 'https://blitz.gg/lol/champions';

let champInfo = {};

const addRole = (champ, role) => {
  if (champ in champInfo === false) champInfo[champ] = {};

  if (role in champInfo[champ] === false) champInfo[champ][role] = {};
};

const addItems = (champ, role, items, type) => {
  const [starting, ...final] = items;

  champInfo[champ][role][type] = { starting, final};
};

const fetchChampionRoles = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(overviewURL, { waitUntil: 'networkidle2' });

  await page.waitForSelector('[class^="Champions__TableWrapper"]')

  const champLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.champion-link'));
    return links.map((link) => link.href.substring(31));
  });

  champLinks.forEach((link) => {
    const [champ, roleString] = link.split('?');

    addRole(champ, roleString.substring(5));
  });

  await browser.close();
};

const fetchBuildInfo = async () => {
  const [ champ, role ] = ['Lulu', 'SUPPORT'];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`${baseChampURL}/${champ}?role=${role}`, { waitUntil: 'networkidle2' });

  await page.waitForSelector('[class^="ChampionRecommendedBuild__Header"]');

  const mostCommonItems = await page.evaluate(() => {
    const itemListDivs = Array.from(document.querySelectorAll('div[class^="ItemBuild__List"][cols="7"] div[class^="ItemBuild__Item"]'));

    return itemListDivs.map((div, i) => {
      if (i === 0) {
        return Array.from(div.querySelectorAll('img'))
          .map((img) => img.src.split('/item/')[1].split('.')[0]);
      }

      const imgTag = div.querySelector(`div > img`);
      return imgTag.src.split('/item/')[1].split('.')[0];
    });
  });

  addItems(champ, role, mostCommonItems, 'mostCommon');

  // console.log(mostCommon);

  await browser.close();
};

const importPages = async () => {
  await fetchChampionRoles();

  await fetchBuildInfo();

  console.log(champInfo['Lulu']['SUPPORT']);
};

module.exports = {
  importPages,
};
