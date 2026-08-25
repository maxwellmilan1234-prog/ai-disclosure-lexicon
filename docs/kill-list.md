# The kill list

What is **not** in this lexicon, and why. For a matcher whose terms all fire on all
languages at once, the absences carry as much design as the entries — this file is
the record of the per-language adversarial reviews (2026-07-27 for the 18-language
expansion, 2026-08-10 for Irish) that killed 40+ proposed terms before they could
ship a false accusation.

## Method

Each language's term set was proposed independently (native-usage sources, real
widget copy patterns), then screened adversarially:

1. **Cross-language pass** — every candidate term run, with the real compiled
   matcher (word boundaries, hyphen/space flex), against ordinary marketing/support
   copy in *all other* covered languages. A whole-word homograph of a common word
   anywhere in the EU kills or demotes the term.
2. **In-language ambiguity pass** — quick-reply chips, product cards, promo banners,
   cookie/GDPR boilerplate: text that lives in chat panels without describing who is
   replying.
3. **Corroboration audit** — the production rule counts *distinct term strings*, so
   any pair of entries that one innocent sentence can produce together (two
   inflections of a lemma, accented + accentless variants, base + definite form) is
   a self-corroboration bomb; one of the pair dies.

Three standing policies came out of the first review and now apply to every
language:

- **Bare acronyms never corroborate** (`ai`, `a.i.`, `ki`, `ia`, `ии`): Romanian
  *ai* ("you have") + *ia* ("takes") and Slovenian *ki* (the relative pronoun, vs
  German's KI) each graded human-staffed chats as AI-disclosed before this guard.
- **First-person "I am a virtual assistant" is not a term in any language.**
  "Virtual assistant" is a human freelance profession, and that greeting is exactly
  how human VAs introduce themselves on their own sites.
- **Greek carries explicit accentless variants** (uppercase drops the tonos) — but
  only where they can't self-corroborate with the accented form; the lexicon never
  folds accents.

## Killed terms, by language

Confidence tiers referenced below: **strong** terms grade alone; **low** terms need
a second distinct non-acronym low term.

### Polish (pl)
- `agent ai` — Romanian collision: *agent* is an everyday Romanian noun (sales/real-
  estate agent) and *ai* is "you have"; comma-dropped recruiting copy like *"Ca
  agent ai acces la platformă"* is a single-hit false accusation, and demotion
  doesn't save it because Romanian copy is saturated with bare *ai*, which would
  self-corroborate. Polish "Agent AI" pages still surface via their other terms.

### Czech (cs)
- `ai asistent` — the Romanian archetype again: *"ai asistent medical la dispoziție
  24/7"* is a clinic promising a **human** nurse. The feminine `ai asistentka`
  stays strong (not a Romanian word shape).
- `jsem virtuální asistent` / `jsem virtuální asistentka` (+ instrumental forms) —
  human-VA profession policy: *"Jsem virtuální asistentka Petra"* is a human
  freelancer's own greeting. Killing costs nothing: the contained bare low still
  matches the same span.
- `virtuálním asistentem` / `virtuální asistentkou` — case inflections of an
  already-listed low counted as distinct strings → same-lemma self-corroboration.
- `automatizovaný` / `automatizované` — three gender forms of one adjective as
  three "distinct" lows meant a single industrial panel corroborated itself; one
  form (`automatizovaná`) survives as low.

### Slovak (sk)
- `som ai` — cross-language killer: Danish/Norwegian/Swedish *som* = "such as", and
  *"teknologier som AI"* is stock Nordic privacy-blurb copy that routinely appears
  in panel text. The review expected *"Som AI asistent"* to stay caught by a strong
  `ai asistent` — but that compound was itself dropped from the shipped set for the
  Romanian collision (see Czech), so today that greeting surfaces only as the
  low-confidence bare `ai`; strong Slovak first-person coverage is `som chatbot` /
  `som robot`.
- `ai asistent` and `som virtuálny asistent` were also dropped from the shipped
  Slovak set — the Romanian collision and the human-VA profession policy,
  respectively (same reasoning as the Czech entries).

### Hungarian (hu)
- `mi-asszisztens` — the hyphen is unenforceable (hyphens match whitespace too), so
  the entry is really `mi asszisztens`: *mi* is the top-frequency pronoun (we/what)
  and *asszisztens* a common human job title; *"a mi asszisztens csapatunk"* ("our
  assistant team") matches cleanly on human-staff panels. `mi-alapú` survives as
  low; real MI-assistant greetings nearly always carry `mesterséges intelligencia`
  or `chatbot` anyway. **Honesty note:** the kill was recorded in the July review,
  but the term slipped into the production scanner's shipped set anyway and was
  still there when this package was extracted. This package applies the recorded
  kill from 1.0.0 (with the *csapatunk* sentence as a regression test); the
  production fix rides the scanner's next rule-pack version.
- `robottal` — same lemma as `robot` counted as a distinct low: one robot-vacuum
  panel produces both.
- `virtuális asszisztense` / `virtuális asszisztensünk` — base + possessive of one
  lemma as two "distinct" lows; human VA agency copy contains both.

### Greek (el)
- `τν` — verified live as the freight abbreviation for *tonnes* ("φορτία έως 500
  τν."); its only runtime role would be second-weak-term-for-free. Greek copy that
  means AI spells out τεχνητή νοημοσύνη.
- `ρομποτ` (accentless) — dominant occurrence is ALL-CAPS merchandising headers
  ("ΣΚΟΥΠΕΣ ΡΟΜΠΟΤ", robot vacuums), and next to accented `ρομπότ` it let ONE word
  in caps header + body case self-corroborate. The all-caps disclosure that matters
  is retained by strong `ειμαι ρομποτ`.
- `εικονικος βοηθος` / `εικονικη βοηθος` / `αυτοματοποιημενη` / `αυτοματοποιημενο`
  (accentless lows) — a free second corroborator for the same phrase across casing;
  killed per the corroboration audit.

### Danish (da)
- `automatiserede` — same lexeme as `automatiseret`; the two inflections routinely
  co-occur in ordinary product copy.
- `autosvar` — an email-feature term, not a chat disclosure: *"Opsæt automatisk
  svar (autosvar) i webmail"* is hosting-support copy that would pair with the low
  `automatisk svar` on exactly those panels. Genuine chat greetings never
  self-describe as "autosvar". (Swedish independently kept `autosvar` as low — its
  review weighed different copy patterns; both decisions are recorded, not
  harmonized.)

### Swedish (sv)
- `automatiserade` — plural/definite form is the signature of feature-list and GDPR
  boilerplate ("automatiserade processer/utskick/beslut"), near-zero greeting value.

### Finnish (fi)
- `robotti` — a Finnish-orthography trap: compounds are normally written solid
  (`robottipölynimuri`, no match), but the hyphen is *required* when identical
  vowels meet — `robotti-imuri` — and a hyphen is a word boundary to the matcher.
  Robot vacuums saturate Finnish electronics promos, and the standard product-title
  shape "tekoälypohjainen robotti-imuri" contains TWO lows in one line — a sealed
  false finding against a human-staffed retail chat. `olen robotti` and
  `chattirobotti` keep the true-positive shapes.

### Bulgarian (bg)
- `робот` — BG appliance copy routinely puts *робот* and an *автоматизиран\**
  form in one product card; two lows, one card.
- `виртуалният асистент` / `виртуалния асистент` / `виртуалният помощник` /
  `виртуалния помощник` (definite forms) — indefinite-then-definite anaphora is
  default Bulgarian grammar, so any page introducing "виртуален асистент" and then
  referring back to it manufactures its own corroboration.

### Croatian (hr)
- `ai asistent` — Romanian collision (see Czech). Croatian coverage survives via
  `ai asistentom` and `ja sam ai asistent`.
- `ja sam virtualni asistent` — human-VA profession policy; a real human job title
  in Croatia.

### Slovenian (sl)
- `sem virtualni asistent` / `sem virtualna asistentka` — the human remote-assistant
  profession is verified and thriving in Slovenia under exactly this
  self-description; a human freelancer's own widget greeting must not grade as an
  AI disclosure.
- `ai asistent` — Romanian collision (see Czech). If the natural *"Sem AI asistent"*
  greeting ever needs strong coverage, the safe entry is the first-person form —
  *sem* is not a Romanian word.
- `virtualnim asistentom` — case inflection self-corroboration (also identical in
  Croatian instrumental).
- `avtomatiziran` / `avtomatizirana` — three inflections of one lemma:
  *"Avtomatiziran sistem za avtomatizirano upravljanje"* is ordinary industrial
  copy and would corroborate itself. Only `avtomatizirano` survives, as low.

### Estonian (et)
- `virtuaalne abiline` — "virtual helper" has no shipped-language precedent and
  would deepen the virtual-assistant synonym stack (more same-concept lows = more
  spurious corroboration surface).

### Latvian (lv)
- `virtuālo asistentu` (accusative) — case variation is grammar-forced: any innocent
  page ABOUT virtual assistants uses nominative in headings and accusative as the
  object of seek/offer/hire; two case forms = self-corroboration.
- `automatizēts` / `automatizēta` — lemma pair, and the feminine is canonical
  Latvian GDPR boilerplate ("automatizēta lēmumu pieņemšana" — automated
  decision-making).

### Irish (ga) — 2026-08-10 review
- `IS` (the téarma.ie acronym for *intleacht shaorga*) — **unaddable in any tier**:
  whole-word homograph of English *is* (and of Danish/Swedish *is*, ice) — the
  archetype of the Romanian `ai`/`ia` kills, one language later.
- bare `comhrá` (conversation) and bare `cúntóir` (a human assistant/helper) —
  ordinary words; they appear only inside compounds (`bota comhrá`,
  `cúntóir digiteach`).
- `róbat comhrá` — plausible calque, but unverified in real usage; dropped rather
  than guessed (`bota comhrá` is the verified term).
- `samhail teanga` ("language model") — unverified in chat-greeting usage; dropped
  rather than guessed.
- First-person virtual-assistant phrases were never proposed for Irish, per the
  standing policy.

### Lithuanian, Maltese, Catalan, Portuguese, Romanian
No kills — but Romanian is the review's largest *absence*: its natural short terms
(`ai …` compounds, first-person forms needing the negator *nu*) are unshippable, so
Romanian coverage leans on full phrases (`inteligență artificială`,
`robot conversațional`, `sunt un chatbot`) and shared loanwords.

## Demotions of note (strong → low)

- `assistente ia` (it), `agente ia` (it/es), `agent ia` (fr) — demoted because
  Portuguese *ia* is the imperfect of *ir*: *"o assistente ia transferir a
  chamada"* is a **human** assistant about to transfer the call (Portuguese itself
  ships the unambiguous `assistente de ia`); *"un agent ia legătura"* is ordinary
  Romanian for a human agent making contact.
- All bare acronyms and product-ambiguous words (`robot`, `automated`,
  `virtual assistant`, …) — see `LOW_CONFIDENCE_TERMS` in the source; the tier
  exists because quick-reply chips and product cards live inside chat panels.

## Negator decisions

- Romanian `nu` is **deliberately absent** from the negator set: it means "now" in
  Dutch/Danish/Swedish chat copy ("chat nu met onze chatbot" is an invitation). The
  Romanian first-person terms that needed it were dropped instead — a stray negator
  may only ever suppress, and only where the suppression is harmless.
- Accepted suppression-only collisions (documented, not fixed): Latvian `nav` vs
  English "nav bar"; Estonian `pole` vs "North Pole"; Finnish/Estonian `ei` vs
  German "Ei"; Catalan `sense` vs English "sense"; Irish `gan` (without) collides
  with nothing whole-word in the EU set.
- Irish negators (`ní`, `níl`, `nílim`, `gan`) exist chiefly so that **"Ní róbat
  mé"** — the Irish reCAPTCHA checkbox, "I'm not a robot" — reads as the denial it
  is. No accent folding means Irish *ní* never touches Spanish *ni*.
