"use strict";
var generators = require("yeoman-generator"),
    utils = require("../../utils");

module.exports = generators.Base.extend({
    prompting: function() {
        var done = this.async();
        this.prompt(
            utils.prompts,
            function(answers){
                console.log(answers);
                this.promptAnswers = answers;
                done();
            }.bind(this)
        );
    },
    writing: function() {
        var args = {
            options: {promptAnswers: this.promptAnswers}
        };

        this.composeWith('deploy:uwsgi', args);
    }
});