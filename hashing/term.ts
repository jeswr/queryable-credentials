import { DatasetCore, Term } from "@rdfjs/types";
import {} from "@mattrglobal/bbs-signatures";

interface Config {
  hash: (term: string) => string;
}

export function termHash(term: Term): string {
  return term.value;
}
