// Per-language positive / negative / negated tests for the 18 languages added
// 2026-07-27 and Irish (ga), added 2026-08-10. Sentences come from the per-language
// proposal + adversarial-review pass that also produced docs/kill-list.md.
// Positives must produce a non-negated match; negatives and negated denials must not
// assess as a disclosure (a single low-confidence hit on everyday copy is by design
// not a disclosure — that is the corroboration rule in assessDisclosure).

import { test } from "node:test";
import assert from "node:assert/strict";
import { disclosesAI, assessDisclosure } from "../index.js";

const panelDiscloses = (text) => assessDisclosure(text).disclosed;

test("Polish (pl) disclosure terms", () => {
  assert.equal(disclosesAI("Cześć! Jestem chatbotem sklepu i odpowiem na Twoje pytania o zamówienie."), true, "Cześć! Jestem chatbotem sklepu i odpowiem na Twoje pytania o zamówienie.");
  assert.equal(disclosesAI("Witaj! Jestem wirtualnym asystentem banku — w czym mogę pomóc?"), true, "Witaj! Jestem wirtualnym asystentem banku — w czym mogę pomóc?");
  assert.equal(disclosesAI("Dzień dobry! Nasz asystent AI odpowie w kilka sekund."), true, "Dzień dobry! Nasz asystent AI odpowie w kilka sekund.");
  assert.equal(disclosesAI("Rozmawiasz ze sztuczną inteligencją wspieraną przez nasz zespół obsługi."), true, "Rozmawiasz ze sztuczną inteligencją wspieraną przez nasz zespół obsługi.");
  assert.equal(disclosesAI("To jest automatyczna odpowiedź — konsultant odezwie się w godzinach pracy."), true, "To jest automatyczna odpowiedź — konsultant odezwie się w godzinach pracy.");
  assert.equal(disclosesAI("Hej! Jestem botem firmy Kowalski i pomogę Ci wybrać rozmiar."), true, "Hej! Jestem botem firmy Kowalski i pomogę Ci wybrać rozmiar.");
});
test("Polish (pl) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Zimowe boty i eleganckie buty skórzane — darmowa dostawa od 200 zł."), false, "Zimowe boty i eleganckie buty skórzane — darmowa dostawa od 200 zł.");
  assert.equal(panelDiscloses("Dobra robota! Twoje zamówienie jest już w drodze do Ciebie."), false, "Dobra robota! Twoje zamówienie jest już w drodze do Ciebie.");
  assert.equal(panelDiscloses("Roboty drogowe na trasie kuriera mogą opóźnić dzisiejsze dostawy."), false, "Roboty drogowe na trasie kuriera mogą opóźnić dzisiejsze dostawy.");
  assert.equal(panelDiscloses("Skontaktuj się z naszym doradcą — chętnie pomożemy w wyborze."), false, "Skontaktuj się z naszym doradcą — chętnie pomożemy w wyborze.");
  assert.equal(panelDiscloses("Automat do kawy w naszym salonie czeka na klientów."), false, "Automat do kawy w naszym salonie czeka na klientów.");
  assert.equal(panelDiscloses("Nasi konsultanci są dostępni od poniedziałku do piątku w godzinach 8-16."), false, "Nasi konsultanci są dostępni od poniedziałku do piątku w godzinach 8-16.");
});
test("Polish (pl) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Nie jestem robotem — u nas zawsze odpowiada człowiek."), false, "Nie jestem robotem — u nas zawsze odpowiada człowiek.");
  assert.equal(panelDiscloses("Nie jestem botem, mam na imię Marta i chętnie pomogę."), false, "Nie jestem botem, mam na imię Marta i chętnie pomogę.");
  assert.equal(panelDiscloses("To nie jest automatyczna odpowiedź, pisze do Ciebie prawdziwy konsultant."), false, "To nie jest automatyczna odpowiedź, pisze do Ciebie prawdziwy konsultant.");
  assert.equal(panelDiscloses("Żaden chatbot nie obsługuje tego czatu — piszesz z człowiekiem."), false, "Żaden chatbot nie obsługuje tego czatu — piszesz z człowiekiem.");
});

test("Czech (cs) disclosure terms", () => {
  assert.equal(disclosesAI("Dobrý den! Jsem virtuální asistentka Anna a pracuji na bázi umělé inteligence."), true, "Dobrý den! Jsem virtuální asistentka Anna a pracuji na bázi umělé inteligence.");
  assert.equal(disclosesAI("Ahoj, jsem chatbot naší podpory. Jak vám mohu pomoci?"), true, "Ahoj, jsem chatbot naší podpory. Jak vám mohu pomoci?");
  assert.equal(disclosesAI("Komunikujete s chatbotem poháněným umělou inteligencí."), true, "Komunikujete s chatbotem poháněným umělou inteligencí.");
  assert.equal(disclosesAI("Náš AI asistent je vám k dispozici nonstop."), true, "Náš AI asistent je vám k dispozici nonstop.");
  assert.equal(disclosesAI("Jsem robot, ale budu se snažit vám co nejlépe pomoci."), true, "Jsem robot, ale budu se snažit vám co nejlépe pomoci.");
  assert.equal(disclosesAI("Toto je automatická odpověď našeho digitálního asistenta."), true, "Toto je automatická odpověď našeho digitálního asistenta.");
});
test("Czech (cs) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Nové kožené boty skladem – doprava zdarma při nákupu nad 1 000 Kč."), false, "Nové kožené boty skladem – doprava zdarma při nákupu nad 1 000 Kč.");
  assert.equal(panelDiscloses("Recenze kuchyňského robota Bosch najdete v sekci domácnost."), false, "Recenze kuchyňského robota Bosch najdete v sekci domácnost.");
  assert.equal(panelDiscloses("Vylepšili jsme uživatelské rozhraní (UI) naší aplikace."), false, "Vylepšili jsme uživatelské rozhraní (UI) naší aplikace.");
  assert.equal(panelDiscloses("Vaše objednávka se automaticky uloží a potvrzení přijde e-mailem."), false, "Vaše objednávka se automaticky uloží a potvrzení přijde e-mailem.");
  assert.equal(panelDiscloses("Emoční inteligence a osobní asistent jsou témata našeho školení."), false, "Emoční inteligence a osobní asistent jsou témata našeho školení.");
});
test("Czech (cs) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Nejsem chatbot, na chatu s vámi je živý operátor."), false, "Nejsem chatbot, na chatu s vámi je živý operátor.");
  assert.equal(panelDiscloses("Žádnou umělou inteligenci náš chat nepoužívá."), false, "Žádnou umělou inteligenci náš chat nepoužívá.");
  assert.equal(panelDiscloses("S žádným chatbotem nemluvíte, odpovídá vám kolegyně Jana."), false, "S žádným chatbotem nemluvíte, odpovídá vám kolegyně Jana.");
  assert.equal(panelDiscloses("Náš chat nepoužívá umělou inteligenci ani chatboty."), false, "Náš chat nepoužívá umělou inteligenci ani chatboty.");
});

test("Slovak (sk) disclosure terms", () => {
  assert.equal(disclosesAI("Dobrý deň! Som chatbot spoločnosti Alfa a rád vám pomôžem s vašou objednávkou."), true, "Dobrý deň! Som chatbot spoločnosti Alfa a rád vám pomôžem s vašou objednávkou.");
  assert.equal(disclosesAI("Vitajte! Práve komunikujete s chatbotom založeným na umelej inteligencii."), true, "Vitajte! Práve komunikujete s chatbotom založeným na umelej inteligencii.");
  assert.equal(disclosesAI("Ahoj, som AI asistent a som vám k dispozícii 24 hodín denne."), true, "Ahoj, som AI asistent a som vám k dispozícii 24 hodín denne.");
  assert.equal(disclosesAI("Toto je automatická odpoveď, náš tím vám odpíše čo najskôr."), true, "Toto je automatická odpoveď, náš tím vám odpíše čo najskôr.");
  assert.equal(disclosesAI("Dobrý deň, som virtuálny asistent poháňaný umelou inteligenciou."), true, "Dobrý deň, som virtuálny asistent poháňaný umelou inteligenciou.");
});
test("Slovak (sk) everyday copy must not match", () => {
  assert.equal(panelDiscloses("V sobotu a nedeľu máme zatvorené, napíšte nám prosím v pondelok."), false, "V sobotu a nedeľu máme zatvorené, napíšte nám prosím v pondelok.");
  assert.equal(panelDiscloses("Robotníci práve dokončujú opravu predajne, ďakujeme za trpezlivosť."), false, "Robotníci práve dokončujú opravu predajne, ďakujeme za trpezlivosť.");
  assert.equal(panelDiscloses("Kávu si môžete kúpiť v automate na prvom poschodí."), false, "Kávu si môžete kúpiť v automate na prvom poschodí.");
  assert.equal(panelDiscloses("Naša aplikácia má nové prehľadné UI a tmavý režim."), false, "Naša aplikácia má nové prehľadné UI a tmavý režim.");
  assert.equal(panelDiscloses("Náš predajný asistent vám osobne poradí priamo v predajni."), false, "Náš predajný asistent vám osobne poradí priamo v predajni.");
});
test("Slovak (sk) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Nie som robot, som živý operátor zákazníckej podpory."), false, "Nie som robot, som živý operátor zákazníckej podpory.");
  assert.equal(panelDiscloses("Nie som chatbot, píše vám skutočný človek."), false, "Nie som chatbot, píše vám skutočný človek.");
  assert.equal(panelDiscloses("Nekomunikujete so žiadnym chatbotom, sme skutoční ľudia."), false, "Nekomunikujete so žiadnym chatbotom, sme skutoční ľudia.");
});

test("Hungarian (hu) disclosure terms", () => {
  assert.equal(disclosesAI("Üdvözlöm! Én egy chatbot vagyok, miben segíthetek?"), true, "Üdvözlöm! Én egy chatbot vagyok, miben segíthetek?");
  assert.equal(disclosesAI("Szia! Mesterséges intelligenciával működő digitális asszisztens vagyok."), true, "Szia! Mesterséges intelligenciával működő digitális asszisztens vagyok.");
  assert.equal(disclosesAI("Chatbotunk éjjel-nappal elérhető, kérdezzen tőle bátran!"), true, "Chatbotunk éjjel-nappal elérhető, kérdezzen tőle bátran!");
  assert.equal(disclosesAI("Vanda vagyok, a bank digitális asszisztense. Miben segíthetek Önnek?"), true, "Vanda vagyok, a bank digitális asszisztense. Miben segíthetek Önnek?");
  assert.equal(disclosesAI("Ez egy automatikus válasz: munkatársaink hétköznap 9 és 17 óra között válaszolnak."), true, "Ez egy automatikus válasz: munkatársaink hétköznap 9 és 17 óra között válaszolnak.");
  assert.equal(disclosesAI("Az AI-asszisztens azonnal válaszol a gyakori kérdésekre."), true, "Az AI-asszisztens azonnal válaszol a gyakori kérdésekre.");
});
test("Hungarian (hu) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Miben segíthetünk? Mi hétfőtől péntekig személyesen is elérhetőek vagyunk."), false, "Miben segíthetünk? Mi hétfőtől péntekig személyesen is elérhetőek vagyunk.");
  assert.equal(panelDiscloses("A túrabotok és a robotporszívók ma akciósak webáruházunkban."), false, "A túrabotok és a robotporszívók ma akciósak webáruházunkban.");
  assert.equal(panelDiscloses("Az érzelmi intelligencia fejlesztéséről szóló cikkünket itt olvashatja."), false, "Az érzelmi intelligencia fejlesztéséről szóló cikkünket itt olvashatja.");
  assert.equal(panelDiscloses("Automatákat telepítünk irodákba és iskolákba, kérjen ajánlatot!"), false, "Automatákat telepítünk irodákba és iskolákba, kérjen ajánlatot!");
  // The recorded "mi-asszisztens" kill: "mi" is the pronoun, "asszisztens" a human
  // job title — "our assistant team" must never grade as an AI disclosure.
  assert.equal(panelDiscloses("A mi asszisztens csapatunk hétfőtől péntekig elérhető."), false, "A mi asszisztens csapatunk hétfőtől péntekig elérhető.");
});
test("Hungarian (hu) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Nem vagyok robot, élő munkatárs válaszol Önnek."), false, "Nem vagyok robot, élő munkatárs válaszol Önnek.");
  assert.equal(panelDiscloses("Nálunk nincs chatbot: minden kérdésre valódi kolléga válaszol."), false, "Nálunk nincs chatbot: minden kérdésre valódi kolléga válaszol.");
  assert.equal(panelDiscloses("Soha nem chatbottal, hanem képzett munkatárssal beszél."), false, "Soha nem chatbottal, hanem képzett munkatárssal beszél.");
});

test("Romanian (ro) disclosure terms", () => {
  assert.equal(disclosesAI("Bună! Sunt un chatbot și te pot ajuta cu întrebări despre comanda ta."), true, "Bună! Sunt un chatbot și te pot ajuta cu întrebări despre comanda ta.");
  assert.equal(disclosesAI("Salut! Sunt asistentul băncii, bazat pe inteligență artificială, disponibil non-stop."), true, "Salut! Sunt asistentul băncii, bazat pe inteligență artificială, disponibil non-stop.");
  assert.equal(disclosesAI("Acesta este un răspuns automat: un asistent virtual îți va prelua întrebarea."), true, "Acesta este un răspuns automat: un asistent virtual îți va prelua întrebarea.");
  assert.equal(disclosesAI("Bună ziua! Sunt un robot conversațional și răspund imediat la întrebările frecvente."), true, "Bună ziua! Sunt un robot conversațional și răspund imediat la întrebările frecvente.");
  assert.equal(disclosesAI("Buna! Sunt un bot si iti raspund automat, fara pauza."), true, "Buna! Sunt un bot si iti raspund automat, fara pauza.");
});
test("Romanian (ro) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Ai întrebări? Ia legătura cu echipa noastră și îți răspundem imediat."), false, "Ai întrebări? Ia legătura cu echipa noastră și îți răspundem imediat.");
  assert.equal(panelDiscloses("Bună, sunt Ana din echipa de suport. Ia loc, îți răspund imediat."), false, "Bună, sunt Ana din echipa de suport. Ia loc, îți răspund imediat.");
  assert.equal(panelDiscloses("Promoție: robot de bucătărie cu 20% reducere. Livrare automată a facturii pe email."), false, "Promoție: robot de bucătărie cu 20% reducere. Livrare automată a facturii pe email.");
  assert.equal(panelDiscloses("Ca asistent ai acces la cursurile noastre de formare medicală."), false, "Ca asistent ai acces la cursurile noastre de formare medicală.");
  assert.equal(panelDiscloses("Botul cățelului este umed — semn că este sănătos."), false, "Botul cățelului este umed — semn că este sănătos.");
});
test("Romanian (ro) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Nu sunt un robot, sunt Andrei din echipa de vânzări și îți răspund personal."), false, "Nu sunt un robot, sunt Andrei din echipa de vânzări și îți răspund personal.");
  assert.equal(panelDiscloses("Bifează căsuța pentru a confirma că nu ești robot."), false, "Bifează căsuța pentru a confirma că nu ești robot.");
  assert.equal(panelDiscloses("Acesta nu este un răspuns automat — un coleg îți scrie chiar acum."), false, "Acesta nu este un răspuns automat — un coleg îți scrie chiar acum.");
});

test("Bulgarian (bg) disclosure terms", () => {
  assert.equal(disclosesAI("Здравейте! Аз съм чатботът на банката и мога да отговоря на въпросите ви веднага."), true, "Здравейте! Аз съм чатботът на банката и мога да отговоря на въпросите ви веднага.");
  assert.equal(disclosesAI("Здравей! Аз съм Ива — вашият виртуален асистент, задвижван от изкуствен интелект."), true, "Здравей! Аз съм Ива — вашият виртуален асистент, задвижван от изкуствен интелект.");
  assert.equal(disclosesAI("Говорите с ИИ асистент. Отговорите се генерират автоматично, а при нужда ще ви свържа с колега."), true, "Говорите с ИИ асистент. Отговорите се генерират автоматично, а при нужда ще ви свържа с колега.");
  assert.equal(disclosesAI("Това е автоматично съобщение: ще ви отговорим до 24 часа."), true, "Това е автоматично съобщение: ще ви отговорим до 24 часа.");
  assert.equal(disclosesAI("Аз съм бот и понякога допускам грешки — напишете 'човек', за да се свържете с оператор."), true, "Аз съм бот и понякога допускам грешки — напишете 'човек', за да се свържете с оператор.");
});
test("Bulgarian (bg) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Ботите и ботушите са с 20% отстъпка до края на седмицата."), false, "Ботите и ботушите са с 20% отстъпка до края на седмицата.");
  assert.equal(panelDiscloses("Роботизираната прахосмукачка е хит в промоцията ни този месец."), false, "Роботизираната прахосмукачка е хит в промоцията ни този месец.");
  assert.equal(panelDiscloses("Диванът е с тапицерия от изкуствена кожа и лесна поддръжка."), false, "Диванът е с тапицерия от изкуствена кожа и лесна поддръжка.");
  assert.equal(panelDiscloses("Всички линии за поръчки работят нормално днес."), false, "Всички линии за поръчки работят нормално днес.");
  assert.equal(panelDiscloses("Нашите асистенти в шоурума ще ви помогнат с избора на автоматична скоростна кутия."), false, "Нашите асистенти в шоурума ще ви помогнат с избора на автоматична скоростна кутия.");
});
test("Bulgarian (bg) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Не съм робот — насреща е истински човек от екипа ни."), false, "Не съм робот — насреща е истински човек от екипа ни.");
  assert.equal(panelDiscloses("Тук няма чатбот: с вас разговаря нашият екип от консултанти."), false, "Тук няма чатбот: с вас разговаря нашият екип от консултанти.");
  assert.equal(panelDiscloses("Разговаряте с човек, а не с автоматизиран асистент."), false, "Разговаряте с човек, а не с автоматизиран асистент.");
  assert.equal(panelDiscloses("Ние нямаме бот — всяко съобщение се чете от служител."), false, "Ние нямаме бот — всяко съобщение се чете от служител.");
});

test("Greek (el) disclosure terms", () => {
  assert.equal(disclosesAI("Γεια σας! Είμαι η Έρη, η ψηφιακή βοηθός της τράπεζας. Πώς μπορώ να βοηθήσω;"), true, "Γεια σας! Είμαι η Έρη, η ψηφιακή βοηθός της τράπεζας. Πώς μπορώ να βοηθήσω;");
  assert.equal(disclosesAI("Συνομιλείτε με chatbot τεχνητής νοημοσύνης, διαθέσιμο όλο το 24ωρο."), true, "Συνομιλείτε με chatbot τεχνητής νοημοσύνης, διαθέσιμο όλο το 24ωρο.");
  assert.equal(disclosesAI("Είμαι ένα ρομπότ και απαντώ αυτόματα σε συχνές ερωτήσεις."), true, "Είμαι ένα ρομπότ και απαντώ αυτόματα σε συχνές ερωτήσεις.");
  assert.equal(disclosesAI("ΑΥΤΟΜΑΤΗ ΑΠΑΝΤΗΣΗ: Ο ΕΙΚΟΝΙΚΟΣ ΒΟΗΘΟΣ ΜΑΣ ΕΙΝΑΙ ΔΙΑΘΕΣΙΜΟΣ 24/7."), true, "ΑΥΤΟΜΑΤΗ ΑΠΑΝΤΗΣΗ: Ο ΕΙΚΟΝΙΚΟΣ ΒΟΗΘΟΣ ΜΑΣ ΕΙΝΑΙ ΔΙΑΘΕΣΙΜΟΣ 24/7.");
  assert.equal(disclosesAI("Ο βοηθός μας λειτουργεί με τεχνητή νοημοσύνη (ΤΝ) και μαθαίνει συνεχώς."), true, "Ο βοηθός μας λειτουργεί με τεχνητή νοημοσύνη (ΤΝ) και μαθαίνει συνεχώς.");
  assert.equal(disclosesAI("Μιλήστε με τον ψηφιακό βοηθό μας για άμεση εξυπηρέτηση."), true, "Μιλήστε με τον ψηφιακό βοηθό μας για άμεση εξυπηρέτηση.");
});
test("Greek (el) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Η ρομποτική σκούπα και οι μπότες πεζοπορίας είναι σε προσφορά — δείτε και τα μποτάκια."), false, "Η ρομποτική σκούπα και οι μπότες πεζοπορίας είναι σε προσφορά — δείτε και τα μποτάκια.");
  assert.equal(panelDiscloses("Ο βοηθός φαρμακοποιού μας απαντά στο τηλέφωνο από τις 9 έως τις 5."), false, "Ο βοηθός φαρμακοποιού μας απαντά στο τηλέφωνο από τις 9 έως τις 5.");
  assert.equal(panelDiscloses("Αυτόματο κιβώτιο ταχυτήτων και αυτόματη ρύθμιση κλιματισμού — δοκιμάστε το αυτοκίνητο."), false, "Αυτόματο κιβώτιο ταχυτήτων και αυτόματη ρύθμιση κλιματισμού — δοκιμάστε το αυτοκίνητο.");
  assert.equal(panelDiscloses("Κάντε κράτηση στον Άι Γιάννη — εικονική περιήγηση στα δωμάτια διαθέσιμη."), false, "Κάντε κράτηση στον Άι Γιάννη — εικονική περιήγηση στα δωμάτια διαθέσιμη.");
  assert.equal(panelDiscloses("Καλώς ήρθατε και καλή διαμονή — η ρεσεψιόν είναι ανοιχτή όλη μέρα."), false, "Καλώς ήρθατε και καλή διαμονή — η ρεσεψιόν είναι ανοιχτή όλη μέρα.");
});
test("Greek (el) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Δεν είμαι ρομπότ."), false, "Δεν είμαι ρομπότ.");
  assert.equal(panelDiscloses("Μιλήστε με άνθρωπο — όχι με ρομπότ ή αυτοματοποιημένη εξυπηρέτηση."), false, "Μιλήστε με άνθρωπο — όχι με ρομπότ ή αυτοματοποιημένη εξυπηρέτηση.");
  assert.equal(panelDiscloses("Καμία αυτόματη απάντηση — ένας πραγματικός συνεργάτης σας απαντά πάντα."), false, "Καμία αυτόματη απάντηση — ένας πραγματικός συνεργάτης σας απαντά πάντα.");
  assert.equal(panelDiscloses("Χωρίς chatbot: εξυπηρέτηση μόνο από ανθρώπους."), false, "Χωρίς chatbot: εξυπηρέτηση μόνο από ανθρώπους.");
});

test("Croatian (hr) disclosure terms", () => {
  assert.equal(disclosesAI("Pozdrav! Ja sam chatbot tvrtke Primjer Osiguranje i tu sam da odgovorim na vaša pitanja."), true, "Pozdrav! Ja sam chatbot tvrtke Primjer Osiguranje i tu sam da odgovorim na vaša pitanja.");
  assert.equal(disclosesAI("Dobrodošli! Ovaj razgovor vodi digitalni asistent temeljen na umjetnoj inteligenciji."), true, "Dobrodošli! Ovaj razgovor vodi digitalni asistent temeljen na umjetnoj inteligenciji.");
  assert.equal(disclosesAI("Bok, ja sam virtualni asistent i dostupan sam 0-24."), true, "Bok, ja sam virtualni asistent i dostupan sam 0-24.");
  assert.equal(disclosesAI("Naš AI asistent odmah odgovara, a na jednostavne upite stiže automatski odgovor."), true, "Naš AI asistent odmah odgovara, a na jednostavne upite stiže automatski odgovor.");
  assert.equal(disclosesAI("Razgovarate s chatbotom koji koristi umjetnu inteligenciju."), true, "Razgovarate s chatbotom koji koristi umjetnu inteligenciju.");
});
test("Croatian (hr) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Naši agenti uživo odgovaraju radnim danom od 8 do 16 sati."), false, "Naši agenti uživo odgovaraju radnim danom od 8 do 16 sati.");
  assert.equal(panelDiscloses("Vaša pretplata se automatski obnavlja svakog mjeseca."), false, "Vaša pretplata se automatski obnavlja svakog mjeseca.");
  assert.equal(panelDiscloses("Posjetite naš botanički vrt i kupite bocu domaćeg maslinovog ulja."), false, "Posjetite naš botanički vrt i kupite bocu domaćeg maslinovog ulja.");
  assert.equal(panelDiscloses("Uistinu nam je stalo do vašeg iskustva — ocijenite naše novo korisničko sučelje (UI)."), false, "Uistinu nam je stalo do vašeg iskustva — ocijenite naše novo korisničko sučelje (UI).");
});
test("Croatian (hr) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Ja nisam robot — javljam se osobno, Marko iz podrške."), false, "Ja nisam robot — javljam se osobno, Marko iz podrške.");
  assert.equal(panelDiscloses("Ne, ja nisam chatbot; sa mnom razgovara stvarna osoba."), false, "Ne, ja nisam chatbot; sa mnom razgovara stvarna osoba.");
  assert.equal(panelDiscloses("Ovdje nema umjetne inteligencije — na poruke odgovara naš tim."), false, "Ovdje nema umjetne inteligencije — na poruke odgovara naš tim.");
});

test("Slovenian (sl) disclosure terms", () => {
  assert.equal(disclosesAI("Pozdravljeni! Sem Vida, vaša virtualna asistentka z umetno inteligenco."), true, "Pozdravljeni! Sem Vida, vaša virtualna asistentka z umetno inteligenco.");
  assert.equal(disclosesAI("Živjo! Sem klepetalni robot in samodejno odgovarjam na vaša vprašanja."), true, "Živjo! Sem klepetalni robot in samodejno odgovarjam na vaša vprašanja.");
  assert.equal(disclosesAI("Pogovarjate se s pogovornim robotom, ki ga poganja umetna inteligenca."), true, "Pogovarjate se s pogovornim robotom, ki ga poganja umetna inteligenca.");
  assert.equal(disclosesAI("To je avtomatsko sporočilo – naš AI asistent vam bo odgovoril takoj."), true, "To je avtomatsko sporočilo – naš AI asistent vam bo odgovoril takoj.");
  assert.equal(disclosesAI("Vprašajte naš klepetalnik – digitalni pomočnik je na voljo 24 ur na dan."), true, "Vprašajte naš klepetalnik – digitalni pomočnik je na voljo 24 ur na dan.");
});
test("Slovenian (sl) everyday copy must not match", () => {
  assert.equal(panelDiscloses("V naši ponudbi najdete robotske sesalnike in kuhinjske aparate po znižanih cenah."), false, "V naši ponudbi najdete robotske sesalnike in kuhinjske aparate po znižanih cenah.");
  assert.equal(panelDiscloses("Pridite sem in si oglejte botanični vrt – vstopnice so na voljo online."), false, "Pridite sem in si oglejte botanični vrt – vstopnice so na voljo online.");
  assert.equal(panelDiscloses("Naš svetovalec vam bo osebno odgovoril v enem delovnem dnevu."), false, "Naš svetovalec vam bo osebno odgovoril v enem delovnem dnevu.");
  assert.equal(panelDiscloses("Za avtomatski menjalnik in servis vozila se obrnite na našo delavnico."), false, "Za avtomatski menjalnik in servis vozila se obrnite na našo delavnico.");
  assert.equal(panelDiscloses("Kupite kuhinjski robot, ki vam prihrani čas pri peki."), false, "Kupite kuhinjski robot, ki vam prihrani čas pri peki.");
});
test("Slovenian (sl) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Nisem robot – sem Marko iz prodajne ekipe in osebno odgovarjam na vsa sporočila."), false, "Nisem robot – sem Marko iz prodajne ekipe in osebno odgovarjam na vsa sporočila.");
  assert.equal(panelDiscloses("Potrdite, da niste robot, in nadaljujte z nakupom."), false, "Potrdite, da niste robot, in nadaljujte z nakupom.");
  assert.equal(panelDiscloses("Naš klepet ni avtomatiziran, saj vam odgovarjajo izključno naši svetovalci."), false, "Naš klepet ni avtomatiziran, saj vam odgovarjajo izključno naši svetovalci.");
});

test("Lithuanian (lt) disclosure terms", () => {
  assert.equal(disclosesAI("Sveiki! Aš esu pokalbių robotas ir atsakysiu į jūsų klausimus visą parą."), true, "Sveiki! Aš esu pokalbių robotas ir atsakysiu į jūsų klausimus visą parą.");
  assert.equal(disclosesAI("Labas! Jūs kalbate su virtualiu asistentu, veikiančiu dirbtinio intelekto pagrindu."), true, "Labas! Jūs kalbate su virtualiu asistentu, veikiančiu dirbtinio intelekto pagrindu.");
  assert.equal(disclosesAI("Sveiki atvykę į mūsų svetainę – esu virtualus asistentas, kuo galiu padėti?"), true, "Sveiki atvykę į mūsų svetainę – esu virtualus asistentas, kuo galiu padėti?");
  assert.equal(disclosesAI("Čia automatinis atsakymas: mūsų komanda susisieks su jumis darbo valandomis."), true, "Čia automatinis atsakymas: mūsų komanda susisieks su jumis darbo valandomis.");
  assert.equal(disclosesAI("Mūsų chatbotas padės jums rasti tinkamą prekę per kelias sekundes."), true, "Mūsų chatbotas padės jums rasti tinkamą prekę per kelias sekundes.");
  assert.equal(disclosesAI("Labas, aš Vika – jūsų DI asistentė. Kuo galiu padėti?"), true, "Labas, aš Vika – jūsų DI asistentė. Kuo galiu padėti?");
});
test("Lithuanian (lt) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Sveiki, aš esu Rūta, jūsų klientų aptarnavimo specialistė. Kuo galiu padėti?"), false, "Sveiki, aš esu Rūta, jūsų klientų aptarnavimo specialistė. Kuo galiu padėti?");
  assert.equal(panelDiscloses("Mūsų robotai siurbliai vėl turi nuolaidą – apsilankykite parduotuvėje!"), false, "Mūsų robotai siurbliai vėl turi nuolaidą – apsilankykite parduotuvėje!");
  assert.equal(panelDiscloses("Kavos automatas pirmame aukšte veikia visą parą."), false, "Kavos automatas pirmame aukšte veikia visą parą.");
  assert.equal(panelDiscloses("Botagas ir kitos jojimo prekės su nuolaida iki 30 proc."), false, "Botagas ir kitos jojimo prekės su nuolaida iki 30 proc.");
  assert.equal(panelDiscloses("Il team di assistenza clienti ti risponderà entro un'ora."), false, "Il team di assistenza clienti ti risponderà entro un'ora.");
  assert.equal(panelDiscloses("Estas botas de piel son las más vendidas esta temporada."), false, "Estas botas de piel son las más vendidas esta temporada.");
});
test("Lithuanian (lt) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Aš ne robotas – mūsų komandoje dirba tikri žmonės."), false, "Aš ne robotas – mūsų komandoje dirba tikri žmonės.");
  assert.equal(panelDiscloses("Aš nesu pokalbių robotas, esu gyvas konsultantas Tomas."), false, "Aš nesu pokalbių robotas, esu gyvas konsultantas Tomas.");
  assert.equal(panelDiscloses("Patvirtinkite, kad nesate robotas, ir tęskite registraciją."), false, "Patvirtinkite, kad nesate robotas, ir tęskite registraciją.");
});

test("Latvian (lv) disclosure terms", () => {
  assert.equal(disclosesAI("Sveiki! Es esmu čatbots un palīdzēšu atbildēt uz jūsu jautājumiem."), true, "Sveiki! Es esmu čatbots un palīdzēšu atbildēt uz jūsu jautājumiem.");
  assert.equal(disclosesAI("Labdien! Esmu virtuālais asistents Toms. Kā varu palīdzēt?"), true, "Labdien! Esmu virtuālais asistents Toms. Kā varu palīdzēt?");
  assert.equal(disclosesAI("Šo sarunu vada mākslīgais intelekts."), true, "Šo sarunu vada mākslīgais intelekts.");
  assert.equal(disclosesAI("Sveicināti! Jums atbild MI asistents. Uzdodiet savu jautājumu!"), true, "Sveicināti! Jums atbild MI asistents. Uzdodiet savu jautājumu!");
  assert.equal(disclosesAI("Šis ir automātiska atbilde — mūsu komanda atbildēs darba laikā."), true, "Šis ir automātiska atbilde — mūsu komanda atbildēs darba laikā.");
  assert.equal(disclosesAI("Jūs sarunājaties ar čatbotu — atbildes tiek ģenerētas automātiski."), true, "Jūs sarunājaties ar čatbotu — atbildes tiek ģenerētas automātiski.");
  assert.equal(disclosesAI("Es esmu mākslīgā intelekta asistents un dažkārt varu kļūdīties."), true, "Es esmu mākslīgā intelekta asistents un dažkārt varu kļūdīties.");
});
test("Latvian (lv) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Emocionālais intelekts ir svarīga mūsu komandas vērtība."), false, "Emocionālais intelekts ir svarīga mūsu komandas vērtība.");
  assert.equal(panelDiscloses("Jaunais robots putekļsūcējs atkal ir pieejams noliktavā."), false, "Jaunais robots putekļsūcējs atkal ir pieejams noliktavā.");
  assert.equal(panelDiscloses("Botānikas grāmatas atradīsiet otrajā stāvā."), false, "Botānikas grāmatas atradīsiet otrajā stāvā.");
  assert.equal(panelDiscloses("Piedāvājam virtuālo ekskursiju pa mūsu muzeju."), false, "Piedāvājam virtuālo ekskursiju pa mūsu muzeju.");
  assert.equal(panelDiscloses("Mi chiamo Anna e sono qui per aiutarti con il tuo ordine."), false, "Mi chiamo Anna e sono qui per aiutarti con il tuo ordine.");
  assert.equal(panelDiscloses("Automātiskā pārnesumkārba pieejama visiem modeļiem."), false, "Automātiskā pārnesumkārba pieejama visiem modeļiem.");
});
test("Latvian (lv) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Šis nav čatbots — jums atbild mūsu klientu atbalsta darbinieks."), false, "Šis nav čatbots — jums atbild mūsu klientu atbalsta darbinieks.");
  assert.equal(panelDiscloses("Apliecinu, ka neesmu robots."), false, "Apliecinu, ka neesmu robots.");
  assert.equal(panelDiscloses("Mēs neizmantojam mākslīgo intelektu klientu apkalpošanā."), false, "Mēs neizmantojam mākslīgo intelektu klientu apkalpošanā.");
});

test("Estonian (et) disclosure terms", () => {
  assert.equal(disclosesAI("Tere! Olen juturobot ja aitan teid tellimuste ja tagastustega."), true, "Tere! Olen juturobot ja aitan teid tellimuste ja tagastustega.");
  assert.equal(disclosesAI("Tere tulemast! Vestlete tehisintellektiga, kes vastab teie küsimustele ööpäevaringselt."), true, "Tere tulemast! Vestlete tehisintellektiga, kes vastab teie küsimustele ööpäevaringselt.");
  assert.equal(disclosesAI("Hei! Mina olen AI-assistent ja vastan teie küsimustele kohe."), true, "Hei! Mina olen AI-assistent ja vastan teie küsimustele kohe.");
  assert.equal(disclosesAI("See on automaatvastus – meie tiim võtab teiega esimesel võimalusel ühendust."), true, "See on automaatvastus – meie tiim võtab teiega esimesel võimalusel ühendust.");
  assert.equal(disclosesAI("Olen virtuaalne assistent ja kasutan vastamiseks tehisaru."), true, "Olen virtuaalne assistent ja kasutan vastamiseks tehisaru.");
});
test("Estonian (et) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Tere tulemast meie e-poodi! Kuidas saame teid täna aidata?"), false, "Tere tulemast meie e-poodi! Kuidas saame teid täna aidata?");
  assert.equal(panelDiscloses("Teie tellimus kinnitati automaatselt ja robotniiduk saadetakse homme välja."), false, "Teie tellimus kinnitati automaatselt ja robotniiduk saadetakse homme välja.");
  assert.equal(panelDiscloses("Botaanikaaed on avatud iga päev, piletid saab osta kohapealt."), false, "Botaanikaaed on avatud iga päev, piletid saab osta kohapealt.");
  assert.equal(panelDiscloses("Meie klienditeenindaja Liisa vastab teile esimesel võimalusel."), false, "Meie klienditeenindaja Liisa vastab teile esimesel võimalusel.");
});
test("Estonian (et) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Ma ei ole robot, vaid päris inimene meie klienditoest."), false, "Ma ei ole robot, vaid päris inimene meie klienditoest.");
  assert.equal(panelDiscloses("See pole automaatvastus – teile kirjutab elus inimene."), false, "See pole automaatvastus – teile kirjutab elus inimene.");
  assert.equal(panelDiscloses("Te ei vestle juturobotiga, teid teenindab alati päris inimene."), false, "Te ei vestle juturobotiga, teid teenindab alati päris inimene.");
});

test("Finnish (fi) disclosure terms", () => {
  assert.equal(disclosesAI("Hei! Olen Aino, verkkokauppamme chattibotti - autan sinua mielelläni tilauksissa."), true, "Hei! Olen Aino, verkkokauppamme chattibotti - autan sinua mielelläni tilauksissa.");
  assert.equal(disclosesAI("Tervetuloa! Keskustelet tekoälyn kanssa, ja vastaan viesteihisi vuorokauden ympäri."), true, "Tervetuloa! Keskustelet tekoälyn kanssa, ja vastaan viesteihisi vuorokauden ympäri.");
  assert.equal(disclosesAI("Hei, olen tekoälyavustaja ja autan sinua tilauksiin liittyvissä kysymyksissä."), true, "Hei, olen tekoälyavustaja ja autan sinua tilauksiin liittyvissä kysymyksissä.");
  assert.equal(disclosesAI("Huomaathan, että tämä on automaattinen vastaus - asiakaspalvelumme jatkaa arkisin klo 9-17."), true, "Huomaathan, että tämä on automaattinen vastaus - asiakaspalvelumme jatkaa arkisin klo 9-17.");
  assert.equal(disclosesAI("Moi! Olen robotti, mutta yritän auttaa parhaani mukaan."), true, "Moi! Olen robotti, mutta yritän auttaa parhaani mukaan.");
});
test("Finnish (fi) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Aivan, autan mielelläni! Asiakaspalvelijamme vastaa sinulle henkilökohtaisesti hetken kuluttua."), false, "Aivan, autan mielelläni! Asiakaspalvelijamme vastaa sinulle henkilökohtaisesti hetken kuluttua.");
  assert.equal(panelDiscloses("Pakettiautomaatista voit noutaa tilauksesi vuorokauden ympäri - katso lähin automaatti kartalta."), false, "Pakettiautomaatista voit noutaa tilauksesi vuorokauden ympäri - katso lähin automaatti kartalta.");
  assert.equal(panelDiscloses("Kerromme kursseillamme lisää tekoälystä ja robotiikasta - opettajamme vastaavat chatissa arkisin."), false, "Kerromme kursseillamme lisää tekoälystä ja robotiikasta - opettajamme vastaavat chatissa arkisin.");
  assert.equal(panelDiscloses("Tutustu robottiruohonleikkureihin verkkokaupassamme - myyjämme auttavat sinua valinnassa."), false, "Tutustu robottiruohonleikkureihin verkkokaupassamme - myyjämme auttavat sinua valinnassa.");
});
test("Finnish (fi) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Emme käytä tekoälyä asiakaspalvelussamme - viestisi lukee aina oikea ihminen."), false, "Emme käytä tekoälyä asiakaspalvelussamme - viestisi lukee aina oikea ihminen.");
  assert.equal(panelDiscloses("Chattimme ei ole chatbot, vaan sinua palvelee koulutettu asiantuntija."), false, "Chattimme ei ole chatbot, vaan sinua palvelee koulutettu asiantuntija.");
  assert.equal(panelDiscloses("Sinua palvelee oikea ihminen ilman tekoälyä tai botteja."), false, "Sinua palvelee oikea ihminen ilman tekoälyä tai botteja.");
});

test("Swedish (sv) disclosure terms", () => {
  assert.equal(disclosesAI("Hej! Jag är en AI-assistent och hjälper dig dygnet runt."), true, "Hej! Jag är en AI-assistent och hjälper dig dygnet runt.");
  assert.equal(disclosesAI("Du chattar med vår chattbot. Ställ din fråga så hjälper jag dig direkt."), true, "Du chattar med vår chattbot. Ställ din fråga så hjälper jag dig direkt.");
  assert.equal(disclosesAI("Hej, jag heter Nova och är en chattrobot som bygger på artificiell intelligens."), true, "Hej, jag heter Nova och är en chattrobot som bygger på artificiell intelligens.");
  assert.equal(disclosesAI("Detta är ett automatiskt svar från vår digitala assistent."), true, "Detta är ett automatiskt svar från vår digitala assistent.");
  assert.equal(disclosesAI("Hej! Jag är AI-assistenten Elsa. Vad kan jag hjälpa dig med?"), true, "Hej! Jag är AI-assistenten Elsa. Vad kan jag hjälpa dig med?");
  assert.equal(disclosesAI("Jag är en virtuell assistent och kan ibland missförstå frågor."), true, "Jag är en virtuell assistent och kan ibland missförstå frågor.");
});
test("Swedish (sv) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Vi vill råda bot på de långa väntetiderna i kundtjänsten."), false, "Vi vill råda bot på de långa väntetiderna i kundtjänsten.");
  assert.equal(panelDiscloses("Har du bott utomlands i mer än fem år?"), false, "Har du bott utomlands i mer än fem år?");
  assert.equal(panelDiscloses("Boten för felparkering är 800 kronor."), false, "Boten för felparkering är 800 kronor.");
  assert.equal(panelDiscloses("Våra robotgräsklippare är automatiska och testade av experter."), false, "Våra robotgräsklippare är automatiska och testade av experter.");
  assert.equal(panelDiscloses("Vår assistent på kliniken hjälper dig att boka en tid."), false, "Vår assistent på kliniken hjälper dig att boka en tid.");
});
test("Swedish (sv) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Jag är inte en robot, jag är en riktig människa."), false, "Jag är inte en robot, jag är en riktig människa.");
  assert.equal(panelDiscloses("Du chattar inte med en chattbot – här svarar riktiga människor."), false, "Du chattar inte med en chattbot – här svarar riktiga människor.");
  assert.equal(panelDiscloses("Vår kundtjänst är ingen AI, alla svar skrivs av människor."), false, "Vår kundtjänst är ingen AI, alla svar skrivs av människor.");
  assert.equal(panelDiscloses("Hos oss får du aldrig automatiserade svar."), false, "Hos oss får du aldrig automatiserade svar.");
});

test("Danish (da) disclosure terms", () => {
  assert.equal(disclosesAI("Hej! Jeg er en chatbot, og jeg kan hjælpe dig med dine spørgsmål."), true, "Hej! Jeg er en chatbot, og jeg kan hjælpe dig med dine spørgsmål.");
  assert.equal(disclosesAI("Du chatter med vores virtuelle assistent, som er drevet af kunstig intelligens."), true, "Du chatter med vores virtuelle assistent, som er drevet af kunstig intelligens.");
  assert.equal(disclosesAI("Velkommen! Jeg er en AI-assistent og svarer på dine spørgsmål døgnet rundt."), true, "Velkommen! Jeg er en AI-assistent og svarer på dine spørgsmål døgnet rundt.");
  assert.equal(disclosesAI("Bemærk: dette er et automatisk svar fra vores chatrobot."), true, "Bemærk: dette er et automatisk svar fra vores chatrobot.");
  assert.equal(disclosesAI("Hej, jeg er en robot, men jeg gør mit bedste for at hjælpe dig!"), true, "Hej, jeg er en robot, men jeg gør mit bedste for at hjælpe dig!");
});
test("Danish (da) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Hej! Jeg hedder Mette, og jeg sidder klar til at hjælpe dig."), false, "Hej! Jeg hedder Mette, og jeg sidder klar til at hjælpe dig.");
  assert.equal(panelDiscloses("Spar 20 % på robotstøvsugere i denne uge — automatisk rengøring hver dag."), false, "Spar 20 % på robotstøvsugere i denne uge — automatisk rengøring hver dag.");
  assert.equal(panelDiscloses("Læs om vores botilbud, og find den rette støtte til dig."), false, "Læs om vores botilbud, og find den rette støtte til dig.");
  assert.equal(panelDiscloses("Dit abonnement fornyes automatisk, og du kan altid opsige det."), false, "Dit abonnement fornyes automatisk, og du kan altid opsige det.");
  assert.equal(panelDiscloses("Kim fra kundeservice kigger på din sag med det samme."), false, "Kim fra kundeservice kigger på din sag med det samme.");
});
test("Danish (da) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Jeg er ikke en robot — jeg er et rigtigt menneske fra kundeservice."), false, "Jeg er ikke en robot — jeg er et rigtigt menneske fra kundeservice.");
  assert.equal(panelDiscloses("Du taler ikke med en chatbot her — alle svar kommer fra rigtige mennesker."), false, "Du taler ikke med en chatbot her — alle svar kommer fra rigtige mennesker.");
  assert.equal(panelDiscloses("Her er ingen chatbot; du skriver direkte med vores medarbejdere."), false, "Her er ingen chatbot; du skriver direkte med vores medarbejdere.");
});

test("Portuguese (pt) disclosure terms", () => {
  assert.equal(disclosesAI("Olá! Sou um chatbot e posso ajudar com o seu pedido."), true, "Olá! Sou um chatbot e posso ajudar com o seu pedido.");
  assert.equal(disclosesAI("Este chat usa inteligência artificial para responder às suas perguntas."), true, "Este chat usa inteligência artificial para responder às suas perguntas.");
  assert.equal(disclosesAI("Oi! Eu sou a Bia, assistente de IA da nossa loja. Como posso ajudar?"), true, "Oi! Eu sou a Bia, assistente de IA da nossa loja. Como posso ajudar?");
  assert.equal(disclosesAI("Sou uma IA e respondo de imediato às questões mais frequentes."), true, "Sou uma IA e respondo de imediato às questões mais frequentes.");
  assert.equal(disclosesAI("Fale com o nosso atendente virtual: um serviço automatizado disponível 24 horas por dia."), true, "Fale com o nosso atendente virtual: um serviço automatizado disponível 24 horas por dia.");
  assert.equal(disclosesAI("Fora do horário de expediente, você receberá uma resposta automática do nosso sistema."), true, "Fora do horário de expediente, você receberá uma resposta automática do nosso sistema.");
});
test("Portuguese (pt) everyday copy must not match", () => {
  assert.equal(panelDiscloses("A nossa equipa ia responder ontem, mas o sistema esteve em manutenção."), false, "A nossa equipa ia responder ontem, mas o sistema esteve em manutenção.");
  assert.equal(panelDiscloses("O nosso assistente ia transferir a chamada para um colega humano."), false, "O nosso assistente ia transferir a chamada para um colega humano.");
  assert.equal(panelDiscloses("Sabia que a nossa loja abre aos sábados? Envie a sua dúvida pelo chat."), false, "Sabia que a nossa loja abre aos sábados? Envie a sua dúvida pelo chat.");
  assert.equal(panelDiscloses("Bateria fraca? A assistência técnica responde em poucos minutos."), false, "Bateria fraca? A assistência técnica responde em poucos minutos.");
  assert.equal(panelDiscloses("O robô de cozinha está em promoção com entrega grátis amanhã."), false, "O robô de cozinha está em promoção com entrega grátis amanhã.");
});
test("Portuguese (pt) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Não sou um robô — sou uma pessoa real da equipa de apoio."), false, "Não sou um robô — sou uma pessoa real da equipa de apoio.");
  assert.equal(panelDiscloses("Você não fala com um chatbot, mas com a nossa equipa de apoio."), false, "Você não fala com um chatbot, mas com a nossa equipa de apoio.");
  assert.equal(panelDiscloses("Isto não é uma resposta automática: um colega escreveu esta mensagem."), false, "Isto não é uma resposta automática: um colega escreveu esta mensagem.");
});

test("Catalan (ca) disclosure terms", () => {
  assert.equal(disclosesAI("Hola! Sóc un chatbot i estic aquí per ajudar-te amb la teva comanda."), true, "Hola! Sóc un chatbot i estic aquí per ajudar-te amb la teva comanda.");
  assert.equal(disclosesAI("Benvingut! Aquest xat funciona amb intel·ligència artificial: escriu la teva pregunta."), true, "Benvingut! Aquest xat funciona amb intel·ligència artificial: escriu la teva pregunta.");
  assert.equal(disclosesAI("Bon dia! Soc un assistent d'IA; si vols, un agent humà pot continuar la conversa."), true, "Bon dia! Soc un assistent d'IA; si vols, un agent humà pot continuar la conversa.");
  assert.equal(disclosesAI("Hola, sóc la Mia, la teva assistent virtual amb IA."), true, "Hola, sóc la Mia, la teva assistent virtual amb IA.");
  assert.equal(disclosesAI("Fora de l'horari d'atenció rebràs una resposta automàtica generada per un bot de conversa."), true, "Fora de l'horari d'atenció rebràs una resposta automàtica generada per un bot de conversa.");
});
test("Catalan (ca) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Benvinguts a la nostra botiga en línia; aviat hi trobaràs les novetats d'estiu."), false, "Benvinguts a la nostra botiga en línia; aviat hi trobaràs les novetats d'estiu.");
  assert.equal(panelDiscloses("El nostre equip d'atenció al client et respondrà tan aviat com sigui possible."), false, "El nostre equip d'atenció al client et respondrà tan aviat com sigui possible.");
  assert.equal(panelDiscloses("Consulta la guia de compra i el diari de la companyia per estar al dia."), false, "Consulta la guia de compra i el diari de la companyia per estar al dia.");
  assert.equal(panelDiscloses("Troba la roba d'estiu ideal i afegeix-la al cistell amb un sol clic."), false, "Troba la roba d'estiu ideal i afegeix-la al cistell amb un sol clic.");
});
test("Catalan (ca) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("No sóc un robot, sóc la Carme de l'equip d'atenció al client."), false, "No sóc un robot, sóc la Carme de l'equip d'atenció al client.");
  assert.equal(panelDiscloses("El nostre servei no és cap chatbot: sempre t'atén una persona real."), false, "El nostre servei no és cap chatbot: sempre t'atén una persona real.");
  assert.equal(panelDiscloses("Sense cap bot ni resposta automàtica: aquí sempre parles amb persones."), false, "Sense cap bot ni resposta automàtica: aquí sempre parles amb persones.");
});

test("Maltese (mt) disclosure terms", () => {
  assert.equal(disclosesAI("Merħba! Jien chatbot u nista' ngħinek bi kwalunkwe mistoqsija dwar l-ordni tiegħek."), true, "Merħba! Jien chatbot u nista' ngħinek bi kwalunkwe mistoqsija dwar l-ordni tiegħek.");
  assert.equal(disclosesAI("Bonġu! Qed titkellem ma' assistent virtwali imħaddem bl-intelliġenza artifiċjali."), true, "Bonġu! Qed titkellem ma' assistent virtwali imħaddem bl-intelliġenza artifiċjali.");
  assert.equal(disclosesAI("Din hija tweġiba awtomatika: l-assistent diġitali tagħna se jwieġbek fi ftit sekondi."), true, "Din hija tweġiba awtomatika: l-assistent diġitali tagħna se jwieġbek fi ftit sekondi.");
  assert.equal(disclosesAI("Għandek bżonn għajnuna? Jien assistent tal-IA u nwieġeb mill-ewwel, lejl u nhar."), true, "Għandek bżonn għajnuna? Jien assistent tal-IA u nwieġeb mill-ewwel, lejl u nhar.");
});
test("Maltese (mt) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Merħba fil-ħanut tagħna — ixtri żewġ bottijiet tal-kunserva u ġib it-tielet b'xejn."), false, "Merħba fil-ħanut tagħna — ixtri żewġ bottijiet tal-kunserva u ġib it-tielet b'xejn.");
  assert.equal(panelDiscloses("Il-bibien tal-garaxx jinfetħu awtomatikament malli tasal."), false, "Il-bibien tal-garaxx jinfetħu awtomatikament malli tasal.");
  assert.equal(panelDiscloses("Aġent tal-assigurazzjoni tagħna jista' jarranġa appuntament virtwali għalik għada."), false, "Aġent tal-assigurazzjoni tagħna jista' jarranġa appuntament virtwali għalik għada.");
  assert.equal(panelDiscloses("Grazzi! Talia se twieġbek fi ftit minuti."), false, "Grazzi! Talia se twieġbek fi ftit minuti.");
});
test("Maltese (mt) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("M'iniex robot — jien persuna vera mit-tim tal-appoġġ."), false, "M'iniex robot — jien persuna vera mit-tim tal-appoġġ.");
  assert.equal(panelDiscloses("Jien mhux chatbot; hawn bniedem iwieġbek dejjem."), false, "Jien mhux chatbot; hawn bniedem iwieġbek dejjem.");
  assert.equal(panelDiscloses("Hawnhekk m'hemm l-ebda chatbot — kull tweġiba tiġi minn nies reali."), false, "Hawnhekk m'hemm l-ebda chatbot — kull tweġiba tiġi minn nies reali.");
});
// ---- Irish (ga), added 2026-08-10 — the 24th official EU language. Terms verified
// against téarma.ie and live Gaeilge usage; kill list and reasoning in
// docs/kill-list.md.

test("Irish (ga) disclosure terms", () => {
  assert.equal(disclosesAI("Dia dhuit! Is bota comhrá mé agus táim anseo chun cabhrú leat le do cheist."), true, "Dia dhuit! Is bota comhrá mé agus táim anseo chun cabhrú leat le do cheist.");
  assert.equal(disclosesAI("Fáilte! Tá tú ag comhrá le cúntóir digiteach atá bunaithe ar an intleacht shaorga."), true, "Fáilte! Tá tú ag comhrá le cúntóir digiteach atá bunaithe ar an intleacht shaorga.");
  assert.equal(disclosesAI("Úsáideann an tseirbhís seo an intleacht shaorga chun do cheisteanna a fhreagairt láithreach."), true, "Úsáideann an tseirbhís seo an intleacht shaorga chun do cheisteanna a fhreagairt láithreach.");
  assert.equal(disclosesAI("Is freagra uathoibríoch é seo — beidh ball dár bhfoireann ar ais chugat go luath."), true, "Is freagra uathoibríoch é seo — beidh ball dár bhfoireann ar ais chugat go luath.");
  assert.equal(disclosesAI("Haigh! Is chatbot mé agus cabhróidh mé leat do bhealach a dhéanamh tríd an suíomh."), true, "Haigh! Is chatbot mé agus cabhróidh mé leat do bhealach a dhéanamh tríd an suíomh.");
  assert.equal(disclosesAI("Tá tú ag labhairt le gníomhaire comhráiteach de chuid na seirbhíse custaiméirí."), true, "Tá tú ag labhairt le gníomhaire comhráiteach de chuid na seirbhíse custaiméirí.");
});
test("Irish (ga) weak-term corroboration works at the detector level", () => {
  // "cúntóir fíorúil" (virtual assistant) and "uathoibrithe" (automated) are both
  // low-confidence; two distinct non-acronym weak terms corroborate.
  assert.equal(panelDiscloses("Is cúntóir fíorúil uathoibrithe mé — cuir do cheist agus déanfaidh mé mo dhícheall."), true, "Is cúntóir fíorúil uathoibrithe mé — cuir do cheist agus déanfaidh mé mo dhícheall.");
});
test("Irish (ga) everyday copy must not match", () => {
  assert.equal(panelDiscloses("Fáilte go dtí ár siopa! Tá lascaine 20% ar gach táirge an tseachtain seo."), false, "Fáilte go dtí ár siopa! Tá lascaine 20% ar gach táirge an tseachtain seo.");
  assert.equal(panelDiscloses("Beidh cúntóir pearsanta ar fáil duit inár siopa i mBaile Átha Cliath."), false, "Beidh cúntóir pearsanta ar fáil duit inár siopa i mBaile Átha Cliath.");
  assert.equal(panelDiscloses("Déan comhrá lenár bhfoireann — táimid ar fáil ó Luan go hAoine, 9 go 5."), false, "Déan comhrá lenár bhfoireann — táimid ar fáil ó Luan go hAoine, 9 go 5.");
  assert.equal(panelDiscloses("Tá ár n-oifigí dúnta inniu; fág teachtaireacht agus glaofaimid ar ais ort amárach."), false, "Tá ár n-oifigí dúnta inniu; fág teachtaireacht agus glaofaimid ar ais ort amárach.");
  assert.equal(panelDiscloses("Seirbhís uathoibrithe páirceála atá ar fáil ag an aerfort do gach custaiméir."), false, "Seirbhís uathoibrithe páirceála atá ar fáil ag an aerfort do gach custaiméir.");
});
test("Irish (ga) negated denials are not disclosures", () => {
  assert.equal(panelDiscloses("Ní róbat mé — is duine daonna atá ag freagairt do cheisteanna anseo."), false, "Ní róbat mé — is duine daonna atá ag freagairt do cheisteanna anseo.");
  assert.equal(panelDiscloses("Ní bota comhrá é seo; tá Máire ónár bhfoireann ag scríobh chugat go pearsanta."), false, "Ní bota comhrá é seo; tá Máire ónár bhfoireann ag scríobh chugat go pearsanta.");
  assert.equal(panelDiscloses("Níl aon intleacht shaorga in úsáid againn sa chomhrá seo — daoine ar fad atá anseo."), false, "Níl aon intleacht shaorga in úsáid againn sa chomhrá seo — daoine ar fad atá anseo.");
  assert.equal(panelDiscloses("Gan aon chatbot — freagraíonn ár ndaoine féin gach ceist a chuirtear."), false, "Gan aon chatbot — freagraíonn ár ndaoine féin gach ceist a chuirtear.");
});
test("cross-language: Czech 'bota' (a shoe) does not fire Irish 'bota comhrá'", () => {
  assert.equal(panelDiscloses("Nové kožené boty skladem – bota pravá i levá, doprava zdarma."), false, "Nové kožené boty skladem – bota pravá i levá, doprava zdarma.");
});
