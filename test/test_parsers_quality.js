/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var should = require('should');
  // Disable errors from using the should library.
  /*jshint -W030 */

  var noerr = function(err) {
    if (err) {
      console.trace(err);
    }
    (!!err).should.be.false;
  };

  var parse = require('../lib/parsers/quality');
  var dryParser = require('../lib/parsers/dry');

  // Loads and parses the given file.
  var parseFromFile = function(parseFromContent, filename, callback) {
    fs.readFile(filename, function(err, content) {
      if (err) {
        return callback(err);
      }
      parseFromContent(filename, content.toString(), callback);
    });
  };

  describe('quality parser', function() {

    // ----------------------------------------------------------------------

    it('should parse basic content', function(done) {
      var content = 'name: Foo Quality';
      parse.parseFromContent('foo.quality.dry', content, function(err, result) {
        noerr(err);
        result.id.should.equal('foo');
        result.name.should.equal('Foo Quality');
        done();
      });
    });

    it('should parse initial int/float value', function(done) {
      var content = 'name: Float Quality\ninitial: 10';
      parse.parseFromContent('floatq.quality.dry', content, function(err, result) {
        noerr(err);
        result.id.should.equal('floatq');
        result.name.should.equal('Float Quality');
        result.initial.should.equal(10);
        done();
      });
    });

    it('should parse initial boolean true/TRUE value', function(done) {
      var content = 'name: Bool Quality\ninitial: true';
      parse.parseFromContent('boolq.quality.dry', content, function(err, result) {
        noerr(err);
        result.id.should.equal('boolq');
        result.name.should.equal('Bool Quality');
        result.initial.should.equal(true);
        done();
      });
    });

    it('should parse initial boolean false/FALSE value', function(done) {
      var content = 'name: Bool Quality\ninitial: false';
      parse.parseFromContent('boolq.quality.dry', content, function(err, result) {
        noerr(err);
        result.id.should.equal('boolq');
        result.name.should.equal('Bool Quality');
        result.initial.should.equal(false);
        done();
      });
    });

    it('should parse initial string value', function(done) {
      var content = 'name: String Quality\ninitial: my initial value';
      parse.parseFromContent('stringq.quality.dry', content, function(err, result) {
        noerr(err);
        result.id.should.equal('stringq');
        result.name.should.equal('String Quality');
        result.initial.should.equal("my initial value");
        done();
      });
    });

    it('should reject ids that aren\'t valid quality names', function(done) {
      var content = 'name: My Quality';
      parse.parseFromContent(
        'foo.bar.quality.dry', content,
        function(err, result) {
          (!!err).should.be.true;
          err.toString().should.equal(
            'Error: foo.bar.quality.dry filename: ' +
            '"foo.bar" is not a valid quality name.'
            );
          (result === undefined).should.be.true;
          done();
        });
    });

    it('should enforce required type', function(done) {
      var content = 'name: My Quality';
      // No 'type' inferred from filename.
      parse.parseFromContent('foo.dry', content, function(err, result) {
        (!!err).should.be.true;
        err.toString().should.equal(
          'Error: foo.dry: Required property "type" missing.');
        (result === undefined).should.be.true;
        done();
      });
    });

    it('should reject unknown properties', function(done) {
      var content = 'name: My Quality\nlabel: foo';
      parse.parseFromContent('foo.quality.dry', content, function(err, result) {
        (!!err).should.be.true;
        err.toString().should.equal(
          'Error: foo.quality.dry: Unknown properties: "label" ' +
          '(foo.quality.dry line 2).');
        (result === undefined).should.be.true;
        done();
      });
    });

    it('should reject sections', function(done) {
      var content = 'name: My Quality\n@bar';
      parse.parseFromContent('foo.quality.dry', content, function(err, result) {
        (!!err).should.be.true;
        err.toString().should.equal(
          'Error: foo.quality.dry: Unknown properties: "sections".');
        (result === undefined).should.be.true;
        done();
      });
    });

    it('should reject options', function(done) {
      var content = 'name: My Quality\n\n- @foo';
      parse.parseFromContent('foo.quality.dry', content, function(err, result) {
        (!!err).should.be.true;
        err.toString().should.equal(
          'Error: foo.quality.dry: Unknown properties: "options".');
        (result === undefined).should.be.true;
        done();
      });
    });

    it('should reject malformed dry files', function(done) {
      var content = 'name: My Quality\nfoo';
      parse.parseFromContent('foo.quality.dry', content, function(err, result) {
        (!!err).should.be.true;
        err.toString().should.equal(
          'Error: foo.quality.dry line 2: Invalid property definition.');
        (result === undefined).should.be.true;
        done();
      });
    });

    it('should load and parse quality file', function(done) {
      var fn = path.join(__dirname, 'files', 'test_quality_parser.quality.dry');
      parseFromFile(parse.parseFromContent, fn, function(err, result) {
        noerr(err);
        dryParser.removeMetadataFromObject(result);
        result.should.eql({
          id: 'test_quality_parser',
          type: 'quality',
          name: 'The Quality Name',
          initial: 5,
          content: {
            type: 'paragraph',
            content: 'This is the description of this quality.'
          }
        });
        done();
      });
    });

    it('should pass on dry file errors', function(done) {
      var fn = path.join(__dirname, 'files', 'unknown.scene.dry');
      parseFromFile(parse.parseFromContent, fn, function(err, result) {
        (!!err).should.be.true;
        (result === undefined).should.be.true;
        done();
      });
    });

  });
}());
