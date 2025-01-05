






 - selective disclosure requirements defined by ETSI (The European Telecommunications Standards Institute) https://www.etsi.org/deliver/etsi_tr/119400_119499/119476/01.01.01_60/tr_119476v010101p.pdf
 - 

ZKPs and Prolog
tom.godden@vub.bew
 - https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=9718332
 - For instance, it is the basis of graph query languages such as SPARQL [16]. We will compile Datalog, as an existing high-level programming language, to zero-knowledge.
 - We believe it could be an interesting alternative approach to linked data proofs
 - Note that this proof requires arithmetic reasoning, which is future work for Circuitree.
 - No public codebase - have emailed author

ZKPs and query
binbing@uci.edu
 - https://arxiv.org/pdf/2411.15031
	 - ZKP for SQL verification
	 - Table 1 compares PoneglyphDB and prior research on verifiable database systems [30, 47, 49] in terms of three properties: (1) the as- surance of zero-knowledge (i.e., confidentiality), (2) non-interactive operability, and (3) applicability to arbitrary SQL queries.
	 - Some is based on [Plonk](https://eprint.iacr.org/2019/953.pdf) which was developed at Protocol Labs + Aztec (https://eprint.iacr.org/2019/953.pdf)
	 -  The correctness and security of PoneglyphDB depend on PLONKish circuits and the Halo2 proving system

ZKPs for theorem provers:
 - https://eprint.iacr.org/2024/267.pdf
	 - emlaufer@cs.stanford.edu
	 - Codebase seems unmaintained https://github.com/emlaufer/zkpi/blob/master/driver.py

Declarative ZKP
 - 

Futher Solid-related Applications:
 - Client side policy evalutation https://ieeexplore.ieee.org/abstract/document/10786564

Related reading:
 - Riskzero compared to halo 2 https://medium.com/@ZeroAgeVentures/risczero-bringing-zero-knowledge-proofs-to-mainstream-c261097491cc
 - Understanding plonk https://vitalik.eth.limo/general/2019/09/22/plonk.html

Possibly useful events:
 - https://www.ndss-symposium.org/ndss2025/

Jesse Opinion:
 - VCs should have been defined in terms of RDF, NOT the JSON-LD serialisation. Is it too late to course correct?

Microsoft appears to be working on something in the space with SPARTAN:
 - https://eprint.iacr.org/2019/550.pdf we should contact

Pointers by MS:
 - https://www.w3.org/TR/vc-di-ecdsa/#representation-ecdsa-sd-2023
	 - Principle behind ECDSA-SD 2023 is that you sign the base "mandatory" facts with a single signature; and then sign a list of non-mandatory quads individually. This allows selective disclosure in the sense that you can select a subset of the non-mandatory quads to disclose and then just include that subset + their relevant signatures.
	 - ECDSA seems largely useless for the use case were are interested in.
 - https://www.w3.org/TR/vc-di-bbs/#test-vectors
	 - Up to https://www.w3.org/TR/vc-di-ecdsa/#enhanced-example-for-representation-ecdsa-rdfc-2019-with-curve-p-384
	 - https://www.w3.org/TR/vc-di-ecdsa/#derived-proof



Summary article on ZK and selective disclosure:
 - https://gataca.io/blog/ssi-essentials-which-selective-disclosure-protocol-will-succeed/
 - Selective disclosure + ZKSnarks https://github.com/decentralized-identity/snark-credentials/blob/master/whitepaper.pdf

Questions:
 - Have you considered the use of zkVMs out of the box
 - Why map back to the canonical bnode IDs rather than making this mapping part of the canon process (i.e. perform rdf-canon, then transform the IDs)
 - This represents an ordered list of statements that will be subject to mandatory and selective disclosure, i.e., it is from this list that statements are grouped.
 - Why did the notion of pointers arise? Note that in a SPARQL paradigm this would just be mapped to (CONSTURCT { ?s ?p ?o  } WHERE { ?s ?p ?o VALUES (?p) { ... } }); or something which also selects relevant object data.
 - Is there anything even like the notion of a range proof in these specs? Even if this is something that BBS singatures permit, there does not seem to be a way of requesting them using the spec.
	 - I also suspect that since it is the quad that is signed; one may need to do parsing of it in a non-zero knowledge way since parsing in zero knowledge seems non-trivial.
	 - Even when the above is done correctly, there are further guarantees that need to be met. E.g. 

 - **So question here is: how are range proofs done in zero knowledge?**
 - **Paper 1: An RDF hashing algorithm for more expressive digital credentials**
 - **Whilst a parallel line of research is: Can we implement a full SPARQL engine using something like Risczero**

Extra BBS features:
 - Anonymous holder binding: Only the holder can create derived proofs (as, I assume, they require a private key known only to the holder)
 - PID: Letting the verifier know that results are derived from different issuers.

Qualms:
 - Pointers conflate syntax and semantics
 - Unecessary encoding with proofValue parser and serializer
 - Conflating evalutation and data useful to a verifier with a deliniation between a baseProof and derivedProof in the spec - and indexes should absolutely NOT appear anywhere in a spec!!
 - What is the purpose of mandatory pointers. Could the holder not just choose to omit disclosure of them? / How are they enforced as mandatory by the issuer? (as far as I can tell this is more about enabling the mandatory statements to be signed in bulk for ecdsa-sd-2023)
 - In ecdsa-sd-2023, the appears to be disclosure of a minimum number of statements appearing in the graph, since adjSignatureIndexes indicates that there are at least 15 statements; whilst only 10 in total are being revealed (perhaps not since this is not appearing in the signed derived document)
 - In ecdsa-sd-2023, the proof breaks if you add / remove data to the document because the signatures are tied to the indexes of data; rather than there just being some signed and some unsigned facts

Hashing questions / research (**premature optimisation warning**):
 - Is there a better way of hashing the graphs / documents than doing rdf-canon -> then hash the document. Immediate thoughts would be:
	 - Can reduce a lot of overhead straight away by having it be iterate through subjects in order; for each subject the predicate; for each predicate the object.
	 - If you go "objects up" it is also highly parallelisable
	 - Using https://people.csail.mit.edu/devadas/pubs/mhashes.pdf could also make the multiset hashing of it all more efficient

Driving motivation:
 - We want good abstractions that allow applications across the Web (LLMs, Apps, etc. to request) to get the data that they care about *without* 


Has good summary of current ZKVMs
https://adapulse.io/the-convergence-of-zero-knowledge-proofs-and-decentralized-systems-part-2/

https://www.etsi.org/deliver/etsi_tr/119400_119499/119476/01.02.01_60/tr_119476v010201p.pdf