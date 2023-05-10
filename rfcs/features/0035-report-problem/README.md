# Aries RFC 0035: Report Problem Protocol 1.0

- Authors: [Stephen Curran](swcurran@cloudcompass.ca), [Daniel Hardman](daniel.hardman@gmail.com)
- Status: [ACCEPTED](/README.md#accepted)
- Since: 2021-03-15
- Status Note: Implemented in multiple codebases.
- Supersedes: [Indy HIPE PR #65]( https://github.com/hyperledger/indy-hipe/pull/65)
- Start Date: 2018-11-26
- Tags: [feature](/tags.md#feature), [protocol](/tags.md#protocol), [test-anomaly](/tags.md#test-anomaly)

## Summary

Describes how to report errors and warnings in a powerful, interoperable way. All implementations
of SSI agent or hub technology SHOULD implement this RFC.

## Motivation

Effective reporting of errors and warnings is difficult in any system, and particularly so in
decentralized systems such as remotely collaborating agents. We need to surface problems, and
their supporting context, to people who want to know about them (and perhaps separately, to
people who can actually fix them). This is especially challenging when a problem is detected
well after and well away from its cause, and when multiple parties may need to cooperate on
a solution.

Interoperability is perhaps more crucial with problem reporting than with any other aspect of
DIDComm, since an agent written by one developer MUST be able to understand an error reported by
an entirely different team. Notice how different this is from normal enterprise software
development, where developers only need to worry about understanding their own errors.

The goal of this RFC is to provide agents with tools and techniques possible to
address these challenges. It makes two key contributions:

- A [protocol](../../concepts/0003-protocols/README.md) that helps an Agent report problems with appropriate
  context. We expect this to be a subprotocol of nearly every interesting application-level
  protocol; messages from it may even be [adopted into other protocols](
  ../../0000-template-protocol.md#adopted-messages).
- An inventory of problem categories and best practices for handling them.

## Tutorial

### "Error" vs. "Warning" vs. "Problem"

The distinction between "error" and "warning" is often thought of as one of severity -- errors
are *really* bad, and warnings are only *somewhat* bad. This is reinforced by the way logging
platforms assign numeric constants to ERROR vs. WARN log events, and by the way compilers
let warnings be suppressed but refuse to ignore errors.

However, any cybersecurity professional will tell you that warnings sometimes signal deep
and scary problems that should not be ignored, and most veteran programmers can tell war
stories that reinforce this wisdom. A deeper analysis of warnings reveals that
what truly differentiates them from errors is not their lesser severity, but rather their
greater ambiguity. _Warnings are problems that require human judgment to evaluate_, whereas
errors are unambiguously bad.

The mechanism for reporting problems in DIDComm cannot make a simplistic assumption that all
agents are configured to run with a particular verbosity or debug level. Each agent must let
other agents decide for themselves, based on policy or user preference, what do do about
various issues. For this reason, we use the generic term "problem" instead of the
more specific and semantically opinionated term "error" (or "warning") to describe the general
situation we're addressing. "Problem" includes any deviation from the so-called "happy path"
of an interaction. This could include situations where the severity is unknown and must be
evaluated by a human, as well as surprising events (e.g., a decision by a human to alter the
basis for in-flight messaging by moving from one device to another).

### Specific Challenges

All of the following challenges need to be addressed.

1. __Report problems to external parties interacting with us__.
  For example, AliceCorp has to be able to tell Bob that it can’t issue the
  credential he requested because his payment didn’t go through.
2. __Report problems to other entities inside our own domain__. For example,
  AliceCorp’s agent #1 has to be able to report to AliceCorp agent #2 that
  it is out of disk space.
3. __Report in a way that provides human beings with useful context and guidance
  to troubleshoot__.
  Most developers know of cases where error reporting was technically correct but
  completely useless. Bad communication about problems is one of the most common
  causes of UX debacles. Humans using agents will speak different languages, have
  differing degrees of technical competence, and have different software and hardware
  resources. They may lack context about what their agents are doing, such as when
  a DIDComm interaction occurs as a result of scheduled or policy-driven actions.
  This makes context and guidance crucial.
4. __Map a problem backward in time, space, and circumstances__, so when it is
  studied, its original context is available. This is particularly difficult
  in DIDComm, which is transport-agnostic and inherently asynchronous, and
  which takes place on an inconsistently connected digital landscape.
5. __Support localization__ using techniques in [the l10n RFC](../0043-l10n/README.md).
6. __Provide consistent, locale-independent problem codes__, not just localized text,
  so problems can be researched in knowledge bases, on Stack Overflow, and in
  other internet forums, regardless of the natural language in which a message
  displays. This also helps meaning remain stable as wording is tweaked.
7. __Provide a registry of well known problem codes__ that are carefully defined and
  localized, to maximize shared understanding. Maintaining an exhaustive list
  of all possible things that can go wrong with all possible agents in all possible
  interactions is completely unrealistic. However, it may be possible to maintain
  a curated subset. While we can't enumerate everything that can go wrong in a
  financial transaction, a code for "insufficient funds" might have near-universal
  usefulness. Compare the posix error inventory in [errorno.h](
  https://pubs.opengroup.org/onlinepubs/009695399/basedefs/errno.h.html).
8. __Facilitate automated problem handling by agents__, not just manual handling by humans.
  Perfect automation may be impossible, but high levels of automation should be
  doable.
9. __Clarify how the problem affects an in-progress interaction__. Does a failure to
  process payment reset the interaction to the very beginning of the protocol, or
  just back to the previous step, where payment was requested? This requires problems
  to be [matched in a formal way to the state machine](
   ../../concepts/0003-protocols/README.md#state-machines) of a protocol underway.

### The `report-problem` protocol

Reporting problems uses a simple one-step [notification protocol](
../../concepts/0003-protocols/README.md#types-of-protocols). Its official [PIURI](
../../concepts/0003-protocols/README.md#piuri) is:

    https://didcomm.org/report-problem/1.0

The protocol includes the standard `notifier` and `notified` roles. It
defines a single message type `problem-report`, introduced here.
It also [adopts](../../0000-template-protocol.md#adopted-messages) the
`ack` message from the [`ACK 1.0` protocol](../0015-acks/README.md),
to accommodate the possibility that the [`~please_ack`](../0317-please-ack/README.md)
[decorator]( ../../concepts/0011-decorators/README.md) may be used on the
 notification.

A `problem-report` communicates about a problem when an agent-to-agent message is
possible and a recipient for the problem report is known. This covers, for example,
cases where a Sender's message gets to an intended Recipient, but the Recipient is
unable to process the message for some reason and wants to notify the Sender. It
may also be relevant in cases where the recipient of the `problem-report` is not a
message Sender. Of course, a reporting technique that depends on message delivery
doesn't apply when the error reporter can't identify or communicate with the proper
recipient.

### The `problem-report` message type

Only `description.code` is required, but a maximally verbose `problem-report` could contain all
of the following:

```jsonc
{
  "@type"            : "https://didcomm.org/report-problem/1.0/problem-report",
  "@id"              : "an identifier that can be used to discuss this error message",
  "~thread"          : "info about the threading context in which the error occurred (if any)",
  "description"      : { "en": "localized message", "code": "symbolic-name-for-error" },
  "problem_items"    : [ {"<item descrip>": "value"} ],
  "who_retries"      : "enum: you | me | both | none",
  "fix_hint"         : { "en": "localized error-instance-specific hint of how to fix issue"},
  "impact"           : "enum: message | thread | connection",
  "where"            : "enum: you | me | other - enum: cloud | edge | wire | agency | ..",
  "noticed_time"     : "<time>",
  "tracking_uri"     : "",
  "escalation_uri"   : ""
}
```

### Field Reference

Some fields will be relevant and useful in many use cases, but not always. Including empty or null fields is discouraged;
best practice is to include as many fields as you can fill with useful data, and to omit the others.

**@id**: An identifier for this message, as described in [the message threading RFC](
../../concepts/0008-message-id-and-threading/README.md#message-ids). This decorator is STRONGLY recommended,
because enables a dialog about the problem itself in a branched thread (e.g., suggest a retry, report a resolution,
ask for more information).

**~thread**: A thread decorator that places the `problem-report` into a thread context. If the problem was
triggered in the processing of a message, then the triggering message is the head of a new thread of which
the problem report is the second member (`~thread.sender_order` = 0). In such cases, the `~thread.pthid`
(parent thread id) here would be the `@id` of the triggering message. If the problem-report is unrelated
to a message, the thread decorator is mostly redundant, as `~thread.thid` must equal `@id`.

**description**: Contains human-readable, localized alternative string(s) that explain the problem. It is highly recommended that the message follow use the guidance in [the l10n RFC](../0043-l10n/README.md), allowing the error to be searched on the web and documented formally.

**description.code**: Required. Contains the code that indicates the problem being communicated. Codes are described in protocol RFCs and other relevant places. New Codes SHOULD follow the [Problem Code](https://identity.foundation/didcomm-messaging/spec/#problem-codes) naming convention detailed in the DIDComm v2 spec.

**problem_items**: A list of one or more key/value pairs that are parameters about the problem. Some examples might be:

- a list of arguments that didn’t pass input validation
- the name of a file or URL that could not be fetched
- the name of a crypto algorithm that the receiving agent didn’t support

All items should have in common the fact that they exemplify the problem described by the code (e.g., each is an invalid param, or each is an unresponsive URL, or each is an unrecognized crypto algorithm, etc).

Each item in the list must be a tagged pair (a JSON {key:value}, where the key names the parameter or item, and the value is the actual problem text/number/value. For example, to report that two different endpoints listed in party B’s DID Doc failed to respond when they were contacted, the code might contain "endpoint-not-responding", and the problem_items property might contain:

``` jsonc
[
  {"endpoint1": "http://agency.com/main/endpoint"},
  {"endpoint2": "http://failover.agency.com/main/endpoint"}
]
```

**who_retries**: value is the string "you", the string "me", the string "both", or the string "none". This property tells whether a problem is considered permanent and who the sender of the problem report believes should have the responsibility to resolve it by retrying. Rules about how many times to retry, and who does the retry, and under what circumstances, are not enforceable and not expressed in the message text. This property is thus not a strong commitment to retry--only a recommendation of who should retry, with the assumption that retries will often occur if they make sense.

> [TODO: figure out how to identify parties > 2 in n-wise interaction]

**fix_hint**: Contains human-readable, localized suggestions about how to fix this instance of the problem. If present, this should be viewed as overriding general hints found in a message catalog.

**impact**: A string describing the breadth of impact of the problem. An enumerated type:

- "message" (this is a problem with a single message only; the rest of the interaction may still be fine),
- "thread" (this is a problem that endangers or invalidates the entire thread),
- "connection" (this is a problem that endangers or invalidates the entire connection).

**where**: A string that describes where the error happened, from the perspective of the reporter, and that uses the "you" or "me" or "other" prefix, followed by a suffix like "cloud", "edge", "wire", "agency", etc.

**noticed_time**: Standard time entry (ISO-8601 UTC with at least day precision and up to millisecond precision) of when the problem was detected.

> [TODO: should we refer to timestamps in a standard way ("date"? "time"? "timestamp"? "when"?)]

**tracking_uri**: Provides a URI that allows the recipient to track the status of the error. For example, if the error is related to a service that is down, the URI could be used to monitor the status of the service, so its return to operational status could be automatically discovered.

**escalation_uri**: Provides a URI where additional help on the issue can be received. For example, this might be a "mailto" and email address for the Help Desk associated with a currently down service.

### Sample

``` jsonc
{
  "@type": "https://didcomm.org/notification/1.0/problem-report",
  "@id": "7c9de639-c51c-4d60-ab95-103fa613c805",
  "~thread": {
    "pthid": "1e513ad4-48c9-444e-9e7e-5b8b45c5e325",
    "sender_order": 1
  },
  "~l10n"            : {"catalog": "https://didcomm.org/error-codes"},
  "description"      : "Unable to find a route to the specified recipient.",
  "description~l10n" : {"code": "cant-find-route" },
  "problem_items"    : [
      { "recipient": "did:sov:C805sNYhMrjHiqZDTUASHg" }
  ],
  "who_retries"      : "you",
  "impact"           : "message",
  "noticed_time"     : "2019-05-27 18:23:06Z"
}
```

## Categorized Examples of Errors and (current) Best Practice Handling

The following is a categorization of a number of examples of errors and (current) Best Practice handling for those types of errors. The new `problem-report` message type is used for some of these categories, but not all.

### Unknown Error

Errors of a known error code will be processed according to the understanding of what the code means. Support of a protocol includes support and proper processing of the error codes detailed within that protocol.

Any unknown error code that starts with `w.` in the DIDComm v2 style may be considered a warning, and the flow of the active protocol SHOULD continue. All other unknown error codes SHOULD be considered to be an end to the active protocol.

### Error While Processing a Received Message

An Agent Message sent by a Sender and received by its intended Recipient cannot be processed.

#### Examples:

- An error occurs in the processing of the message (e.g. missing required parameters, bad data in parameters, etc.)
- The recipient has no message handler for the message type
- A message request is rejected because of a policy
- "Access denied" scenarios

#### Recommended Handling

The Recipient should send the Sender a `problem-report` Agent Message detailing the issue.

The last example deserves an additional comment about whether there should be a response sent at all. Particularly in cases where trust in the message sender is low (e.g. when establishing the connection), an Agent may not want to send any response to a rejected message as even a negative response could reveal correlatable information. That said, if a response is provided, the `problem-report` message type should be used.

### Error While Routing A Message

An Agent in the routing flow of getting a message from a Sender to the Agent Message Recipient cannot route the message.

#### Examples:

- Unknown "To" destination for the message
- Insufficient resources (disk space, network access)
- Unable to decrypt the message

#### Recommended Handling

If the Sender is known to the Agent having the problem, send a `problem-report` Agent Message detailing at least that a blocking issue occurred, and if relevant (such as in the first example), some details about the issue. If the message is valid, and the problem is related to a lack of resources (e.g. the second issue), also send a `problem-report` message to an escalation point within the domain.

Alternatively, the capabilities described in [0034: Message Tracing](../0034-message-tracing/README.md) could be used to inform others of the fact that an issue occurred.

### Messages Triggered about a Transaction

#### Examples:

- "You’re asking for more information than we agreed to" or "You’re giving me more than I expected."
- Couldn’t pay (insufficient funds, payment mechanism is offline…)
- You violated the terms of service we agreed to, because I see that my info has been leaked.
- Your credential has been revoked (asynchronous)
- A is unwilling to consent to the terms and conditions that B proposes.

#### Recommended Handling

These types of error scenarios represent a gray error in handling between using the generic `problem-report` message format, or a message type that is part of the current transaction's message family. For example, the "Your credential has been revoked" might well be included as a part of the (TBD) standard Credentials Exchange message family. The "more information" example might be a generic error across a number of message families and so should trigger a `problem-report`) or, might be specific to the ongoing thread (e.g. Credential Exchange) and so be better handled by a defined message within that thread and that message family.

The current advice on which to use in a given scenario is to consider how the recipient will handle the message. If the handler will need to process the response in a specific way for the transaction, then a message family-specific message type should be used. If the error is cross-cutting such that a common handler can be used across transaction contexts, then a generic `problem-report` should be used.

"Current advice" implies that as we gain more experience with Agent To Agent messaging, the recommendations could get more precise.

### Messaging Channel Settings

#### Examples

- "Please resend so a different one of my agents can read this.", or, "Agent X no longer in service. Use Agent Y instead."
- A received a message from B that it cannot understand (message garbled, can’t be decrypted, is of an unrecognized type, uses crypto from a library that A doesn’t have, etc)
- A wants to report to B that it believes A has been hacked, or that it is under attack
- A wants to report to B that it believes B has been hacked, or that it is under attack
- Version incompatibilities of various kinds (transport version incompatibilities [http 1.1 vs. 2.0]; agent message type version incompatibilities)

#### Recommended Handling

These types of messages might or might not be triggered during the receipt and processing of a message, but either way, they are unrelated to the message and are really about the communication channel between the entities. In such cases, the recommended approach is to use a (TBD) standard message family to notify and rectify the issue (e.g. change the attributes of a connection). The definition of that message family is outside the scope of this RFC.

### Timeouts

A special generic class of errors that deserves mention is the timeout, where a Sender sends out a message and does not receive back a response in a given time. In a distributed environment such as Agent to Agent messaging, these are particularly likely - and particularly difficult to handle gracefully. The potential reasons for timeouts are numerous:

- loss of connectivity
- resource errors with one of the Agents between the Sender and Receiver
- not yet detected key rotations (cached DIDDocs and encryption keys)
- errors occurring in an Agent unaware of the Sender (so cannot notify the sender of the issue)
- Recipient offline for an extended period
- disinterest on the part of the Recipient (received, but no response sent back)

#### Recommended Handling

Appropriate timeout handling is extremely contextual, with two key parameters driving the handling - the length of the waiting period before triggering the timeout and the response to a triggered timeout.

The time to wait for a response should be dynamic by at least type of message, and ideally learned through experience. Messages requiring human interaction should have an inherently longer timeout period than a message expected to be handled automatically. Beyond that, it would be good for Agents to track response times by message type (and perhaps other parameters) and adjust timeouts to match observed patterns.

When a timeout is received there are three possible responses, handled automatically or based on feedback from the user:

- Wait longer
- Retry
- Give up

An automated "wait longer" response might be used when first interacting with a particular message type or identity, as the response cadence is learned.

If the decision is to retry, it would be good to have support in areas covered by other RFCs. First, it would be helpful (and perhaps necessary) for the threading decorator to support the concept of retries, so that a Recipient would know when a message is a retry of an already sent message.  Next, on "forward" message types, Agents might want to know that a message was a retry such that they can consider refreshing DIDDoc/encryption key cache before sending the message along. It could also be helpful for a retry to interact with the Tracing facility so that more information could be gathered about why messages are not getting to their destination.

Excessive retrying can exacerbate an existing system issue. If the reason for the timeout is because there is a "too many messages to be processed" situation, then sending retries simply makes the problem worse. As such, a reasonable backoff strategy should be used (e.g. exponentially increasing times between retries). As well, a [strategy used at Uber](https://eng.uber.com/reliable-reprocessing/) is to flag and handle retries differently from regular messages. The analogy with Uber is not pure - that is a single-vendor system - but the notion of flagging retries such that retry messages can be handled differently is a good approach.

### Caveat: Problem Report Loops

Implementers should consider and mitigate the risk of an endless loop of error messages. For example:

- Alice sends a message to Bob that Bob doesn't recognize. Bob sends a `Problem Report` message to Alice.
- Alice doesn't understand the message from Bob and sends a `Problem Report` to Bob.
- Bob doesn't understand the message from Alice and sends a `Problem Report` to Alice. And so on...

#### Recommended Handling

How agents mitigate the risk of this problem is implementation specific, balancing loop-tracking overhead versus the likelihood of occurrence.
For example, an agent implementation might have a counter on a connection object that is incremented when certain types of `Problem Report` messages are sent on that connection,
and reset when any other message is sent. The agent could stop sending those types of `Problem Report` messages after the counter reaches a given value.

## Reference

TBD

## Drawbacks

In many cases, a specific `problem-report` message is necessary, so formalizing the format of the message is also preferred over leaving it to individual implementations. There is no drawback to specifying that format now.

As experience is gained with handling distributed errors, the recommendations provided in this RFC will have to evolve.

## Rationale and alternatives

The error type specification mechanism builds on the same approach used by the message type specifications. It's possible that additional capabilities could be gained by making runtime use of the error type specification - e.g. for the broader internationalization of the error messages.

The main alternative to a formally defined error type format is leaving it to individual implementations to handle error notifications, which will not lead to an effective solution.

## Prior art

A brief search was done for error handling in messaging systems with few useful results found. Perhaps the best was the Uber article referenced in the "Timeout" section above.

## Unresolved questions

- Can the Tracing facility provide a trusted way to better handle distributed errors in a production environment?
- [Denial of service via problems that spam the wrong person with
  a problem report](https://chat.hyperledger.org/channel/indy-agent?msg=cDsBfdDfK43nGQLBE).

## Implementations

The following lists the implementations (if any) of this RFC. Please do a pull request to add your implementation. If the implementation is open source, include a link to the repo or to the implementation within the repo. Please be consistent in the "Name" field so that a mechanical processing of the RFCs can generate a list of all RFCs supported by an Aries implementation.

Name / Link | Implementation Notes
--- | ---
[RFC 0036: Issue Credential Protocol](../0036-issue-credential/README.md) | The `problem-report` message is [adopted](../../0000-template-protocol.md#adopted-messages) by this protocol. [MISSING test results](/tags.md#test-anomaly)
[RFC 0037: Present Proof Protocol](../0037-present-proof/README.md) | The `problem-report` message is [adopted](../../0000-template-protocol.md#adopted-messages) by this protocol. [MISSING test results](/tags.md#test-anomaly)
[Trinsic.id](https://trinsic.id/) | Commercial mobile and web app built using Aries Framework - .NET [MISSING test results](/tags.md#test-anomaly)
