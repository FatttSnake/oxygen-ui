<div align="center">
    <h1>
        <img alt="Logo" src="doc/logo.svg" width="128">
        <br>
        <span>Web UI of Oxygen Toolbox</span>
    </h1>
</div>
<div align="center">
    <a href="https://ci.fatweb.top/job/Oxygen%20Toolbox%20UI/">
        <img alt="Build" src="https://ci.fatweb.top/job/Oxygen%20Toolbox%20UI/badge/icon">
    </a>
    <a href="https://github.com/FatttSnake/oxygen-ui/releases/latest">
        <img alt="Release" src="https://img.shields.io/github/v/release/FatttSnake/oxygen-ui">
    </a>
    <a href="LICENSE">
        <img alt="LICENSE" src="https://img.shields.io/github/license/FatttSnake/oxygen-ui">
    </a>
</div>

# Overview ([ZH](README_zh.md), EN)

This project is a front-end web UI of Oxygen Toolbox and needs to be used with the back-end API.

# Requires

- Web Server (e.g. Nginx, Apache httpd)
- [API of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-api) (v1.0.0 or later versions)

# Related projects

[API of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-api)

[Desktop Client of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-desktop)

[Android Client of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-android)

# Quick Start

**1. Download the latest packaged production version from [Releases](https://github.com/FatttSnake/oxygen-ui/releases/latest) page**

**2. Upload the file `oxygen-ui-*.tar.gz` or `oxygen-ui-*.zip` to the web server and unzip it**

**3. Configure pseudo-static**

Nginx:

```nginx
server {
    ...
    
    index index.html
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    ...
}
```

Apache httpd (.htaccess):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
