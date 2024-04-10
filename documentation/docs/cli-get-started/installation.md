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
### Create an identifer
Run this command, and follow the instruction to create an identifier.
```bash
vckit did create
```
This example uses the did:key as provider, you can try with other providers.
![cli identifiler](/img/cli-create-identifier.png)
### Issue a VC
Run this command and follow the CLI instruction to issue a VC
```bash
vckit credential create
```
This is the expected result:

![cli issue vc](/img/cli-issue-credential.png)

