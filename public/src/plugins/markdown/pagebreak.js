function tokenizePagebreak(md, options) {
    return function(tokens, idx, _options, env, self) {
        let output = '';
        if (tokens[idx].info[0] === true) {
            output += '<div class="pageNumber auto"></div>';
        }
        output += `</section><section class="page" id="p${tokens[idx].info[1]}">`;
        return output;
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

        let pbreg = new RegExp('^\\\\pagebreak(Num)?$');
        if (!pbreg.test(line)) return false;
        const pb = pbreg.exec(line);

        state.skipChars(bol, eol);
        state.line = startLine + 1;

        let pages = state.tokens.filter((t) => t.type === 'pagebreak').length;

        let token;
        token = state.push('pagebreak', '', 0);
        token.info = [pb[1] === 'Num', pages + 2];
        token.content = line;
        token.markup = line;
        token.map = [startLine, state.line];

        return true;
    };
}

function pagebreakPlugin(md, options) {
    md.block.ruler.before('fence', 'pagebreak', pagebreakEmbed(md, options));
    md.renderer.rules.pagebreak = tokenizePagebreak(md, options);
}

export default pagebreakPlugin;
