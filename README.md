DendryNexus
======

[![Build Status](https://travis-ci.org/dendry/dendry.svg?branch=master)](https://travis-ci.org/dendry/dendry)
[![Dependencies Status](https://david-dm.org/dendry/dendry.svg)](https://david-dm.org/dendry/dendry)
[![Test Coverage](https://coveralls.io/repos/dendry/dendry/badge.png?branch=master)](https://coveralls.io/r/dendry/dendry)


DendryNexus is an interactive fiction framework based on [Dendry](https://github.com/aucchen/dendry). It is a strict superset of dendry, and has all of its features, but in addition has support for the card-game paradigm used in the now-defunct [StoryNexus](http://wiki.failbettergames.com/). Unlike StoryNexus, DendryNexus works entirely in the browser and does not have a server component.

Right now, using DendryNexus is not recommended unless you have used dendry previously, are somewhat familiar with the StoryNexus paradign, and can debug js/html/css.

The best way to get started with dendry is to read [smhwr's guide](https://smwhr.notion.site/Getting-started-with-Dendry-188e7e39a961497fb2d0a0deee0c21a0).

To install:

`npm install -g .`

To create a new project:

`dendrynexus new`

To create a playable html/js from a dendrynexus project:

`dendrynexus make-html`

## DendryNexus Features

### Hands

A scene with the property `is-hand: true` will be presented as a hand, showing the choices in this scene as decks, the cards in the hand, and the pinned cards.

All choices available in a "hand" scene should be either decks or pinned cards, and will be displayed as such.

### Decks

Decks are implemented as individual dendry scenes that do not have any text, but do have the `is-deck: true` property, as well as a set of potential choices (most likely tag choices). In order to draw from a deck, DendryNexus will identify all of the available scenes from the deck-scene's potential choices, and randomly return one such scene. So it really isn't like drawing a card from a deck at all...

The `card-image` property is used to indicate the deck's image.

### Cards

Cards are implemented as dendry scenes that have the `is-card: true` property. Pinned cards have the `is-pinned-card: true` property. Cards are otherwise just normal scenes, and can lead to a chain of other scenes that are not cards. Transitioning back to the hand scene has to be done manually at the end of a scene chain.

The `card-image` property is used to indicate the card image.

### Stat checks

Using a stat check in a scene requires a few different properties to be in order:

- `check-quality:` this is the name of a single numeric quality
- `broad-difficulty:`  or `narrow-difficulty:` See FL wiki
- `check-success-go-to:` scene to go to on success
- `check-failure-go-to:` scene to go to on failure

Selecting this scene will immediately transition to either the scene indicated by `check-success-go-to` or `check-failure-go-to`. The text in a stat check scene will be displayed before the results, on either success or failure.



## Debugging

In the browser, the state is stored as `dendryUI.dendryEngine.state`. Qualities are at `dendryUI.dendryEngine.state.qualities`.
