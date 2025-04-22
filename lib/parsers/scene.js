/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  'use strict';

  var make = require('./make');
  var validators = require('./validators');
  var dryParser = require('./dry');

  // --------------------------------------------------------------------
  // Schemae
  // --------------------------------------------------------------------

  var sceneOptionSchema = {
    id: {
      required: true,
      validate: null
    },
    title: {
      required: false,
      validate: validators.validateLineContent
    },
    subtitle: {
      required: false,
      validate: validators.validateLineContent
    },
    unavailableSubtitle: {
      required: false,
      validate: validators.validateLineContent
    },
    viewIf: {
      required: false,
      validate: validators.validatePredicate
    },
    chooseIf: {
      required: false,
      validate: validators.validatePredicate
    },
    order: {
      required: false,
      validate: validators.validateInteger
    },
    priority: {
      required: false,
      validate: validators.validateInteger
    },
    frequency: {
      required: false,
      validate: validators.validateFloat
    },
    frequencyVar: {
      required: false,
      validate: validators.validateExpression
    }
  };

  var sceneSectionSchema = make.extendSchema(sceneOptionSchema, {
    $clean: function(object, callback) {
      if (object.maxVisits !== undefined) {
        if (object.countVisitsMax === undefined) {
          object.countVisitsMax = object.maxVisits;
        } else if (object.countVisitsMax < object.maxVisits) {
          var cv = dryParser.propertyFileAndLine(object, 'countVisitsMax');
          var mv = dryParser.propertyFileAndLine(object, 'maxVisits');
          var msg = (
            'Cannot have count-visits-max (' + cv +
            ') set lower than max-visits (' + mv + ').'
            );
          return callback(new Error(msg));
        }
      }
      // sigh... this is a magic number
      if (object.maxVisitsVar !== undefined) {
        object.countVisitsMax = 10000;
      }
      callback(null, object);
    },
    signal: {
      required: false,
      validate: null
    },
    style: {
      required: false,
      validate: null
    },
    tags: {
      required: false,
      validate: validators.validateTagList
    },

    maxVisits: {
      required: false,
      validate: validators.makeEnsureInRange(1, undefined)
    },
    countVisitsMax: { // always at least as high as maxVisits, if that is set
      required: false,
      validate: validators.makeEnsureInRange(1, undefined)
    },

    // like maxVisits, but a variable/expression.
    maxVisitsVar: {
      required: false,
      validate: validators.validateExpression
    },

    onArrival: {
      required: false,
      validate: validators.validateActions
    },
    onDeparture: {
      required: false,
      validate: validators.validateActions
    },
    onDisplay: {
      required: false,
      validate: validators.validateActions
    },
    gameOver: {
      required: false,
      validate: validators.validateBoolean
    },
    goTo: {
      required: false,
      validate: validators.validateGoTo
    },
    goToRef: {
        required: false,
        validate: validators.validateGoToRef
    },
    // TODO: separate into goSubStart and goSubEnd, based on should the goSub be done before or after the main content is displayed?
    // logic of goSubStart: scene onArrival actions -> gosub -> display scene (if newpage, it is called) -> display choices or do other gotos
    // logic of goSubEnd: scene onArrival actions -> display scene (if newpage, it is called) -> gosub -> display choices or do other gotos
    // logic of goSub: same as goSubEnd
    // priorities: gosub > goto > gotoref
    goSub: {
      required: false,
      validate: validators.validateGoTo
    },
    goSubStart: {
      required: false,
      validate: validators.validateGoTo
    },
    goSubEnd: {
      required: false,
      validate: validators.validateGoTo
    },
    newPage: {
      required: false,
      validate: validators.validateBoolean
    },

    setRoot: {
      required: false,
      validate: validators.validateBoolean
    },

    minChoices: {
      required: false,
      validate: validators.validateInteger
    },
    maxChoices: {
      required: false,
      validate: validators.validateInteger
    },

    // currently unused
    isTop: {
      required: false,
      validate: validators.validateBoolean
    },
    // isSpecialScene is true for stuff like stats, settings, achievements
    // where you want the player to be able to go back to the previous
    // page without necessarily changing anything
    isSpecial: {
      required: false,
      validate: validators.validateBoolean
    },
    // the jump point is a scene that can be visited by going to
    // the "jump" special scene. Basically a variable goto destination.
    // can be used for subroutines.
    setJump: {
      required: false,
      validate: validators.validateId
    },
    // this "calls" the onArrival function in a scene.
    call: {
      required: false,
      validate: validators.validateId
    },
    // set background image to a given URL
    setBg: {
      required: false,
      validate: null
    },
    setMusic: {
      required: false,
      validate: null
    },
    setSprites: {
      required: false,
      validate: validators.validateSprites
    },
    // TODO: do not use - i don't have a good syntax for this
    setSpriteStyles: {
      required: false,
      validate: validators.validateSpriteStyles
    },
    setTopLeftStyle: {
      required: false,
      validate: null
    },
    setTopRightStyle: {
      required: false,
      validate: null
    },
    setBottomLeftStyle: {
      required: false,
      validate: null
    },
    setBottomRightStyle: {
      required: false,
      validate: null
    },
    // grants the player an achievement.
    achievement: {
      required: false,
      validate: null
    },
    // audio properties? just pass the audio url as a string, same as bg
    audio: {
      required: false,
      validate: null
    },
    // dendrynexus stuff
    // true if the scene represents a deck
    isDeck: {
      required: false,
      validate: validators.validateBoolean
    },
    isPinnedCard: {
      required: false,
      validate: validators.validateBoolean
    },
    // True if the scene is the top level of a card
    isCard: {
      required: false,
      validate: validators.validateBoolean
    },
    // cardImage is used for both cards and hands. As with setBg, this should be a URL.
    cardImage: {
      required: false,
      validate: null
    },
    // faceImage is used for displaying images in content.
    faceImage: {
      required: false,
      validate: null
    },
    // if the scene represents a hand
    isHand: {
      required: false,
      validate: validators.validateBoolean
    },
    // number of cards allowed in the hand
    maxCards: {
      required: false,
      validate: validators.validateInteger
    },
    // dendrynexus: stat checks
    // currently, the checks are based on only a single quality. i
    checkQuality: {
      required: false,
      validate: validators.validateQualityName
    },
    // difficulty of the check
    // broad difficulty as defined in https://fallenlondon.wiki/wiki/Broad_difficulty
    broadDifficulty: {
      required: false,
      validate: validators.validateQualityValue
    },
    // narrow difficulty as defined in https://fallenlondon.wiki/wiki/Narrow_difficulty
    narrowDifficulty: {
      required: false,
      validate: validators.validateQualityValue
    },
    // difficulty scaling for broad difficulty (default: 0.6 - see https://fallenlondon.wiki/wiki/Broad_difficulty)
    difficultyScaler: {
      required: false,
      validate: validators.validateQualityValue
    },
    // only used for narrow difficulty (default: 10%) - see https://fallenlondon.wiki/wiki/Narrow_difficulty
    difficultyIncrement: {
      required: false,
      validate: validators.validateQualityValue
    },
    // go to a scene upon succeeding the difficulty roll
    checkSuccessGoTo: {
      required: false,
      validate: validators.validateRelativeId
    },
    // go to a scene upon failing the difficulty roll
    checkFailureGoTo: {
      required: false,
      validate: validators.validateRelativeId
    },
    content: {
      required: true,
      validate: validators.validateParagraphContent
    },
    options: {
      required: false,
      validate: validators.makeEnsureListItemsMatchSchema(sceneOptionSchema)
    }
  });

  var sceneSchema = make.extendSchema(sceneSectionSchema, {
    type: {
      required: true,
      validate: validators.makeEnsureEqualTo('File type', 'scene')
    },
    sections: {
      required: false,
      validate: validators.makeEnsureListItemsMatchSchema(sceneSectionSchema)
    }
  });

  // --------------------------------------------------------------------

  module.exports = make.makeExports(sceneSchema);
  module.exports.optionSchema = sceneOptionSchema;
}());
