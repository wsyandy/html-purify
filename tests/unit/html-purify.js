/*
Copyright 2015, Yahoo Inc. 
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Aditya Mahendrakar <maditya@yahoo-inc.com>
         Nera Liu <neraliu@yahoo-inc.com>
         Albert Yu <albertyu@yahoo-inc.com>
         Adonis Fung <adon@yahoo-inc.com>
*/
(function () {

    require("mocha");
    var assert = require("assert"),
    	testVectors = require("../test-vectors.js"),
    	html5secVectors = testVectors.html5secVectors,
    	generalVectors = testVectors.generalVectors,
        Purifier = require("../../src/html-purify");

    describe('HTML Purify', function() {

        it('should allow whitelisted tags and attributes', function(){
            var html = "<h1 id=\"foo\" title=\"asd\" checked>hello world</h1>";
            var output = (new Purifier()).purify(html);
            assert.equal(output, '<h1 id="foo" title="asd" checked>hello world</h1>');
        });

        it('should discard attributes not whitelisted', function(){
            var html = "<h1 id=\"foo\" title=\"asd\" evil=\"bar\" checked>hello world 2</h1>";
            var output = (new Purifier()).purify(html);
            assert.equal(output, '<h1 id="foo" title="asd" checked>hello world 2</h1>');
        });

        it('should handle all vectors mentioned in https://html5sec.org', function(){
	    var output, i, vector;
	    for (var i = 0; i < html5secVectors.length; i++) {
	        vector = html5secVectors[i].input;
		output = (new Purifier()).purify(vector);
		console.log("*****" + html5secVectors[i].id + "*****");
		console.log("input   ==> " + vector);
		console.log("output  ==> " + output);
		assert.equal(output, html5secVectors[i].output);
	    }

        });

        it('should allow self-closing tags', function(){
            var html = "<br /> hello world </br>"
            var output = (new Purifier()).purify(html);
	    console.log(output);
            assert.equal(output, '<br /> hello world </br>');
        });

        it('should handle href attributes', function(){
            var html = "<a href=\"http://www.yahoo.com\">yahoo</a>";
            var output = (new Purifier()).purify(html);
	    console.log(output);
            assert.equal(output, '<a href="http://www.yahoo.com">yahoo</a>');
        });

        it('should handle js in href attributes', function(){
            var html = "<a href=\"javascript:alert(1)\">yahoo</a>";
            var output = (new Purifier()).purify(html);
	    console.log(output);
            assert.equal(output, '<a href="x-javascript:alert(1)">yahoo</a>');
        });

        it('should strip attributes in the end tag', function(){
            var html = "<h1 dir =  \"asd\">hello</h1 id=\"bar\">"
            var output = (new Purifier()).purify(html);
            console.log(output);
            assert.equal(output, '<h1 dir=\"asd\">hello</h1>');
        });

        it('should handle characters between attributes correctly', function(){
            var html = "<h1    label  dir =  \"asd\"  evil1 defer \"evil2\" evil3 evil4=\"asdasd\" icon 'evil5>hello</h1>"
            var output = (new Purifier()).purify(html);
            console.log(output);
            assert.equal(output, '<h1 label dir=\"asd\" defer icon>hello</h1>');
        });

        it('should allow style attribute if the css is valid', function(){
            var html = "<div style=\"color:#0000FF\">"
            var output = (new Purifier()).purify(html);
            console.log(output);
            assert.equal(output, '<div style=\"color:#0000FF\">');

            // invalid css
            html = "<div style=\"color;foobar\">";
            output = (new Purifier()).purify(html);
	    console.log(output);
      	    assert.equal(output, '<div>');
        });

        it('should handle additional vectors', function(){
	    var output, i, vector;
	    for (var i = 0; i < generalVectors.length; i++) {
                vector = generalVectors[i].input;
                output = (new Purifier()).purify(vector);
                console.log("*****" + generalVectors[i].id + "*****");
                console.log("input   ==> " + vector);
                console.log("output  ==> " + output);
                assert.equal(output, generalVectors[i].output);
	    }
        });
    });
}());
