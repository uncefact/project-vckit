# 0041: Renderer Plugin
- Authors: [Richard Spellman](namlleps.drahcir@gmail.com)
- Status: [PROPOSED](/README.md#proposed)
- Since: 2023-05-24
- Status Note: This is just a stub, requires initial content.
- Supersedes: (link to anything this RFC supersedes)
- Start Date: 2023-05-24
- Tags: [feature](/tags.md#feature)

## Summary

The approach to renderering credentials in a human friendly way is still evolving, but there is an emerging approach that is becoming stable enough to begin to implement. This component is a vc-kit plugin that takes a verifiable credential (perhaps, later, also a verifiable presentation) and returns a human friendly rendering of the credential. 

## Motivation

vc-kit is positioned to provide a verifiable credentials solution in the context of regulated industry. As such, there is commonly a requirement, on the part of issuers, that their credentials are presented in a pre-defined format. This puts a requirement on wallets to render credentials so that they comply with this format. 

In the context of transitioning to a fully decentralised, digital ecosystem, there remains the requirement for credentials to be transmitted in their rendered format - either via email, or printed documents. 

## Tutorial

The Verifiable Credential Data Model v2.0 indroduces a new, reserved term 'renderMethod' which can be used by wallets to display human friendly renderings of credentials.

Let's assume we have this credential, presented here without proof for simplicity.

```json
{
   "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
     {
       "render":"https://www.w3.org/2018/credentials#renderMethod"
      }
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2010-01-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "name": "Jane Smith",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts",
      "institution": "Example University"
    }
  },
  "render": [{
    "@id": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.institution}}.\n  </div>\n</div>",
    "@type": "WebRenderingTemplate2022"
  }]
}
```

> Note: rendering does not rely on the presence of proof, or a valid credential. We should be able to render a document prior to it being issued for the purposes of preview, etc... 

The renderer-plugin takes a credential of this format, locates the renderMethod object, inspects the type of the render method, and calls a function specific to the renderMethod type, passing in the (possiblly dereferenced) @id and credentialSubject and returns a file object representing the rendered credential. 

If the credential is represented as a JSON-LD document, then the process above should be done by locating the elements from the expanded document. 

> Note: the "render" property in the example above is deliberately named differently to the VC data model reserved term to illustrate this point. 

Let's take a look at the expanded document. 

```json
[
  {
    "https://www.w3.org/2018/credentials#credentialSubject": [
      {
        "https://example.org/examples#degree": [
          {
            "http://schema.org/name": [
              {
                "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML",
                "@value": "Bachelor of Science and Arts"
              }
            ],
            "@type": [
              "https://example.org/examples#BachelorDegree"
            ]
          }
        ],
        "@id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "http://schema.org/name": [
          {
            "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML",
            "@value": "Jane Smith"
          }
        ]
      }
    ],
    "@id": "http://example.edu/credentials/3732",
    "https://www.w3.org/2018/credentials#issuanceDate": [
      {
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
        "@value": "2010-01-01T00:00:00Z"
      }
    ],
    "https://www.w3.org/2018/credentials#issuer": [
      {
        "@id": "https://example.edu/issuers/565049"
      }
    ],
    "https://www.w3.org/2018/credentials#renderMethod": [
      {
        "@id": "<div style=\"width:300px; height:100px; border: 2px solid black; text-align:center\">\n  <div>\n    This {{credentialSubject.degree.name}} is conferred to\n  </div>\n  <strong style=\"font-size: 16px\">\n    {{credentialSubject.name}}\n  </strong>\n  <div>\n    by {{credentialSubject.degree.institution}}.\n  </div>\n</div>",
        "@type": [
          "WebRenderingTemplate2022"
        ]
      }
    ],
    "@type": [
      "https://www.w3.org/2018/credentials#VerifiableCredential",
      "https://example.org/examples#UniversityDegreeCredential"
    ]
  }
]
```

We can see that the property named "render" in the original document is now expanded as the absolute URI for the renderMethod reserved term definition: https://www.w3.org/2018/credentials#renderMethod

This is the value that the renderer-plugin inspects to locate the render method type. 

> Note: the renderMethod is an array, but for the moment, the renderer-plugin assumes a single render method and only returns the rendering given by the first object in the array. Further work is required to develop an appraoch to handling multiple rendering options for a single document, this is likely to to include passing in a content type to the render-credential plugin, or an accepts header when calling remote server functions. 

The vckit-core package contains a function for each known renderMethod type. Currently these are:
- WebRenderingTemplate2022
- SvgRenderingHint2022

These functions are passed in to the renderer-plugin via a mapping defined in the agent configuration file. This allows for the addition of new handlers to the renderer-plugin via configuration, without changing the plugin itself. 

If the @id of the render method is a URI, then the renderer plugin dereferences the URI before calling the render function. 


> TODO: the following is boilerplate from the RFC template. needs to be filled out... 

- Introducing new named concepts.
- Explaining the feature largely in terms of examples.
- Explaining how vc-kit contributors and/or consumers should *think* about the
feature, and how it should impact the way they use the ecosystem.
- If applicable, provide sample error messages, deprecation warnings, or
migration guidance.

Some enhancement proposals may be more aimed at contributors (e.g. for
consensus internals); others may be more aimed at consumers.

## Reference

Provide guidance for implementers, procedures to inform testing,
interface definitions, formal function prototypes, error codes,
diagrams, and other technical details that might be looked up.
Strive to guarantee that:

- Interactions with other features are clear.
- Implementation trajectory is well defined.
- Corner cases are dissected by example.

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

