# Aries RFC 0104: Chained Credentials

- Authors: Daniel Hardman, Lovesh Harchandani
- Status: [PROPOSED](/README.md#proposed)
- Since: 2019-09-09
- Status Note: Updated 2019-11-04 after discussion at IIW at on Aries community calls, and again 2020-01-07. Various aspects of this are implemented, or in the process of being implemented, in [Hyperledger Ursa](https://github.com/hyperledger/ursa-rfcs/pull/14) and Hyperledger Indy. This doc will be updated based on learnings.
- Start Date: 2019-08-01
- Tags: [concept](/tags.md#concept), [credentials](/tags.md#credentials)

###### Note: editable images
>See [here](https://docs.google.com/presentation/d/1lMHHvsHDrP8j3_WUf5bFK1eFYCILue1l9jhnfR_mLVY/edit) for original images used in this RFC.

###### Note: terminology update
>"Chained credentials" were previously called "delegatable credentials." The new term is broader and more accurate. Delegation remains a use case for the mechanism, but is no longer its exclusive focus.

## Summary

Describes a set of conventions, collectively called __chained credentials__, that allows data in a verifiable credential (VC) to be traced back to its origin while retaining its verifiable quality. This chaining alters trust dynamics. It means that issuers late in a chain can skip complex issuer setup, and do not need the same strong, globally recognizable reputation that's important for true roots of trust. It increases the usefulness of offline verification. It enables powerful delegation of privileges, which unlocks many new verifiable credential use cases.

Chained credentials do not require any modification to the [standard data model for verifiable credentials](https://www.w3.org/TR/vc-data-model/); rather, they leverage the data model in a simple, predictable way. Chaining conventions work (with some feature variations) for any W3C-conformant verifiable credential type, not just the ones developed inside Hyperledger.

###### Note: object capabilities
>When chained credentials are used to delegate, the result is an [object capabilities (OCAP)](https://en.wikipedia.org/wiki/Capability-based_security) solution similar to [ZCAP-LD](https://w3c-ccg.github.io/zcap-ld/) in scope, features, and intent. However, such __chained capabilities__ accomplish their goals a bit differently. See [here](contrast-zcap-ld.md) for an explanation of the divergence and redundancy.

###### Note: sister RFC
>This RFC is complements [Aries RFC 0103: Indirect Identity Control](../0103-indirect-identity-control/README.md). That doc describes how delegation (and related control mechanisms like delegation and controllership) can be represented in credentials and governed; this one describes an underlying infrastructure to enable such a model. The ZKP implementation of this RFC [comes from Hyperledger Ursa](https://github.com/hyperledger/ursa-rfcs/pull/14) and depends on cryptography [described by Camenisch et al. in 2017](https://acmccs.github.io/papers/p683-camenischA.pdf).

## Motivation

There is a tension between the decentralization that we want in a VC ecosystem, and the way that trust tends to centralize because knowledge and reputation are unevenly distributed. We want anyone to be able to attest to anything they like--but we know that verifiers care very much about the reputation of the parties that make those attestations.

We can say that verifiers will choose which issuers they trust. However, this places a heavy burden on them--verifiers can't afford to vett every potential issuer of credentials they might encounter. The result will be a tendency to accept credentials only from a short list of issuers, which leads back to centralization.

This tendency also creates problems with delegation. If all delegation has to be validated through a few authorities, a lot of the flexibility and power of delegation is frustrated.

We'd like a VC landscape where a tiny startup can issue an employment credential with holder attributes taken as seriously as one from a massive global conglomerate--and with no special setup by verifiers to trust them equally. And we'd like parents to be able to delegate childcare decisions to a babysitter on the spur of the moment--and have the babysitter be able to prove it when she calls an ambulance.

## Tutorial

### Data provenance

Our confidence in data depends on the data's origin and chain of custody--its **provenance**.

Journalists and academics cite sources. The highest quality sources explain how primary data was derived, and what inferences are reasonable to draw from it. Better sources, and better links to those sources, create better trust.

With credentials, the direct reporter of data is the issuer--but the issuer is not always the data's source. When Acme's HR department issues an employment credential that includes Bob the employee's name, the source of Bob's name is probably government-issued ID, not Acme's subjective opinion. Acme is reporting data that originated elsewhere.

![provenanced name](provenanced-name.png)

Acme should cite its sources. Even when citations are unstructured and unsigned, they may still be helpful to humans. But we may be able to do better. If the provenance of an employee's name is *verifiable* in the same way as other credential data, then Acme's reputation with respect to that assertion becomes almost unimportant; the *data's ability to foster trust is derived from the reputation of its true source, plus the algorithm that verifies that source*.

This matters.

One of the challenges with traditional trust on the web is the all-or-nothing model of trust for certificate authorities. A website in an obscure corner of the globe uses an odd CA; browser manufacturers must debate whether that CA deserves to be on the list of globally trusted attesters. If yes, then any cert the CA issues will be silently believed; if no, then none will. UX pressure has often decided the debate in favor of trust by default; the result has been very long lists of trusted CAs, and a corresponding parade of junk certificates and abuse.

Provenanced data helps verifiable credentials avoid the same conundrum. The set of original sources for a person's legal name is far smaller than the set of secondary entities that might issue credentials containing that data, so verifiers need only a short list of trusted sources for that data, no matter how many issuers they see. When they evaluate an employment credential, they will be able to see that the employee's name comes from a passport issued by the government, while the hire date is directly attested by the company. This lets the verifier nuance trust in granular and useful ways. 

### Delegation as provenance of authority

Delegation can be modeled as a data provenance issue, where the data in question is an authorization. Suppose Alice, the CEO of Thrift Bank, has the authority to do many tasks, and that one of them is to negotiate contracts. As the company grows, she decides that the company needs a role called "Corporate Counsel", and she hires Carl for the job. She wants to give Carl a credential that says he has the authority to negotiate contracts. The provenance of Carl's authority is Alice's own authority.

![provenanced authz](provenanced-authz.png)

Notice how parallel this diagram is to the previous one.

### Chaining

Both of the examples given above imagine a single indirection between a data source and the issuer who references it. But of course many use cases will be far more complex. Perhaps the government attests Bob's name; this becomes the basis for Bob's employer's attestation, which in turn becomes the basis for an attestation by the contractor that processes payroll for Bob's employer. Or perhaps authorization from Alice to corporate counsel gets further delegated. In either case, the result will be a **data provenance chain**:

![chains of provenanced data](chains.png)

This is the basis for the **chained credential** mechanism that gives this RFC its name. Chained credentials contain information about the provenance of some or all of the data they embody; this allows a verifier to trace the data backward, possibly through several links, to its origin, and to evaluate trust on that basis.

### Use cases

Many use cases exist for conveying provenance for the data inside verifiable credentials:

* A person wants to use an airplane ticket to gain access to a boarding area in an airport. The airplaine ticket contains data directly attested by the carrier, as well as data attested by the passport that the passenger used during check in, plus data attested by the credit card company that the passenger used to buy the ticket, plus maybe data attested by personnel at a security checkpoint. Verification of this data should impute different trust to different fields on the ticket depending on the provenance of the data. 
* An oversight body wants to certify election results, based on results reported (as VCs) by each precint. Precints in turn want to certify results based on data emitted (as VCs) by polling stations. The oversight body wants to show that its certification is dependent on data that it received and believed to be genuine, not on direct observation in every polling location.
* Company A wants to delegate to B (a vendor of HR services) the management of A's employees, including the issuance of employee-of-A credentials that are in turn used to act on behalf of A.
* A scientific organization that operates exploratory drones wants to delegate pilot privileges to some staff members, and maintenance privileges to other staff members.
* A parent wants to delegate medical care decisions to a babysitter for a few hours.

#### Acid Test

Although these situations sound different, their underlying characteristics are surprisingly similar--and so are those of other use cases we've identified. We therefore chose a single situation as being prototypical. If we address it well, our solution will embody all the characteristics we want. The situation is this:

![use case diagram](use-case.png)

##### Chain of Provenance for Authority (Delegation)

The national headquarters of Ur Wheelz (a car rental company) issues a verifiable credential, C1, to its regional office in Houston, authorizing Ur Wheelz Houston to rent, maintain, sell, drive, and delegate driving privileges to customers, for certain cars owned by the national company. 

Alice rents a car from Ur Wheelz Houston. Ur Wheelz Houston issues a driving privileges credential, C2, to Alice. C2 gives Alice the privilege to drive the car on a particular week, within the state of Texas, and to further delegate that privilege. Alice uses her C2 credential to prove to the car (which is a fancy future car that acts as verifier) that she is an authorized driver; this is what unlocks the door.

Alice gets pulled over for speeding on Wednesday and uses C2 to prove to the police that she is the authorized driver of the car.

On Thursday night Alice goes to a fancy restaurant. She uses valet parking. She issues credential C3 to the valet, allowing him to drive the car within 100 meters of the restaurant, for the next 2 hours while she is at the restaurant. Alice chooses to constrain C3 so the valet cannot further delegate. The valet uses C3 to unlock and drive the car to the parking garage.

##### Revocation

While Alice eats, law enforcement officers go to Ur Wheelz Houston with a search warrant for the car. They have discovered that the previous driver of the car was a criminal. They ask Ur Wheelz to revoke C2, because they don’t want the car to be driven any more, in case evidence is accidentally destroyed.

At the end of dinner, Alice goes to the valet and asks for her car to be returned. The valet goes to the car and attempts to open the door using C3. The car tests the validity of the delegation chain of C3, and discovers that C2 has been revoked, making C3 invalid. The car refuses to open the door. Alice has to take Uber to get home. Law enforcement takes possession of the car.

### How chained credentials address this use case

A chained credential is a verifiable credential that contains provenanced data, linking it back to its source. In this case, the provenanced data is about authority, and each credential in the chain functions like a capability token, granting its holder privileges that derive from an upstream issuer's own authority.

###### Note: delegate credentials
>We call this subtype of chained credential a **delegate credential**. We'll try to describe the provenance chain in generic terms as much as possible, but the delegation problem domain will occasionally color our verbiage... All delegate credentials are chained; not all chained credentials are delegate credentials.

The first entity in the provenance chain for authority (Ur Wheels National, in our acid use case) is called the **root attester**, and is probably an institution configured for traditional credential issuance (e.g., with a public DID to which reputation attaches; in Indy, this entity also publishes a credential definition). All downstream entities in the provenance chain can participate without special setup. They need not have public DIDs or credential definitions. This is because the strength of the assertion does not depend on their reputation; rather, it depends on the robustness of the algorithm that walks the provenance chain back to its root. Only the root attester needs public reputation.
 
###### Note: contrast with ACLs
>When chained credentials are used to convey authority (the delegate credential subtype), they are quite different from ACLs. ACLs map an identity to a list of permissions. Delegate credentials entitle their holder to whatever permissions the credential enumerates. Holding may or may not be transferrable. If it is not transferrable, then [fraud prevention must be considered](../0207-credential-fraud-threat-model/README.md). If the credential isn't bound to a holder, then it's a bearer token and is an even more canonical OCAP.

#### Special Sauce

A chained credential delivers these features by obeying some special conventions over and above the core requirements of an ordinary VC:

1. It contains a special field named `schema` that is a base64url-encoded representation of *its own schema*. This makes the credential self-contained in the sense that it doesn't depend on a schema or credential definition defined by an external authority (though it could optionally embody one). This field is always disclosed in presentations.

2. It contains a special field named `provenanceProofs`. The field is an array, where each member of the array is a tuple (also a JSON array). The first member of each tuple is a list of field names; the second member of each tuple is an embedded W3C verifiable presentation that proves the provenance of the values in those fields. In the case of delegate credentials, `provenanceProofs` is proving the provenance of a field named `authorization`.

    Using credentials C1, C2, and C3 from our example use case, the `authorization` tuple in `provenanceProofs` of C1 includes a presentation that proves, on the basis of a car title that's a traditional, non-provenanced VC, that Ur Wheelz National had the authority to delegate a certain set of privileges X to Ur Wheelz Houston. The `authorization` tuple in `provenanceProofs` of C2 proves that Ur Wheelz Houston had authority to delegate Y (a subset of the authority in X) to Alice, and also that Ur Wheelz Houston derived its authority from Ur Wheelz National, who had the authority to delegate X to Ur Wheelz Houston. Similarly, the `authorization` tuple in C3's `provenanceProofs` is an extension of the `authorization` tuple in C2's `provenanceProofs`&mdash;now proving that Alice had the authority to delegate Z to the valet, plus all the other delegations in the upstream credentials.

    ![diagram](delegation-proofs.png)
    
    When a presentation is created from a chained credential, `provenanceProofs` is either disclosed (for non-ZKP proofs), or is used as evidence to prove the same thing (for ZKPs).
    
3. It is associated (through a name in its `type` field array and through a URI in its `trustFrameworkURI` field) with a [trust framework](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0103-indirect-identity-control/README.md#proxy-trust-framework) that describes provenancing rules. For general chained credentials, this is optional; for delegate credentails, it is required. The trust framework may partially describe the semantics of some schema variants for a family of chained credentials, as well as how provenance is attenuated or categorized. For example, a trust framework jointly published by Ur Wheelz and other car rental companies might describe delegate credential schemas for car owners, car rental offices, drivers, insurers, maintenance staff, and guest users of cars. It might specify that the permissions delegatable in these credentials include `drive`, `maintain`, `rent`, `sell`, `retire`, `delegate-further`, and so forth. The trust framework would do more than enumerate these values; it would define exactly what they mean, how they interact with one another, and what permissions are expected to be in force in various circumstances.

4. The reputation of non-root holders in a provenance chain become irrelevant as far as credential trust is concerned--trust is based on an unbroken chain back to a root public attester, not on published, permanent characteristics of secondary issuers. Only the root attester needs to have a public DID. Other issuer keys and DIDs can be private and pairwise.

5. If it is a delegate credential, it also meets all the requirements to be a __proxy credential__ as described in [Aries RFC 0103: Indirect Identity Control](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0103-indirect-identity-control/README.md#proxy-credential). Specifically:

    * It uses `credentialSubject.holder.*` fields to bind it to a particular holder, if applicable.
    
    * It uses `credentialSubject.proxied.*` fields to describe the upstream delegator to whatever extent is required.
    
    * It uses `credentialSubject.holder.role` and `credentialSubject.proxied.permissions` to grant permissions to the holder. See [Delegating Permissions](#delegating-permissions) for more details.
    
    * It may use `credentialSubject.holder.constraints.*` to [impose restrictions](../../concepts/0103-indirect-identity-control/guardianship-sample/trust-framework.md#constraints) on how/when/under what circumstances the delegation is appropriate.

#### What's not different

Proof of non-revocation uses the same mechanism as the underlying credentialing system. For ZKPs, this means that merkle tree or accumulator state is checked against the ledger or against any other source of truth that the root attester in the chain specifies; no conferring with upstream issuers is required. See [ZKP Revocation](#zkp-revocation) in the reference section. For non-ZKP credentials, this probably means consulting revocation lists or similar.

Offline mode works exactly the same way as it works for ordinary credentials, and with exactly the same latency and caching properties.

Chained credentials may contain ordinary credential attributes that describe the holder or other subjects, including ZKP-style blinded link secrets. This allows chained credentials to be combined with other VCs in composite presentations.

#### Sample credentials

Here is JSON that might embody credentials C1, C2, and C3 from our use case. Note that these examples suppress a few details that seem uninteresting, and they also introduce some new concepts that are described more fully in the [Reference](#reference) section.

##### C1 (delegates management of car to Ur Wheelz Houston)

```jsonc
{
    "@context": ["https://w3.org/2018/credentials/v1", "https://github.com/hyperledger/aries-rfcs/tree/main/concepts/0104-delegatable-credentials"],
    "type": ["VerifiableCredential", "Proxy.D/CarRentalTF/1.0/subsidiary"],
    "schema": "WwogICJAY29udGV4dCIsIC8vSlN... (clipped for brevity) ...ob2x",
    "provenanceProofs": [
        [["authorization"], {
            // proof that Ur Wheelz National owns the car
            }]
    ],
    // Optional. Might be used to identify the car in question.
    "credentialSubject.car.VIN": "1HGES26721L024785",
    "credentialSubject.proxied.permissions": {
        "grant": ["rent", "maintain", "sell", "drive", "delegate"], 
        "when": { "role": "regional_office" } 
    }
    // Optional. Binds the credential to a business name.
    "credentialSubject.holder.name": "Ur Wheelz Houston",
    // Optional. Binds the credential to the public DID of Houston office.
    "credentialSubject.holder.id": "did:example:12345",
    "credentialSubject.holder.role": "regional_office",
}
```

##### C2 (delegates permission to Alice to drive, subdelegate)

```jsonc
{
    // @context, type, schema are similar to previous
    "provenanceProofs": {
        [["authorization"], {
            // proof that Ur Wheelz Houston could delegate
            }]
    },
    // Optional. Might be used to identify the car in question.
    "credentialSubject.car.VIN": "1HGES26721L024785",
    "credentialSubject.proxied.permissions": {
        "grant": ["drive", "delegate"], 
        "when": { "role": "renter" } 
    }
    // Optional. Binds the credential to a business name.
    "credentialSubject.holder.name": "Alice Jones",
    // Optional. Binds the credential to the public DID of Houston office.
    "credentialSubject.holder.id": "did:example:12345",
    "credentialSubject.holder.role": "renter",
    // Limit dates when delegation is active
    "credentialSubject.holder.constraints.startTime": "2020-05-20T14:00Z",
    "credentialSubject.holder.constraints.endTime": "2020-05-27T14:00Z",
    // Provide a boundary within which delegation is active
    "credentialSubject.holder.constraints.boundary": "USA:TX"
}
```

##### C3 (delegates permission to valet to drive)

```jsonc
{
    // @context, type, schema are similar to previous
    "delegationProof": {
        [["authorization"], {
            // proof that Alice could delegate
            }]
    },
    // Optional. Might be used to identify the car in question.
    "credentialSubject.car.VIN": "1HGES26721L024785",
    "credentialSubject.proxied.permissions": {
        "grant": ["drive"], 
        "when": { "role": "valet" } 
    }
    // Optional. Binds the credential to a business name.
    "credentialSubject.holder.name": "Alice Jones",
    // Optional. Binds the credential to the public DID of Houston office.
    "credentialSubject.holder.id": "did:example:12345",
    "credentialSubject.holder.role": "valet",
    "credentialSubject.holder.constraints.startTime": "2020-05-25T04:00Z",
    "credentialSubject.holder.constraints.endTime": "2020-05-25T06:00Z",
    // Give a place where delegation is active.
    "credentialSubject.holder.constraints.pointOfOrigin": "@29.7690295,-95.5293445,12z",
    "credentialSubject.holder.constraints.radiusKm": 0.1,
}
```

## Reference

### Delegating Permissions

In theory, we could just enumerate permissions in delegate credentials in a special VC field named `permissions`. To delegate the `drive` and `delegate` privileges to Alice, this would mean we'd need a credential field like this:
 
```jsonc
{
    // ... rest of credential fields ...
    
    "permissions": ["drive", "delegate"]
}
``` 
 
Such a technique is adequate for many delegation use cases, and is more or less how ZCAP-LD works. However, it has two important limitations:

* It doesn't support __aggregate delegation__&mdash;delegating to a group of holders who must act together to acquire the permission. Example: there is no obvious way for a company to delegate signing permissions to 3 members of its board as a collective unit&mdash;only to single board members as individuals.
* It __doesn't convey context__ in ways that lets humans adjudicate the intent of the delegator. This is a [requirement for guardianship](../../concepts/0103-indirect-identity-control/README.md#guardianship), and possibly for some other specialized delegation use cases.

To address these additional requirements, delegate credentials split the granting of permissions into two fields instead of one:

1. The permission model that provides context for the credential is expressed in a special field named `credentialSubject.proxied.permissions`. This field contains an [SGL](https://evernym.github.io/sgl) rule that embodies the semantics of the delegation.
2. The holder (delegate) is given a named role in that overall permission scheme in a special field named `credentialSubject.holder.role`. This role has to reference something from `...permissions`. 

In our Ur Wheelz / Alice use case, the extra expressive power of these two fields is not especially interesting. The credential that Alice carries might look like this:

```jsonc
{
    // ... rest of credential fields ...
    
    "credentialSubject.proxied.permissions": { 
        "grant": ["drive"], 
        "when": { "role": "renter" } 
    }
    "credentialSubject.holder.role": ["renter"]
}
``` 

Since `credentialSubject.holder.role` says that Alice has the `renter` role, the grant of `drive` applies to her. We expect permissions to always apply directly to the holder in simple cases like this.

But in the case of a corporation that wants to delegate signing privileges to 3 board members, the benefit of the two-field approach is clearer. Each board member gets a delegate credential that looks like this:

```jsonc
{
    // ... rest of credential fields ...
    
    "credentialSubject.proxied.permissions": { 
        "grant": ["sign"], 
        "when": { "role": "board", "n": 3 } 
    }
    "credentialSubject.holder.role": ["board"]
}
```

Now a verifier can say to one credential-holding board member, "I see that you have *part* of the signing privilege. Can you find me two other board members who agree with this action?"

### Privacy Considerations

Non-ZKP-based chained credentials reveal the public identity of the immediate downstream holder to each issuer (delegator) -- and they reveal the public identiy of all upstream members of the chain to the holder.

ZKP-based chained credentials offer more granular choices. See [ZKP Variants and their privacy implications](#zkp-variants-and-their-privacy-implications) below.

### Embedded schema

Often, the schema of a chained credential might be decided (or created) by the issuer. In some cases, the schema might be decided by the delegatee or specified fully or partially in a trust framework. 

It is the responsibility of each issuer to ensure that the special `schema` attribute is present and that the credential matches it.

### ZKP Revocation

When a chained credential is issued, a unique credential id is assigned to it by its issuer and then the revocation registry is updated to track which credential id was issued by which issuer. During proof presentation, the prover proves in zero knowledge that its credential is not revoked. When a credential is to be revoked, the issuer of the credential sends a signed message to the revocation registry asking it to mark the credential id as revoked. Note that this allows only the issuer of the credential to revoke the credential and does not allow, for example, the delegator to revoke any credential that was issued by its delegatee. However, this can be achieved by the verifier mandating that each credential in the chain of credentials is non-revoked. When a PCF decides to revoke the PTR credential, every subsequent credential should be considered revoked.

In practice, there are more attributes associated with the credential id in the revocation registry than just the public key. The registry also tracks the timestamps of issuance and revocation of the credential id and the prover is able to prove in zero knowledge about those data points as well. The way we imagine revocation being implemented is having a merkle tree with each leaf corresponding to a credential id, so for a binary tree of height 8, there are 2^8 = 256 leaves and leaf number 1 will correspond to credential id 1, leaf number 2 will correspond to credential id 2, and so on. The data at the leaf consists of the public key of the issuer, the issuance timestamp and the revocation timestamp. We imagine the use of Bulletproofs merkle tree gadget to do such proofs like we plan to do for the upcoming version of anonymous credentials.

### ZKP Variants and their privacy implications

There are two general categories of chained anonymous credentials, distinguished by the tradeoff they make between privacy and efficiency. Choosing between them should depend on whether privacy between intermediate issuers is required.

The more efficient category provides no privacy among the issuers but only verifiers. Suppose the holder, say Alice, requests a chained credential from the root attestor, say Acme Corp., which it further attests to a downstream issuer Bob which further delegates to another downstream issuer Carol. Here Carol knows the identity (a public key) of Bob and both Carol and Bob know the identity of Alice but when Carol or Bob uses its credential to create a proof and send it to the verifier, the verifier only learns about the identity of the root attester.

Less efficient but more private schemes (isolating attestors more completely) also exist.

The first academic paper in the following list describes a scheme which does not allow for privacy between attestors, but that is more efficient; the second and third papers make the opposite tradeoff.

1. [Practical UC-Secure Delegatable Credentials with Attributes and Their Application to Blockchain](https://acmccs.github.io/papers/p683-camenischA.pdf).
2. [Delegatable Attribute-based Anonymous Credentials from Dynamically Malleable Signatures](https://eprint.iacr.org/2018/340)
3. [Delegatable Anonymous Credentials from Mercurial Signatures](https://eprint.iacr.org/2018/923) 

In the first scheme, each issuer passes on its received credentials to the issuer it is delegating to. In the above Acme Corp., Alice, Bob and Carol example, if when Alice delegates to Bob, it gives Bob a new credential but also a copy of the credential it received from Acme Corp. And when Bob delegates to Carol, he gives a new credential to Carol but also the copies of credential it got from Alice and the one Alice had got from Acme Corp. The verifier while getting a proof from, say Carol, does not learn the about the Alice, Bob or Carol but learns that there were 2 issuers between Acme Corp and the proof presenter. It also learns the number of attributes in each credential in the chain of credentials.

In the second and third scheme, during delegation, the delegator gives only one credential to the delegatee derived from its credential but the delegatee randomizes its identity each time. The second scheme's efficiency is comparable to the first scheme's but it has a trusted authority which can deanonymize any issuer given a proof created from that issuer's credential. This might be fine in cases where the PCF can be safely made the trusted authority and is not assumed to colluding with the verifiers to deanonymize the users.

In the third scheme, another limitation exists that non-root issuers cannot add any more attributes to the credential than the root issuer did.

## Drawbacks

If the trust framework is not properly defined, malicious parties might be able to get credentials from delegators leading to priviledge escalation. 

## Rationale and alternatives

An expensive alternative of delegatable credentials is the holder to get credential directly from the root issuer. The expensiveness of this is not just computational but operational too.

## Prior art

Delegatable anonymous credentials have been explored since the last decade and the first efficient (somewhat) came in 2009 by Belenkiy et al. in "Randomizable proofs and delegatable anonymous credentials". Although this was a significant efficiency improvement over previous works, it was still impractical. Chase et al. gave a conceptually novel construction of delegatable anonymous credentials in 2013 in "Complex unary transformations and delegatable anonymous credentials" but the resulting construction was essentially as inefficient as that of Belenkiy et al. 

## Implementations

The following lists the implementations (if any) of this RFC. Please do a pull request to add your implementation. If the implementation is open source, include a link to the repo or to the implementation within the repo. Please be consistent in the "Name" field so that a mechanical processing of the RFCs can generate a list of all RFCs supported by an Aries implementation.

Name / Link | Implementation Notes
--- | ---
 |  | 

