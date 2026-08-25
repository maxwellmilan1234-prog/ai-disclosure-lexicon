import { test } from "node:test";
import assert from "node:assert/strict";
import { scanTerms, disclosesAI, detectedLanguages, assessDisclosure } from "../index.js";

test("matches whole-word AI/bot terms", () => {
  assert.equal(disclosesAI("You are chatting with a bot"), true);
  assert.equal(disclosesAI("Talk to our chatbot"), true);
  assert.equal(disclosesAI("This is powered by AI"), true);
  assert.equal(disclosesAI("I'm a virtual assistant"), true);
});

test("word boundaries prevent substring false positives", () => {
  // 'bot' must not match inside 'bottom'; 'robot' must not match inside 'robotics'
  assert.equal(disclosesAI("scroll to the bottom of the page"), false);
  assert.equal(disclosesAI("a robotics engineering firm"), false);
  // 'ai' must not match inside 'email' / 'maintenance'
  assert.equal(disclosesAI("email us about maintenance"), false);
});

test("negation guard suppresses negated terms", () => {
  assert.equal(disclosesAI("You are not a bot, a real person"), false);
  assert.equal(disclosesAI("dit is geen chatbot"), false); // nl: 'geen' negator
  const matches = scanTerms("This is not a bot");
  assert.equal(matches.length, 1);
  assert.equal(matches[0].negated, true);
});

test("multilingual coverage (nl/de/fr/es/it)", () => {
  assert.equal(disclosesAI("onze virtuele assistent helpt u"), true); // nl
  assert.equal(disclosesAI("Ich bin ein KI-Assistent"), true); // de, hyphen flex
  assert.equal(disclosesAI("assistant virtuel à votre service"), true); // fr
  assert.equal(disclosesAI("soy un asistente virtual"), true); // es
  assert.equal(disclosesAI("sono un assistente virtuale"), true); // it
});

test("reports language of matches", () => {
  const langs = detectedLanguages(scanTerms("Ich bin ein KI-Assistent"));
  assert.ok(langs.includes("de"));
});

test("product-ambiguous terms are tagged low-confidence, not just bare acronyms", () => {
  const robot = scanTerms("track my robot order")[0];
  assert.equal(robot.term, "robot");
  assert.equal(robot.low, true);

  const automated = scanTerms("automated returns available")[0];
  assert.equal(automated.term, "automated");
  assert.equal(automated.low, true);

  const virtualAssistant = scanTerms("book a call with our virtual assistant")[0];
  assert.equal(virtualAssistant.term, "virtual assistant");
  assert.equal(virtualAssistant.low, true);

  // A clearly self-referential term stays strong (not low-confidence).
  const aiAssistant = scanTerms("I'm an AI assistant")[0];
  assert.equal(aiAssistant.low, false);
});

test("empty / non-string input is safe", () => {
  assert.deepEqual(scanTerms(""), []);
  assert.deepEqual(scanTerms(null), []);
  assert.deepEqual(scanTerms(undefined), []);
});

// A negator binds only inside its own clause. "I'm not a human, I'm an AI assistant"
// is standard honest greeting copy, and reading the `not` (which negates *human*)
// as negating the disclosure accused exactly the sites that disclose.
const strong = (text) => scanTerms(text).filter((m) => !m.negated && !m.low);

test("negation is clause-bounded: a denial of being human does not negate the AI disclosure", () => {
  for (const text of [
    "I'm not a human — I'm an AI assistant.",
    "I am not a human, I am an AI assistant here to help.",
    "I am not a human. I am an AI assistant.",
  ]) {
    assert.ok(strong(text).length > 0, `should read as a disclosure: ${text}`);
  }
});

test("negation still fires when the negator is in the SAME clause as the term", () => {
  for (const text of ["We are not an AI assistant.", "Not a chatbot", "This is not a bot.", "I am not a bot, I am a real person"]) {
    assert.equal(strong(text).length, 0, `should stay negated/weak: ${text}`);
    assert.ok(scanTerms(text).some((m) => m.negated), `a negated match is expected: ${text}`);
  }
});

test("Romance-language disclosures match a strong compound, not just the bare acronym", () => {
  for (const text of [
    "Je suis votre assistant IA.",
    "Soy un asistente de IA.",
    "Sono un assistente IA.",
  ]) {
    assert.ok(strong(text).length > 0, `idiomatic disclosure should be strong: ${text}`);
  }
});

test("first-person English acronym is strong (the pronoun removes the ambiguity)", () => {
  assert.ok(strong("Hi! I'm an AI.").length > 0);
  // The bare acronym on its own stays low-confidence — that gate still exists.
  assert.equal(strong("AI").length, 0);
});

// ---- assessDisclosure: the corroboration rule ------------------------------------

test("a single strong term is a disclosure on its own", () => {
  assert.equal(assessDisclosure("Talk to our chatbot").disclosed, true);
});

test("a single low-confidence term is NOT a disclosure", () => {
  assert.equal(assessDisclosure("track my robot order").disclosed, false);
  assert.equal(assessDisclosure("book a call with our virtual assistant").disclosed, false);
});

test("two distinct non-acronym weak terms corroborate", () => {
  const a = assessDisclosure("This chat is automated and powered by ai technology.");
  assert.equal(a.disclosed, true);
});

// The Romanian acronym-pair regression: "ai" (en, low) + "ia" (fr/es/it/ca, low) both
// fire as whole words on ordinary Romanian contact copy. Two bare acronyms must never
// corroborate (BARE_ACRONYMS guard).
test("two bare acronym lows never corroborate (Romanian copy regression)", () => {
  const a = assessDisclosure("Bună! Dacă ai întrebări, ia legătura cu echipa noastră.");
  assert.equal(a.disclosed, false);
});

// The Slovenian pronoun regression: de's "ki" (the German KI acronym) is Slovenian's
// ubiquitous relative pronoun. "robot" (low) + "ki" (acronym) on an ordinary
// kitchen-robot promo must not corroborate.
test("acronym 'ki' cannot corroborate 'robot' (Slovenian pronoun regression)", () => {
  const a = assessDisclosure("Kupite kuhinjski robot, ki vam prihrani čas pri peki.");
  assert.equal(a.disclosed, false);
});

test("negatedOnly reports denial-only text", () => {
  const a = assessDisclosure("This is not a bot.");
  assert.equal(a.disclosed, false);
  assert.equal(a.negatedOnly, true);
});

test("assessDisclosure reports terms, tiers and languages", () => {
  const a = assessDisclosure("Ich bin ein KI-Assistent");
  assert.equal(a.disclosed, true);
  assert.ok(a.strongTerms.includes("ki-assistent"));
  assert.ok(a.languages.includes("de"));
});
