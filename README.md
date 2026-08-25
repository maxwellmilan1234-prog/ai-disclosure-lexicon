# ai-disclosure-lexicon

**Does this text say "you are talking to an AI"?**

A deterministic, auditable lexicon for AI/bot self-disclosure wording in the **24
official EU languages plus Catalan** — with unicode-boundary matching, negation
handling, a low-confidence tier with a corroboration rule, and (the part that took
the longest) **cross-language homograph screening**.

Zero dependencies, pure data + ~150 lines of matching code, ESM, Node ≥ 20.

Extracted from the [DisclosureProof](https://disclosureproof.com/) scanner, where it
is the first pass of the EU AI Act Article 50 chatbot-disclosure check, and where it
powered [The State of AI Disclosure 2026](https://disclosureproof.com/research/state-of-ai-disclosure/)
(1,088 detector-flagged, EU-facing sites). Every rule in here was paid for by a
false positive or false negative found in adversarial review or production — most
of them listed below.

```js
import { assessDisclosure } from "ai-disclosure-lexicon";

assessDisclosure("Hi! I'm an AI assistant.").disclosed;              // true
assessDisclosure("Ich bin ein KI-Assistent").disclosed;              // true
assessDisclosure("Ní róbat mé — is duine daonna atá anseo.").disclosed; // false (Irish: "I'm not a robot")
assessDisclosure("track my robot order").disclosed;                  // false (product copy, not a disclosure)
```

## Why this is not just a word list

Matching "AI words" across 25 languages **in the same text** — a chat greeting does
not announce its language — means every term fires on every language's ordinary
copy. That is where word lists die. The stories, all real:

**Romanian nearly always "discloses".** English lists the acronym `ai`. French,
Spanish, Italian and Catalan list `ia`. In Romanian, *ai* is "you have" (2nd person
of *a avea*) and *ia* is "take(s)" — two of the most frequent words in the language.
`"Bună! Dacă ai întrebări, ia legătura cu echipa noastră."` ("Hi! If you have
questions, get in touch with our team") fires both, as whole words, with perfect
word boundaries. Before the guard existed, that pair graded a human-staffed Romanian
support chat as a detected AI disclosure. The fix is structural: bare acronyms
(`ai`, `a.i.`, `ki`, `ia`, `ии`) are permanently low-confidence and **can never
corroborate each other** — corroboration requires at least one non-acronym term.

**Slovenian broke German's acronym.** German lists `ki` (Künstliche Intelligenz).
*Ki* is also Slovenian's ubiquitous relative pronoun — "who/which". A kitchen-robot
promo like `"Kupite kuhinjski robot, ki vam prihrani čas pri peki."` ("Buy a kitchen
robot that saves you baking time") fires `robot` (low-confidence) **and** `ki`, and
under a naive two-weak-terms rule the pair would corroborate into a disclosure. Same
guard: acronyms don't corroborate, ever.

**Portuguese demoted French.** `assistente ia` and `agente ia` were shipped as
strong terms — the idiomatic Romance-language disclosure is "assistant IA". Then a
negative test found that *ia* is also the Portuguese imperfect of *ir*: `"o
assistente ia transferir a chamada"` means **a (human) assistant was going to
transfer the call**. The compounds were demoted to low-confidence; the strong
Romance disclosures are now the unambiguous forms (`assistant ia` remains strong in
French where the word order pins it, `sou uma ia`, `je suis une ia`, …).

**Irish's acronym cannot exist.** The téarma.ie acronym for *intleacht shaorga*
(artificial intelligence) is **IS** — a whole-word homograph of English "is", one of
the most frequent tokens on the planet. It is unaddable in any confidence tier, so
Irish coverage rests entirely on full terms (`intleacht shaorga`, `bota comhrá`,
`gníomhaire comhráiteach`, explicit declensions included).

**"Ní róbat mé".** The Irish reCAPTCHA checkbox — "I'm not a robot" — is exactly the
kind of text a page-level scraper feeds a lexicon. The Irish negators (`ní`, `níl`,
`nílim`, `gan`) suppress it, and because this lexicon never folds accents, Irish
*ní* stays distinct from Spanish *ni*.

**"Virtual assistant" is a human job.** In Czech, Slovenian, Croatian (and English),
"virtual assistant" is a real freelance profession, and `"Pozdravljeni, sem
virtualna asistentka Petra"` is precisely how a human VA introduces herself in her
own site's chat widget. So first-person "I am a virtual assistant" phrases are not
terms in **any** language, and the noun phrases themselves are low-confidence
everywhere.

**A negator must not cross a clause.** `"I'm not a human — I'm an AI assistant."` is
the clearest possible disclosure, and an unbounded lookback read the *not* (which
negates *human*) as negating the disclosure — accusing exactly the sites that
disclose.
The negation window is clause-bounded: it cuts at the last `, . ; : ! ? — –` before
the match. `"not a bot"` still negates; the em-dash saves the honest robot.

**Romanian "nu" is deliberately not a negator.** It means "now" in Dutch, Danish and
Swedish chat copy — `"chat nu met onze chatbot"` is an *invitation*, not a denial.
Since a stray negator can only ever suppress a real disclosure (the one direction
this lexicon refuses to fail in), the Romanian first-person terms that needed "nu"
were dropped instead. A handful of harmless collisions in the suppression-only
direction were accepted and documented: Latvian *nav* vs English "nav bar", Estonian
*pole* vs "North Pole", Finnish/Estonian *ei* vs German "Ei", Catalan *sense* vs
English "sense".

**Inflections are listed, never generated — and mostly not listed twice.** No
stemming, no accent folding ("künstliche" and "kunstliche" are different tokens;
where an accentless variant is genuinely common — Greek all-caps drops the tonos —
it is listed explicitly). And two inflections of one low-confidence lemma are
usually *not* both listed: under the corroboration rule they would let a single
innocent sentence corroborate itself — `"Avtomatiziran sistem za avtomatizirano
upravljanje"` is ordinary Slovenian industrial copy, not an AI disclosure.

The full record of what was **killed** during the per-language adversarial reviews,
and why, is in [docs/kill-list.md](docs/kill-list.md). For a matcher like this the
absences are load-bearing.

## The Irish confession (or: why the study says "23 of 24")

Through multiple review passes and two pre-registered documents this lexicon was
described — including by its authors, to themselves — as covering "all 24 official
EU languages". A self-audit before the study published counted the keys: **23
official EU languages plus Catalan**. Catalan is not an official EU language; Irish,
official since 2007, was simply absent, and nobody had decided that — the number 24
was reached by counting keys, not by checking them against the official list.

The study was already mid-measurement under a frozen instrument, so the published
numbers honestly say **23 of 24 plus Catalan** — and the study page states plainly
that under the frozen instrument a greeting in an uncovered language published as
"no disclosure detected", not as "could not assess"; the dedicated
could-not-assess-language outcome the study pre-registered shipped only after run 2,
alongside Irish itself. Irish was added on 2026-08-10, after the freeze lifted, with
terms verified against [téarma.ie](https://www.tearma.ie/) (the national terminology
database) and live Gaeilge usage. This package ships the post-fix lexicon: **24
official EU languages plus Catalan**.

## Field numbers

From the study run this instrument powered (August 2026, 1,088 live EU sites —
methodology and confidence intervals on the
[study page](https://disclosureproof.com/research/state-of-ai-disclosure/)): 794
sites had a confirmed chat widget; 78% of those widgets could not be read by the
study's automated visitor (consent layers, panels that never opened, unreadable
panel text — a substantial share attributed by the study to its own instrument
rather than to the sites). Of the **174 readable**
widget texts, **19 disclosed AI (11%)**, **73 contained no disclosure wording
(42%)**, and **82 were inconclusive (47%)**. Three buckets, kept separate on
principle — "no disclosure detected" and "we could not tell" are different claims,
and this library's API preserves that distinction.

## Usage

```js
import {
  assessDisclosure, // the full assessment, with the corroboration rule
  scanTerms,        // every match: { term, lang, index, negated, low }
  disclosesAI,      // raw signal: any non-negated term at all, however weak
  detectedLanguages,
  termLanguages,
  matchPhrasesWithNegation,
  TERMS_BY_LANG, LOW_CONFIDENCE_TERMS, BARE_ACRONYMS, NEGATORS, SUPPORTED_LANGS,
} from "ai-disclosure-lexicon";

const a = assessDisclosure("This chat is automated and powered by AI technology.");
// {
//   disclosed: true,          // no strong term here — two distinct non-acronym
//   strongTerms: [],          // weak terms ("automated" + "powered by ai")
//   weakTerms: ["automated", "powered by ai"],   // corroborate each other
//   terms: [...], languages: ["en"], negatedOnly: false,
//   matches: [{ term, lang, index, negated, low }, ...]
// }
```

- **`assessDisclosure(text)`** is what production uses: one strong term suffices;
  low-confidence terms need two *distinct* non-acronym weak terms to corroborate
  ("I'm an automated virtual assistant" is a real disclosure even though every word
  in it is individually weak). `negatedOnly: true` means the text only *denies*
  being AI — counter-evidence, not absence.
- **`disclosesAI(text)`** is the raw lexicon signal (any non-negated match, low or
  strong). Use it for recall-oriented screening, not for verdicts.
- **`scanTerms(text)`** returns every occurrence with its language, position,
  negation flag and confidence tier. Overlapping matches keep the longest span.
- **`termLanguages(term)`** expands a shared term ("chatbot") to every language that
  lists it — a Dutch panel saying "chatbot" covers Dutch even if the match was
  recorded under `en`.
- **`matchPhrasesWithNegation(text, phrases)`** applies the same negation guard to
  your own fixed phrases (e.g. "AI-generated" content labels): a page stating "This
  article is NOT generated by AI" must not count as carrying an AI label.

## What this is not

- **Not a compliance determination.** This answers "does the text name
  AI/automation", nothing more. Whether a given page *needs* a disclosure, whether
  placement/timing satisfy Article 50, whether an exemption applies — none of that
  is here, and the scanner this was extracted from
  [never says "compliant" either](https://disclosureproof.com/why-we-never-say-compliant/).
- **Not AI-text detection.** It detects disclosure *statements*, not whether text
  was machine-written. No statistical detector is involved anywhere.
- **Not a language detector.** `detectedLanguages` reflects which term sets matched;
  shared loanwords ("chatbot") match from many sets.

## Design rules

1. **Unicode word boundaries** (`\p{L}\p{N}` classes): `bot` never matches inside
   "bottom" or "robot"; `ia` never inside "media". Spaces/hyphens in terms are
   interchangeable and flexible ("ai-powered" ≡ "ai powered").
2. **No stemming, no accent folding.** Declensions are explicit entries; genuinely
   common accentless variants are explicit entries too.
3. **Every term matches every language's text**, so every candidate term was
   screened against ordinary copy in all 25 sets before shipping ([kill
   list](docs/kill-list.md)).
4. **Two-tier confidence + corroboration.** Product-ambiguous words and bare
   acronyms are low-confidence; one strong term or two distinct non-acronym weak
   terms make a disclosure; bare acronyms never corroborate.
5. **Negation fails safe.** The negator union spans all 25 languages; a stray
   cross-language negator can only ever *suppress* a match. We would rather
   under-report a disclosure than claim a site said "I am AI" when it said the
   opposite.
6. **The list is the logic.** Everything is explicit, diffable data — auditable line
   by line, which is the point for anything compliance-adjacent.

## Versioning

Semantic versioning on the package. Term-set changes (adding a language, killing a
term) are **minor** versions; matching-semantics changes (boundaries, negation
window, corroboration rule) are **major**; see [CHANGELOG.md](CHANGELOG.md) for the
lineage, including the internal rule-pack versions this history comes from.

## License

[MIT](LICENSE) © 2026 [DisclosureProof](https://disclosureproof.com/)
