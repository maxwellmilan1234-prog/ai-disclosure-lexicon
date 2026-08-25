// ai-disclosure-lexicon — does this text say "you are talking to an AI"?
//
// A deterministic, auditable lexicon for AI/bot self-disclosure wording in the 24
// official EU languages plus Catalan. Given some text (a chat-widget greeting, a
// persona line, a proactive bubble, a header), it reports which AI/automation terms
// appear, in which language, and whether each occurrence is negated ("not a bot",
// "geen chatbot", "Ní róbat mé"). No legal judgment lives here — this answers
// "does the text name AI/automation", nothing more.
//
// Extracted from the DisclosureProof scanner (https://disclosureproof.com/), where it
// is the first pass of the EU AI Act Article 50 chatbot-disclosure check and was run
// against 1,088 live EU sites for the State of AI Disclosure study. The war stories
// that shaped it are in the README; the terms that were deliberately KILLED, and why,
// are in docs/kill-list.md — for this kind of matcher the absences are load-bearing.
//
// Design rules (each one paid for by a false positive found in review or production):
//  - Matching is unicode word-boundary aware, so "bot" does NOT match "robot",
//    "about", or "bottom", and "ia" does not match "media"/"financial". Boundaries
//    kill substring false-positives; the negator window kills semantic ones.
//  - Terms with accents are kept as-is (matched case-insensitively). We do not fold
//    accents — "künstliche" and "kunstliche" are different tokens and folding would
//    cost precision for little gain in a widget greeting. Where an accentless variant
//    is genuinely common (Greek all-caps drops the tonos), it is listed explicitly.
//  - No stemming. Declension variants are listed explicitly, and inflections of an
//    already-listed low-confidence term are usually NOT added — under the
//    two-distinct-weak-terms corroboration rule (assessDisclosure below), two
//    inflections of one lemma would let a single innocent sentence corroborate
//    itself ("Avtomatiziran sistem za avtomatizirano upravljanje").
//  - Every term is matched against text in EVERY language — a widget greeting does
//    not announce its language. So any candidate term that is a whole-word homograph
//    of a common word elsewhere in the EU was killed, demoted, or guarded before it
//    could ship. The archetypes: Romanian "ai" (= "you have") and "ia" (= "takes"),
//    Slovenian "ki" (the relative pronoun, vs German's KI acronym), Irish "IS" (the
//    téarma.ie acronym for intleacht shaorga, unaddable — it is English "is").

// AI / automation disclosure terms per language. Kept explicit (not stemmed, not
// generated) so the set is auditable — for a compliance-adjacent matcher the list
// itself is the logic.
export const TERMS_BY_LANG = {
  en: [
    "ai", "a.i.", "artificial intelligence", "virtual assistant", "virtual agent",
    "ai assistant", "ai agent", "ai-powered", "ai powered", "powered by ai",
    "chatbot", "chat bot", "bot", "automated", "automated assistant", "automation",
    "digital assistant", "conversational ai", "generative ai", "language model",
    "auto-reply", "automatic reply", "robot",
    // First-person forms: the pronoun context removes the acronym ambiguity that makes
    // bare "ai" low-confidence, so "Hi! I'm an AI." is a real disclosure, not a maybe.
    "i'm an ai", "i am an ai", "im an ai",
  ],
  nl: [
    "kunstmatige intelligentie", "virtuele assistent", "virtuele medewerker",
    "ai-assistent", "chatbot", "bot", "geautomatiseerd", "geautomatiseerde",
    "digitale assistent", "automatisch antwoord",
  ],
  de: [
    "künstliche intelligenz", "ki", "ki-assistent", "ki-assistentin", "virtueller assistent",
    "virtuelle assistentin", "chatbot", "bot", "automatisiert", "automatisierte",
    "digitaler assistent", "sprachassistent", "automatische antwort",
  ],
  fr: [
    "intelligence artificielle", "ia", "assistant virtuel", "assistante virtuelle",
    "agent virtuel", "chatbot", "bot", "automatisé", "automatisée",
    "assistant numérique", "robot conversationnel", "réponse automatique",
    // Strong IA compounds: the idiomatic French disclosure is "assistant IA", and
    // without these it matched only the bare low-confidence "ia" acronym, so the most
    // natural phrasing in the language graded as no-disclosure-found.
    "assistant ia", "assistante ia", "agent ia", "je suis une ia", "je suis un assistant ia",
  ],
  es: [
    "inteligencia artificial", "ia", "asistente virtual", "agente virtual", "chatbot",
    "bot", "automatizado", "automatizada", "asistente digital", "respuesta automática",
    "robot",
    "asistente ia", "asistente de ia", "agente ia", "agente de ia", "soy una ia", "soy un asistente de ia",
  ],
  it: [
    "intelligenza artificiale", "ia", "assistente virtuale", "agente virtuale", "chatbot",
    "bot", "automatizzato", "automatizzata", "assistente digitale", "risposta automatica",
    "assistente ia", "agente ia", "sono un'ia", "sono un assistente ia",
  ],
  // ---- 18 languages added 2026-07-27 ------------------------------------------------
  // Proposed per-language and adversarially reviewed for cross-language collisions
  // before inclusion (docs/kill-list.md holds the kill list and reasoning). Three
  // policies from that review, applied consistently across ALL languages:
  //  - a term is matched against text in EVERY language, so any term that is a
  //    whole-word homograph of a common word elsewhere in the EU was killed outright
  //    (the archetypes: "ai asistent" / "agent ia", which are ordinary Romanian copy
  //    about HUMAN agents — "ai" = you have, "ia" = takes);
  //  - first-person "I am a virtual assistant" phrases are NOT terms in any language:
  //    "virtual assistant" is a human freelance profession, and that greeting is
  //    exactly how human VAs introduce themselves on their own sites (en set the
  //    precedent by never listing "i'm a virtual assistant");
  //  - Greek entries carry accentless variants: uppercase Greek drops the tonos and
  //    this lexicon deliberately never folds accents.
  pl: [
    "sztuczna inteligencja", "sztucznej inteligencji", "sztuczną inteligencję",
    "sztuczną inteligencją", "chatbot", "chatbota", "chatbotem", "czatbot", "czatbotem",
    "asystent ai", "asystentem ai", "cyfrowy asystent", "automatyczna odpowiedź",
    "wiadomość automatyczna", "automatyczna wiadomość", "wygenerowana automatycznie",
    "wygenerowano automatycznie", "jestem chatbotem", "jestem botem", "ai", "bot", "botem",
    "robot", "robotem", "zautomatyzowany", "zautomatyzowana", "zautomatyzowane",
    "wirtualny asystent", "wirtualnym asystentem", "wirtualna asystentka",
    "wirtualną asystentką",
  ],
  cs: [
    "umělá inteligence", "umělé inteligence", "umělé inteligenci", "umělou inteligenci",
    "umělou inteligencí", "chatbot", "chatbota", "chatbotem", "chatovací robot",
    "ai asistentka", "digitální asistent", "digitální asistentka", "automatická odpověď",
    "jazykový model", "jazykovém modelu", "jsem ai", "jsem robot", "virtuální asistent",
    "virtuální asistentka", "automatizovaná",
  ],
  sk: [
    "umelá inteligencia", "umelú inteligenciu", "umelej inteligencie", "umelej inteligencii",
    "umelou inteligenciou", "chatbot", "chatbotom", "digitálny asistent",
    "automatická odpoveď", "som chatbot", "som robot", "ai", "bot", "virtuálny asistent",
    "virtuálna asistentka", "virtuálnym asistentom", "virtuálny agent", "automatizovaný",
    "automatizovaná",
  ],
  hu: [
    // "mi-asszisztens" is deliberately ABSENT: the hyphen is unenforceable (hyphens
    // match whitespace too), so the entry would really be "mi asszisztens" — "mi" is
    // the top-frequency Hungarian pronoun and "asszisztens" a common human job title
    // ("a mi asszisztens csapatunk" = "our assistant team"). Recorded as a kill in
    // the 2026-07-27 review; see docs/kill-list.md.
    "mesterséges intelligencia", "mesterséges intelligenciával", "ai-asszisztens", "mi-alapú",
    "ai-alapú", "chatbot", "chatbottal", "chatbotunk", "chatbotunkkal", "csevegőrobot",
    "beszélgetőrobot", "robot", "virtuális asszisztens", "digitális asszisztens",
    "digitális asszisztense", "virtuális ügyintéző", "automatizált", "automatikus válasz",
    "nyelvi modell", "chatbot vagyok", "robot vagyok", "mesterséges intelligencia vagyok",
  ],
  ro: [
    "inteligență artificială", "inteligenta artificiala", "chatbot", "robot conversațional",
    "asistent virtual", "asistentă virtuală", "agent virtual", "asistent digital",
    "răspuns automat", "raspuns automat", "mesaj automat", "automatizat", "automatizată",
    "sunt un chatbot",
  ],
  bg: [
    "изкуствен интелект", "изкуственият интелект", "изкуствения интелект", "ии", "ии асистент",
    "ai асистент", "чатбот", "чат бот", "чатботът", "чатбота", "chatbot", "бот", "bot",
    "виртуален асистент", "виртуален помощник", "виртуален агент", "дигитален асистент",
    "дигиталният асистент", "дигиталния асистент", "дигитален помощник", "автоматизиран",
    "автоматизирана", "автоматизирано", "автоматизиран асистент", "автоматичен отговор",
    "автоматично съобщение", "езиков модел", "генеративен ии", "аз съм бот", "съм бот",
    "аз съм изкуствен интелект", "аз съм ии",
  ],
  el: [
    "τεχνητή νοημοσύνη", "τεχνητη νοημοσυνη", "τεχνητής νοημοσύνης", "τεχνητης νοημοσυνης",
    "chatbot", "τσατμπότ", "τσατμποτ", "ψηφιακός βοηθός", "ψηφιακή βοηθός", "ψηφιακό βοηθό",
    "ψηφιακή βοηθό", "ψηφιακος βοηθος", "ψηφιακη βοηθος", "αυτόματη απάντηση",
    "αυτοματη απαντηση", "ai βοηθός", "βοηθός ai", "ai βοηθος", "βοηθος ai", "είμαι ρομπότ",
    "είμαι ένα ρομπότ", "ειμαι ρομποτ", "ειμαι ενα ρομποτ", "ai", "bot", "μποτ", "ρομπότ",
    "εικονικός βοηθός", "εικονική βοηθός", "εικονικό βοηθό", "εικονική βοηθό",
    "αυτοματοποιημένη", "αυτοματοποιημένος", "αυτοματοποιημένο",
  ],
  hr: [
    "umjetna inteligencija", "umjetne inteligencije", "umjetnu inteligenciju",
    "umjetnoj inteligenciji", "umjetnom inteligencijom", "chatbot", "chatbota", "chatbotu",
    "chatbotom", "bot", "robot", "ai asistentom", "digitalni asistent", "digitalni pomoćnik",
    "virtualni asistent", "virtualna asistentica", "virtualni pomoćnik", "virtualni agent",
    "automatiziran", "automatizirana", "automatizirani", "automatski odgovor",
    "automatizirani odgovor", "ja sam chatbot", "ja sam bot", "ja sam ai asistent",
  ],
  sl: [
    "umetna inteligenca", "umetne inteligence", "umetno inteligenco", "sem umetna inteligenca",
    "chatbot", "klepetalnik", "klepetalni robot", "klepetalnim robotom", "pogovorni robot",
    "pogovornim robotom", "sem klepetalni robot", "digitalni asistent", "digitalna asistentka",
    "digitalni pomočnik", "digitalna pomočnica", "ai pomočnik", "avtomatski odgovor",
    "samodejni odgovor", "avtomatsko sporočilo", "samodejno sporočilo", "bot", "robot",
    "virtualni asistent", "virtualna asistentka", "virtualni pomočnik", "virtualna pomočnica",
    "avtomatizirano",
  ],
  lt: [
    "dirbtinis intelektas", "dirbtinio intelekto", "dirbtiniu intelektu", "di asistentas",
    "di asistentė", "chatbotas", "chatbot", "pokalbių robotas", "pokalbių roboto",
    "pokalbių robotu", "pokalbių botas", "bot", "robotas", "virtualus asistentas",
    "virtualusis asistentas", "virtuali asistentė", "virtualiu asistentu",
    "virtualia asistente", "virtualus padėjėjas", "skaitmeninis asistentas",
    "skaitmeninis padėjėjas", "automatizuotas", "automatizuota", "automatinis atsakymas",
    "autoatsakiklis", "kalbos modelis", "esu pokalbių robotas", "esu robotas", "esu botas",
  ],
  lv: [
    "mākslīgais intelekts", "mākslīgā intelekta", "mākslīgo intelektu", "mi asistents",
    "čatbots", "čatbotu", "chatbot", "bot", "sarunbots", "sarunbotu", "tērzēšanas robots",
    "tērzēšanas robotu", "virtuālais asistents", "virtuālā asistente", "virtuālais aģents",
    "virtuālais palīgs", "digitālais asistents", "automātiska atbilde", "automātiskā atbilde",
    "esmu čatbots", "esmu bots", "esmu robots",
  ],
  et: [
    "tehisintellekt", "tehisintellekti", "tehisintellektiga", "tehisintellektil põhinev",
    "tehisaru", "juturobot", "juturobotiga", "vestlusrobot", "vestlusrobotiga", "chatbot",
    "bot", "robot", "ai-assistent", "virtuaalne assistent", "virtuaalassistent",
    "digitaalne assistent", "digiassistent", "automatiseeritud", "automaatvastus",
    "automaatne vastus", "olen juturobot", "olen vestlusrobot", "olen tehisintellekt",
  ],
  fi: [
    "tekoäly", "tekoälyä", "tekoälyn", "tekoälyavustaja", "tekoälyassistentti",
    "tekoälypohjainen", "chatbot", "chatbotti", "chattibotti", "chattirobotti",
    "asiakaspalvelubotti", "virtuaalinen avustaja", "virtuaaliavustaja",
    "virtuaaliassistentti", "virtuaalinen asiakasneuvoja", "digitaalinen avustaja",
    "automatisoitu", "automaattinen vastaus", "automaattivastaus", "olen tekoäly",
    "olen robotti", "olen botti",
  ],
  sv: [
    "artificiell intelligens", "ai", "ai-assistent", "ai-assistenten", "ai-agent", "chatbot",
    "chattbot", "chattbott", "chatboten", "chattbotten", "chattrobot", "virtuell assistent",
    "virtuella assistent", "digital assistent", "digitala assistent", "digital medarbetare",
    "digitala medarbetare", "automatiserad", "automatiserat", "automatiskt svar", "autosvar",
    "robot", "språkmodell", "generativ ai", "jag är en ai", "jag är en chatbot",
    "jag är en robot",
  ],
  da: [
    "kunstig intelligens", "kunstige intelligens", "ki", "ai", "ai-assistent", "chatbot",
    "chatrobot", "bot", "robot", "virtuel assistent", "virtuelle assistent",
    "digital assistent", "digitale assistent", "automatiseret", "automatisk svar",
    "sprogmodel", "jeg er en chatbot", "jeg er en ai", "jeg er en robot",
  ],
  pt: [
    "inteligência artificial", "chatbot", "bot", "assistente virtual", "atendente virtual",
    "agente virtual", "assistente digital", "automatizado", "automatizada",
    "resposta automática", "robô", "robot", "assistente de ia", "agente de ia",
    "sou um chatbot", "sou uma ia",
  ],
  ca: [
    "intel·ligència artificial", "intel.ligència artificial", "ia", "chatbot", "xatbot",
    "bot de conversa", "bot conversacional", "assistent virtual", "agent virtual",
    "assistent digital", "assistent d'ia", "assistent d’ia", "assistent ia", "agent d'ia",
    "agent d’ia", "automatitzat", "automatitzada", "resposta automàtica", "robot",
    "sóc un chatbot", "soc un chatbot", "sóc una ia", "soc una ia", "sóc un bot", "soc un bot",
  ],
  mt: [
    "intelliġenza artifiċjali", "intelligenza artificjali", "ia", "ai", "chatbot", "bot",
    "robot", "assistent virtwali", "aġent virtwali", "agent virtwali", "assistent diġitali",
    "assistent digitali", "assistent tal-ia", "assistent tal-ai", "awtomatizzat",
    "awtomatizzata", "tweġiba awtomatika", "twegiba awtomatika", "risposta awtomatika",
    "jien chatbot", "jiena chatbot", "jien assistent virtwali", "jien assistent tal-ia",
  ],
  // ---- Irish added 2026-08-10 — the 24th official EU language. The lexicon went
  // through multiple review passes and a full field study covering 23 of the 24 plus
  // Catalan before anyone counted the keys against the official list and noticed
  // Irish was missing (the story is in the README).
  // Terms verified against téarma.ie (the national terminology database:
  // "intleacht shaorga" = AI, "bota comhrá" / "gníomhaire comhráiteach" = chatbot /
  // conversational agent, "uathoibrithe/uathoibríoch" = automated/automatic) and live
  // usage (thejournal.ie Gaeilge reporting; citizensinformation.ie/data.gov.ie
  // Gaeilge pages). Notable kills: the Irish acronym for intleacht shaorga, "IS", is
  // a whole-word homograph of English "is" and can never be a term in any confidence
  // tier; "comhrá" and "cúntóir" alone are ordinary words (conversation; a human
  // assistant/helper) and only appear inside compounds. Declension variants are
  // listed explicitly (genitive "intleachta saorga", h-prefixed "hintleachta
  // saorga") because this lexicon never stems or folds.
  ga: [
    "intleacht shaorga", "intleachta saorga", "intleachta shaorga", "hintleachta saorga",
    "bota comhrá", "bot comhrá", "gníomhaire comhráiteach", "chatbot",
    "cúntóir digiteach", "cúntóir ai", "cúntóir fíorúil", "gníomhaire fíorúil",
    "freagra uathoibríoch", "uathoibrithe", "uathoibríoch", "róbat",
    "is bota comhrá mé", "is chatbot mé", "is róbat mé",
  ],
};

// Two kinds of low-confidence term, both requiring corroboration before a caller
// should lean on them (assessDisclosure below enforces this):
//  - very short, standalone acronyms ("ai", "ki", "ia") that carry real
//    false-positive risk even with boundaries (a name "Ki", the abbreviation "IA");
//  - product/marketing-ambiguous words ("robot", "automated", "automation", "virtual
//    assistant/agent", "ai-powered") that show up constantly in ordinary panel copy —
//    quick-reply chips, product cards, promo banners — with no connection to who's
//    actually replying in the chat. A panel that says "track my robot order" must not
//    grade as a disclosure.
export const LOW_CONFIDENCE_TERMS = new Set([
  "ai", "a.i.", "ki", "ia", "bot",
  "robot", "automated", "automation", "ai-powered", "ai powered", "powered by ai",
  "virtual assistant", "virtual agent",
  "virtuele assistent", "virtuele medewerker", "geautomatiseerd", "geautomatiseerde",
  "virtueller assistent", "virtuelle assistentin", "automatisiert", "automatisierte",
  "assistant virtuel", "assistante virtuelle", "agent virtuel", "automatisé", "automatisée",
  "asistente virtual", "agente virtual", "automatizado", "automatizada",
  "assistente virtuale", "agente virtuale", "automatizzato", "automatizzata",
  // Demoted from strong 2026-07-27, found by the 24-language review's negative tests:
  // "ia" is the Portuguese imperfect of "ir", so "o assistente ia transferir a chamada"
  // (a HUMAN assistant was going to transfer the call) matched it/fr's strong compounds;
  // "un agent ia legătura" is ordinary Romanian for a human agent making contact.
  "assistente ia", "agente ia", "agent ia",
  // ---- the 18 added languages (2026-07-27; per-language reasoning in
  // docs/kill-list.md). A Set, so cross-language repeats are free.
  // pl
  "wygenerowana automatycznie", "wygenerowano automatycznie", "botem", "robotem",
  "zautomatyzowany", "zautomatyzowana", "zautomatyzowane", "wirtualny asystent",
  "wirtualnym asystentem", "wirtualna asystentka", "wirtualną asystentką",
  // cs
  "virtuální asistent", "virtuální asistentka", "automatizovaná",
  // sk
  "virtuálny asistent", "virtuálna asistentka", "virtuálnym asistentom",
  "virtuálny agent", "automatizovaný",
  // hu
  "mi-alapú", "ai-alapú", "chatbottal", "virtuális asszisztens",
  "virtuális ügyintéző", "automatizált", "robot vagyok",
  // ro
  "asistent virtual", "asistentă virtuală", "agent virtual", "răspuns automat",
  "raspuns automat", "mesaj automat", "automatizat", "automatizată",
  // bg
  "ии", "бот", "виртуален асистент", "виртуален помощник", "виртуален агент",
  "дигитален помощник", "автоматизиран", "автоматизирана", "автоматизирано",
  "автоматичен отговор", "автоматично съобщение",
  // el
  "μποτ", "ρομπότ", "εικονικός βοηθός", "εικονική βοηθός", "εικονικό βοηθό",
  "εικονική βοηθό", "αυτοματοποιημένη", "αυτοματοποιημένος", "αυτοματοποιημένο",
  // hr
  "digitalni pomoćnik", "virtualni asistent", "virtualna asistentica",
  "virtualni pomoćnik", "virtualni agent", "automatiziran", "automatizirana", "automatizirani",
  // sl
  "klepetalnik", "virtualna asistentka", "virtualni pomočnik", "virtualna pomočnica",
  "avtomatizirano",
  // lt
  "robotas", "virtualus asistentas", "virtualusis asistentas", "virtuali asistentė",
  "virtualiu asistentu", "virtualia asistente", "virtualus padėjėjas", "automatizuotas",
  "automatizuota", "autoatsakiklis",
  // lv
  "virtuālais asistents", "virtuālā asistente", "virtuālais aģents", "virtuālais palīgs",
  // et
  "tehisintellektil põhinev", "virtuaalne assistent", "virtuaalassistent", "automatiseeritud",
  // fi
  "tekoälypohjainen", "virtuaalinen avustaja", "virtuaaliavustaja", "virtuaaliassistentti",
  "virtuaalinen asiakasneuvoja", "automatisoitu",
  // sv
  "virtuell assistent", "virtuella assistent", "digital assistent", "digitala assistent",
  "digital medarbetare", "digitala medarbetare", "automatiserad", "automatiserat",
  "automatiskt svar", "autosvar", "generativ ai",
  // da
  "virtuel assistent", "virtuelle assistent", "automatiseret", "automatisk svar",
  // pt
  "assistente virtual", "atendente virtual", "agente virtual", "automatizado",
  "automatizada", "robô",
  // ca
  "assistent virtual", "agent virtual", "assistent digital", "automatitzat", "automatitzada",
  // mt
  "assistent virtwali", "aġent virtwali", "agent virtwali", "awtomatizzat", "awtomatizzata",
  // ga (2026-08-10): mirrors of the standing policies — "cúntóir fíorúil"/
  // "gníomhaire fíorúil" are the virtual-assistant/agent human-profession ambiguity;
  // "uathoibrithe"/"uathoibríoch" mirror "automated"; "róbat" mirrors "robot" (and the
  // Irish reCAPTCHA checkbox is "Ní róbat mé", which the ga negators below suppress).
  "cúntóir fíorúil", "gníomhaire fíorúil", "uathoibrithe", "uathoibríoch", "róbat",
]);

// Bare acronyms among the low-confidence terms. Two DISTINCT low terms normally
// corroborate into a disclosure (assessDisclosure), but two bare acronyms must NOT:
// on ordinary Romanian copy, en's "ai" ("dacă ai întrebări" — you have) and
// fr/es/it's "ia" ("ia legătura" — take) both fire as whole words, and before this
// guard existed that pair graded a human-staffed Romanian chat as a detected AI
// disclosure. Found by the 2026-07-27 cross-language review; the corroboration rule
// now requires at least one non-acronym weak term.
export const BARE_ACRONYMS = new Set(["ai", "a.i.", "ki", "ia", "ии"]);

// Words that negate a following term within a short window. Multilingual union;
// a stray cross-language negator only ever suppresses a match (fail-safe direction:
// we would rather under-report a disclosure as "not found" than falsely claim the
// text disclosed AI when it said the opposite).
export const NEGATORS = new Set([
  "not", "no", "never", "isnt", "arent", "dont", "doesnt", "without", "aint", // en
  "geen", "niet", "nooit", "zonder", // nl
  "kein", "keine", "keinen", "nicht", "nie", "ohne", // de
  "pas", "non", "jamais", "aucun", "aucune", "sans", "ne", // fr
  "ni", "nunca", "sin", // es ("no" shared with en)
  "senza", "mai", // it ("non"/"no" shared)
  // ---- the 18 added languages (2026-07-27). Same fail-safe direction as ever: a stray
  // cross-language negator only suppresses. Deliberately ABSENT: Romanian "nu" — it means
  // "now" in Dutch/Danish/Swedish chat copy ("chat nu met onze chatbot") and would
  // suppress real disclosures in a core market; the Romanian first-person terms that
  // needed it were dropped instead.
  "nie", "nigdy", "żaden", "żadna", "żadne", "żadnym", "żadną", "ani", "brak", // pl ("bez" shared pl/cs/sk/hr)
  "ne", "není", "nejsem", "nejsi", "nejsme", "nejste", "nejsou", "nikdy", "nikoli", "nikoliv", "žádný", "žádná", "žádné", "žádného", "žádnou", "žádným", "bez", "nejde", "nejedná", "nemáme", "nepoužívá", "nepoužíváme", // cs
  "žiadny", "žiadna", "žiadne", "žiaden", "žiadneho", "žiadnym", "žiadnou", // sk
  "nem", "soha", "sosem", "sem", "nincs", "nincsen", "sincs", "nélkül", // hu
  "niciodată", "niciodata", "fără", "fara", "nici", "niciun", "nicio", // ro
  "не", "няма", "нямаме", "нямам", "никога", "без", "нито", "никакъв", "никаква", "никакво", "никакви", // bg
  "δεν", "δε", "μη", "μην", "όχι", "οχι", "ούτε", "ουτε", "ποτέ", "ποτε", "χωρίς", "χωρις", "κανένας", "κανενας", "κανένα", "κανενα", "καμία", "καμιά", "καμια", // el
  "nije", "nisam", "nisi", "nismo", "niste", "nisu", "nikad", "nikada", "niti", "nema", // hr ("ne"/"ni" shared)
  "nisem", "niso", "nikoli", "brez", "noben", "nobena", // sl
  "nė", "nesu", "nesi", "nesate", "nesame", "nėra", "niekada", "joks", "jokia", "jokio", "jokios", "jokiu", // lt
  "nē", "nav", "nebija", "nebūs", "neesmu", "neesam", "neesat", "nekad", "nevis", "nekāds", "nekāda", "neizmanto", "neizmantojam", "nelieto", "nelietojam", // lv ("nav": suppression-only English "nav bar" collision accepted)
  "ei", // fi/et ("ei ole robotti/robot" — the basic denial; stray "Ei" (de: egg) only suppresses, accepted)
  "pole", // et ("see pole automaatvastus"; English "North Pole" collision is suppression-only, accepted)
  "eikä", "eivät", "emme", "ilman", // fi
  "ikke", "ingen", "intet", "aldrig", "uden", // da
  "inte", "icke", "inget", "utan", // sv ("ingen"/"aldrig" shared)
  "não", "nao", // pt ("nunca"/"jamais" shared with es/fr)
  "tampoc", "sense", // ca ("no"/"ni"/"pas" shared; "sense" = without — English "sense" collision is suppression-only, accepted)
  "mhux", "mhix", "mhuwiex", "mhijiex", "mhumiex", "miniex", "mhemmx", "mingħajr", "minghajr", "qatt", "ebda", "lanqas", // mt
  "ní", "níl", "nílim", "gan", // ga (2026-08-10) — "ní róbat mé" is the Irish "I'm not a robot"; accented tokens, no fold, so es "ni" stays distinct; "gan" (without) collides with nothing whole-word in the EU set and is suppression-only anyway
]);

const NEGATOR_LOOKBACK_CHARS = 24; // ~3-4 words before the term

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build a boundary-aware matcher for one term. Spaces become flexible whitespace and
// hyphens accept either a hyphen or whitespace, so "ai powered" / "ai-powered" and
// "chat  bot" all match one entry. Boundaries use unicode letter/number classes so
// non-latin scripts behave and substrings never match.
function compileTerm(term) {
  // Collapse any run of spaces/hyphens into a single flexible separator in ONE pass —
  // doing space then hyphen separately would re-process the hyphen inside the [\s-]
  // class we just inserted and corrupt the pattern.
  const body = escapeRegex(term).replace(/[ -]+/g, "[\\s-]+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, "giu");
}

const COMPILED = Object.entries(TERMS_BY_LANG).flatMap(([lang, terms]) =>
  terms.map((term) => ({ lang, term, re: compileTerm(term), low: LOW_CONFIDENCE_TERMS.has(term) }))
);

function isNegated(text, matchIndex) {
  const from = Math.max(0, matchIndex - NEGATOR_LOOKBACK_CHARS);
  let window = text.slice(from, matchIndex).toLowerCase();
  // CLAUSE-BOUNDED: cut the lookback at the last clause break before the match. Without
  // this, "I'm not a human — I'm an AI assistant" read the `not` (which negates *human*,
  // in the previous clause) as negating "ai assistant", so the clearest possible
  // disclosure graded as no-disclosure-detected. "not a bot" still negates: no break
  // sits between the negator and the term.
  const lastBreak = window.search(/[,.;:!?—–\n][^,.;:!?—–\n]*$/u);
  if (lastBreak !== -1) window = window.slice(lastBreak + 1);
  // Words in the lookback window, stripped of punctuation. A negator anywhere in the
  // window (immediately preceding clause) counts.
  const words = window.split(/[^\p{L}\p{N}']+/u).filter(Boolean);
  return words.some((w) => NEGATORS.has(w.replace(/'/g, "")));
}

// Core scan. Returns every occurrence: { term, lang, index, negated, low }.
// Deduplicates overlapping matches of the same span across term variants by keeping
// the longest (so "virtual assistant" wins over a bare would-be "assistant").
export function scanTerms(text) {
  if (!text || typeof text !== "string") return [];
  const matches = [];
  for (const { lang, term, re, low } of COMPILED) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push({ term, lang, index: m.index, end: m.index + m[0].length, negated: isNegated(text, m.index), low });
      if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-width loops
    }
  }
  matches.sort((a, b) => a.index - b.index || b.end - a.end);
  const kept = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.index < lastEnd) continue; // fully covered by a longer earlier match at this span
    kept.push({ term: m.term, lang: m.lang, index: m.index, negated: m.negated, low: m.low });
    lastEnd = m.end;
  }
  return kept;
}

// Convenience: does the text contain ANY non-negated AI/automation term, including
// low-confidence ones? This is the raw lexicon signal. For "would this greeting count
// as a disclosure?" use assessDisclosure, which applies the corroboration rule.
export function disclosesAI(text) {
  return scanTerms(text).some((m) => !m.negated);
}

// The corroboration rule, exactly as it runs in production:
//  - one STRONG (non-low-confidence) term is sufficient on its own;
//  - low-confidence terms need corroboration: two DISTINCT weak terms together count
//    ("I'm an automated virtual assistant" is a real disclosure even though every
//    word in it is individually weak) — but bare acronyms NEVER contribute to that
//    pair. Two incidents set the acronym guard: ordinary Romanian copy fired en's
//    "ai" ("dacă ai întrebări") plus fr/es/it's "ia" ("ia legătura"), and ordinary
//    Slovenian fired "robot" (kitchen-robot promo) plus de's "ki" — which is
//    Slovenian's ubiquitous relative pronoun ("robot, ki vam prihrani čas"). In
//    both, a human-staffed page would have graded as a detected AI disclosure.
//    Acronym matches are still reported as evidence and still count for language
//    coverage; they just can't corroborate.
// Returns { disclosed, matches, terms, strongTerms, weakTerms, languages, negatedOnly }.
export function assessDisclosure(text) {
  const matches = scanTerms(text);
  const positive = matches.filter((m) => !m.negated);
  const strong = positive.filter((m) => !m.low);
  const distinctWeakTerms = new Set(positive.filter((m) => m.low).map((m) => m.term));
  const nonAcronymWeak = [...distinctWeakTerms].filter((t) => !BARE_ACRONYMS.has(t));
  return {
    disclosed: strong.length > 0 || nonAcronymWeak.length >= 2,
    matches,
    terms: [...new Set(positive.map((m) => m.term))],
    strongTerms: [...new Set(strong.map((m) => m.term))],
    weakTerms: [...distinctWeakTerms],
    languages: detectedLanguages(matches),
    negatedOnly: matches.length > 0 && positive.length === 0,
  };
}

// The set of distinct languages a disclosure term was seen in — a soft signal for
// which locale the text is serving (not authoritative; a page can mix languages).
export function detectedLanguages(matches) {
  return [...new Set(matches.filter((m) => !m.negated).map((m) => m.lang))];
}

// Languages the lexicon can actually detect terms in. Coverage comparisons must
// never claim a gap for a language the lexicon couldn't have matched.
export const SUPPORTED_LANGS = new Set(Object.keys(TERMS_BY_LANG));

// Every language that lists `term` in its term set. scanTerms dedupes overlapping
// matches of the SAME span keeping one lang (whichever compiled first), but a shared
// term like "chatbot" or "bot" is a valid disclosure in every language that lists
// it — a Dutch panel saying "chatbot" covers nl, even though the match was recorded
// as en. Coverage logic must therefore expand a matched term to all its languages,
// not trust match.lang.
const TERM_LANGS = new Map();
for (const [lang, terms] of Object.entries(TERMS_BY_LANG)) {
  for (const term of terms) {
    if (!TERM_LANGS.has(term)) TERM_LANGS.set(term, new Set());
    TERM_LANGS.get(term).add(lang);
  }
}
export function termLanguages(term) {
  return TERM_LANGS.get(term) || new Set();
}

// Negation-aware phrase matching for fixed label phrases (e.g. "AI-generated"
// content labels), sharing the guard the term scan has always had: plain substring
// matching counted a page stating "This article is NOT generated by AI. No AI
// assistance was used." as carrying an AI label, so an explicit denial graded as a
// present label. Returns { found, negated }: `found` phrases are real occurrences,
// `negated` ones are denials — counter-evidence, not labels.
export function matchPhrasesWithNegation(text, phrases) {
  const found = [];
  const negated = [];
  if (!text) return { found, negated };
  for (const phrase of phrases) {
    let idx = text.indexOf(phrase);
    let sawPositive = false;
    let sawNegated = false;
    while (idx !== -1) {
      if (isNegated(text, idx)) sawNegated = true;
      else sawPositive = true;
      idx = text.indexOf(phrase, idx + phrase.length);
    }
    if (sawPositive) found.push(phrase);
    else if (sawNegated) negated.push(phrase);
  }
  return { found, negated };
}
