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

# 概述 (ZH, [EN](README.md))

本项目为 Oxygen Toolbox 的网页 UI，需配合后端 API 使用。

# 环境要求

- Web 服务器（如 Nginx, Apache httpd）
- [API of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-api) (v1.0.0 及更高版本)

# 关联项目

[API of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-api)

[Desktop Client of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-desktop)

[Android Client of Oxygen Toolbox](https://github.com/FatttSnake/oxygen-android)

# 快速开始

**1. 从 [Releases](https://github.com/FatttSnake/oxygen-ui/releases/latest) 页面下载最后打包的生产版本**

**2. 将文件 `oxygen-ui-*.tar.gz` 或 `oxygen-ui-*.zip` 上传到 Web 服务器并解压**

**3. 配置伪静态**

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
