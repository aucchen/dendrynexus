/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  "use strict";

  var assert = require('assert');
  var _ = require('lodash');

  /*
    = Romeo and Juliet

    Two households, both alike in dignity //
    In fair Verona where we lay our scene //
    From ancient grudge break to new mutiny
    Where civil blood makes civil hands unclean

    From *forth the fatal loins of these two foes
    A pair of **starcross'd** lovers take their* life
    Whose misadventured piteous overthrows
    [? if foo > 1: Doth with their [death bury their] parents' strife? ?]

    The [fearful passage of their death-mark'd love
    And the continuance of their parents' rage
    Which, but their children's end, naught could remove
    Is now the two hours passage of our stage.]

    > The which if you with patient ears attend, //
    > What here shall miss, our toil shall strive to mend.
    >> Wm Shakespeare

    ---
   */

  /*
    Key:
    *some words* - emphasis
    **some words** - strong emphasis
    > paragraph - quotation
    = paragraph - heading
    // + <newline> - manual line break
    <blank line> - paragraph break
    --- - horizontal rule / break
    [some words] - hidable section
    [? if condition: text ?] - conditional section
   */

  var featuresRe =
    /\*+|\/\/\n|^[ \t]*\n|^\s*---\s*$|^\s*>>?|^\s*=|\[\??|\??\]|\{\?|\?\}/mg;
  var findFeatures = function(text) {
    var results = [];
    var match;
    while ((match = featuresRe.exec(text)) !== null) {
      results.push({
        feature: match[0].trim(),
        start: match.index,
        end: match.index + match[0].length
      });
    }
    return results;
  };

  var createFeatureBoundaries = function(text, features) {
    var result = [];
    var typeStack = [];
    var emphasisStack = [];

    var add = function(featureName, type, start, end) {
      var newFeature = {feature:featureName, type:type};
      newFeature.start = (start !== undefined) ? start : feature.start;
      newFeature.end = (end !== undefined) ? end : feature.end;
      result.push(newFeature);
    };

    add('paragraph', 'start', 0, 0);
    var currentParagraphFeature = 'paragraph';
    var inConditional = false;

    var magicStarted = null;
    var processedUpTo = 0;
    for (var i = 0; i < features.length; i++) {
      var feature = features[i];

      var em = function(level) {
        if (emphasisStack[emphasisStack.length-1] === level) {
          emphasisStack.pop();
          add('emphasis-'+level, 'end');
        } else {
          emphasisStack.push(level);
          add('emphasis-'+level, 'start');
        }
      };

      // Magic can only be ended by magic, anything else inside is
      // considered part of the magic.
      if (magicStarted !== null) {
        if (feature.feature === '?}') {
          // End of magic.
          add('magic', 'end');
          magicStarted = null;
        }
        continue;
      }

      // In all other contexts, features change the current state.
      var level;
      switch(feature.feature) {
      case '*': // Start or end emphasis.
        em(1);
        break;
      case '**':
        em(2);
        break;
      case '//': // Manual line break.
        add('line-break', 'single');
        break;
      case '[': // Start of hidden text.
        add('hidden' ,'start');
        break;
      case ']': // End of hidden text.
        add('hidden', 'end');
        break;
      case '[?':
        add('conditional', 'start');
        inConditional = true;
        break;
      case '?]': // End of conditional (if one is in progress, else hidden).
        if (inConditional) add('conditional', 'end');
        else add('hidden', 'end', feature.start+1);
        break;
      case '{?':
        // Start of magic (end is handled in a separate clause above).
        add('magic', 'start');
        magicStarted = feature.end;
        break;

      // New paragraph creation...
      case '': // Blank line, new paragraph.
        if (currentParagraphFeature !== null) {
          add(currentParagraphFeature, 'end');
        }
        currentParagraphFeature = 'paragraph';
        add(currentParagraphFeature, 'start');
        break;
      case '---': // Horizontal rule, also forces a new paragraph.
        if (currentParagraphFeature !== null) {
          add(currentParagraphFeature, 'end');
        }
        add('hrule', 'single');
        currentParagraphFeature = 'paragraph';
        add(currentParagraphFeature, 'start');
        break;
      case '>': // This paragraph is a quote.
        if (currentParagraphFeature !== 'quotation') {
          if (currentParagraphFeature !== null) {
            add(currentParagraphFeature, 'end');
          }
          currentParagraphFeature = 'quotation';
          add(currentParagraphFeature, 'start');
        }
        break;
      case '>>': // This paragraph is a quote attribution.
        if (currentParagraphFeature !== 'attribution') {
          if (currentParagraphFeature !== null) {
            add(currentParagraphFeature, 'end');
          }
          currentParagraphFeature = 'attribution';
          add(currentParagraphFeature, 'start');
        }
        break;
      case '=': // This paragraph is a heading (level one or two).
        if (currentParagraphFeature !== 'heading') {
          if (currentParagraphFeature !== null) {
            add(currentParagraphFeature, 'end');
          }
          currentParagraphFeature = 'heading';
          add(currentParagraphFeature, 'start');
        }
        break;
      };
    }
    add(currentParagraphFeature, 'end', text.length);
    return result;
  };

  var buildRanges = function(text, features) {
    var top = function(array) {
      return array[array.length - 1];
    };
    var add = function(range) {
      top(stack).content.push(range);
    };
    var addText = function() {
      if (lastPosition < feature.start) {
        var t = text.substring(lastPosition, feature.start);
        t = t.replace(/\s+/g, ' ').trim();
        if (t.length > 0) add(t);
      }
    };

    var stack = [{content:[]}];
    var lastPosition = 0;
    for (var i = 0; i < features.length; ++i) {
      var feature = features[i];

      addText();

      switch(feature.type) {
      case 'start':
        stack.push({
          type: feature.feature,
          content: []
        });
        break;
      case 'single':
        add({type:feature.feature});
        break;
      case 'end':
        assert(top(stack).type === feature.feature);
        add(stack.pop());
        break;
      }
      lastPosition = feature.end;
    }
    assert(stack.length === 1);
    return tidy(stack[0].content);
  };

  var tidy = function(ranges) {
    var result = [];
    _.each(ranges, function(range) {
      if (range.content === undefined) {
        result.push(range);
      } else {
        range.content = tidy(range.content);
        if (range.content.length > 0) {
          result.push(range);
        }
      }
    });
    return result;
  };

  var toHTML = function(ranges) {
    var result = [];
    _.each(ranges, function(range) {
      if (range.type === undefined) {
        result.push(range);
      } else {
        switch(range.type) {
        case 'heading':
          result.push('<h1>');
          result.push(toHTML(range.content));
          result.push('</h1>');
          break;
        case 'paragraph':
          result.push('<p>');
          result.push(toHTML(range.content));
          result.push('</p>');
          break;
        case 'quotation':
          result.push('<blockquote>');
          result.push(toHTML(range.content));
          result.push('</blockquote>');
          break;
        case 'attribution':
          result.push('<p class="attribution">');
          result.push(toHTML(range.content));
          result.push('</p>');
          break;
        case 'emphasis-1':
          result.push(' <em>');
          result.push(toHTML(range.content));
          result.push('</em> ');
          break;
        case 'emphasis-2':
          result.push(' <strong>');
          result.push(toHTML(range.content));
          result.push('</strong> ');
          break;
        case 'hidden':
          result.push(' <span class="hidden">');
          result.push(toHTML(range.content));
          result.push('</span> ');
          break;
        case 'conditional':
          result.push(' <span class="conditional">');
          result.push(toHTML(range.content));
          result.push('</span> ');
          break;
        case 'magic':
          result.push(' {! ');
          result.push(toHTML(range.content));
          result.push(' !} ');
          break;
        case 'line-break':
          result.push('<br>');
          break;
        case 'hrule':
          result.push('<hr>');
          break;
        }
      }
    });
    return result.join('');
  };

  var rnj = "    = Romeo and Juliet\n\n    Two households, both alike in dignity //\n    In fair Verona where we lay our scene //\n    From ancient grudge break to new mutiny\n    Where civil blood makes civil hands unclean\n\n    From *forth the fatal loins of these two foes\n    A pair of **starcross'd** lovers take their* life\n    Whose misadventured piteous overthrows\n    [? if {? Q.foo = \"[?]\" ?}: Doth with their [death bury their] parents' strife?]\n\n    The [fearful passage of their death-mark'd love\n    And the continuance of their parents' rage\n    Which, but their children's end, naught could remove\n    Is now the two hours passage of our stage.]\n\n    > The which if you with patient ears attend,//\n    What here shall miss, our toil shall strive to mend.\n    >> Wm Shakespeare\n\n    ---\nAnd we're done.";
  var f = findFeatures(rnj);
  var b = createFeatureBoundaries(rnj, f);
  var r = buildRanges(rnj, b);
  console.log(toHTML(r));
  //console.log(JSON.stringify(r, null, 2));

}());