function tokenizeColumnbreak(md, options) {
    return function(tokens, idx, _options, env, self) {
        // console.log(tokens[idx]);
        return '<div class=column-break></div>';
    };
}

function columnbreakEmbed(md, options) {
    return function(state, startLine, endLine, silent) {
        let bol = state.bMarks[startLine] + state.tShift[startLine];
        let eol = state.src.substring(bol).indexOf('\n');
        
        if (state.sCount[startLine] - state.blkIndent >= 4) return false;
        const marker = state.src.charCodeAt(bol);
        if (marker !== 92) return false;

        const line = state.src.substr(bol, eol);

        let pbreg = new RegExp('^\\\\columnbreak$');
        if (!pbreg.test(line)) return false;

        let token;
        token = state.push('columnbreak', '', 0);
        token.info = [];
        token.content = line;
        token.markup = line;
        token.map = [startLine, startLine + 1];

        state.skipChars(bol, eol);
        state.line = startLine + 1;

        return true;
    };
}

function columnbreakPlugin(md, options) {
    md.block.ruler.before('fence', 'columnbreak', columnbreakEmbed(md, options));
    md.renderer.rules.columnbreak = tokenizeColumnbreak(md, options);
}

module.exports = columnbreakPlugin;
