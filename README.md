# Queryable Credentials

This codebase contains research into queryable credentials; this started with the 

## Motivation

Verifiable Credentials are seeing a rise in popularity - with reference made to them across the European eUIDAS, UK DIATF and Australian trust frameworks. The key drivers appear to be the ability to prove data integrity through signatures, and the ability to selectively disclose attributes from Verifiable Credentials, thus enhancing privcy.

At present we see the following limitations:
 - Provide a layer for *trust building* for data stored in decentralised B2C2B data transfers like those that take place on top of [Linked Web Storage](https://www.w3.org/groups/wg/lws/), and the [Semantic Web Agents]() that operate on top of them. Look [here]() for complimentary work that we are investigating on:
    - [trust evaluation]() to allow systems to evaluate what data they can use (sure the data may be signed, but how do you know whether to trust the signatory...)
    - relatedly, [trust negotiation]() to allow systems (incl. agents) to "discuss" which provenance, including signatures, they need to believe a given piece of data
    - [policy evaluation]() to allow systems (incl. agents) to establish what data they *can* share
    - relatedly, [policy creation and enforcement]() how do systems define their data sharing policies? Can systems create legal agreements with other systems to ensure legal safeguards are in place if data is not used beyond its intended purpose.

## Initial Design Thoughts for a Queryable API

The goal of [RDF 1.2](https://www.w3.org/2022/08/rdf-star-wg-charter/) is to support a reification syntax for RDF, that is, allowing one to "make statements about statements".

Importantly, [RDF 1.2](https://www.w3.org/2022/08/rdf-star-wg-charter/) is also approaching the end-date of its WG charter - which means that it is close to a point of stability.

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

  FILTER (?x >= "03-01-2024"^^xsd:dateTime)
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

As explored more deeply in the research section, there appear to be to be a few general approaches that can be taken:

 - Build a SPARQL engine on top of an existing ZKVM such as [Riskzero](https://risczero.com) or [Halo 2](https://zcash.github.io/halo2/):
    - Pros:
      - Would likely be able to implement full SPARQL expressivity
      - These ZKVMs are very robust, and appear to be well funded by the crypto communities
    - Cons:
      - Feasibility unknown, requires advice from ZKVM expert or experimentation
      - Would likely result in large proof size since proof is at level of assembly instruction execution rather than higher-order rule evaluation
      - 

 - Build on top of a related solution such as:
   - [Circuitree](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=9718332): A Datalog Reasoner in Zero-Knowledge
     - Pros:
       - Close to SPARQL technology (existing N3 reasoning and SPARQL querying engines are built on top of )
     - Cons:
       - Cannot find public codebase (have contacted author)

 - Bespoke approaches:
   - 

 - Try compose operations from existing W3C VC Specifications.
   - 

 - Try a similar approach the the existing W3C VC Specifications with updated hashing algorithms

## Groups and organisations with related interests
 - W3C verifiable credentials
 - IEEE verifiable credentials
 - Stanford Cryptography
 - The riskzero folks

## Proposed research plan
 - A new hashing algorithm for 

## Questions I have
 - Which of the above approaches is best in terms of:
   - Path to adoption by existing credential issuers
   - Path to adoption in data decentralisation projects such as Solid, [AcitivtyPods](https://activitypods.org) and NextGraph. 
