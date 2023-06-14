# Title 0042: Oauth Plugin for Remote Server
- Authors: [Richard Spellman](namlleps.drahcir@gmail.com)
- Status: [PROPOSED](/README.md#proposed)
- Since: 2023-06-14 (date you submit your PR)
- Status Note: initial draft
- Supersedes: (link to anything this RFC supersedes)
- Start Date: 2023-06-14 (date you started working on this idea)
- Tags: [feature](/tags.md#feature)

## Summary

Provide an oauth express middleware that can be added to remote server component via agent config to provide validation of oauth bearer tokens for requests to the vckit remote server.

## Motivation

- conformance with traceability interop / vc http api open api auth mechanism

## Tutorial

Explain the proposal as if it were already implemented and you
were teaching it to another vc-kit contributor or vc-kit consumer. That generally
means:

- Introducing new named concepts.
- Explaining the feature largely in terms of examples.
- Explaining how vc-kit contributors and/or consumers should *think* about the
feature, and how it should impact the way they use the ecosystem.
- If applicable, provide sample error messages, deprecation warnings, or
migration guidance.

Some enhancement proposals may be more aimed at contributors (e.g. for
consensus internals); others may be more aimed at consumers.

## Reference

https://w3c-ccg.github.io/traceability-interop/openapi/#auth
https://github.com/w3c-ccg/vc-api/blob/bf79360bfdbbf36fb6510e2860b10bf46696c07c/components/SecuritySchemes.yml#L23
https://github.com/auth0/node-oauth2-jwt-bearer

## Drawbacks

Why should we *not* do this?

## Rationale and alternatives

- Why is this design the best in the space of possible designs?
- What other designs have been considered and what is the rationale for not
choosing them?
- What is the impact of not doing this?

## Prior art

Discuss prior art, both the good and the bad, in relation to this proposal.
A few examples of what this can include are:

- Does this feature exist in other SSI ecosystems and what experience have
their community had?
- For other teams: What lessons can we learn from other attempts?
- Papers: Are there any published papers or great posts that discuss this?
If you have some relevant papers to refer to, this can serve as a more detailed
theoretical background.

This section is intended to encourage you as an author to think about the
lessons from other implementers, provide readers of your proposal with a
fuller picture. If there is no prior art, that is fine - your ideas are
interesting to us whether they are brand new or if they are an adaptation
from other communities.

Note that while precedent set by other communities is some motivation, it
does not on its own motivate an enhancement proposal here.

## Unresolved questions

- What parts of the design do you expect to resolve through the
enhancement proposal process before this gets merged?
- What parts of the design do you expect to resolve through the
implementation of this feature before stabilization?
- What related issues do you consider out of scope for this 
proposal that could be addressed in the future independently of the
solution that comes out of this doc?
   
## Implementations

The following lists the implementations (if any) of this RFC. Please do a pull request to add your implementation. If the implementation is open source, include a link to the repo or to the implementation within the repo. Please be consistent in the "Name" field so that a mechanical processing of the RFCs can generate a list of all RFCs supported by a vc-kit implementation.

*Implementation Notes* [may need to include a link to test results](/README.md#accepted).

Name / Link | Implementation Notes
--- | ---
 | 

