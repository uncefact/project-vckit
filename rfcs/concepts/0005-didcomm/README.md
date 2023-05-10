# Aries RFC 0005: DID Communication

- Authors: [Daniel Hardman](daniel.hardman@gmail.com)
- Status: [ACCEPTED](/README.md#accepted)
- Since: 2019-11-21
- Status Note: Mature as concept, with multiple implementations.
- Supersedes: [Indy PR #98](https://github.com/hyperledger/indy-hipe/pull/98)
- Start Date: 2018-01-05 (approx, backdated)
- Tags: [concept](/tags.md#concept)

## Summary

Explain the basics of __DID communication__ (__DIDComm__) at a
high level, and link to other RFCs to promote deeper exploration.

>NOTE: The version of DIDComm collectively defined in Aries RFCs is known by the label "DIDComm V1." A [newer version of DIDComm](https://identity.foundation/didcomm-messaging/spec/) ("DIDComm V2") is now being [incubated](https://github.com/decentralized-identity/didcomm-messaging) at DIF. Many concepts are the same between the two versions, but there are some differences in the details. For information about detecting V1 versus V2, see [Detecting DIDComm Versions](../../features/0044-didcomm-file-and-mime-types/README.md#detecting-didcomm-versions).

## Motivation

The DID communication between [agents](../0004-agents/README.md) and [agent-like things](../0004-agents/README.md#the-agent-ness-continuum) is a rich subject with a lot of tribal
knowledge. Newcomers to the decentralized identity
ecosystem tend to bring mental models that are subtly divergent from
its paradigm. When they encounter dissonance, DIDComm becomes mysterious.
We need a standard high-level reference.

## Tutorial

>This discussion assumes that you have a reasonable grasp on topics like
[self-sovereign identity](https://medium.com/evernym/the-three-models-of-digital-identity-relationships-ca0727cb5186),
[DIDs and DID docs](https://w3c-ccg.github.io/did-spec/), and [agents](
https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0004-agents/README.md). If you find yourself
lost, please review that material for background and starting assumptions.

Agent-like things have to interact with one another to get work done. How they
talk in general is DIDComm, the subject of this RFC. The specific interactions enabled by
DIDComm--connecting and maintaining relationships, issuing credentials,
providing proof, etc.--are called __protocols__; they are described [elsewhere](
https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0003-protocols/README.md).

### Rough Overview

A typical DIDComm interaction works like this:

<blockquote>
Imagine Alice wants to negotiate with Bob to sell something online, and
that DIDComm, not direct human communication, is involved. This means Alice's
agent and Bob's agent are going to exchange a series of messages.

Alice may just press a button and be unaware of details, but underneath,
her agent begins by preparing a plaintext JSON message about the proposed sale.
(The particulars are irrelevant here, but would be described
in the spec for a "sell something" protocol.) It then looks up Bob's DID Doc
to access two key pieces of information:

* An endpoint (web, email, etc) where messages can be delivered to Bob.
* The public key that Bob's agent is using in the Alice:Bob relationship.

Now Alice's agent uses Bob's public key to encrypt the plaintext so that
only Bob's agent can read it, adding authentication with its own private key.
The agent arranges delivery to Bob. This "arranging" can involve various
hops and intermediaries. It can be complex.

Bob's agent eventually receives and decrypts the message, authenticating its
origin as Alice using her public key. It prepares its response and routes it
back using a reciprocal process (plaintext -> lookup endpoint and public key
for Alice -> encrypt with authentication -> arrange delivery).
</blockquote>

That's it.

Well, mostly. The description is pretty good, if you squint, but it does
not fit all DIDComm interactions:

* DIDComm doesn't always involve turn-taking and request-response.
* DIDComm interactions can involve more than 2 parties, and the parties are
not always individuals.
* DIDComm may include formats other than JSON.

Before we provide more details, let's explore what drives the design of
DIDComm.

### Goals and Ramifications

The DIDComm design attempts to be:

1. __Secure__
2. __Private__
3. __Interoperable__
4. __Transport-agnostic__
5. __Extensible__

As a list of buzz words, this may elicit nods rather than surprise.
However, several items have deep ramifications.

Taken together, _Secure_ and _Private_ require that the protocol be
decentralized and maximally opaque to the surveillance economy.

_Interoperable_ means that DIDComm should work across programming languages,
blockchains, vendors, OS/platforms, networks, legal jurisdictions, geos,
cryptographies, and hardware--as well as across time. That's quite a list. It means that
DIDComm intends something more than just compatibility within Aries; it aims to be
a future-proof _lingua franca_ of all self-sovereign interactions.

_Transport-agnostic_ means that it should be possible to use DIDComm over
HTTP(S) 1.x and 2.0, WebSockets, IRC, Bluetooth, AMQP, NFC, Signal,
email, push notifications to mobile devices, Ham radio, multicast,
snail mail, carrier pigeon, and more.

All software design involves tradeoffs. These goals, prioritized as shown,
lead down an interesting path.

#### Message-Based, Asynchronous, and Simplex

The dominant paradigm in mobile and web development today is duplex
request-response. You call an API with certain inputs, and you get
back a response with certain outputs over the same channel, shortly
thereafter. This is the world of [OpenAPI (Swagger)](
https://swagger.io/docs/specification/about/), and it has many virtues.

Unfortunately, many agents are not good analogs to web servers. They may
be mobile devices that turn off at unpredictable intervals and that lack
a stable connection to the network. They may need to work peer-to-peer,
when the internet is not available. They may need to interact in time frames
of hours or days, not with 30-second timeouts. They may not listen over the
same channel that they use to talk.

Because of this, the fundamental paradigm for DIDComm is message-based,
asynchronous, and simplex. Agent X sends a message over channel A.
Sometime later, it may receive a response from Agent Y over channel B.
This is much closer to an email paradigm than a web paradigm.

On top of this foundation, it is possible to build elegant, synchronous
request-response interactions. All of us have interacted with a friend
who's emailing or texting us in near-realtime. However, interoperability
begins with a least-common-denominator assumption that's simpler.

#### Message-Level Security, Reciprocal Authentication

The security and privacy goals, and the asynchronous+simplex design
decision, break familiar web assumptions in another way. Servers are
commonly run by institutions, and we authenticate them with certificates.
People and things are usually authenticated to servers by some sort of
login process quite different from certificates, and this authentication
is cached in a session object that expires. Furthermore, web security
is provided at the transport level (TLS); it is not an independent
attribute of the messages themselves.

In a partially disconnected world where a comm channel is not assumed to
support duplex request-response, and where the security can't be ignored
as a transport problem, traditional TLS, login, and expiring sessions
are impractical. Furthermore, centralized servers and certificate
authorities perpetuate a power and UX imbalance between servers and clients
that doesn't fit with the peer-oriented DIDComm.

DIDComm uses public key cryptography, not certificates from some parties and
passwords from others. Its security guarantees are independent of the
transport over which it flows. It is sessionless (though sessions can
_easily_ be built atop it). When authentication is required, all
parties do it the same way.

## Reference

The following RFCs profide additional information:
* [0021: DIDComm Message Anatomy](../0021-didcomm-message-anatomy/README.md)
* [0020: Message Types](../0020-message-types/README.md)
* [0011: Decorators](../0011-decorators/README.md)
* [0008: Message ID and Threading](../0008-message-id-and-threading/README.md)
* [0019: Encryption Envelope](../../features/0019-encryption-envelope/README.md)
* [0025: Agent Transports](../../features/0025-didcomm-transports/README.md)


## Implementations

The following lists the implementations (if any) of this RFC. Please do a pull request to add your implementation. If the implementation is open source, include a link to the repo or to the implementation within the repo. Please be consistent in the "Name" field so that a mechanical processing of the RFCs can generate a list of all RFCs supported by an Aries implementation.

Name / Link | Implementation Notes
--- | ---
[Indy Cloud Agent - Python](https://github.com/hyperledger/indy-agent/python) | Reference agent implementation contributed by Sovrin Foundation and Community
[Aries Framework - .NET](https://github.com/hyperledger/aries-framework-dotnet) | .NET framework for building agents of all types
[Streetcred.id](https://streetcred.id/) | Commercial mobile and web app built using Aries Framework - .NET
[Aries Cloud Agent - Python](https://github.com/hyperledger/aries-cloudagent-python) | Contributed by the government of British Columbia.
[Aries Static Agent - Python](https://github.com/hyperledger/aries-staticagent-python) | Useful for cron jobs and other simple, automated use cases.
[Aries Framework - Go](https://github.com/hyperledger/aries-framework-go) | For building agents, hubs and other DIDComm features in GoLang.
[Connect.Me](https://www.evernym.com/blog/connect-me-sovrin-digital-wallet/) | Free mobile app from Evernym. Installed via app store on iOS and Android. 
[Verity](https://www.evernym.com/products/) | Commercially licensed enterprise agent, SaaS or on-prem.
[Aries Protocol Test Suite](https://github.com/hyperledger/aries-protocol-test-suite) | 
[Pico Labs](http://picolabs.io/) | [Pico Agents](https://github.com/Picolab/G2S) protocols: connections, trust_ping, basicmessage, routing
 
