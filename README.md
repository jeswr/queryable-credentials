# Queryable Credentials

This codebase contains research into queryable credentials; this started with the question "Can we do ZKP over SPARQL 1.2 or N3 queries to prove that a result can be derived from facts signed by trusted entities?".

## Motivation

Verifiable Credentials are seeing a rise in popularity - with reference made to them across the European eUIDAS, UK DIATF and Australian trust frameworks. The key drivers appear to be the ability to prove data integrity through signatures, and the ability to selectively disclose attributes from Verifiable Credentials, thus enhancing privcy.

At present we see the following limitations:
 - We are unsure whether there is enough expressivity to provide a layer for *trust building* for data stored in decentralised B2C2B data transfers like those that take place on top of [Linked Web Storage](https://www.w3.org/groups/wg/lws/), and the [Semantic Web Agents]() that operate on top of them. Look [here]() for complimentary work that we are investigating on:
    - [trust evaluation]() to allow systems to evaluate what data they can use (sure the data may be signed, but how do you know whether to trust the signatory...)
    - relatedly, [trust negotiation]() to allow systems (incl. agents) to "discuss" which provenance, including signatures, they need to believe a given piece of data
    - [policy evaluation]() to allow systems (incl. agents) to establish what data they *can* share
    - relatedly, [policy creation and enforcement]() how do systems define their data sharing policies? Can systems create legal agreements with other systems to ensure legal safeguards are in place if data is not used beyond its intended purpose.
 - There are Semantic design concerns with the current specs (see below)

## What is zero knowledge proof?

Zero knowledge proofs can enable selective disclosure and derived disclosure of signed data. Selective disclosure is sharing a subset of signed attributes, derived disclosure is proving that a property can be derived from a set of signed facts (e.g. I can prove that I am over 21 to a bar using a government signed statement about my DOB, without disclosing my DOB to the bar).

## Pointers for verifiable credentials + ZKP

Verifiable Credential Standards:
 - [W3C VC Data Model](https://www.w3.org/TR/vc-data-model-2.0/)
 - [IETF SD-JWT VCs](https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-03.html)


W3C BBS+ and ECDSA signature algorithms for enabling ZKP:
 - [ECDSA](https://www.w3.org/TR/vc-di-ecdsa/#representation-ecdsa-sd-2023)
 - [BBS](https://www.w3.org/TR/vc-di-bbs/#test-vectors)

## Initial Design Thoughts for a Queryable API

My initial thought was to build a [SPARQL 1.2 query engine](https://www.w3.org/TR/sparql12-entailment/#sec-intro) which is able to produce a ZKP showing that a result can be derived from a set of unknown facts - that are provably signed by trusted entities. Ideally [entailment](https://www.w3.org/TR/sparql12-entailment/#RIFCoreEnt) should be supported.

The goal of [RDF 1.2](https://www.w3.org/2022/08/rdf-star-wg-charter/) is to support a reification syntax for RDF, that is, allowing one to "make statements about statements". This makes it a good system for modelling claims and signatures about other claims.

Importantly, [RDF 1.2](https://www.w3.org/2022/08/rdf-star-wg-charter/) is also approaching the end-date of its WG charter - which means that it is close to a point of stability. There is a [JSON-LD serialisation of RDF 1.2](https://json-ld.github.io/json-ld-star/) - though currently at CG status.

To give an example - I may have a KG consisting of the facts:

```ttl
:UKDrivingAuthority :claims <<:Jesse :dob "06-04-2000"^^xsd:dateTime>> .
  :signature [...] .

:UKImmigrationAuthority :claims <<:Jesse :hasCitizenship :Australia>> .
  :signature [...] .

:UKImmigrationAuthority :claims <<:Australia a :CommonwealthCountry>> .
  :signature [...] .
```

I want to be able to execute the following SPARQL ASK query (API to be refined). I also want to be able to execute all other read-only SPARQL operations (SELECT and CONSTRUCT).

```sparql
ASK {
   :Jesse :dob ?x .
         :hasCitizenship [ a :CommonwealthCountry  ]

  FILTER (?x >= "03-01-2006"^^xsd:dateTime)
}
```

And have a zero-knowledge proof proving that the statement is true if you trust claims issued by `:UKDrivingAuthority` and `:UKImmigrationAuthority`.


## Explicit Goals

 - Ongoing engagement with W3C and IEEE standards groups to solve challenges faced by current standards implementors 
 - Build a solution which allows Semantic Web Agents to operate over trusted data
 - Produce novel algorithmic insights for academic publication

## On Abstractions

It is my view that part of the reason for the popularity of the current form of the VC specifications is a result of the 1-1 conceptual mapping between a physical credential (e.g. a drivers license) and a digital credentials / documents.

Whilst this approach is very sensible from a UX perspective, it does not mean that this is the right abstraction to be applying at the base layer of IEEE and W3C integrity standards - where I see the capacity to support a much wider range of use cases. That is not to say that an integrity standards cannot be *built upon* the more queryable integrity standards that we are proposing. For instance; we suggest that the contemporary VC APIs would be defined by saying "the result should be equivalent to executing a given CONSTRUCT query against the more generic integrity stadard."

## Semantic concerns with the current standards (to be a [Pedantic Webber](https://harth.org/andreas/2016/pedantic-web/))

 - Pointers conflate syntax and semantics
 - Unecessary encoding with proofValue parser and serializer
 - Conflating evalutation and data useful to a verifier with a deliniation between a baseProof and derivedProof in the spec - similarly with indexing of quad terms.
  - The proof is added to the named graph that you are signing and making claims about. A concern [also raised by the late Henry Story](https://lists.w3.org/Archives/Public/semantic-web/2023Sep/0005.html).


## Approaches

As explored more deeply in the research section, there appear to be to be a few general approaches that can be taken. For sligtly more detailed, but less coherent notes, see [here](./notes/research.md):

 - Build a SPARQL engine on top of an existing [Zero Knowledge Virtual Machine](https://dev.risczero.com/api/zkvm/) (ZKVM) such as [Riskzero](https://risczero.com) or [Halo 2](https://zcash.github.io/halo2/):
    - Pros:
      - Would likely be able to implement full SPARQL expressivity
      - These ZKVMs are very robust, and appear to be well funded by the crypto communities
    - Cons:
      - Feasibility unknown, requires advice from ZKVM expert or experimentation
      - Would likely result in large proof size since proof is at level of assembly instruction execution rather than higher-order rule evaluation

 - Build on top of a related solution such as:
   - [Circuitree](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=9718332): A Datalog Reasoner in Zero-Knowledge
     - Pros:
       - Close to SPARQL technology (existing N3 reasoning and SPARQL querying engines are built on top of)
     - Cons:
       - Not tailored for proof of derived facts - and likely has large proofs size; instead is defined for full ZKP of arbitrary prolog execution.
       - Cannot find public codebase (am trying to contact author)
   - [PoneglyphDB](https://arxiv.org/pdf/2411.15031): ZKP of SQL Evaluation - in this case it would more likely that we build a related solution than an identical solution.
     - Pros: 
       - It is a working solution for doing fully fledged ZKP proof of correct evalutation of a query engine that does not disclose the data used throughout the evaluation. 
     - Cons:
       - SPARQL `->` SQL rewrites is going to be a very messy approach if that is how we chose to go about it
       - It is not dealing with signatures; it is proving that SQL queries were evaluated correctly.
   - [Lean ZKP](https://eprint.iacr.org/2024/267.pdf): A zero knowledge theorem prover compatible with lean4:
      - Pros:
        - Specialised for proving that theorems are true in zero knowledge - including SAT and other formal logic problems. This is a problem that can easily be translated into "is the following query true given this set of facts".
        - Has a relatively small proof size according to the paper
      - Cons:
        - Codebase appears to have been unmaintained for last 8 months
        - Unclear how easy it would be to translate this to a production system - would a theorem prover be needed to make every implementation work?
        - Would likely need to collaborate directly with the original author to make this work.

 - Try compose operations from existing W3C VC Specifications / build a queryable interface on top of them.
   - Pros:
     - Builds on top of existing standards / no need to get under the hood of managing canonicalisation, hashing, and signing.
     - Using existing standards makes adoption easier
   - Cons:
     - **Likely deal breaker**: Will not have the expressivity of SPARQL or inference, in fact I'm not sure that anything other than choosing to show a subset of the originally issued VC is true with the current BBS or ECDSA specs - including the inability to perform e.g. range proofs over age statements. The reason for this claim is that the granularity of a signature is over the hash of an n-quad stringds (or a multiset of hashes of n-quad strings). This means that in order to do a range proof one would have to prove, in zero knowledge, that the string can be (1) parsed to a triple where the the subject is :Jesse the predicate is :dob and the object is some xsd:dateTime less than or equal to "03-01-2006"^^xsd:dateTime. 
   - Compromised approach
     - It may be possible to improve the ability to do things like range proofs with some updates to the current specs. Most immediately coming to mind would be to change the strategy from hashing n-quads to, to perform salted hashing on each element of a triple (and for typed datatypes to separately hash the datatype, value and langtag) and then do a merkle-tree style rollup of the hashes and sign the root hash. That way the holder is able to selectively reveal and make claims about parts of triples; and directly apply range proofs on e.g. the value of a triple.

 - Bespoke approaches:
   - Largely go from scratch; with something similar to the RDF 1.2 style API above in mind
     - Pros:
       - We can be very particular about the API design and how things are signed in order to have high query expressivity
     - Cons:
       - This would essentially result in needing to build competing specs to the current VC specs which would be very time consuming and have less likelihood of adoption of the RDF 1.2 specs already have adoption themselves.


## Proposed Research Plan

Based on the above, it seems to me that the most sensible way forward is to in parallel work on the following three streams of work:
  - Work on improved hashing algorithms that would begin to allow e.g. range proofs when added to the existing [BBS](https://www.w3.org/TR/vc-di-bbs/#test-vectors) VC spec.
  - Reach out to the authors of [Lean ZKP](https://eprint.iacr.org/2024/267.pdf) to understand the feasibility of implementing a solution on top of their work.
  - Experiment with implementing some basic SPARQL opertions on top of [riskzero](https://risczero.com) to get a sense of how easy it is to build any kind of ZKP query evalutation on top of that systen - and what plumbing needs to be done to create the type of APIs that we want.


## Groups and organisations with related interests

Groups who may be interested are:
 - W3C verifiable credentials
 - IEEE verifiable credentials
 - Stanford Cryptography
 - The riskzero folks

## Questions I have
 - Which of the above approaches is best in terms of:
   - Path to adoption by existing credential issuers
   - Path to adoption in  decentralisation projects such as Solid, [ActivtyPods](https://activitypods.org) and NextGraph.
   - Design that will allow Web Agents to operate over trusted data in a privacy preserving manner?
   - Operating best with the Web architecture and REST design principles
