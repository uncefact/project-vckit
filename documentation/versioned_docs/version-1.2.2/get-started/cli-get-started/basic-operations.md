---
sidebar_label: 'Basic Operations'
sidebar_position: 3
---

import Disclaimer from './../../\_disclaimer.mdx';

# Basic Operations

<Disclaimer />

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
