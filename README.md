# Yo Deploy
A [**Yeoman**](http://yeoman.io/) generator for server configuration files needed in the deployment of Django applications; including uWSGI, NGINX, and Supervisor settings.

The generator will also write a custom deployment guide based on the answers provided to its prompts.

Whilst not necessary, this generator was conceived in concurrence with the development of [**this Django Boilerplate**](https://github.com/clione/dboilerplate).


## Requirements
 - [Yo](http://yeoman.io/learning/)


## Getting Started

1. The files are generated into the current working directory, so navigate to a fresh directory if necessary

2. `yo deploy`

3. Follow the prompts on screen


## A Bit More Information

Find below a more detailed description of each prompt:

**Name of project folder. This folder contains the entire project, both code and config files (e.g. mydomain.com)** (mandatory)

The project folder is key to the entire deployment. It contains both configuration and code files. The only files related to the project that exist outside of this folder, are symlinked configurations (NGINX, etc.)

---

**The absolute server path to this project folder** (default: /srv/)

The server directory containing the project folder. This directory may contain multiple applications that exist in isolation from one another. Convention dictates this folder is located within `/srv/`, but I don't really care about convention. So go wild!

---

**Name of codebase. The codebase is usually inside of the project folder, and contains the code. Usually this will be the name of a GIT repository (e.g. my-site)**

Most likely the name of the codebase is the name of the GIT repository. Inside of the project folder you have directories for the configuration files, but the codebase contains the actual project code.

---

**Relative path from the root of the codebase to the wsgi.py file, including "wsgi.py" component (e.g. src/myProject/wsgi.py)**

This is a little sloppy, but uWSGI configurations must know the location of the `wsgi.py` file within a project.
In the [**Django Boilerplate mentioned previously**](https://github.com/clione/dboilerplate), the path from the codebase to this file would be:

    <project folder>/src/<project name>/wsgi.py

Mileage may vary. The `wsgi.py` file may be situated at the same level as the codebase, for example.

---

**What structure will this project's uWSGI app live under? [Standalone, Vassal]**

uWSGI can be deployed directly on the project (standalone) or as an Emperor lording over vassals, with our project becoming a subservient vassal. The advatages and disadvatages can be argued.

By running an Emperor, you are putting the responsibility of killing and managing uWSGI workers in the hands of the Emperor and not Supervisor. For a standalone app, Supervisor is responsible for the uWSGI workers - kind of. That's a simplification of the argument.

For more information, learn more about [**uWSGI Emperor apps**](http://uwsgi-docs.readthedocs.org/en/latest/Emperor.html).

---

**This deployment is for... [Debug, Staging, Live]**

The [**aforementioned boilerplate**](https://github.com/clione/dboilerplate) relies on environmental variables to distinguish different deployments; a live environment vs. staging. This prompts helps fill in these environmental variables in the configuration files and deployment guide. The actual names of the variables may need adapting for your needs.

---

**Will this project run under SSL?**

Will it?

---

**The domain(s) this project will be deployed under. If multiple, write as a non-delimited string (e.g. www.mydomain.com mydomain.com sub.mydomain.com)**

Used in the NGINX configuration. The answer is reprinted verbatim on the domain key of the NGINX config. This means that multiple domains can be supplied.

---

**Would you like to generate a deployment guide for your project?**

A personalised deployment guide will be generated from the answers given previously, and standard practices for new deployments.

---

**What is the name of the UNIX user your project will run under?** (default: <username>)

In theory each deployment would live under its own UNIX user, to isolate it from other applications. The generator uses the UNIX user provided to make the generated guide a lot more helpful.

## Sub-generators

Each component of the deployment exists as a seperate sub-generator. This means that any individual part of the deployment can be generated on its own. To deploy a specific component, enter one of the following commands:

    yo deploy:uwsgi
    yo deploy:nginx
    yo deploy:supervisor
    yo deploy:documentation