
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
    return /^\p{Lu}/u.test(src) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

function plural(word, src)
{
    return /s$/.test(src) ? word + 's' : word;
}

var nft_replaces = ["shitty JPEG", "shoddy JPEG", "stinking JPEG"];
var non_fungible_token_replaces = ["dreadful amateur drawing", "hideous image"];
var bitcoin_replaces = ["buttcoin", "shitcoin", "scamcoin"];

function transform(node)
{
    var v = node.nodeValue;

    // <start of sentence>NFT → Shitty JPEG
    v = v.replace(/([.!?]\s+|^)NFTs?\b/g,
        (m, p1) => p1 + plural_and_capital(randget(nft_replaces), 'A' + m));

    // NFT → shitty JPEG
    // NFTs → shitty JPEGs
    // an NFT → a shitty JPEG
    v = v.replace(/\b(([Aa])n(\s+))?NFTs?\b/g,
        (m, p1, p2, p3) => (p1 ? p2 + p3 : '') + plural_and_capital(randget(nft_replaces), 'a' + m));

    // SomethingNFT → SomethingShittyJPEG
    v = v.replace(/([A-Z][a-z]+)NFTs?\b/g,
        (m, p1) => p1 + plural_and_capital(randget(nft_replaces), 'A' + m).replace(/\s+/g, ''));

    v = v.replace(/[Nn]on[- ][Ff]ungible [Tt]okens?/g,
        (m) => plural_and_capital(randget(non_fungible_token_replaces), m));

    v = v.replace(/\b[Bb]lockchains?\b/g,
        (m) => plural_and_capital("circlejerk", m));

    v = v.replace(/\b[Cc]rypto[- ]?currenc(y|ies)\b/g,
        (m) => capital("pretend money", m));

    v = v.replace(/\b[Pp]roof[-\s]+[Oo]f[-\s]+([Ww]ork)\b/g,
        (m, p1) => capital("solving", m) + ' ' + capital("sudokus", p1));

    v = v.replace(/\b([Bb])itcoins?\b/g,
        (m) => plural_and_capital(randget(bitcoin_replaces), m));

    if (v != node.nodeValue)
        node.nodeValue = v;
}

walk(document.body, transform);

