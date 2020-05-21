function tokenizePagebreak(md, options) {
    return function(tokens, idx, _options, env, self) {
        return '</section><section class=page>';
    };
}

function pagebreakEmbed(md, options) {
    return function(state, startLine, endLine, silent) {
        let bol = state.bMarks[startLine] + state.tShift[startLine];
        let eol = state.src.substring(bol).indexOf('\n');
        
        if (state.sCount[startLine] - state.blkIndent >= 4) return false;
        const marker = state.src.charCodeAt(bol);
        if (marker !== 92) return false;

        const line = state.src.substr(bol, eol);

        let pbreg = new RegExp('^\\\\pagebreak|\\\\pagebreakNum$');
        if (!pbreg.test(line)) return false;

        let token;
        token = state.push('pagebreak', '', 0);
        token.info = [];
        token.content = line;
        token.markup = line;
        token.map = [startLine, startLine + 1];

        state.skipChars(bol, eol);
        state.line = startLine + 1;

        return true;
    };
}

function pagebreakPlugin(md, options) {
    md.block.ruler.before('fence', 'pagebreak', pagebreakEmbed(md, options));
    md.renderer.rules.pagebreak = tokenizePagebreak(md, options);
}

export default pagebreakPlugin;
