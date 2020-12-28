// OFFSET represents the number of lines added prior to the user's text.
const OFFSET = 2;

function LinkToHeaderEmbed (tokens, idx, options, env, slf) {
    let line;
    if (tokens[idx].map) {
        line = tokens[idx].map[0] - OFFSET;
        tokens[idx].attrJoin('class', 'source-line');
        tokens[idx].attrSet('data-source-line', String(line));
    }
    return slf.renderToken(tokens, idx, options, env, slf);
}

function LinkToHeaderPlugin(md, options) {
    md.renderer.rules.heading_open = LinkToHeaderEmbed;
}

module.exports = LinkToHeaderPlugin;
