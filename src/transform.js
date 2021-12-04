
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
    let n = Math.floor(Math.random() * array.length);
    // Optional re-roll so that early items are picked more often
    if (Math.random() > 0.5)
        n = Math.min(n, Math.floor(Math.random() * array.length));
    return array[n];
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

var nft_replaces = ["shitty JPEG", "crappy JPEG", "stinking JPEG", "Web2 JPEG"];
var non_fungible_token_replaces = ["dreadful amateur drawing", "hideous image", "stolen art"];
var bitcoin_replaces = ["buttcoin", "shitcoin", "scamcoin", "mlm scam"];

var old_text = {};

function transform(node)
{
    var t = node.nodeValue;

    // #NFT → #ShittyJPEG (useful on Twitter & others)
    // @NFT → @ShittyJPEG
    t = t.replace(/([#@$])(NFTs?)/g,
        (m, p1, p2) => p1 + plural_and_capital(randget(nft_replaces), p2).replace(/\s+/g, ''));

    // <start of sentence>NFT → Shitty JPEG
    t = t.replace(/([.!?]\s+|[("«“]|^)(NFTs?)\b/g,
        (m, p1, p2) => p1 + plural_and_capital(randget(nft_replaces), p2));

    // NFT → shitty JPEG
    // NFTs → shitty JPEGs
    // an NFT → a shitty JPEG
    t = t.replace(/\b(([Aa])n(\s+))?NFTs?\b/g,
        (m, p1, p2, p3) => (p1 ? p2 + p3 : '') + plural_and_capital(randget(nft_replaces), 'a' + m));

    // SomethingNFT → SomethingShittyJPEG
    // NFTSomething → ShittyJPEGSomething
    t = t.replace(/([a-zA-Z][a-z]+|[@_]|\b)(NFTs?)([a-zA-Z][a-zA-Z]|\b)/g,
        (m, p1, p2, p3) => p1 + plural_and_capital(randget(nft_replaces), p2).replace(/\s+/g, '') + p3);

    t = t.replace(/[Nn]on[- ][Ff]ungible [Tt]okens?/g,
        (m) => plural_and_capital(randget(non_fungible_token_replaces), m));

    t = t.replace(/([@#$]|\b)([Bb]lockchains?)/g,
        (m, p1, p2) => p1 + plural_and_capital("circlejerk", p2));

    t = t.replace(/\b[Cc]rypto[- ]?currenc(y|ies)\b/g,
        (m) => capital("pretend money", m));

    t = t.replace(/\b[Pp]roof[-\s]+[Oo]f[-\s]+([Ww]ork)\b/g,
        (m, p1) => capital("solving", m) + ' ' + capital("sudokus", p1));

    t = t.replace(/([@#$]|\b)([Bb]itcoins?)/g,
        (m, p1, p2) => p1 + plural_and_capital(randget(bitcoin_replaces), p2));

    if (t != node.nodeValue)
    {
        old_text[node] = node.nodeValue;
        node.nodeValue = t;
    }
}

function observe(mutations)
{
    for (let m of mutations)
    {
        for (let n of m.addedNodes ?? [])
        {
            walk(n, transform);
        }
    }
}

// Fix document contents
walk(document.body, transform);

// Observe future changes
new MutationObserver(observe).observe(document, { childList: true, subtree: true });

