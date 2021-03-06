# Deployment Guide

## Pre-requirements
This guide assumes the following dependencies are installed and operating correctly:

  - NGINX
  - Supervisor
  - Python
    - Virtualenv (or equivalent)
    - uWSGI
  - (Optional) A shared unix user group that all projects run under, e.g. "developers"

---

## Overview & Assumptions
The target structure for this application is as followed:

  - A project directory containing all configuration files and code called `<%= ctx.projectFolder %>` inside of `<%= ctx.projectLocation %>`:

        <%= ctx.projectLocation %><%= ctx.projectFolder %>/

  - Directories containing the uWSGI and NGINX configuration files generated alongside this documentation:

        <%= ctx.projectLocation %><%= ctx.projectFolder %>/config/nginx/<%= ctx.projectFolder %>.conf
        <%= ctx.projectLocation %><%= ctx.projectFolder %>/config/uwsgi/<%= ctx.projectFolder %>.ini

  - All project code will be found at:

        <%= ctx.projectLocation %><%= ctx.projectFolder %>/<%= ctx.codebase %>/

  - An assumption is made that (for Django projects) the `manage.py` file (and hence the project root) can be found within:

        <%= ctx.projectLocation %><%= ctx.projectFolder %>/<%= ctx.codebase %>/src/

  - Project code is stored in a GIT repository

---

## How-to
1. Create a user for the project:

    `sudo useradd -d <%= ctx.projectLocation %><%= ctx.projectFolder %> -g developers -m -s /bin/bash <%= ctx.unixuser %>`

2. Set a password for that newly created user:

    `sudo passwd <%= ctx.unixuser %>`

3. Log in to that user:

    `su <%= ctx.unixuser %>`
  
    `cd ~`

4. Create a Virtual environment:
  
    `virtualenv venv`

5. Change the project user's bash profile to activate this environment on login:

    `vim .bashrc`

    Add to the file...

        source $HOME/venv/bin/activate
        cd $HOME

    If the project calculates its deployment state from environmental variables, like this
    [**Django Boilerplate**](https://github.com/clione/dboilerplate), also add the following lines...

        export DJANGO_IS_DEBUG=<%= ctx.deploymentType.debug %>
        export DJANGO_IS_STAGING=<%= ctx.deploymentType.staging %>

6. Make directories to house configurations and, optionally, static files:

        mkdir logs
        mkdir logs/nginx
        mkdir logs/uwsgi
        mkdir config
        mkdir config/nginx
        mkdir config/uwsgi
        mkdir run
        mkdir tmp
        mkdir htdocs

7. Add the files generated by this process to the appropriate directories inside of `config`:

        <%= ctx.projectLocation %><%= ctx.projectFolder %>/config/nginx/<%= ctx.projectFolder %>.conf
        <%= ctx.projectLocation %><%= ctx.projectFolder %>/config/uwsgi/<%= ctx.projectFolder %>.ini

8. The NGINX configuration must be symlinked to the global sites-enabled directory within NGINX *(n.b. the following needs to be run as root)*:

    `sudo ln -s <%= ctx.projectLocation %><%= ctx.projectFolder %>/config/nginx/<%= ctx.projectFolder %>.conf /etc/nginx/sites-enabled/`

    Pre-touch the NGINX log files, and restart NGINX to activate the new site...

    `touch <%= ctx.projectLocation %><%= ctx.projectFolder %>/logs/nginx/nginx.error.log`

    `touch <%= ctx.projectLocation %><%= ctx.projectFolder %>/logs/nginx/nginx.access.log`
    
    `service nginx restart`
<% if (ctx.emperor) { %>
9. The uWSGI vassal must be symlinked to the application directory watched by the Emperor:

    `sudo ln -s <%= ctx.projectLocation %><%= ctx.projectFolder %>/config/uwsgi/<%= ctx.projectFolder %>.ini /srv/applications/vassals/`

    *n.b. The assumption being made here is that the Emperor watches for new vassals in the directory `/srv/applications/vassals/`. Change as appropriate*
<% } else { %>
9. A Supervisor configuration must be added to monitor and restart the uWSGI process in the event it falls over. Run the following commands:

    `mkdir config/supervisor`

    `vim config/supervisor/<%= ctx.projectFolder %>.conf`
    
    Fill this file with the contents of the `<%= ctx.projectFolder %>.supervisor.conf`, generated alongside this documentation.

    Symlink this configuration in to Supervisor's monitored directory.

    `sudo ln -s <%= ctx.projectLocation %><%= ctx.projectFolder %>/config/supervisor/<%= ctx.projectFolder %>.conf /etc/supervisord/conf.d/`

    Update and reload Supervisor to have it discover the new configuration:

    `sudo supervisorctl reread`

    `sudo supervisorctl update`
<% } %>
10. GIT clone the project into `<%= ctx.projectLocation %><%= ctx.projectFolder %>`

11. Install Python and frontend dependencies. Build the frontend component of the project after dependencies are installed.

12. **(Optional)** Add a `robots.txt` to `config/nginx/staticfiles/`