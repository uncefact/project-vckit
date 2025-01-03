---
sidebar_position: 1
slug: /vckit-plugins
---

import Disclaimer from './../\_disclaimer.mdx';

# Introduction

<Disclaimer />

VCkit is built on top of Veramo - a Javascript agent framework - to provide a structured and modular approach to building decentralized identity and credentialing solutions.
## Plugins system

Functionality in VCkit is added to the agent via the plugin system. The diagram below describes what a VCkit agent looks like. Basically, it's a set of Veramo plugins that are configured to work together with plugins that are made by VCkit itself to provide a complete VC issuance and verification capability.

![VCkit diagram](/img/vckit-diagram.svg)

To get more understanding of each plugin with operational walkthroughs and examples, keep reading.