---
sidebar_label: 'Installation'
sidebar_position: 1
---
# Installation
## Prerequisites
* You need to have Node v14 or later installed.
* This guide uses npm as the package manager.
* Clone [VCKit](https://github.com/uncefact/project-vckit.git) repository

## Instal VCKit CLI
After cloned VCKit repository, go to `project-vckit/packages/cli` and run this command.
```bash
npm install -g .
```
This command will install VCKit CLI globally.

## Start using the CLI

Create a new folder, open a terminal, and run this command to check if the VCKit CLI has been installed successfully.
```bash
vckit -v
```
It's expected to show the version of VCKit CLI.

Next, run this command to create an **`agent.yml`** file.

```bash
vckit config create 
```
