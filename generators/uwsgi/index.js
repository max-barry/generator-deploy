"use strict";
var generators = require("yeoman-generator"),
    utils = require("../../utils");

module.exports = generators.Base.extend({
    initializing: function() {
        this.log("Initializing uWSGI configuration...");
        this.promptedAlready = !!this.options.promptAnswers;
        if (this.promptedAlready) {
            this.promptAnswers = this.options.promptAnswers;
        }
    },
    prompting: function() {
        var done = this.async();
        if (!this.promptedAlready) {
            var prompts = utils.reduce_prompts(["ssl", "domain", "documentation", "unixuser"]);
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
            targ = this.promptAnswers.projectFolder + ".ini",
            tpl = this.promptAnswers.emperor ? "_uwsgi_vassal.ini" : "_uwsgi_standalone.ini",
            logMsg = this.promptAnswers.emperor ? "Writing uWSGI vassal app" : "Writing standalone uWSGI app";

        this.log(logMsg);
        this.template(tpl, targ, ctx);

        var args = {
            options: {
                uwsgiprefilled: true,
                promptAnswers: this.promptAnswers
            }
        };

        if (!this.promptAnswers.emperor) {
            this.log("Creating a Supervisor configuration for the project's standalone uWSGI app");
            this.composeWith('deploy:supervisor', args);
        }


    }
});