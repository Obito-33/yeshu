const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR-ANON-KEY';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = s => document.querySelector(s);
const MAX_MB = 50; // Supabase free plan limit

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

async function loadVideos() {
  const grid = $('#grid');
  grid.replaceChildren();
  const { data, error } = await db
    .from('videos').select('*').order('created_at', { ascending: false });

  if (error) return grid.append(el('p', '', 'Load aagala: ' + error.message));
  if (!data.length) return grid.append(el('p', '', 'இன்னும் வீடியோ இல்ல. முதல் வீடியோ நீ போடு!'));

  data.forEach(v => {
    const card = el('article', 'card');
    const vid = document.createElement('video');
    vid.src = v.video_url;
    vid.controls = true;
    vid.preload = 'metadata';
    vid.playsInline = true;

    const meta = el('div', 'meta');
    const p = el('p', '');
    p.append(el('span', 'tag', v.tool || 'AI'), ' ' + (v.creator || 'Anonymous'));
    meta.append(el('h3', '', v.title), p);

    card.append(vid, meta);
    grid.append(card);
  });
}

$('#form').onsubmit = async e => {
  e.preventDefault();
  const file = $('#file').files[0];
  const btn = $('#btn');
  if (!file) return;
  if (file.size > MAX_MB * 1024 * 1024) return alert(`${MAX_MB}MB-க்கு கீழ உள்ள வீடியோ போடு`);

  btn.disabled = true;
  btn.textContent = 'பதிவேற்றம் நடக்குது…';

  try {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const up = await db.storage.from('videos').upload(path, file, { contentType: file.type });
    if (up.error) throw up.error;

    const { data } = db.storage.from('videos').getPublicUrl(path);

    const ins = await db.from('videos').insert({
      title: $('#title').value.trim(),
      creator: $('#creator').value.trim() || 'Anonymous',
      tool: $('#tool').value,
      video_url: data.publicUrl
    });
    if (ins.error) throw ins.error;

    $('#form').reset();
    await loadVideos();
    alert('பதிவேற்றம் ஆச்சு!');
  } catch (err) {
    alert('Upload fail: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'பதிவேற்று';
  }
};

loadVideos();