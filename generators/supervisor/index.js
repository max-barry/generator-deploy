"use strict";
var generators = require("yeoman-generator"),
    utils = require("../../utils");

module.exports = generators.Base.extend({
    initializing: function() {
        this.log("Initializing Supervisor configuration...");
        this.promptedAlready = !!this.options.promptAnswers;
        if (this.promptedAlready) {
            this.promptAnswers = this.options.promptAnswers;
        }
    },
    prompting: function() {
        var done = this.async(),
            prompts = utils.reduce_prompts(["codebaseToWSGI", "ssl", "domain", "emperor", "deploymentType", "documentation"]);
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
        var ctx = {
                ctx: this.promptAnswers,
                uwsgiprefilled: !!this.options.uwsgiprefilled
            },
            targ = this.promptAnswers.projectFolder + ".supervisor.conf",
            tpl = "_supervisor.conf";

        this.log("Writing Supervisor configuration file");
        this.template(tpl, targ, ctx);
    }
});