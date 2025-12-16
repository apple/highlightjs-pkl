/*
 * Copyright © 2025 Apple Inc. and the Pkl project authors. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
Language: Pkl
Author: The Pkl Team <pkl-oss@group.apple.com>
Description: Pkl is a programming language for configuration.
Website: https://pkl-lang.org
Category: config
*/
/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').HLJSApi} HLJSApi
@typedef {import('highlight.js').LanguageFn} LanguageFn
*/

/**
 * @param {RegExp | string } re
 * @returns {string | null}
 */
function source(re) {
  if (!re) return null;
  if (typeof re === "string") return re;

  return re.source;
}

/**
 * @param {...(RegExp | string) } args
 * @returns {string}
 */
function concat(...args) {
  return args.map((x) => source(x)).join("");
}

// noinspection JSUnusedGlobalSymbols
/**
 *  @type LanguageFn
 *  @param hljs {HLJSApi}
 */
export default function (hljs) {
  const KEYWORDS = {
    keyword: [
      "abstract",
      "amends",
      "as",
      "case",
      "class",
      "const",
      "delete",
      "else",
      "extends",
      "external",
      "fixed",
      "for",
      "function",
      "hidden",
      "if",
      "import",
      "import*",
      "in",
      "is",
      "let",
      "local",
      "module",
      "new",
      "open",
      "out",
      "outer",
      "override",
      "protected",
      "read",
      "read*",
      "read?",
      "record",
      "super",
      "switch",
      "this",
      "throw",
      "trace",
      "typealias",
      "unknown",
      "vararg",
      "when",
    ],
    literal: ["true", "false", "null", "nothing"],
  };

  const IDENTIFIER_RE = "[a-zA-Z_][a-zA-Z0-9_]*";
  const QUOTED_IDENTIFIER_RE = /`[^`]+`/;

  /** @type Mode */
  const NORMAL_IDENTIFIER = {
    className: "title",
    begin: IDENTIFIER_RE,
  };

  /** @type Mode */
  const QUOTED_IDENTIFIER = {
    className: "title",
    begin: QUOTED_IDENTIFIER_RE,
  };

  /** @type Mode */
  const IDENTIFIER = {
    className: "title",
    variants: [NORMAL_IDENTIFIER, QUOTED_IDENTIFIER],
  };

  const decimalDigits = "([0-9]_*)+";
  const hexDigits = "([0-9a-fA-F]_*)+";

  /** @type Mode */
  const NUMBER = {
    className: "number",
    relevance: 0,
    variants: [
      // decimal floating-point-literal (subsumes decimal-literal)
      {
        match:
          `\\b(${decimalDigits})(\\.(${decimalDigits}))?` +
          `([eE][+-]?(${decimalDigits}))?\\b`,
      },
      // hexadecimal floating-point-literal (subsumes hexadecimal-literal)
      {
        match:
          `\\b0x(${hexDigits})(\\.(${hexDigits}))?` +
          `([pP][+-]?(${decimalDigits}))?\\b`,
      },
      // octal-literal
      { match: /\b0o([0-7]_*)+\b/ },
      // binary-literal
      { match: /\b0b([01]_*)+\b/ },
    ],
  };

  // borrowed from swift.js (Pkl and Swift share the same grammar for strings)
  const stringEscape = (rawDelimiter = "") => ({
    className: "subst",
    variants: [
      { match: concat(/\\/, rawDelimiter, /[0\\tnr"']/) },
      { match: concat(/\\/, rawDelimiter, /u\{[0-9a-fA-F]{1,8}}/) },
    ],
  });

  const interpolation = (rawDelimiter = "") => ({
    className: "subst",
    label: "interpol",
    begin: concat(/\\/, rawDelimiter, /\(/),
    end: /\)/,
  });

  const multilineString = (rawDelimiter = "") => ({
    begin: concat(rawDelimiter, /"""/),
    end: concat(/"""/, rawDelimiter),
    contains: [stringEscape(rawDelimiter), interpolation(rawDelimiter)],
  });

  const singleLineString = (rawDelimiter = "") => ({
    begin: concat(rawDelimiter, /"/),
    end: concat(/"/, rawDelimiter),
    contains: [stringEscape(rawDelimiter), interpolation(rawDelimiter)],
  });

  const stringConstantVariant = (delimiter = "") => ({
    begin: concat(delimiter, /"/),
    end: concat(/"/, delimiter),
    contains: [stringEscape(delimiter)],
  });

  /** @type Mode */
  const STRING = {
    className: "string",
    variants: [
      multilineString(),
      multilineString("#"),
      multilineString("##"),
      multilineString("###"),
      singleLineString(),
      singleLineString("#"),
      singleLineString("##"),
      singleLineString("###"),
    ],
  };

  /** @type Mode */
  const STRING_CONSTANT = {
    className: "string",
    variants: [
      stringConstantVariant(),
      stringConstantVariant("#"),
      stringConstantVariant("##"),
      stringConstantVariant("##"),
    ],
  };

  const DOC_COMMENT = hljs.COMMENT("///", "$", {
    className: "doctag",
    relevance: 10,
  });

  /** @type Mode */
  const ANNOTATION = {
    className: "meta",
    begin: /@[a-zA-Z_][a-zA-Z0-9_]*/,
    relevance: 5,
  };

  /** @type Mode */
  const FUNCTION_DEF = {
    className: "function",
    beginKeywords: "function",
    end: /[={]/,
    excludeEnd: true,
    contains: [
      IDENTIFIER,
      {
        className: "params",
        begin: /\(/,
        end: /\)/,
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          IDENTIFIER,
        ],
      },
    ],
  };

  /** @type Mode */
  const CLASS_DEF = {
    className: "class",
    beginKeywords: "class",
    end: /[{]|$/,
    excludeEnd: true,
    contains: [
      IDENTIFIER,
      { beginKeywords: "extends" },
      {
        begin: /</,
        end: />/,
        contains: ["self"],
      },
    ],
  };

  /** @type Mode */
  const TYPEALIAS_DEF = {
    className: "type",
    beginKeywords: "typealias",
    end: /$/,
    contains: [
      IDENTIFIER,
      {
        begin: /=\s*/,
        returnBegin: true,
        contains: [],
      },
    ],
  };

  /** @type Mode */
  const MODULE_DECLARATION = {
    className: "meta",
    variants: [
      {
        begin: /^\s*(module|amends|extends)\s+/,
        end: /$/,
        contains: [
          {
            className: "keyword",
            begin: /(module|amends|extends)/,
          },
          STRING_CONSTANT,
        ],
      },
    ],
  };

  /** @type Mode */
  const IMPORT_DECLARATION = {
    className: "meta",
    begin: /\b(import|import\*)\s+/,
    end: /$/,
    keywords: { keyword: ["import", "import*", "as"] },
    contains: [STRING_CONSTANT],
  };

  /** @type Mode */
  const TYPE_REFERENCE = {
    className: "type",
    begin: /:\s*/,
    end: /(?=[=,)\]}]|$)/,
    excludeBegin: true,
    contains: [
      {
        className: "type",
        begin: IDENTIFIER_RE,
      },

      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
    ],
  };

  /** @type Mode */
  const PROPERTY_ACCESS = {
    variants: [
      {
        match: [/\.|\?\./, /\s*/, QUOTED_IDENTIFIER_RE],
        scope: {
          3: "property",
        },
      },
      {
        match: [/\.|\?\./, /\s*/, IDENTIFIER_RE],
        scope: {
          3: "property",
        },
      },
    ],
  };

  /** @type Mode */
  const OBJECT_PROPERTY = {
    variants: [
      {
        match: [QUOTED_IDENTIFIER_RE, /\s*/, /(?=[=:{])/],
        scope: {
          1: "property",
        },
      },
      {
        match: [IDENTIFIER_RE, /\s*/, /(?=[=:{])/],
        scope: {
          1: "property",
        },
      },
    ],
  };

  return {
    name: "Pkl",
    aliases: ["pkl"],
    keywords: KEYWORDS,
    contains: [
      DOC_COMMENT,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      MODULE_DECLARATION,
      IMPORT_DECLARATION,
      ANNOTATION,
      CLASS_DEF,
      FUNCTION_DEF,
      TYPEALIAS_DEF,
      PROPERTY_ACCESS,
      TYPE_REFERENCE,
      OBJECT_PROPERTY,
      STRING,
      NUMBER,
    ],
  };
}
