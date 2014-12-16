"use strict";
var generators = require("yeoman-generator"),
    utils = require("../../utils");

module.exports = generators.Base.extend({
    initializing: function() {
        this.log("Initializing documentation...");
        this.promptedAlready = !!this.options.promptAnswers;
        if (this.promptedAlready) {
            this.promptAnswers = this.options.promptAnswers;
        }
    },
    prompting: function() {
        var done = this.async(),
            prompts = utils.reduce_prompts(["codebaseToWSGI", "ssl" ]);
        if (!this.promptedAlready) {
            this.prompt(
                prompts,
                function(answers){
                    this.promptAnswers = answers;
                    done();
                }.bind(this)
            );
        } else {
            done();
        }
    },
    writing: function() {
        var ctx = {ctx: this.promptAnswers},
            targ = "README.md",
            tpl = "_README.md";

        this.log("Writing documentation");
        this.template(tpl, targ, ctx);
    }
});