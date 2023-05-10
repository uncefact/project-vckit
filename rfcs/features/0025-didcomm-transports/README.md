# Aries RFC 0025: DIDComm Transports

- Authors: [Sam Curren](sam@sovrin.org)
- Status: [ACCEPTED](/README.md#accepted)
- Since: 2019-12-05
- Status Note:  
- Supersedes: [INDY PR 94](https://github.com/hyperledger/indy-hipe/pull/94)
- Start Date: 2019-02-26
- Tags: [feature](/tags.md#feature)

## Summary

This RFC Details how different transports are to be used for Agent Messaging.

## Motivation

Agent Messaging is designed to be transport independent, including message encryption and agent message format. Each transport does have unique features, and we need to standardize how the transport features are (or are not) applied.

## Reference

Standardized transport methods are detailed here.

### HTTP(S)

HTTP(S) is the first, and most used transport for DID Communication that has received heavy attention. 

While it is recognized that all DIDComm messages are secured through strong encryption, making HTTPS somewhat redundant, it will likely cause issues with mobile clients because venders (Apple and Google) are limiting application access to the HTTP protocol. For example, on iOS 9 or above where [ATS])(https://developer.apple.com/documentation/bundleresources/information_property_list/nsapptransportsecurity) is in effect, any URLs using HTTP must have an exception hard coded in the application prior to uploading to the iTunes Store. This makes DIDComm unreliable as the agent initiating the the request provides an endpoint for communication that the mobile client must use. If the agent provides a URL using the HTTP protocol it will likely be unusable due to low level operating system limitations.

As a best practice, when HTTP is used in situations where a mobile client (iOS or Android) may be involved it is highly recommended to use the HTTPS protocol, specifically TLS 1.2 or above. 

Other important notes on the subject of using HTTP(S) include:

- Messages are transported via HTTP POST.
- The MIME Type for the POST request is `application/didcomm-envelope-enc`; see [RFC 0044: DIDComm File and MIME Types](../0044-didcomm-file-and-mime-types/README.md) for more details.
- A received message should be responded to with a 202 Accepted status code. This indicates that the request was received, but not necessarily processed. Accepting a 200 OK status code is allowed.
- POST requests are considered transmit only by default. No agent messages will be returned in the response. This behavior may be modified with additional signaling.
- Using HTTPS with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.

#### Known Implementations

[Aries Cloud Agent - Python](https://github.com/hyperledger/aries-cloudagent-python)
[Aries Framework - .NET](https://github.com/hyperledger/aries-framework-dotnet)

### Websocket

Websockets are an efficient way to transmit multiple messages without the overhead of individual requests.

- Each message is transmitted individually in an Encryption Envelope.
- The trust of each message comes from the Encryption Envelope, not the socket connection itself.
- Websockets are considered transmit only by default. Messages will only flow from the agent that opened the socket. This behavior may be modified with additional signaling.
- Using Secure Websockets (wss://) with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.

#### Known Implementations

[Aries Cloud Agent - Python](https://github.com/hyperledger/aries-cloudagent-python)
[Aries Framework - .NET](https://github.com/hyperledger/aries-framework-dotnet)

### XMPP

XMPP is an effective transport for incoming DID-Communication messages directly to mobile agents, like smartphones.

- Incoming DID-Communication messages will arrive, even if the mobile agent is behind a firewall and network-address-translation (NAT).
- Incoming DID-Communication messages continue to arrive, even when the IP address of the mobile agent changes (switching between, 3G, 4G, Wifi, roaming, ...).
- Independent of cloud agents and routing agents, as messages arrive directly at the mobile agent.
- Well suited for direct consumer-to-consumer SSI transactions, from one mobile agent directly to another mobile agent without any DID-Communication intermediaries.
- Simple encapsulation of DIDcom messages, getting trust from the DIDcom Encryption Envelope.
- Specified in [Aries RFC 0024: DIDCom-over-XMPP](https://github.com/hyperledger/aries-rfcs/tree/main/features/0024-didcomm-over-xmpp)

#### Known Implementations

XMPP is implemented in the [Openfire Server](https://www.igniterealtime.org/projects/openfire/) open source project. Integration with DID Communication agents is work-in-progress.

### Other Transports

Other transports may be used for Agent messaging. As they are developed, this RFC should be updated with appropriate standards for the transport method. A PR should be raised against this doc to facilitate discussion of the proposed additions and/or updates. New transports should highlight the common elements of the transport (such as an HTTP response code for the HTTP transport) and how they should be applied.

### Message Routing

The transports described here are used between two agents. In the case of [message routing](../../concepts/0094-cross-domain-messaging/README.md), a message will travel across multiple agent connections. Each intermediate agent (see [Mediators and Relays](../../concepts/0046-mediators-and-relays/README.md)) may use a different transport. These transport details are not made known to the sender, who only knows the keys of Mediators and the first endpoint of the route.

### Message Context

The transport used from a previous agent can be recorded in the message trust context. This is particularly true of controlled network environments, where the transport may have additional security considerations not applicable on the public internet. The transport recorded in the message context only records the last transport used, and not any previous routing steps as described in the Message Routing section of this document.

### Transport Testing

Transports which operate on IP based networks can be tested by an Agent Test Suite through a transport adapter. Some transports may be more difficult to test in a general sense, and may need specialized testing frameworks. An agent with a transport not yet supported by any testing suites may have non-transport testing performed by use of a routing agent.

## Drawbacks

Setting transport standards may prevent some uses of each transport method.

## Rationale and alternatives

- Without standards for each transport, the assumptions of each agent may not align and prevent communication before each message can be unpacked and evaluated.

## Prior art

Several agent implementations already exist that follow similar conventions.

## Unresolved questions

## Implementations

The following lists the implementations (if any) of this RFC. Please do a pull request to add your implementation. If the implementation is open source, include a link to the repo or to the implementation within the repo. Please be consistent in the "Name" field so that a mechanical processing of the RFCs can generate a list of all RFCs supported by an Aries implementation.

Name / Link | Implementation Notes
--- | ---
 |  |
