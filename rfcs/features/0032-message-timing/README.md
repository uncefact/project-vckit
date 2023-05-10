# Aries RFC 0032: Message Timing

- Authors: [Daniel Hardman](daniel.hardman@gmail.com)
- Status: [DEMONSTRATED](/README.md#demonstrated)
- Since: 2019-05-01
- Status Note: Broadly socialized but not yet implemented. 
- Supersedes: [Indy RFC PR #68](https://github.com/hyperledger/indy-hipe/pull/68)
- Start Date: 2018-12-11
- Tags: [feature](/tags.md#feature)

## Summary

Explain how timing of agent messages can be communicated and constrained.

## Motivation

Many timing considerations influence asynchronous messaging delivery.
We need a standard way to talk about them.

## Tutorial

This RFC introduces a decorator to communicate about timing of messages.
It is compatible with, but independent from, [conventions around date and
time fields in messages](../../concepts/0074-didcomm-best-practices/README.md).

Timing attributes of messages can be described with the `~timing`
decorator. It offers a number of optional subfields:

```JSON
"~timing": {
  "in_time":  "2019-01-23 18:03:27.123Z",
  "out_time": "2019-01-23 18:03:27.123Z",
  "stale_time": "2019-01-24 18:25Z",
  "expires_time": "2019-01-25 18:25Z",
  "delay_milli": 12345,
  "wait_until_time": "2019-01-24 00:00Z"
}
```

The meaning of these fields is:

* `in_time`: The timestamp when the preceding message in this thread
  (the one that elicited this message as a response) was received. Or, on
  a dynamically composed `forward` message, the timestamp when an upstream
  relay first received the message it's now asking to be forwarded.
* `out_time`: The timestamp when the message was emitted. At least millisecond
  precision is preferred, though second precision is acceptable.
* `stale_time`: Ideally, the decorated message should be processed by the
  the specified timestamp. After that, the message may become irrelevant
  or less meaningful than intended. This is a hint only.
* `expires_time`: The decorated message should be considered invalid or expired
  if encountered after the specified timestamp. This is a much stronger claim
  than the one for `stale_time`; it says that the receiver should cancel
  attempts to process it once the deadline is past, because the sender won't
  stand behind it any longer. While processing of the received message should
  stop, the thread of the message should be retained as the sender may send an
  updated/replacement message. In the case that the sender does not follow up,
  the policy of the receiver agent related to abandoned threads would presumably
  be used to eventually delete the thread.
* `delay_milli`: Wait at least this many milliseconds before processing the
  message. This may be useful to defeat temporal correlation. It is recommended
  that agents supporting this field should not honor requests for delays longer
  than 10 minutes (600,000 milliseconds).
* `wait_until_time`: Wait until this time before processing the message.

All information in these fields should be considered best-effort. That
is, the sender makes a best effort to communicate accurately, and the
receiver makes a best effort to use the information intelligently. In
this respect, these values are like timestamps in email headers--they
are generally useful, but not expected to be perfect. Receivers are not
required to honor them exactly.

An agent may ignore the `~timing` decorator entirely or implement the `~timing`
decorator and silently ignore any of the fields it chooses not to support.

### Timing in Routing

Most usage of the `~timing` decorator is likely to focus on application-oriented
messages processed at the edge. `in_time` and `out_time`, for example, are mainly
useful so Bob can know how long Alice took to ponder her response to his love letter.
In onion routing, where one edge agent prepares all layers of the `forward` wrapping,
it makes no sense to apply them to `forward` messages. However, if a relay is
composing new `forward` messages dynamically, these fields could be used to measure
the delay imposed by that relay. All the other fields have meaning in routing.

### Timing and Threads

When a message is a reply, then `in_time` on an application-focused message is
useful. However, `out_time` and all other fields are meaningful regardless of
whether threading is active.

## Reference

- [Discussion of date and time datatypes on Wikipedia](https://en.wikipedia.org/wiki/System_time)
- [ISO 8601](https://de.wikipedia.org/wiki/ISO_8601)

## Implementations

The following lists the implementations (if any) of this RFC. Please do a pull request to add your implementation. If the implementation is open source, include a link to the repo or to the implementation within the repo. Please be consistent in the "Name" field so that a mechanical processing of the RFCs can generate a list of all RFCs supported by an Aries implementation.

Name / Link | Implementation Notes
--- | ---
[RFC 0193: Coin Flip Protocol](../0193-coin-flip/README.md) | Uses `~timing.expires_time` to time out each step of the coin flip.
