/* ===== Daily Verse – script.js ===== */
const API = 'https://api.getbible.net/v2';
const BOOKS = "Genesis,Exodus,Leviticus,Numbers,Deuteronomy,Joshua,Judges,Ruth,1 Samuel,2 Samuel,1 Kings,2 Kings,1 Chronicles,2 Chronicles,Ezra,Nehemiah,Esther,Job,Psalms,Proverbs,Ecclesiastes,Song of Solomon,Isaiah,Jeremiah,Lamentations,Ezekiel,Daniel,Hosea,Joel,Amos,Obadiah,Jonah,Micah,Nahum,Habakkuk,Zephaniah,Haggai,Zechariah,Malachi,Matthew,Mark,Luke,John,Acts,Romans,1 Corinthians,2 Corinthians,Galatians,Ephesians,Philippians,Colossians,1 Thessalonians,2 Thessalonians,1 Timothy,2 Timothy,Titus,Philemon,Hebrews,James,1 Peter,2 Peter,1 John,2 John,3 John,Jude,Revelation".split(',');

/* [book#, chapter, from, to, Tamil explanation]
   Explanation voice file (optional): audio/explain-0.mp3 ... audio/explain-14.mp3 */
const V = [
 [19,23,1,1,"கர்த்தர் உங்களை ஒரு மேய்ப்பன் மாதிரி பார்த்துக்கறாரு. அவர் கூட இருக்கும்போது உங்களுக்கு எந்தக் குறையும் வராது. இன்னைக்கு நிம்மதியா இருங்க."],
 [43,3,16,16,"கடவுள் நம்மள அவ்வளவு அதிகமா நேசிக்கிறாரு. அதனால தன்னோட மகன் இயேசுவையே நமக்காகக் கொடுத்தாரு. அவர நம்புறவங்களுக்கு முடிவில்லாத வாழ்க்கை கிடைக்கும்."],
 [50,4,6,7,"எதுக்கும் கவலைப்படாதீங்க. எல்லாத்தையும் ஜெபத்துல கடவுள்கிட்ட சொல்லுங்க. அப்போ புரிஞ்சுக்க முடியாத அளவுக்கு ஒரு அமைதி உங்க மனசுக்குள்ள வரும்."],
 [40,11,28,28,"பாரம் சுமந்து களைச்சுப்போனவங்க எல்லாரும் என்கிட்ட வாங்கன்னு இயேசு கூப்பிடுறாரு. அவர் உங்களுக்கு ஓய்வும் ஆறுதலும் தருவாரு."],
 [23,41,10,10,"பயப்படாதீங்க, நான் உங்க கூடவே இருக்கேன்னு கடவுள் சொல்றாரு. உங்கள தாங்கிப் பிடிச்சு பலப்படுத்துவாரு."],
 [24,29,11,11,"உங்க வாழ்க்கைக்கு கடவுள் நல்ல திட்டம் வச்சிருக்காரு. அது தீமைக்கு இல்ல, நம்பிக்கையான எதிர்காலத்துக்கு."],
 [20,3,5,6,"உங்க சொந்த புத்தியை மட்டும் நம்பாம, முழு மனசோட கடவுளை நம்புங்க. அவர் உங்க பாதையை நேரா வழிநடத்துவாரு."],
 [45,8,28,28,"கடவுளை நேசிக்கிறவங்களுக்கு எல்லாமே கடைசியில நன்மையா முடியும். இப்போ கஷ்டமா தெரிஞ்சாலும் அவர் பாத்துக்குவாரு."],
 [6,1,9,9,"தைரியமா இருங்க, பயப்படாதீங்க. நீங்க எங்க போனாலும் கடவுள் உங்க கூடவே வருவாரு."],
 [19,46,1,1,"கஷ்டமான நேரத்துல கடவுள்தான் நமக்குப் புகலிடம், பலம், எப்பவும் கிடைக்கிற உதவி."],
 [43,14,27,27,"இயேசு தர்ற அமைதி உலகம் தர்ற அமைதி மாதிரி இல்ல. அதனால மனசு கலங்காம, பயப்படாம இருங்க."],
 [23,40,31,31,"கடவுளுக்காகக் காத்திருக்கிறவங்களுக்கு புது பலம் கிடைக்கும். கழுகு மாதிரி உயரப் பறப்பாங்க, சோர்ந்து போக மாட்டாங்க."],
 [60,5,7,7,"உங்க கவலைகளை எல்லாம் அவர்கிட்ட இறக்கி வச்சிடுங்க, ஏன்னா அவர் உங்கள ரொம்ப அக்கறையா பாத்துக்குறாரு."],
 [4,6,24,26,"கர்த்தர் உங்கள ஆசீர்வதிச்சு காப்பாத்தட்டும். அவர் முகத்தை உங்க மேல பிரகாசிக்கப் பண்ணி உங்களுக்கு சமாதானம் தரட்டும்."],
 [19,119,105,105,"கடவுளுடைய வார்த்தை நம்ம கால்களுக்கு விளக்கு மாதிரி. இருட்டான நேரத்துலயும் எந்த வழியில போகணும்னு காட்டும்."]
];

const $ = s => document.querySelector(s);
const store = {
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
};
let TR = {}, cache = {}, token = 0, audio = null, today = null, selVerse = null, voices = [];

/* ---------- small helpers ---------- */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 4500);
}
const curTr = () => TR[$('#tr').value] || { abbreviation: 'kjv', lang: 'en' };
const langOf = t => ((t && t.lang) || 'en').toLowerCase();

async function chapter(tr, b, c) {
  const k = `${tr}/${b}/${c}`;
  if (cache[k]) return cache[k];
  const r = await fetch(`${API}/${tr}/${b}/${c}.json`);
  if (!r.ok) throw new Error('not found');
  return (cache[k] = await r.json());
}

/* ---------- voice (text to speech) ---------- */
const loadVoices = () => { voices = speechSynthesis.getVoices(); };
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

function stopAll() {
  token++;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (audio) { audio.onerror = null; audio.pause(); audio = null; }
  document.querySelectorAll('.now').forEach(e => e.classList.remove('now'));
}

/* list = [{t: text, el: element to highlight}] */
function speak(list, lang) {
  if (!('speechSynthesis' in window)) return toast('This browser has no voice support. Use Chrome or Edge.');
  stopAll();
  const id = token, code = lang.slice(0, 2);
  const v = voices.find(x => x.lang.toLowerCase().replace('_', '-').startsWith(code));
  if (!v && code !== 'en') {
    toast('No voice for this language on your device. Install it in Settings > Text-to-speech (or use Chrome/Edge).');
  }
  const next = i => {
    if (id !== token || i >= list.length) return;
    const { t, el } = list[i];
    if (el) el.classList.add('now');
    const u = new SpeechSynthesisUtterance(t);
    u.lang = v ? v.lang : lang; if (v) u.voice = v; u.rate = .92;
    u.onend = u.onerror = () => { if (el) el.classList.remove('now'); next(i + 1); };
    speechSynthesis.speak(u);
  };
  setTimeout(() => next(0), 80);
}
const chunks = t => (t.match(/[^.!?।]+[.!?।]*/g) || [t]).map(s => ({ t: s.trim() })).filter(x => x.t);

/* Explanation voice for narrator "Jesus Tyson":
   plays audio/explain-N.mp3 if you recorded it, otherwise falls back to the device Tamil voice */
function playExplain(i, text) {
  stopAll();
  const a = new Audio(`audio/explain-${i}.mp3`);
  audio = a;
  a.onerror = () => { audio = null; speak(chunks(text), 'ta'); };
  a.play().catch(() => {});
}

function showExplain(box, text) {
  box.hidden = false;
  box.innerHTML = '<small>Explained by Jesus Tyson</small>';
  const p = document.createElement('div'); p.textContent = text; box.append(p);
}

/* ---------- daily verse ---------- */
$('#go').onclick = async () => {
  const name = $('#name').value.trim(), date = $('#date').value;
  if (!name || !date) return toast('Please enter your name and pick a date.');
  store.set('name', name);
  const day = Math.floor(new Date(date).getTime() / 864e5);
  const i = ((day % V.length) + V.length) % V.length;
  const [b, c, s, e, ex] = V[i], t = curTr();
  $('#result').hidden = false; $('#exp1').hidden = true; stopAll();
  $('#greet').textContent = `Peace be with you, ${name}`;
  $('#vtext').textContent = 'Loading…'; $('#vref').textContent = '';
  try {
    const ch = await chapter(t.abbreviation, b, c);
    const text = ch.verses.filter(v => v.verse >= s && v.verse <= e).map(v => v.text.trim()).join(' ');
    const ref = `${ch.book_name || BOOKS[b - 1]} ${c}:${s}${e > s ? '-' + e : ''}`;
    const q = $('#vtext'); q.textContent = ''; q.lang = langOf(t);
    text.split(/\s+/).forEach((w, k) => {
      const sp = document.createElement('span');
      sp.className = 'w'; sp.textContent = w + ' '; sp.style.animationDelay = (k * 0.09) + 's';
      q.append(sp);
    });
    $('#vref').textContent = ref;
    today = { i, text, ref, ex, lang: langOf(t) };
    document.body.classList.add('risen');
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch {
    $('#vtext').textContent = 'Could not load this verse. Check your internet or choose another language.';
  }
};
$('#vlisten').onclick = () => today && speak([{ t: today.text + '. ' + today.ref, el: $('#vtext') }], today.lang);
$('#vexp').onclick = () => {
  if (!today) return;
  showExplain($('#exp1'), today.ex);
  playExplain(today.i, today.ex);
};
document.querySelectorAll('.stop').forEach(b => b.onclick = stopAll);

/* ---------- Bible reader ---------- */
async function openChapter() {
  const b = +$('#book').value, c = Math.max(1, +$('#chap').value || 1), t = curTr();
  const box = $('#text'); selVerse = null; $('#exp2').hidden = true; stopAll();
  box.innerHTML = '<p class="hint">Loading…</p>';
  try {
    const ch = await chapter(t.abbreviation, b, c);
    box.innerHTML = ''; box.lang = langOf(t);
    ch.verses.forEach(v => {
      const p = document.createElement('p'); p.className = 'v';
      p.innerHTML = `<b>${v.verse}</b>`; p.append(document.createTextNode(v.text.trim()));
      p.onclick = () => {
        document.querySelectorAll('.v.sel').forEach(x => x.classList.remove('sel'));
        p.classList.add('sel'); selVerse = { n: v.verse, text: v.text.trim(), b, c };
      };
      box.append(p);
    });
    box.scrollTop = 0;
  } catch {
    box.innerHTML = '<p class="hint">This chapter was not found in this language. Try another chapter or language.</p>';
  }
}
$('#open').onclick = openChapter;
$('#prev').onclick = () => { $('#chap').value = Math.max(1, +$('#chap').value - 1); openChapter(); };
$('#next').onclick = () => { $('#chap').value = +$('#chap').value + 1; openChapter(); };
$('#tr').onchange = () => { if ($('#text .v')) openChapter(); };

$('#rlisten').onclick = () => {
  const els = [...document.querySelectorAll('#text .v')];
  if (!els.length) return toast('Open a chapter first.');
  speak(els.map(el => ({ t: el.lastChild.textContent, el })), langOf(curTr()));
};

/* Explain any verse (modern Tamil) with AI – needs API key in Settings */
$('#rexp').onclick = async () => {
  if (!selVerse) return toast('Tap a verse first, then press Explain.');
  const key = store.get('key');
  if (!key) return toast('Add your API key in Settings to explain any verse.');
  const box = $('#exp2'); showExplain(box, 'Please wait…');
  const ref = `${BOOKS[selVerse.b - 1]} ${selVerse.c}:${selVerse.n}`;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json', 'x-api-key': key,
        'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6', max_tokens: 600,
        messages: [{ role: 'user', content: `Explain ${ref}: "${selVerse.text}" in simple, warm, modern spoken Tamil (Tamil script only). Maximum 3 short sentences, easy for a common person. Output only the explanation.` }]
      })
    });
    const j = await r.json();
    const text = j.content && j.content[0] && j.content[0].text;
    if (!text) throw new Error(j.error ? j.error.message : 'no reply');
    showExplain(box, text); speak(chunks(text), 'ta');
  } catch (err) {
    showExplain(box, 'Could not explain: ' + err.message);
  }
};

/* ---------- settings ---------- */
$('#savekey').onclick = () => { store.set('key', $('#key').value.trim()); toast('Saved on this device.'); };

/* ---------- start ---------- */
async function init() {
  $('#date').value = new Date().toISOString().slice(0, 10);
  $('#name').value = store.get('name') || '';
  $('#key').value = store.get('key') || '';
  $('#book').innerHTML = BOOKS.map((n, i) => `<option value="${i + 1}">${n}</option>`).join('');
  $('#book').value = 43;

  let list;
  try {
    list = Object.values(await (await fetch(API + '/translations.json')).json());
  } catch {
    list = [{ abbreviation: 'kjv', translation: 'King James Version', language: 'English', lang: 'en' }];
    toast('Could not load all languages. Check your internet.');
  }
  list.sort((a, b) => ((a.language || '') + a.translation).localeCompare((b.language || '') + b.translation));
  const groups = {};
  list.forEach(t => { TR[t.abbreviation] = t; (groups[t.language || 'Other'] = groups[t.language || 'Other'] || []).push(t); });
  $('#tr').innerHTML = Object.entries(groups).map(([l, a]) =>
    `<optgroup label="${l}">${a.map(t => `<option value="${t.abbreviation}">${t.translation}</option>`).join('')}</optgroup>`).join('');
  const def = list.find(t => /tamil/i.test(t.language || '') || t.lang === 'ta') || list[0];
  $('#tr').value = def.abbreviation;
}
init();
