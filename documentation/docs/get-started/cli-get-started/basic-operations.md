---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---
# Basic Operations
:::info
Please note that this content is still under development
:::
## Start using the VCKit CLI
Create a new folder, open a terminal, and run this command to check if the VCKit CLI has been installed successfully.
```bash
vckit -v
```
It's expected to show the version of VCKit CLI.

Next, run this command to create an **`agent.yml`** file.

```bash
vckit config create 
```
## Create an identifer
Run this command, and follow the instruction to create an identifier.
```bash
vckit did create
```
This example uses the did:key as provider, you can try with other providers.
![cli identifiler](/img/cli-create-identifier.png)
## Issue a VC
Run this command and follow the CLI instruction to issue a VC
```bash
vckit credential create
```
This is the expected result:

![cli issue vc](/img/cli-issue-credential.png)
