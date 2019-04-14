'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    class RouteMap {
        constructor() {
            this.route = {};
            this.width = puzzle[0].length;
            this.height = puzzle.length;
        }

        key(x, y) {
            return `${x},${y}`;
        }

        markAvailable(x, y) {
            this.route[this.key(x, y)] = false;
        }

        markVisited(x, y) {
            this.route[this.key(x, y)] = true;
        }

        isAvailable(x, y) {
            return x >= 0
                && x < this.width
                && y >= 0
                && y < this.height
                && !this.route[this.key(x, y)];
        }
    }

    function* getSiblings(x, y) {
        yield [x - 1, y];
        yield [x + 1, y];
        yield [x, y - 1];
        yield [x, y + 1];
    }

    function checkRoute(x, y, search, route) {
        if (!route.isAvailable(x, y) || puzzle[y][x] !== search[0]) {
            return false;
        }

        if (search.length === 1) {
           return true;
        }

        route.markVisited(x, y);

        const nextSearch = search.slice(1);

        for (let [sx, sy] of getSiblings(x, y)) {
            if (checkRoute(sx, sy, nextSearch, route)) {
                return true;
            }
        }

        route.markAvailable(x, y);
        return false;
    }

    for (let y = 0; y < puzzle.length; ++y) {
        for (let x = 0; x < puzzle[0].length; ++x) {
            if (checkRoute(x, y, searchStr, new RouteMap())) {
                return true;
            }
        }
    }

    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function permute(chars) {
        if (chars.length == 1) {
            return chars;
        } else if (chars.length == 2) {
            return [chars, chars[1] + chars[0]];
        } else {
            const permutations = [];

            chars.split('').forEach((char, index, array) => {
                let sub = [].concat(array);

                sub.splice(index, 1);

                permute(sub.join('')).forEach((permutation) => permutations.push(char + permutation));
            });

            return permutations;
        }
    }

    for (let permutation of permute(chars)) {
        yield permutation;
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let sum = 0;

	quotes.forEach((value, index) => sum += quotes.slice(index).sort((a, b) => b - a)[0] - value);

	return sum;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
        let s = url.split('').reduce((pv, cv) => pv + (this.urlAllowedChars.indexOf(cv) < 10 ? '0' : '') + this.urlAllowedChars.indexOf(cv), '');
        let answer = '';

        if (s.length % 4 !== 0) s += '99';

        while (s.length > 0) {
            answer += String.fromCharCode(s.slice(0, 4));
            s = s.slice(4);
        }

        return answer;
    },
    
    decode: function(code) {
        return code.split('').reduce((pv, cv) => pv += this.urlAllowedChars[Math.floor(cv.charCodeAt(0) / 100)] + (cv.charCodeAt(0) % 100 !== 99 ? this.urlAllowedChars[cv.charCodeAt(0) % 100] : ''), '');
    } 
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
