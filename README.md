![Dendry](http://dendry.org/img/logo_64.png) Dendry
======

[![Build Status](https://travis-ci.org/dendry/dendry.svg?branch=master)](https://travis-ci.org/dendry/dendry)
[![Dependencies Status](https://david-dm.org/dendry/dendry.svg)](https://david-dm.org/dendry/dendry)
[![Test Coverage](https://coveralls.io/repos/dendry/dendry/badge.png?branch=master)](https://coveralls.io/r/dendry/dendry)

This is a new project aimed at developing a suite of command line
tools and a common file format for hypertext interactive fiction. My
ability to work on this project is minimal, so until I remove this
message and describe the contents of this repo, assume that the tools
are incomplete, missing or non-functional.

To install:

`sudo npm install -g .`

To create a playable html/js from a dendry project:

`dendry make-html`

## Examples

Displaying variables in text: `[+ var : +]`

Varying text based on a condition: `[? if var = 1 : something ?]`

Basic scene example:

```
@scene1
title: Scene
subtitle: subtitle of the scene
unavailable-subtitle: scene cannot be selected
view-if: var1 = 1 and (var2 = 2 or var3 = 3)
choose-if: var4 = 4
on-arrival: v2 = 1; v3 = 3; vs = "abc"
go-to: scene2 if v2 = 2; scene3 if v3 = 3
tags: start, tag1, tag2
new-page: true
max-visits: 2

Content goes here.

var1: [+ var1 : +]

vs: [+ vs : +]

[? if var1 = 1 : aaaaa ?]

- @scene2: Choice 1
- @scene3: Choice 2
```

Including javascript in `on-arrival`: `{! Q['var1'] = Math.cos(Math.PI/4); !}`

Including javascript in `view-if`: `{! return ((Q['a'] || 0)===(Q['b'] || 0)); !}`
