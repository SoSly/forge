'use strict'

/**
 * MIT License
 * 
 * Copyright (c) 2018 Fabio Zendhi Nagao
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function slugify (x) {
  return encodeURIComponent(String(x).trim().toLowerCase().replace(/\s+/g, '-'))
}

function htmlencode (x) {
/*
  // safest, delegate task to native -- IMPORTANT: enabling this breaks both jest and runkit, but with browserify it's fine
  if (document && document.createElement) {
    const el = document.createElement("div")
    el.innerText = x
    return el.innerHTML
  }
*/

  return String(x)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function tocPlugin (md, options) {
  options = Object.assign({}, {
    placeholder: '(\\$\\{toc\\}|\\[\\[?_?toc_?\\]?\\]|\\$\\<toc(\\{[^}]*\\})\\>)',
    slugify: slugify,
    containerClass: 'table-of-contents',
    containerId: undefined,
    listClass: undefined,
    itemClass: undefined,
    linkClass: undefined,
    level: 1,
    listType: 'ol',
    format: undefined,
    callback: undefined/* function(html, ast) {} */
  }, options)

  let ast
  const pattern = new RegExp('^' + options.placeholder + '$', 'i')

  function toc (state, startLine, endLine, silent) {
    let token
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // use whitespace as a line tokenizer and extract the first token
    // to test against the placeholder anchored pattern, rejecting if false
    const lineFirstToken = state.src.slice(pos, max).split(' ')[0]
    if (!pattern.test(lineFirstToken)) return false

    if (silent) return true

    const matches = pattern.exec(lineFirstToken)
    let inlineOptions = {}
    if (matches !== null && matches.length === 3) {
      try {
        inlineOptions = JSON.parse(matches[2])
      } catch (ex) {
        // silently ignore inline options
      }
    }

    state.line = startLine + 1

    token = state.push('tocOpen', 'nav', 1)
    token.markup = ''
    token.map = [startLine, state.line]
    token.inlineOptions = inlineOptions

    token = state.push('tocBody', '', 0)
    token.markup = ''
    token.map = [startLine, state.line]
    token.inlineOptions = inlineOptions
    token.children = []

    token = state.push('tocClose', 'nav', -1)
    token.markup = ''

    return true
  }

  md.renderer.rules.tocOpen = function (tokens, idx/* , options, env, renderer */) {
    let _options = Object.assign({}, options)
    if (tokens && idx >= 0) {
      const token = tokens[idx]
      _options = Object.assign(_options, token.inlineOptions)
    }
    const id = _options.containerId ? ` id="${htmlencode(_options.containerId)}"` : ''
    return `<nav${id} class="${htmlencode(_options.containerClass)}">`
  }

  md.renderer.rules.tocClose = function (/* tokens, idx, options, env, renderer */) {
    return '</nav>'
  }

  md.renderer.rules.tocBody = function (tokens, idx/* , options, env, renderer */) {
    let _options = Object.assign({}, options)
    if (tokens && idx >= 0) {
      const token = tokens[idx]
      _options = Object.assign(_options, token.inlineOptions)
    }

    const uniques = {}
    function unique (s) {
      let u = s
      let i = 2
      while (Object.prototype.hasOwnProperty.call(uniques, u)) u = `${s}-${i++}`
      uniques[u] = true
      return u
    }

    const isLevelSelectedNumber = selection => level => level >= selection
    const isLevelSelectedArray = selection => level => selection.includes(level)

    const isLevelSelected = Array.isArray(_options.level)
      ? isLevelSelectedArray(_options.level)
      : isLevelSelectedNumber(_options.level)

    function ast2html (tree) {
      const listClass = _options.listClass ? ` class="${htmlencode(_options.listClass)}"` : ''
      const itemClass = _options.itemClass ? ` class="${htmlencode(_options.itemClass)}"` : ''
      const linkClass = _options.linkClass ? ` class="${htmlencode(_options.linkClass)}"` : ''

      if (tree.c.length === 0) return ''

      let buffer = ''
      if (tree.l === 0 || isLevelSelected(tree.l)) {
        buffer += (`<${htmlencode(_options.listType) + listClass}>`)
      }
      tree.c.forEach(node => {
        if (isLevelSelected(node.l)) {
          buffer += (`<li${itemClass}><span>${node.p}</span><a${linkClass} href="#p${node.p}">${typeof _options.format === 'function' ? _options.format(node.n, htmlencode) : htmlencode(node.n)}</a>${ast2html(node)}</li>`)
        } else {
          // unique(options.slugify(node.n))
          buffer += ast2html(node)
        }
      })
      if (tree.l === 0 || isLevelSelected(tree.l)) {
        buffer += (`</${htmlencode(_options.listType)}>`)
      }
      return buffer
    }

    return ast2html(ast)
  }

function getCurrentPage(tokens, i) {
    let pages = tokens.slice(0, i).filter((t) => t.type === 'pagebreak').length;
    return pages + 1;
}

const header = new RegExp(`^<section class="header">\n$`, 'i');
const notoc = new RegExp(`notoc`, 'i');

function headings2ast (tokens) {
  const ast = { l: 0, n: '', c: [], p: 0 }
  const stack = [ast]

  for (let i = 0, iK = tokens.length; i < iK; i++) {
    const token = tokens[i]
    if (token.type === 'heading_open') {
      if (notoc.test(token.attrs.find((attr) => attr[0] === 'class'))) continue; // ignore elements that are flagged to not be in the TOC.
      
      const key = (
        tokens[i + 1]
          .children
          .filter(function (token) { return token.type === 'text' || token.type === 'code_inline' })
          .reduce(function (s, t) { return s + t.content }, '')
      );

      let level = parseInt(token.tag.substr(1), 10) + 1;
      
      // if (tokens[i - 1].type === 'html_block' && header.test(tokens[i - 1].content)) level--;
      if (token.tag === 'h1' && tokens[i - 1].type !== 'hr') level--;  

      const node = {
        l: level,
        n: key,
        c: [],
        p: getCurrentPage(tokens, i)
      }

      if (node.l > stack[0].l) {
        stack[0].c.push(node)
        stack.unshift(node)
      } else if (node.l === stack[0].l) {
        stack[1].c.push(node)
        stack[0] = node
      } else {
        while (node.l <= stack[0].l) stack.shift()
        stack[0].c.push(node)
        stack.unshift(node)
      }
    }
  }

  return ast
}

  md.core.ruler.push('generateTocAst', function (state) {
    const tokens = state.tokens
    ast = headings2ast(tokens)

    if (typeof options.callback === 'function') {
      options.callback(
        md.renderer.rules.tocOpen() + md.renderer.rules.tocBody() + md.renderer.rules.tocClose(),
        ast
      )
    }
  })

  md.block.ruler.before('heading', 'toc', toc, {
    alt: ['paragraph', 'reference', 'blockquote']
  })
}

export default tocPlugin
