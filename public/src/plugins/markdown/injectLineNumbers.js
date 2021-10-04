'use strict';


function injectLineNumbersPlugin(md) {
  //
  // Inject line numbers for sync scroll and header anchoring. Notes:
  //
  // - We track only headings and paragraphs, at any level.
  // - TODO Footnotes content causes jumps. Level limit filters it automatically.
  function injectLineNumbers(tokens, idx, options, env, slf) {
    var line;
    // if (tokens[idx].map && tokens[idx].level === 0) {
    if (tokens[idx].map) {
      line = tokens[idx].map[0];
      tokens[idx].attrJoin('class', 'source-line');
      tokens[idx].attrSet('data-source-line', String(line));
    }
    return slf.renderToken(tokens, idx, options, env, slf);
  }

  md.renderer.rules.paragraph_open = injectLineNumbers;
  md.renderer.rules.heading_open   = injectLineNumbers;
  md.renderer.rules.list_item_open = injectLineNumbers;
  md.renderer.rules.table_open     = injectLineNumbers;
};

module.exports = injectLineNumbersPlugin;