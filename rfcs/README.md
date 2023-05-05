# vc-kit RFCs

This folder holds Request for Comment (RFCs) for the vc-kit project. They describe important
topics ([not minor details](contributing.md#do-you-need-an-RFC)) that we want to
standardize across the vc-kit ecosystem.

If you are here to learn about vc-kit, we recommend you use the [the RFC Index](index.md) for a current listing of all RFCs and their statuses.

There are 2 types of vc-kit RFCs:

* RFCs that describe individual features (in the [features](./features) folder)
* RFCs that explain concepts underpinning many features (in the [concepts](./concepts) folder)

RFCs are for developers *building on* vc-kit. They don't provide guidance on how vc-kit components
implement features internally; individual vc-kit packages have design docs for that. Each
vc-kit RFC includes an "implementations" section and all RFCs with a status greater than
`Proposed` should have at least one listed implementation.

## RFC Lifecycle

RFCs go through a standard lifecycle.

![lifecycle](lifecycle.png)

#### PROPOSED
To __propose__ an RFC, [use these instructions to raise a PR](
contributing.md#how-to-propose-an-RFC) against the repo. Proposed
RFCs are considered a "work in progress", even after they are merged. In other words, they
haven't been endorsed by the community yet, but they seem like reasonable ideas worth
exploring.

#### DEMONSTRATED
__Demonstrated__ RFCs have one or more implementations available, listed in the "Implementations" section of the RFC document. As with the PROPOSED status, demonstrated RFCs haven't been endorsed by the community, but the ideas put forth have been more thoroughly explored through the implementation(s). The demonstrated status is an optional step in the lifecycle. 

#### ACCEPTED
To get an RFC __accepted__, [build consensus](contributing.md#how-to-get-an-RFC-accepted) for your RFC on [vc-kit discord](https://discord.com/channels/1100602714720829543/1103849339400507402). An accepted RFC is incubating on a standards track; the community has decided to polish it and is exploring or pursuing implementation.

#### ADOPTED
To get an RFC __adopted__, [socialize and implement](contributing.md#how-to-get-an-rfc-adopted). An RFC gets this status once it has significant momentum--when implementations accumulate, or when the mental model it advocates has begun to permeate our discourse. In other words, adoption is acknowledgment of a _de facto_ standard.

To __refine__ an RFC, propose changes to it through additional PRs. Typically these changes are driven by experience that accumulates during or after adoption. Minor refinements that just improve clarity can happen inline with lightweight review. Status is still ADOPTED.

#### RETIRED
An RFC is __retired__ when it is withdrawn from community consideration by its authors, when implementation seems permanently stalled, or when significant refinements require a superseding document. If a retired RFC has been superseded, its `Superseded By` field should contain a link to the newer spec, and the newer spec's `Supersedes` field should contain a link to the older spec. Permalinks are not broken.

### Changing an RFC Status

See notes about this in [Contributing](contributing.md#changing-an-rfc-status).

## About

#### License

This repository is licensed under a [GPLv3 License](../LICENSE). It is protected
by a [Developer Certificate of Origin](https://developercertificate.org/) on every commit.
This means that any contributions you make must be licensed in a GPLv3
way, and must be free from patent encumbrances or additional terms and conditions. By
raising a PR, you certify that this is the case for your contribution.

For more instructions about contributing, see [Contributing](contributing.md).

#### Acknowledgement

The structure and a lot of the initial language of this vc-kit RFC folder was borrowed from [Hyperledger Aries RFCs](https://github.com/hyperledger/aries-rfcs) which borrowed it from [Indy HIPEs](
https://github.com/hyperledger/indy-hipe), which borrowed it from [Rust RFC](https://github.com/rust-lang/rfcs).
Their good work has made the setup of this repository much quicker and better than it otherwise would have been.
If you are not familiar with the Rust or Aries communities, you should check them out.
