const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { chain } = require('lodash');
const compareVersions = require('compare-versions');

const isChromiumVersion = (version) => /\d+\.\d+\.\d+\.\d+/.test(version);

const getAllVersionTags = async () => {
    const res = await fetch('https://chromium.googlesource.com/chromium/src.git/+refs');
    const html = await res.text();
    const $ = cheerio.load(html);
    const set = $('.RefList').get(1);
    const setName = $(set).find('h3').text();
    if (setName === 'Tags') {
        const versionNumberElements = $(set).find('ul > li > a').map(function() {
            return $(this).text();
        }).get();
        return chain(versionNumberElements)
            .filter(isChromiumVersion)
            .sort(compareVersions)
            .groupBy((versionString) => versionString.split('.')[0])
            .map((v, k) => [k, v[0]])
            .fromPairs()
            .value();
    } else {
        throw new Error('Cannot find Chromium versions.');
    }
};

const getBasePosition = async (versionTag) => {
  const res = await fetch(`https://omahaproxy.appspot.com/deps.json?version=${versionTag}`);
  const { chromium_base_position } = await res.json();
  return chromium_base_position;
};

module.exports = {
  getAllVersionTags,
  getBasePosition,
};