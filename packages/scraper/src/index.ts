import axios from 'axios';
import { writeFile } from 'fs';
import { lowerCase } from 'change-case';
import { JSDOM } from 'jsdom';
import * as mkdirp from 'mkdirp';
import { mapOverCountryName } from './corrections';


const ENTRY_URL = 'https://en.wikipedia.org/wiki/ISO_3166-2';

const createDomFromRemoteSource = async (url: string) => {
  const { data: html } = await axios.get(url);
  const { window: { document } } = new JSDOM(html);
  return document as HTMLDocument;
}

const getTableRowsFromDom = (document: HTMLDocument, key) => {
  try {
    const tableRowsNodeList = document.querySelectorAll('.sortable > tbody > tr');
    return Array.from(tableRowsNodeList);
  } catch (err) {
    console.warn(`Error encountered on ${key}, returning empty array instead.`)    
    return [];
  }
}

const getTableRowsFromRemote = async (url: string, key?) => {
  const document = await createDomFromRemoteSource(url);
  return getTableRowsFromDom(document, key);
}

const parseSubdivisionData = async (node) => {
  try {
    const cells = Array.from(node.querySelectorAll('td'));
    const [codeNode, nameNode] = cells as HTMLTableCellElement[];

    if (!codeNode || !nameNode) {
      return null;
    }

    const key = codeNode.querySelector('span').innerHTML;
    const imageNode = nameNode.querySelector('img');
    const icon = !!imageNode && `https://${imageNode.src}`; 
    const name = nameNode.querySelector('[title]').innerHTML;

    return {
      key,
      name,
      icon,
    };
  } catch (err) {
    // console.warn(err);
    return {};
  }
}

const parseCountryData = async (node) => {
  const cells = Array.from(node.querySelectorAll('td'));
  const [codeNode, nameNode] = cells as HTMLTableCellElement[];
  
  if (!codeNode || !nameNode) {
    return null;
  }

  const key = codeNode.querySelector('a').innerHTML;
  const link = codeNode.querySelector('a').href;
  const name = mapOverCountryName(nameNode.querySelector('a').innerHTML);

  return {
    key,
    icon: `https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${lowerCase(key)}.svg`,
    name,
    link: `https://en.wikipedia.org/${link}`
  };
};

const isTruthy = (value) => !!value;
type TpreviewItem = { link: string, key: string };

const scrape = async (url, callback, key?): Promise<TpreviewItem[]> => {
  const tableRows = await getTableRowsFromRemote(url, key)
  const previewArray: any[] = await Promise.all(tableRows.map(callback))
  const filtered: TpreviewItem[] = previewArray.filter(isTruthy);
  return filtered;
}

const emitOnFinished = (resolve) => (error) => {
  if (error) {
    throw new Error(error);
  }

  resolve;
}

const createJson = (array, folder = '') => new Promise((resolve) => {
  const keys = array.map(({ name }) => name);
  const path = `./ouput/${folder ? `${folder}/` : ''}`;

  mkdirp(path);
  writeFile(`${path}/keys.min.json`, JSON.stringify(keys), emitOnFinished(resolve))
  writeFile(`${path}/keys.json`, JSON.stringify(keys, null, 2), emitOnFinished(resolve))
  writeFile(`${path}/previews.min.json`, JSON.stringify(array), emitOnFinished(resolve))
  writeFile(`${path}/previews.json`, JSON.stringify(array, null, 2), emitOnFinished(resolve))
});

const init = async () => {
  console.log('Scraping countries...')
  const countriesPreview = await scrape(ENTRY_URL, parseCountryData, 'countries');
  createJson(countriesPreview);

  
  console.log('Scraping subdivisions...')
  countriesPreview.forEach(async (props: { link: string, key: string; name: string }) => {
    const { link, key, name } = props;

    const subdivisionsPreview = await scrape(link, parseSubdivisionData, key);
    createJson(subdivisionsPreview, name);
  })
}

init();