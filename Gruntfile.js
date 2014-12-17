module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bump: {
            options: {
                push: false,
                pushTo: "origin",
                files: [
                    "package.json"
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');

};
