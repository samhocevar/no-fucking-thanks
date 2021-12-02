
// Some stats to detect whether we’re dealing with French
var is_french = false;

//var english_words = [ 'of', 'a', 'if', 'the', 'he', 'an', 'is', 'has', 'have', 'are' ];

/*
var words = [ 'de', 'des', 'du', 'en', 'et', 'le', 'la', 'les', 'un', 'une' ];
var french_letters = [ 'é', 'è', 'à', 'ù', 'ė' ];

var french_word_count = {};
var french_letter_count = {};

for (var i in words)
    french_word_count[words[i]] = 0;

for (var i in french_letters)
    french_letter_count[french_letters[i]] = 0;
*/


function walk(node, fun)
{
    switch (node.nodeType)
    {
        case Node.TEXT_NODE:
            fun(node);
            break;
        case Node.ELEMENT_NODE:
        case Node.DOCUMENT_NODE:
        case Node.DOCUMENT_FRAGMENT_NODE:
            for (let n of node.childNodes)
                walk(n, fun);
            break;
        default:
            // Do nothing with unknown nodes
            break;
    }
}

function stats(node)
{
    var v = node.nodeValue.toLowerCase();

    for (var i in words)
        french_word_count[words[i]] += (v.match(new RegExp('\\b' + words[i] + '\\b', 'g')) || []).length;

    for (var i in french_letters)
        french_letter_count[french_letters[i]] += (v.match(new RegExp(french_letters[i], 'g')) || []).length;
}

function randget(array)
{
    return array[Math.floor(Math.random() * array.length)];
}

function plural_and_capital(word, src)
{
    return capital(plural(word, src), src);
}

function capital(word, src)
{
    if (/^\p{Lu}/u.test(src))
        return word.charAt(0).toUpperCase() + word.slice(1);
    return word;
}

function plural(word, src)
{
    if (/s$/.test(src))
        return word + 's';
    return word;
}

var nft_replaces = ["shitty JPEG", "shoddy JPEG", "stinking JPEG"];
var non_fungible_token_replaces = ["dreadful amateur drawing", "hideous image"];
var bitcoin_replaces = ["buttcoin", "shitcoin", "scamcoin"];

function transform(node)
{
    var v = node.nodeValue;

    v = v.replace(/([.!?]\s+|^)NFTs?\b/g, function(m, p1) {
        return p1 + plural_and_capital(randget(nft_replaces), 'A' + m);
    });
    v = v.replace(/((\b[Aa])n(\s+))?NFTs?\b/g, function(m, _, p2, p3) {
        return (_ ? p2 + p3 : '') + plural_and_capital(randget(nft_replaces), 'a' + m);
    });

    v = v.replace(/[Nn]on[- ][Ff]ungible [Tt]okens?/g, function(m) {
        return plural_and_capital(randget(non_fungible_token_replaces), m);
    });

    v = v.replace(/\b[Bb]lockchains?\b/g, function(m) {
        return plural_and_capital("circlejerk", m);
    });

    v = v.replace(/\b[Cc]rypto[- ]?currenc(y|ies)\b/g, function(m) {
        return capital("pretend money", m);
    });

    v = v.replace(/\b([Bb])itcoins?\b/g, function(m) {
        return plural_and_capital(randget(bitcoin_replaces), m);
    });

    if (v != node.nodeValue)
        node.nodeValue = v;
}

/*
walk(document.body, stats);

var good_words = 0;
var good_letters = 0;
for (var i in Object.keys(french_word_count))
    if (french_word_count[words[i]] > 5)
        ++good_words;
for (var i in Object.keys(french_letter_count))
    if (french_letter_count[french_letters[i]] > 5)
        ++good_letters;

if (good_words * 2 > words.length || good_letters * 2 > french_letters.length)
*/

walk(document.body, transform);

