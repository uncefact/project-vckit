# Aries RFC 0434: Out-of-Band Protocol 1.1

- Authors: [Ryan West](ryan.west@sovrin.org), [Daniel Bluhm](daniel.bluhm@sovrin.org), Matthew Hailstone, [Stephen Curran](swcurran@cloudcompass.ca), [Sam Curren](sam@sovrin.org), [George Aristy](george.aristy@securekey.com)
- Status: [ACCEPTED](/README.md#accepted)
- Since: 2020-03-01
- Status Note: This RFC extracts the `invitation` messages from the [DID Exchange](../../features/0023-did-exchange/README.md) protocol (and perhaps [Connection](../../features/0160-connection-protocol/README.md)), and replaces the combined `present_proof/1.0/request` combined with the `~service` decorator to define an ephemeral (connection-less) challenge.
- Supersedes: Invitation Message in [0160-Connections](https://github.com/hyperledger/aries-rfcs/blob/9b0aaa39df7e8bd434126c4b33c097aae78d65bf/features/0160-connection-protocol/README.md#0-invitation-to-connect) and Invitation Message in [0023-DID-Exchange](https://github.com/hyperledger/aries-rfcs/blob/9b0aaa39df7e8bd434126c4b33c097aae78d65bf/features/0023-did-exchange/README.md#0-invitation-to-exchange).
- Start Date: 2020-03-01
- Tags: [feature](/tags.md#feature), [protocol](/tags.md#protocol), [test-anomaly](/tags.md#test-anomaly)
- URI: `https://didcomm.org/out-of-band/%VER`

## Summary

The Out-of-band protocol is used when you wish to engage with another agent and you don't have a DIDComm connection to use for the interaction.

## Motivation

The use of the `invitation` in the [Connection](../../features/0160-connection-protocol/README.md) and [DID Exchange](../../features/0023-did-exchange/README.md) protocols has been relatively successful, but has some shortcomings, as follows.

### Connection Reuse

A common pattern we have seen in the early days of Aries agents is a user with a browser getting to a point where a connection is needed between the website's (enterprise) agent and the user's mobile agent. A QR invitation is displayed, scanned and a protocol is executed to establish a connection. Life is good!

However, with the current invitation processes, when the same user returns to the same page, the same process is executed (QR code, scan, etc.) and a new connection is created between the two agents. There is no way for the user's agent to say "Hey, I've already got a connection with you. Let's use that one!"

We need the ability to reuse a connection.

### Connection Establishment Versioning

In the existing Connections and DID Exchange `invitation` handling, the _inviter_ dictates what connection establishment protocol all _invitee_'s will use. A more sustainable approach is for the _inviter_ to offer the _invitee_ a list of supported protocols and allow the _invitee_ to use one that it supports.

### Handling of all Out-of-Band Messages

We currently have two sets of out-of-band messages that cannot be delivered via DIDComm because there is no channel. We'd like to align those messages into a single "out-of-band" protocol so that their handling can be harmonized inside an agent, and a common QR code handling mechanism can be used.

### URLs and QR Code Handling

We'd like to have the specification of QR handling harmonized into a single RFC (this one).

## Tutorial

### Key Concepts

The Out-of-band protocol is used when an agent doesn't know if it has a connection with another agent. This could be because you are trying to establish a new connection with that agent, you have connections but don't know who the other party is, or if you want to have a connection-less interaction. Since there is no DIDComm connection to use for the messages of this protocol, the messages are plaintext and sent out-of-band, such as via a QR code, in an email message or any other available channel. Since the delivery of out-of-band messages will often be via QR codes, this RFC also covers the use of QR codes.

Two well known use cases for using an out-of-band protocol are:

- A user on a web browser wants to execute a protocol (for example, to issue a verifiable credential) between the website operator's agent and a user's agent. To enable the execution of the protocol, the two agents must first have a connection. An out-of-band message is used to trigger the creation of a new, or the reuse an existing, connection.
- A website operator wants to request something from a user on their site where there is no (known) connection with the user's agent, and there is no need to create a connection.

In both cases, there is only a single out-of-band protocol message sent. The message responding to the out-of-band message is a DIDComm message from an appropriate protocol.

Note that the website-to-agent model is not the only such interaction enabled by the out-of-band protocol, and a QR code is not the only delivery mechanism for out-of-band messages. However, they are useful as examples of the purpose of the protocol.

### Roles

The out-of-band protocol has two roles: __sender__ and __receiver__.

#### sender

The agent that generates the out-of-band message and makes it available to the other party.

#### receiver

The agent that receives the out-of-band message and decides how to respond. There is no out-of-band protocol message with which the receiver will respond. Rather, if they respond, they will use a message from another protocol that the sender understands.

### States

The state machines for the sender and receiver are a bit odd for the out-of-band protocol because it consists of a single message that kicks off a co-protocol and ends when evidence of the co-protocol's launch is received, in the form of some response. In the following state machine diagrams we generically describe the response message from the *receiver* as being a DIDComm message.

The *sender* state machine is as follows:

[![sender state machine google doc](state-machine-sender.png)](https://docs.google.com/spreadsheets/d/1o1szGCMx6FzrxfAKV76IEYmeKRJqvV3gd1r3Qfv1Q9o/edit#gid=1176419697)

Note the "optional" reference under the second event in the `await-response` state. That is to indicate that an out-of-band message might be a single use message with a transition to done, or reusable message (received by many receivers) with a transition back to `await-response`.

The *receiver* state machine is as follows:

[![receiver state machine google doc](state-machine-receiver.png)](https://docs.google.com/spreadsheets/d/1o1szGCMx6FzrxfAKV76IEYmeKRJqvV3gd1r3Qfv1Q9o/edit#gid=10874521)

Worth noting is the first event of the `done` state, where the receiver may receive the message multiple times. This represents, for example, an agent returning to the same website and being greeted with instances of the same QR code each time.

### Messages

The out-of-band protocol a single message that is sent by the *sender*.

#### Invitation: `https://didcomm.org/out-of-band/%VER/invitation`

```jsonc
{
  "@type": "https://didcomm.org/out-of-band/%VER/invitation",
  "@id": "<id used for context as pthid>",
  "label": "Faber College",
  "goal_code": "issue-vc",
  "goal": "To issue a Faber College Graduate credential",
  "accept": [
    "didcomm/aip2;env=rfc587",
    "didcomm/aip2;env=rfc19"
  ],
  "handshake_protocols": [
    "https://didcomm.org/didexchange/1.0",
    "https://didcomm.org/connections/1.0"
  ],
  "requests~attach": [
    {
      "@id": "request-0",
      "mime-type": "application/json",
      "data": {
        "json": "<json of protocol message>"
      }
    }
  ],
  "services": ["did:sov:LjgpST2rjsoxYegQDRm7EL"]
}
```

The items in the message are:

- `@type` - the DIDComm message type
- `@id` - the unique ID of the message. The ID should be used as the **parent** thread ID (`pthid`) for the response message, rather than the more common thread ID (`thid`) of the response message. This enables multiple uses of a single out-of-band message.
- `label` - [optional] a self-attested string that the receiver may want to display to the user, likely about who sent the out-of-band message.
- `goal_code` - [optional] a self-attested code the receiver may want to display to the user or use in automatically deciding what to do with the out-of-band message.
- `goal` - [optional] a self-attested string that the receiver may want to display to the user about the context-specific goal of the out-of-band message.
- `accept` - [optional] an array of media (aka mime) types in the order of preference of the sender that the receiver can use in responding to the message.
If `accept` is not specified, the receiver uses its preferred choice to respond to the message.
[RFC 0044](../0044-didcomm-file-and-mime-types/README.md) provides a general discussion of media types.
- `handshake_protocols` - [optional] an array of protocols in the order of preference of the sender that the receiver can use in responding to the message in order to create or reuse a connection with the sender. These are not arbitrary protocols but rather protocols that result in the establishment of a connection. One or both of `handshake_protocols` and `requests~attach` **MUST** be included in the message.
- `requests~attach` - [optional] an attachment decorator containing an array of request messages in order of preference that the receiver can using in responding to the message. One or both of `handshake_protocols` and `requests~attach` **MUST** be included in the message.
  - While the JSON form of the attachment is used in the example above, the sender could choose to use the base64 form.
- `services` - an array of union types that the receiver uses when responding to the message. Each item is either a DIDComm `service` object (as per [RFC0067](../0067-didcomm-diddoc-conventions/README.md#service-conventions)) or a DID (as per [Decentralized Identifiers v1.0](https://w3c.github.io/did-core/#did-syntax)). Additional details below.

If only the `handshake_protocols` item is included, the initial interaction will complete with the establishment (or reuse) of the connection. Either side may then use that connection for any purpose. A common use case (but not required) would be for the sender to initiate another protocol after the connection is established to accomplish some shared goal.

If only the `requests~attach` item is included, no new connection is expected to be created, although one could be used if the receiver knows such a connection already exists. The receiver responds to one of the messages in the `requests~attach` array. The `requests~attach` item might include the first message of a protocol from the sender, or might be a [please-play-the-role](#) message requesting the receiver initiate a protocol. If the protocol requires a further response from the sender to the receiver, the receiver must include a [`~service` decorator](../0056-service-decorator/README.md) for the sender to use in responding.

If both the `handshake_protocols` and `requests~attach` items are included in the message, the receiver should first establish a connection and then respond (using that connection) to one of the messages in the `requests~attach` message. If a connection already exists between the parties, the receiver may respond immediately to the `request-attach` message using the established connection.

### Reuse Messages

While the _receiver_ is expected to respond with an initiating message from a `handshake_protocols` or `requests~attach` item using an offered service, the receiver may be able to respond by reusing an existing connection. Specifically, if a connection they have was created from an out-of-band `invitation` from the same `services` DID of a new `invitation` message, the connection **MAY** be reused. The receiver may choose to not reuse the existing connection for privacy purposes and repeat a handshake protocol to receive a redundant connection. 

If a message has a service block instead of a DID in the `services` list, you may enable reuse by encoding the key and endpoint of the service block in a [Peer DID numalgo 2](https://identity.foundation/peer-did-method-spec/#generation-method) and using that DID instead of a service block.

If the receiver desires to reuse the existing connection and a `requests~attach` item is included in the message, the receiver **SHOULD** respond to one of the attached messages using the existing connection.

If the receiver desires to reuse the existing connection and no `requests~attach` item is included in the message, the receiver **SHOULD** attempt to do so with the `reuse` and `reuse-accepted` messages. This will notify the _inviter_ that the existing connection should be used, along with the context that can be used for follow-on interactions.

While the `invitation` message is passed unencrypted and out-of-band, both the `handshake-reuse` and `handshake-reuse-accepted` messages **MUST** be encrypted and transmitted as normal DIDComm messages.

#### Reuse: `https://didcomm.org/out-of-band/%VER/handshake-reuse`

```jsonc
{
  "@type": "https://didcomm.org/out-of-band/%VER/handshake-reuse",
  "@id": "<id>",
  "~thread": {
    "thid": "<same as @id>",
    "pthid": "<The @id of the Out-of-Band invitation>"
  }
}
```

The items in the message are:

- `@type` - the DIDComm message type
- `@id` - the unique ID of the message. 
- `pthid` - the @id of the invitation message. This provides the context link for the _inviter_ to prompt additional protocol interactions.

Sending or receiving this message does not change the state of the existing connection.

When the _inviter_ receives the `handshake-reuse` message, they **MUST** respond with a `handshake-reuse-accepted` message to notify that _invitee_ that the request to reuse the existing connection is successful.

#### Reuse Accepted:  `https://didcomm.org/out-of-band/%VER/handshake-reuse-accepted`

```json
{
  "@type": "https://didcomm.org/out-of-band/%VER/handshake-reuse-accepted",
  "@id": "<id>",
  "~thread": {
    "thid": "<The Message @id of the reuse message>",
    "pthid": "<The @id of the Out-of-Band invitation>"
  }
}
```

The items in the message are:

- `@type` - the DIDComm message type
- `@id` - the unique ID of the message. 
- `pthid` - the @id of the invitation message. This and the `thid` provides context for the _invitee_ to know the reuse attempt succeeded.

If this message is not received by the _invitee_, they should use the regular process. This message is a mechanism by which the _invitee_ can detect a situation where the _inviter_ no longer has a record of the connection and is unable to decrypt and process the `handshake-reuse` message.

After sending this message, the _inviter_ may continue any desired protocol interactions based on the context matched by the `pthid` present in the `handshake-reuse` message.

### Responses

The following table summarizes the different forms of the out-of-band `invitation` message depending on the presence (or not) of the `handshake_protocols` item, the `requests~attach` item and whether or not a connection between the agents already exists.

`handshake_protocols` Present? | `requests~attach` Present? | Existing connection? | Receiver action(s)
--- | --- | --- | ---
No | No | No | Impossible
Yes | No | No | Uses the first supported protocol from `handshake_protocols` to make a new connection using the first supported `services` entry.
No | Yes | No | Send a response to the first supported request message using the first supported `services` entry. Include a `~service` decorator if the sender is expected to respond.
No | No | Yes | Impossible
Yes | Yes | No | Use the first supported protocol from `handshake_protocols` to make a new connection using the first supported `services` entry, and then send a response message to the first supported attachment message using the new connection.
Yes | No | Yes | Send a `handshake-reuse` message. 
No | Yes | Yes | Send a response message to the first supported request message using the existing connection.
Yes | Yes | Yes | Send a response message to the first supported request message using the existing connection.

Both the `goal_code` and `goal` fields **SHOULD** be used with the [localization service decorator](../0043-l10n/README.md). The two fields are to enable both human and machine handling of the out-of-band message. `goal_code` is to specify a generic, protocol level outcome for sending the out-of-band message (e.g. issue verifiable credential, request proof, etc.) that is suitable for machine handling and possibly human display, while `goal` provides context specific guidance, targeting mainly a person controlling the receiver's agent. The list of `goal_code` values is provided in the [Message Catalog](#message-catalog) section of this RFC.

#### The `services` Item

As mentioned in the description above, the `services` item array is intended to be analogous to the `service` block of a DIDDoc. When not reusing an existing connection, the receiver scans the array and selects (according to the rules described below) a service entry to use for the response to the out-of-band message.

There are two forms of entries in the `services` item array:

- a DID that is resolved to retrieve it's DIDDoc service block, and
- an inline service block.

The following is an example of a two entry array, one of each form:

```jsonc
{
  "@type": "https://didcomm.org/out-of-band/%VER/invitation",
  "@id": "<id used for context as pthid>",
  "label": "Faber College",
  "handshake_protocols": ["https://didcomm.org/didexchange/1.0"],
  "services": [
    {
      "id": "#inline",
      "type": "did-communication",
      "recipientKeys": ["did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH"],
      "routingKeys": [],
      "serviceEndpoint": "https://example.com:5000"
    },
    "did:sov:LjgpST2rjsoxYegQDRm7EL"
  ]
}
```

The processing rules for the `services` block are:

- Use only entries where the `type` is equal to `did-communication`.
  - Entries without a `type` are assumed to be `did-communication`.
- The sender **MUST** put the array into their order of preference, and, as such, the receiver **SHOULD** prefer the entries in order.

The attributes in the inline form parallel the attributes of a DID Document for increased meaning. The `recipientKeys` and `routingKeys` within the inline block decorator **MUST** be [`did:key` references](https://digitalbazaar.github.io/did-method-key/).

As defined in the [DIDComm Cross Domain Messaging RFC](https://github.com/hyperledger/aries-rfcs/tree/main/concepts/0094-cross-domain-messaging), if `routingKeys` is present and non-empty, additional forwarding wrapping are necessary in the response message.

When considering routing and options for out-of-band messages, keep in mind that the more detail in the message, the longer the URL will be and (if used) the more dense (and harder to scan) the QR code will be.

##### Service Endpoint

The service endpoint used to transmit the response is either present in the out-of-band message or available in the DID Document of a presented DID. If the endpoint is itself a DID, the `serviceEndpoint` in the DIDDoc of the resolved DID **MUST** be a URI, and the `recipientKeys` **MUST** contain a single key. That key is appended to the end of the list of `routingKeys` for processing. For more information about message forwarding and routing, see [RFC 0094 Cross Domain Messaging](https://github.com/hyperledger/aries-rfcs/tree/main/concepts/0094-cross-domain-messaging).

### Adoption Messages

The `problem_report` message **MAY** be adopted by the out-of-band protocol if the agent wants to respond with problem reports to invalid messages, such as attempting to reuse a single-use invitation.

### Constraints

An existing connection can only be reused based on a DID in the `services` list in an out-of-band message.

## Reference

### Messages Reference

The full description of the message in this protocol can be found in the [Tutorial](#messages) section of this RFC.

### Localization

The `goal_code` and `goal` fields **SHOULD** have localization applied. See the purpose of those fields in the [message type definitions](#messages) section and the [message catalog](#message-catalog) section (immediately below).

### Message Catalog

#### `goal_code`

The following values are defined for the `goal_code` field:

| Code (cd)       | English (en)                                        |
| --------------- | ----------------------------------------------------|
| issue-vc        | To issue a credential                               |
| request-proof   | To request a proof                                  |
| create-account  | To create an account with a service                 |
| p2p-messaging   | To establish a peer-to-peer messaging relationship  |

#### `goal`

The `goal` localization values are use case specific and localization is left to the agent implementor to enable using the techniques defined in the [~l10n RFC](../0043-l10n/README.md).

### Roles Reference

The roles are defined in the [Tutorial](#roles) section of this RFC.

### States Reference

#### initial

No out-of-band messages have been sent.

#### await-response

The __sender__ has shared an out-of-band message with the intended _receiver_(s), and the _sender_ has not yet received all of the responses. For a single-use out-of-band message, there will be only one response; for a multi-use out-of-band message, there is no defined limit on the number of responses.

#### prepare-response

The _receiver_ has received the out-of-band message and is preparing a response. The response will not be an out-of-band protocol message, but a message from another protocol chosen based on the contents of the out-of-band message.

#### done

The out-of-band protocol has been completed. Note that if the out-of-band message was intended to be available to many receivers (a multiple use message), the _sender_ returns to the _await-response_ state rather than going to the _done_ state.

### Errors

There is an optional courtesy error message stemming from an out-of-band message that the _sender_ could provide if they have sufficient recipient information. If the out-of-band message is a single use message **and** the sender receives multiple responses **and** each receiver's response includes a way for the sender to respond with a DIDComm message, all but the first **MAY** be answered with a `problem_report`.

#### Error Message Example

```jsonc
{
  "@type": "https://didcomm.org/out-of-band/%VER/problem_report",
  "@id": "5678876542345",
  "~thread": { "pthid": "<@id of the OutofBand message>" },
  "description": {
    "en": "The invitation has expired.",
    "code": "expired-invitation"
  },
  "impact": "thread"
}
```

See the [problem-report](https://github.com/hyperledger/aries-rfcs/tree/main/features/0035-report-problem) protocol for details on the items in the example.

### Flow Overview

In an out-of-band message the _sender_ gives information to the _receiver_ about the kind of DIDComm protocol response messages it can handle and how to deliver the response. The receiver uses that information to determine what DIDComm protocol/message to use in responding to the sender, and (from the service item or an existing connection) how to deliver the response to the sender.

The handling of the response is specified by the protocol used.

> To Do: Make sure that the following remains in the DID Exchange/Connections RFCs
>
> Any Published DID that expresses support for DIDComm by defining a  [`service`](https://w3c.github.io/did-core/#service-endpoints) that follows the [DIDComm conventions](../0067-didcomm-diddoc-conventions/README.md#service-conventions) serves as an implicit invitation. If an _invitee_ wishes to connect to any Published DID, they need not wait for an out-of-band invitation message. Rather, they can designate their own label and initiate the appropriate protocol (e.g. [0160-Connections](https://github.com/hyperledger/aries-rfcs/blob/9b0aaa39df7e8bd434126c4b33c097aae78d65bf/features/0160-connection-protocol/README.md#0-invitation-to-connect) or [0023-DID-Exchange](https://github.com/hyperledger/aries-rfcs/blob/9b0aaa39df7e8bd434126c4b33c097aae78d65bf/features/0023-did-exchange/README.md#0-invitation-to-exchange)) for establishing a connection.

### Standard Out-of-Band Message Encoding

Using a standard out-of-band message encoding allows for easier interoperability between multiple projects and software platforms. Using a URL for that standard encoding provides a built in fallback flow for users who are unable to automatically process the message. Those new users will load the URL in a browser as a default behavior, and may be presented with instructions on how to install software capable of processing the message. Already onboarded users will be able to process the message without loading in a browser via mobile app URL capture, or via capability detection after being loaded in a browser.

The standard out-of-band message format is a URL with a **Base64Url** encoded json object as a query parameter.

Please note the difference between [Base64Url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) and [Base64](https://datatracker.ietf.org/doc/html/rfc4648#section-4) encoding.

The URL format is as follows, with some elements described below:

```text
https://<domain>/<path>?oob=<outofbandMessage>
```

`<domain>` and `<path>` should be kept as short as possible, and the full URL **SHOULD** return human readable instructions when loaded in a browser. This is intended to aid new users. The `oob` query parameter is required and is reserved to contain the out-of-band message string. Additional path elements or query parameters are allowed, and can be leveraged to provide coupons or other promise of payment for new users.

> To do: We need to rationalize this approach `https://` approach with the use of a special protocol (e.g. `didcomm://`) that will enable handling of the URL on mobile devices to automatically invoke an installed app on both Android and iOS. A user must be able to process the out-of-band message on the device of the agent (e.g. when the mobile device can't scan the QR code because it is on a web page on device).

The `<outofbandMessage>` is an agent plaintext message (not a DIDComm message) that has been Base64Url encoded such that the resulting string can be safely used in a URL.

```javascript
outofband_message = base64UrlEncode(<outofbandMessage>)
```

During Base64Url encoding, whitespace from the JSON string **SHOULD** be eliminated to keep the resulting out-of-band message string as short as possible.

#### Example Out-of-Band Message Encoding

Invitation:

```json
{
  "@type": "https://didcomm.org/out-of-band/1.0/invitation",
  "@id": "69212a3a-d068-4f9d-a2dd-4741bca89af3",
  "label": "Faber College",
  "goal_code": "issue-vc",
  "goal": "To issue a Faber College Graduate credential",
  "handshake_protocols": ["https://didcomm.org/didexchange/1.0", "https://didcomm.org/connections/1.0"],
  "services": ["did:sov:LjgpST2rjsoxYegQDRm7EL"]
}
```

Whitespace removed:

```jsonc
{"@type":"https://didcomm.org/out-of-band/1.0/invitation","@id":"69212a3a-d068-4f9d-a2dd-4741bca89af3","label":"Faber College","goal_code":"issue-vc","goal":"To issue a Faber College Graduate credential","handshake_protocols":["https://didcomm.org/didexchange/1.0","https://didcomm.org/connections/1.0"],"services":["did:sov:LjgpST2rjsoxYegQDRm7EL"]}
```

Base64Url encoded:

```text
eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4wL2ludml0YXRpb24iLCJAaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJsYWJlbCI6IkZhYmVyIENvbGxlZ2UiLCJnb2FsX2NvZGUiOiJpc3N1ZS12YyIsImdvYWwiOiJUbyBpc3N1ZSBhIEZhYmVyIENvbGxlZ2UgR3JhZHVhdGUgY3JlZGVudGlhbCIsImhhbmRzaGFrZV9wcm90b2NvbHMiOlsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjAiLCJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMCJdLCJzZXJ2aWNlcyI6WyJkaWQ6c292OkxqZ3BTVDJyanNveFllZ1FEUm03RUwiXX0=
```

Example URL with Base64Url encoded message:

```text
http://example.com/ssi?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4wL2ludml0YXRpb24iLCJAaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJsYWJlbCI6IkZhYmVyIENvbGxlZ2UiLCJnb2FsX2NvZGUiOiJpc3N1ZS12YyIsImdvYWwiOiJUbyBpc3N1ZSBhIEZhYmVyIENvbGxlZ2UgR3JhZHVhdGUgY3JlZGVudGlhbCIsImhhbmRzaGFrZV9wcm90b2NvbHMiOlsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjAiLCJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMCJdLCJzZXJ2aWNlcyI6WyJkaWQ6c292OkxqZ3BTVDJyanNveFllZ1FEUm03RUwiXX0=
```

Out-of-band message URLs can be transferred via any method that can send text, including an email, SMS, posting on a website, or QR Code.

Example URL encoded as a QR Code:

![Example QR Code](ExampleQRCode.png)

Example Email Message:

```email
To: alice@alum.faber.edu
From: studentrecords@faber.edu
Subject: Your request to connect and receive your graduate verifiable credential

Dear Alice,

To receive your Faber College graduation certificate, click here to [connect](http://example.com/ssi?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4wL2ludml0YXRpb24iLCJAaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJsYWJlbCI6IkZhYmVyIENvbGxlZ2UiLCJnb2FsX2NvZGUiOiJpc3N1ZS12YyIsImdvYWwiOiJUbyBpc3N1ZSBhIEZhYmVyIENvbGxlZ2UgR3JhZHVhdGUgY3JlZGVudGlhbCIsImhhbmRzaGFrZV9wcm90b2NvbHMiOlsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjAiLCJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMCJdLCJzZXJ2aWNlcyI6WyJkaWQ6c292OkxqZ3BTVDJyanNveFllZ1FEUm03RUwiXX0=) with us, or paste the following into your browser:

http://example.com/ssi?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4wL2ludml0YXRpb24iLCJAaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJsYWJlbCI6IkZhYmVyIENvbGxlZ2UiLCJnb2FsX2NvZGUiOiJpc3N1ZS12YyIsImdvYWwiOiJUbyBpc3N1ZSBhIEZhYmVyIENvbGxlZ2UgR3JhZHVhdGUgY3JlZGVudGlhbCIsImhhbmRzaGFrZV9wcm90b2NvbHMiOlsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjAiLCJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMCJdLCJzZXJ2aWNlcyI6WyJkaWQ6c292OkxqZ3BTVDJyanNveFllZ1FEUm03RUwiXX0=

If you don't have an identity agent for holding credentials, you will be given instructions on how you can get one.

Thanks,

Faber College
Knowledge is Good
```

#### URL Shortening

It seems inevitable that the length of some out-of-band message will be too long to produce a useable QR code. Techniques to avoid unusable QR codes have been presented above, including using attachment links for requests, minimizing the routing of the response and eliminating unnecessary whitespace in the JSON. However, at some point a _sender_ may need generate a very long URL. In that case, a DIDComm specific URL shortener redirection should be implemented by the sender as follows:

- The sender generates a unique URL for each shortened out-of-band message.
- The unique URL often includes a unique id component as part of the path or in a query parameter.
- The following URLs are valid examples:
  - `https://example.com/ssi?id=5f0e3ffb-3f92-4648-9868-0d6f8889e6f3`
  - `https://example.com/8E6nEcJ26TTE`
  - `https://example.com/sky/event/8DcnUW2h8m4jcfPdQ2uMN7/work-laptop-bag/s/u`
- On receipt of this form of message, the agent **MUST** perform an HTTP GET to retrieve the associated out-of-band message. The agent **SHOULD** include an `Accept` header requesting the `application/json` MIME type.
- The sender **MAY** include a `Content-Type` header specifying `application/json; charset=utf-8`, and in the case where the agent included an `Accept` header for the `application/json` MIME type, the sender **MUST** include the header. If so, the sender **MUST** return the invitation in JSON format in the response body with a `status_code` of `200`.
- The sender **MAY** respond with a `status_code` of `301` or `302` and include a `Location` header specifying the long out-of-band message URL.
  - This redirect option operates like many commercial URL shorteners. 
- The sender **MUST** invalidate the URL after message retrieval or after an expiration time to prevent unintended parties from retrieving a copy of the message.
  - A sender **MUST NOT** use a commercial URL shortener unless it supports invalidating the URL.

A usable QR code will always be able to be generated from the shortened form of the URL.


#### URL Shortening Caveats

Some HTTP libraries don't support stopping redirects from occuring on reception of a `301` or `302`, in this instance the redirect is automatically followed and will result in a response that **MAY** have a status of `200` and **MAY** contain a URL that can be processed as a normal `Out-of-Band` message.

If the agent performs a HTTP GET with the `Accept` header requesting `application/json` MIME type the response can either contain the message in `json` or result in a redirect, processing of the response should attempt to determine which response type is received and process the message accordingly.

#### Out-of-Band Message Publishing

The _sender_ will publish or transmit the out-of-band message URL in a manner available to the intended _receiver_. After publishing, the sender is in the _await-response_ state, will the receiver is in the _prepare-response_ state.

#### Out-of-Band Message Processing

If the receiver receives an `out-of-band` message in the form of a QR code, the receiver should attempt to decode the QR code to an out-of-band message URL for processing.

When the receiver receives the out-of-band message URL, there are two possible user flows, depending on whether the individual has an Aries agent. If the individual is new to Aries, they will likely load the URL in a browser. The resulting page **SHOULD** contain instructions on how to get started by installing an Aries agent. That install flow will transfer the out-of-band message to the newly installed software.

A user that already has those steps accomplished will have the URL received by software directly. That software will attempt to base64URL decode the string and can read the out-of-band message directly out of the `oob` query parameter, without loading the URL. If this process fails then the software should attempt the steps to [process a shortened URL](#url-shortening). 


> **NOTE**: In receiving the out-of-band message, the base64url decode implementation used **MUST**
> correctly decode padded and unpadded base64URL encoded data.

If the receiver wants to respond to the out-of-band message, they will use the information in the message to prepare the request, including:

- the `handshake_protocols` or `requests~attach` to determine the acceptable response messages, and
- the `services` block to determine how to get the response to the sender.

#### Correlating responses to Out-of-Band messages

The response to an out-of-band message **MUST** set its `~thread.pthid` equal to the `@id` property of the out-of-band message.

Example referencing an explicit invitation:

```jsonc
{
  "@id": "a46cdd0f-a2ca-4d12-afbf-2e78a6f1f3ef",
  "@type": "https://didcomm.org/didexchange/1.0/request",
  "~thread": { "pthid": "032fbd19-f6fd-48c5-9197-ba9a47040470" },
  "label": "Bob",
  "did": "B.did@B:A",
  "did_doc~attach": {
    "base64": "eyJ0eXAiOiJKV1Qi... (bytes omitted)",
    "jws": {
      "header": {
        "kid": "did:key:z6MkmjY8GnV5i9YTDtPETC2uUAW6ejw3nk5mXF5yci5ab7th"
      },
      "protected": "eyJhbGciOiJFZERTQSIsImlhdCI6MTU4Mzg4... (bytes omitted)",
      "signature": "3dZWsuru7QAVFUCtTd0s7uc1peYEijx4eyt5... (bytes omitted)"
    }
  }
}
```

#### Response Transmission

The response message from the receiver is encoded according to the standards of the DIDComm encryption envelope, using the `service` block present in (or resolved from) the out-of-band invitation.

##### Reusing Connections

If an out-of-band invitation has a DID in the `services` block, and the _receiver_ determines it has previously established a connection with that DID, the receiver **MAY** send its response on the established connection. See [Reuse Messages](#reuse-messages) for details.

##### Receiver Error Handling

If the _receiver_ is unable to process the out-of-band message, the receiver may respond with a [Problem Report](../0035-report-problem/README.md) identifying the problem using a DIDComm message. As with any response, the ~thread decorator of the `pthid` **MUST** be the `@id` of the out-of-band message. The problem report **MUST** be in the protocol of an expected response. An example of an error that might come up is that the receiver is not able to handle any of the proposed protocols in the out-of-band message. The receiver **MAY** include in the problem report a [`~service` decorator](../0056-service-decorator/README.md) that allows the sender to respond to the out-of-band message with a DIDComm message.

#### Response processing

The _sender_ **MAY** look up the corresponding out-of-band message identified in the response's `~thread.pthid` to determine whether it should accept the response. Information about the related out-of-band message protocol may be required to provide the sender with context about processing the response and what to do after the protocol completes.

##### Sender Error Handling

If the _sender_ receives a [Problem Report](../0035-report-problem/README.md) message from the receiver, the sender has several options for responding. The sender will receive the message as part of an offered protocol in the out-of-band message.

If the receiver did not include a `~service` decorator in the response, the sender can only respond if it is still in session with the receiver. For example, if the sender is a website that displayed a QR code for the receiver to scan, the sender could create a new, presumably adjusted, out-of-band message, encode it and present it to the user in the same way as before.

If the receiver included a [`~service` decorator](../0056-service-decorator/README.md) in the response, the sender can provide a new message to the receiver, even a new version of the original out-of-band message, and send it to the receiver. The new message **MUST** include a `~thread` decorator with the `thid` set to the `@id` from the problem report message.

## Drawbacks

- Publicly displayed out-of-band messages (say, a slide at the end of a presentation) all use the same DID. This is not a problem for institutions, and only provides a minor increase in correlation over sharing an endpoint, key, and routing information in a way that is observable by multiple parties.

## Prior art

- The out-of-band message/response process is similar to other key exchange protocols.
- The [Connections](https://github.com/hyperledger/aries-rfcs/tree/main/features/0160-connection-protocol) and [DID Exchange](https://github.com/hyperledger/aries-rfcs/tree/main/features/0023-did-exchange) protocols have (or had) their own `invitation` method.
- The `~service` decorator in combination with a request/response-type protocol message (such as present-proof/request) has previously used in place of the out-of-band `request` message.

## Unresolved questions

- None

## Implementations

The following lists the implementations (if any) of this RFC. Please do a pull request to add your implementation. If the implementation is open source, include a link to the repo or to the implementation within the repo. Please be consistent in the "Name" field so that a mechanical processing of the RFCs can generate a list of all RFCs supported by an Aries implementation.

Name / Link | Implementation Notes
--- | ---
 |
