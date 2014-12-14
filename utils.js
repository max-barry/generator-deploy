"use strict";

function make_start_server_path(str) {
    return str.indexOf("/") == 0 ? str : "/" + str;
}

function make_end_server_path(str) {
    return str.indexOf("/", str.length - 1) !== -1 ? str : str + "/";
}

function make_server_path(str) {
    var ret = make_start_server_path(str);
    return make_end_server_path(ret);
}

function make_not_server_path(str) {
    var ret = str.indexOf("/") == 0 ? str.substring(1) : str;
    return ret.indexOf("/", ret.length - 1) !== -1 ? ret.slice(0, -1) : ret;
}

function mandatory_input(answer) {
    return answer.length === 0 ? "This value can not be empty" : true;
}

function must_be_wsgi_file(answer) {
    var resp = answer.length !== 0 ? true : "This value can not be empty";
    return answer.slice(answer.length - 3) == ".py" ? true : "Your answer did not end in .py. Please provide a path to the wsgi.py file.";
}


var prompts = [
    {
        type: "input",
        name: "projectFolder",
        message: "Name of project folder. This folder contains the entire project, both code and config files (e.g. mydomain.com)",
        filter: make_not_server_path,
        validate: mandatory_input
    },
    {
        type: "input",
        name: "projectLocation",
        message: "The absolute server path to this project folder",
        default: "/srv/",
        filter: make_server_path
    },
    {
        type: "input",
        name: "codebase",
        message: "Name of codebase. The codebase is usually inside of the project folder, and contains the code. Usually this will be the name of a GIT repository (e.g. my-site)",
        filter: make_not_server_path,
        validate: mandatory_input
    },
    {
        type: "input",
        name: "codebaseToWSGI",
        message: "Relative path from the root of the codebase to the wsgi.py file, including \"wsgi.py\" component (e.g. src/myProject/wsgi.py)",
        filter: make_start_server_path,
        validate: must_be_wsgi_file
    },
    {
        type: "list",
        name: "emperor",
        message: "What structure will this project's uWSGI app live under",
        choices: [
            {
                name: "Standalone:\nThe uWSGI configuration will be independent of other projects,\nand will require its own Supervisor instance.",
                value: false,
            },
            {
                name: "Vassal:\nThe project will live as a vassal under an Emperor\nthat controls all projects on the server.",
                value: true,
            }
        ]
    },
    {
        type: "list",
        name: "deploymentType",
        message: "This deployment is for...",
        choices: ["Debug", "Staging", "Live"],
        filter: function(answer) {
            return {
                debug: answer == "Debug" || answer == "Staging" ? "1": "0",
                staging: answer == "Staging" ? "1": "0"
            }
        }
    },
];

module.exports = {
    prompts: prompts,
};