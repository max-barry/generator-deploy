"use strict";
var generators = require("yeoman-generator"),
    utils = require("../../utils");

module.exports = generators.Base.extend({
    initializing: function() {
        this.log("Initializing NGINX configuration...");
        this.promptedAlready = !!this.options.promptAnswers;
        if (this.promptedAlready) {
            this.promptAnswers = this.options.promptAnswers;
        }
    },
    prompting: function() {
        var done = this.async();
        if (!this.promptedAlready) {
            var prompts = utils.reduce_prompts(["emperor", "codebaseToWSGI", "codebase", "deploymentType", ]);
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
            targ = this.promptAnswers.projectFolder + ".conf",
            tpl = "_nginx.conf";

        this.log("Writing NGINX configuration file");
        this.template(tpl, targ, ctx);
    }
});