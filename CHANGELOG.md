# Changelog

Semantic versioning: term-set changes (adding a language, killing a term) are minor
versions; matching-semantics changes (boundaries, negation window, corroboration
rule) are major.

## 1.0.0 — 2026-08-25

First standalone release, extracted from the DisclosureProof scanner's internal
rule-pack lineage:

- **2026-07 (internal):** six languages (en, nl, de, fr, es, it), unicode
  word-boundary matching, negation window, low-confidence tier.
- **2026-07-25/27 (internal):** clause-bounded negation (the "I'm not a human —
  I'm an AI assistant" fix); 18 languages added with per-language adversarial
  review and the cross-language homograph kill list (docs/kill-list.md);
  corroboration tightened: bare acronyms never corroborate (the Romanian
  "ai"/"ia" and Slovenian "ki" regressions); Romance strong compounds added
  ("assistant ia", "soy un asistente de ia", …) and "assistente ia"/"agente
  ia"/"agent ia" demoted (Portuguese "ia" = imperfect of "ir").
- **2026-08-10 (internal):** Irish (ga) added — the 24th official EU language,
  previously absent while the count said otherwise (see "The Irish confession" in
  the README). Terms verified against téarma.ie and live Gaeilge usage; the "IS"
  acronym recorded as permanently unaddable; Irish negators added so "Ní róbat
  mé" (the Irish reCAPTCHA) reads as a denial.
- **This release:** the matching core (scanTerms, negation, longest-span dedupe),
  the corroboration rule as `assessDisclosure`, `matchPhrasesWithNegation`,
  the full 24-EU-languages + Catalan term data, and the ported test suite
  (77 tests: per-language positives, everyday-copy negatives, negated denials,
  cross-language regressions).
- **One deliberate divergence from the production scanner's shipped set:**
  Hungarian `mi-asszisztens` is removed here. Its kill was recorded in the July
  review ("a mi asszisztens csapatunk" — *our assistant team* — is human-staff
  copy that matches cleanly) but the term slipped into the shipped set anyway;
  this package applies the recorded kill, with a regression test. See
  docs/kill-list.md § Hungarian.
