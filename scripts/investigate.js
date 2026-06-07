'use strict';
const axios   = require('axios');
const cheerio = require('cheerio');

const http = axios.create({
  timeout: 20000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120' }
});

const SLUG = 'hussain-al-shemsi-chartered-accountants-sharjah';
const PAGE_URL = `https://www.malayalibusiness.com/listing/${SLUG}/`;
const BASE     = 'https://www.malayalibusiness.com';

function sep(label) { console.log('\n' + '═'.repeat(60)); console.log('  ' + label); console.log('═'.repeat(60)); }

async function investigatePage() {
  sep('1. PAGE HTML — data-attributes & encoded fields');
  const res = await http.get(PAGE_URL);
  const raw = res.data;
  const $   = cheerio.load(raw);

  // ALL elements with any data- attribute containing phone/email/contact
  const dataAttrEls = [];
  $('*').each(function() {
    const attrs = this.attribs || {};
    const relevant = Object.entries(attrs).filter(([k]) =>
      /phone|email|mobile|contact|tel|whatsapp|web|url/i.test(k)
    );
    if (relevant.length) {
      dataAttrEls.push({ tag: this.tagName, attrs: relevant, text: $(this).text().trim().slice(0,80) });
    }
  });
  if (dataAttrEls.length) {
    dataAttrEls.forEach(e => console.log(JSON.stringify(e)));
  } else {
    console.log('  (none found)');
  }

  sep('2. ALL tel:/mailto:/wa.me LINKS');
  let linkCount = 0;
  $('a').each(function() {
    const href = this.attribs.href || '';
    if (/^(tel:|mailto:|.*wa\.me|.*whatsapp)/i.test(href)) {
      console.log('  HREF:', href, '| TEXT:', $(this).text().trim().slice(0,60));
      linkCount++;
    }
  });
  if (!linkCount) console.log('  (none found)');

  sep('3. CLASSES CONTAINING phone/email/contact/mobile/tel');
  const classEls = [];
  $('[class]').each(function() {
    const cls = (this.attribs.class || '').toLowerCase();
    if (/phone|email|contact|mobile|tel|whatsapp/.test(cls)) {
      const text = $(this).text().trim().slice(0, 120);
      const html = $($.parseHTML($(this).html() || '')).text ? $(this).html().trim().slice(0,300) : '';
      classEls.push({ class: this.attribs.class, text, html });
    }
  });
  classEls.slice(0,20).forEach(e => {
    console.log('  class:', e.class);
    console.log('  text: ', e.text);
    console.log('  html: ', e.html.slice(0,200));
    console.log('  ---');
  });
  if (!classEls.length) console.log('  (none found)');

  sep('4. SCRIPT TAGS — looking for phone/email/AJAX/atob/encoded data');
  let scriptHits = 0;
  $('script').each(function() {
    const content = $(this).html() || '';
    if (/phone|email|mobile|contact|atob|rot13|ajax|nonce|rest_url|wp_ajax/i.test(content)) {
      console.log('  ---SCRIPT---');
      // Print relevant lines only
      content.split('\n').forEach(line => {
        if (/phone|email|mobile|contact|atob|rot13|ajax|nonce|rest_url|wp_ajax/i.test(line)) {
          console.log('  ' + line.trim().slice(0, 200));
        }
      });
      scriptHits++;
    }
  });
  if (!scriptHits) console.log('  (none found)');

  sep('5. GEODIR / WPBDP / LISTING SPECIFIC HTML BLOCKS');
  const geoSelectors = [
    '.geodir-field', '.geodir-post-meta', '.geodir-listing-detail',
    '.gd-detail', '.listing-detail', '.wpbdp-field', '.business-detail',
    '.listing-meta', '.business-meta', '.listing-info', '.contact-info'
  ];
  geoSelectors.forEach(sel => {
    const el = $(sel);
    if (el.length) {
      console.log(`\n  SELECTOR: ${sel} (${el.length} elements)`);
      el.slice(0,3).each(function() {
        console.log('  HTML:', $(this).html().trim().slice(0,400));
      });
    }
  });

  sep('6. ALL META TAGS');
  $('meta').each(function() {
    const attrs = this.attribs;
    const name = attrs.name || attrs.property || attrs['http-equiv'] || '';
    const content = attrs.content || '';
    if (name && content) console.log(`  ${name} = ${content.slice(0,120)}`);
  });

  sep('7. POST ID — from body class, noscript, scripts');
  const bodyClass = $('body').attr('class') || '';
  console.log('  body class:', bodyClass);
  // Extract post-XXX from body class
  const postIdFromBody = bodyClass.match(/post-(\d+)/);
  if (postIdFromBody) console.log('  POST ID from body class:', postIdFromBody[1]);

  // Look for postid in inline scripts
  const postIdPatterns = raw.match(/"postid"\s*:\s*(\d+)|post_id['":\s]+(\d+)|"id"\s*:\s*(\d+)|postId['":\s]+(\d+)/g) || [];
  console.log('  Post ID hints:', [...new Set(postIdPatterns)].slice(0, 5));

  // Try to find AJAX nonce
  const nonceMatch = raw.match(/nonce['":\s]+['"]([a-f0-9]{10,})['"]/g) || [];
  console.log('  Nonces:', [...new Set(nonceMatch)].slice(0, 3));

  sep('8. WP-JSON REFERENCES IN PAGE HTML');
  const wpJsonRefs = [...new Set(raw.match(/wp-json[^"'\s<>]{0,120}/g) || [])];
  wpJsonRefs.slice(0, 15).forEach(r => console.log(' ', r));
  if (!wpJsonRefs.length) console.log('  (none found)');

  sep('9. BASE64 CANDIDATES (anything decoding to phone/email)');
  const b64candidates = [...new Set(raw.match(/[A-Za-z0-9+/]{20,}={0,2}/g) || [])];
  let b64hits = 0;
  for (const s of b64candidates) {
    try {
      const decoded = Buffer.from(s, 'base64').toString('utf8');
      if (/\+971|\b05\d|\b04\d|@[a-z]+\.[a-z]{2,}/.test(decoded)) {
        console.log('  RAW:', s.slice(0, 40), '-> DECODED:', decoded.slice(0, 80));
        b64hits++;
      }
    } catch {}
  }
  if (!b64hits) console.log('  (none found)');

  sep('10. ROT13 CHECK — look for suspicious letter strings');
  // ROT13 of common UAE prefixes: +971 -> +971 (digits unchanged), "phone" -> "cubar"
  const rot13match = raw.match(/cubar|rznvy|jrofvgr|zbovyr/g);
  if (rot13match) console.log('  ROT13 hits:', rot13match);
  else console.log('  (no ROT13 found)');

  sep('11. FULL RAW HTML SNIPPET (chars 5000-8000 — likely listing body)');
  console.log(raw.slice(5000, 8000));

  return postIdFromBody ? postIdFromBody[1] : null;
}

async function investigateRestApi(postId) {
  sep(`12. REST API — wp/v2/posts/${postId || 'UNKNOWN'} (all fields)`);
  if (!postId) {
    // Try searching by slug
    try {
      const r = await http.get(`${BASE}/wp-json/wp/v2/posts?slug=${SLUG}&_fields=id,slug,title,meta,acf,_links`);
      if (r.data && r.data[0]) {
        postId = r.data[0].id;
        console.log('  Found via slug search. ID:', postId);
        console.log('  meta:', JSON.stringify(r.data[0].meta, null, 2));
        console.log('  acf:',  JSON.stringify(r.data[0].acf,  null, 2));
      }
    } catch(e) { console.log('  posts search failed:', e.message); }

    // Also try listing CPT
    const cpts = ['listing', 'listings', 'gd_place', 'wpbdp_listing'];
    for (const cpt of cpts) {
      try {
        const r = await http.get(`${BASE}/wp-json/wp/v2/${cpt}?slug=${SLUG}&_fields=id,slug,title,meta,acf,_links`);
        if (r.data && r.data[0]) {
          postId = r.data[0].id;
          console.log(`  Found via /${cpt}?slug. ID:`, postId);
          console.log('  meta:', JSON.stringify(r.data[0].meta, null, 2));
          console.log('  acf:',  JSON.stringify(r.data[0].acf,  null, 2));
          break;
        }
      } catch {}
    }
  }

  if (postId) {
    // Fetch ALL fields for this specific post
    const fieldSets = [
      `?_fields=id,slug,title,content,meta,acf,_embedded&_embed`,
      `?_fields=acf,meta`,
    ];
    for (const cpt of ['posts', 'listing', 'listings', 'gd_place']) {
      for (const fields of fieldSets) {
        try {
          const r = await http.get(`${BASE}/wp-json/wp/v2/${cpt}/${postId}${fields}`);
          console.log(`\n  /${cpt}/${postId}${fields.slice(0,30)}`);
          const d = r.data;
          if (d.meta && Object.keys(d.meta).length) {
            console.log('  META KEYS:', Object.keys(d.meta).join(', '));
            console.log('  META VALUES:', JSON.stringify(d.meta, null, 2).slice(0, 800));
          }
          if (d.acf && Object.keys(d.acf).length) {
            console.log('  ACF:', JSON.stringify(d.acf, null, 2).slice(0, 800));
          }
        } catch {}
      }
    }
  }
}

async function investigateGeoDirectory(postId) {
  sep('13. GEODIRECTORY REST API');
  const urls = [
    `${BASE}/wp-json/geodir/v2/places`,
    `${BASE}/wp-json/geodir/v2/places?slug=${SLUG}`,
    postId ? `${BASE}/wp-json/geodir/v2/places/${postId}` : null,
  ].filter(Boolean);

  for (const url of urls) {
    try {
      const r = await http.get(url);
      console.log(`\n  GET ${url}`);
      const data = Array.isArray(r.data) ? r.data[0] : r.data;
      if (data) {
        console.log('  KEYS:', Object.keys(data).join(', '));
        console.log('  DATA:', JSON.stringify(data, null, 2).slice(0, 1200));
      }
    } catch(e) {
      console.log(`  ${url} → ${e.response ? e.response.status : e.message}`);
    }
  }
}

async function investigateAjax() {
  sep('14. AJAX ENDPOINTS — common WP AJAX patterns');
  const ajaxUrls = [
    `${BASE}/wp-admin/admin-ajax.php`,
  ];
  // Try common GeoDirectory AJAX actions
  const actions = ['geodir_get_post', 'geodir_listing_contact', 'wpbdp_contact'];
  for (const action of actions) {
    try {
      const r = await http.post(`${BASE}/wp-admin/admin-ajax.php`,
        new URLSearchParams({ action }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 }
      );
      console.log(`  action=${action}:`, JSON.stringify(r.data).slice(0, 200));
    } catch(e) {
      console.log(`  action=${action}: ${e.response ? e.response.status : e.message}`);
    }
  }
}

(async () => {
  try {
    const postId = await investigatePage();
    await investigateRestApi(postId);
    await investigateGeoDirectory(postId);
    await investigateAjax();
  } catch(e) {
    console.error('FATAL:', e.message);
    if (e.response) console.error('STATUS:', e.response.status, 'DATA:', String(e.response.data).slice(0,300));
  }
})();
