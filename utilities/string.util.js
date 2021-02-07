const slugifyUtils = require('slugify'),
  fuzz = require('fuzzball');

/**
 * Method to check substr exist case insensitive
 * @param {*} srcString 
 * @param {*} subString 
 */
const caseInsensitiveIncludes = (srcString, subString) => {
  return (srcString || '').trim().toLowerCase().includes((subString || '').trim().toLowerCase())
}

/**
 * Method to assign null to empty objects and arrays
 * @param {*} data 
 */

const nullify = (data) => {
  for (const key in data) {
    if (!!data[key]) {
      if ((Array.isArray(data[key]) && !data[key].length)
        || (typeof (data[key]) === 'object' && !(Object.keys(data[key]).length))) {
        data[key] = null;
      }
    }
  }
  return data;
}

/**
 * Generates slugs out of strings
 * @param {*} name 
 */
const slugify = (name, replacement = '-') => {
  const slug = slugifyUtils(name, {
    replacement: replacement,    // replace spaces with replacement
    remove: /[*+~.()'"!:@/]/g,        // regex to remove characters
    lower: true          // result in lower case
  });

  return slug;
}

/**
 * Method to get the substr between two string
 * @param {*} str 
 * @param {*} fst 
 * @param {*} lst 
 */
const stringBetween = (str = '', fst = '', lst = '') => {
  var chopFront = str.substring(str.search(fst) + fst.length, str.length);
  var result = chopFront.substring(0, chopFront.search(lst));
  return result;
}
/**
 * Method to push into list of element if not in the list already
 * @param {*} targetList 
 * @param {*} item 
 */
const insertIfNotExists = (targetList, item) => {
  const fnInsert = (list, str) => {
    if (!list.includes(str)) {
      list.push(str);
    }
  }
  if (Array.isArray(item)) {
    item.forEach((val) => {
      fnInsert(targetList, val);
    })
  } else {
    fnInsert(targetList, item);
  }
  return targetList;
}
/**
 * Method to check is string is available in list
 * @param {*} string 
 * @param {*} list 
 * @param {*} matchExact 
 */
const isInList = (string, list = [], matchExact = false) => {
  let exists = false;
  for (let i = 0; i < list.length; i++) {
    let condition = caseInsensitiveIncludes(list[i], string);
    if (matchExact) {
      condition = condition && caseInsensitiveIncludes(string, list[i]);
    }
    if (condition) {
      exists = true;
      break;
    }
  }
  return exists;
}

/**
 * Method to parse object & if error catch & return default value
 * @param {*} string 
 * @param {*} defaultValue 
 */
const parseObject = (value, defaultValue) => {
  let returnValue = defaultValue;
  if (!!value) {
    if (typeof value === "object" || Array.isArray(value)) {
      return value;
    }
    try {
      returnValue = JSON.parse(value);
    }
    catch (e) {
      returnValue = defaultValue;
    }
  }
  return returnValue;
}
/**
 * Method to clean the string by removing tabs/whitespaces
 * @param {*} string 
 */
const clean = (string = '') => {
  if (string) {
    string = string.replace(/\r/gmi, ' ').replace(/\n/gmi, ' ').replace(/\t/gmi, ' ').replace(/\s{2,}/gmi, ' ');
    string = string.trim();
    return string;
  } else {
    return null;
  }
}

/**
 * Method fuzzy fuzzy match with given match ratio 
 * @param {*} string 
 * @param {*} string 
 * @param {*} number 
 */
const isFuzzyMatched = (string, matchingString, matchRatio = 95) => {
  let isMatched = false
  if (fuzz.ratio(string, matchingString) >= matchRatio) {
    isMatched = true;
  }
  return isMatched;
}

const replaceAll = (str = '', findStr = '', replaceStr = '') => {
  return str.split(findStr).join(replaceStr);
}

/**
 * Added an array method to create batches 
 * and execute param fn asynchronously over the batches
 * @param {*} fn 
 * @param {*} batchSize 
 */
Array.prototype.batchExecuteAsync = async function (fn, batchSize) {
  var i, j, temparray;
  batchSize = batchSize || 50;
  for (i = 0, j = this.length; i < j; i += batchSize) {
    temparray = this.slice(i, i + batchSize);
    await fn(temparray);
  }
}



module.exports = {
  caseInsensitiveIncludes,
  nullify,
  slugify,
  stringBetween,
  insertIfNotExists,
  isInList,
  parseObject,
  clean,
  isFuzzyMatched,
  replaceAll
}