'use strict';
const axios   = require('axios');
const cheerio = require('cheerio');

const http = axios.create({
  timeout: 20000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120' }
});

const BASE = 'https://www.malayalibusiness.com';

function sep(label) { console.log('\n' + '═'.repeat(60)); console.log(' ' + label); console.log('═'.repeat(60)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── TEST 1: full REST API response for post 5535 ─────────────────────────────
async function checkFullRestResponse() {
  sep('A. FULL REST RESPONSE for listing/5535');
  try {
    const r = await http.get(`${BASE}/wp-json/wp/v2/listing/5535?_embed`);
    const d = r.data;
    console.log('TOP-LEVEL KEYS:', Object.keys(d).join(', '));
    console.log('\n-- title:', JSON.stringify(d.title));
    console.log('-- slug:', d.slug);
    console.log('-- link:', d.link);
    console.log('-- status:', d.status);
    console.log('-- type:', d.type);

    // meta
    if (d.meta) {
      console.log('\n-- meta TYPE:', Array.isArray(d.meta) ? 'array' : typeof d.meta);
      console.log('-- meta:', JSON.stringify(d.meta).slice(0, 500));
    }
    // acf
    if (d.acf !== undefined) {
      console.log('\n-- acf:', JSON.stringify(d.acf).slice(0, 500));
    }
    // _embedded
    if (d._embedded) {
      console.log('\n-- _embedded keys:', Object.keys(d._embedded).join(', '));
      const terms = (d._embedded['wp:term'] || []).flat();
      console.log('-- embedded terms:', terms.map(t => `${t.taxonomy}:${t.name}`).join(', '));
    }
    // All unknown keys
    const known = ['id','date','date_gmt','guid','modified','modified_gmt','slug','status','type','link',
                   'title','content','excerpt','author','featured_media','comment_status','ping_status',
                   'template','meta','acf','categories','tags','_links','_embedded','format','sticky'];
    const custom = Object.keys(d).filter(k => !known.includes(k));
    if (custom.length) {
      console.log('\n-- CUSTOM FIELDS (not in standard WP schema):');
      custom.forEach(k => console.log(`   ${k}:`, JSON.stringify(d[k]).slice(0, 200)));
    }
  } catch(e) {
    console.log('ERROR:', e.response ? e.response.status : e.message);
  }
}

// ── TEST 2: fetch 5 random listing URLs from API and check HTML ───────────────
async function checkMultipleListings() {
  sep('B. CHECK 5 RANDOM LISTING PAGES — contact visible or hidden?');

  // Get first 10 listings
  const r = await http.get(`${BASE}/wp-json/wp/v2/listing?per_page=10&page=1`);
  const items = r.data;
  console.log(`Got ${items.length} listings from API. Checking pages...\n`);

  for (const item of items.slice(0, 5)) {
    const url = item.link;
    console.log(`\n── ${item.slug} ──`);
    console.log(`   URL: ${url}`);
    await sleep(1500);
    try {
      const pr = await http.get(url);
      const $  = cheerio.load(pr.data);

      // Check for tel: link
      const telLinks = [];
      $('a[href^="tel:"]').each(function() { telLinks.push($(this).attr('href')); });

      // Check for mailto: link
      const mailLinks = [];
      $('a[href^="mailto:"]').each(function() { mailLinks.push($(this).attr('href')); });

      // Check for wa.me
      const waLinks = [];
      $('a[href*="wa.me"]').each(function() { waLinks.push($(this).attr('href')); });

      // Check for "reveal" button pattern
      const revealBtns = [];
      $('[id*="contact"],[id*="phone"],[id*="reveal"],[class*="reveal"],[data-listing-id]').each(function() {
        revealBtns.push({ id: this.attribs.id, class: this.attribs.class, data: JSON.stringify(this.attribs).slice(0,100) });
      });

      // Check for hidden / protected contact spans
      const hiddenSpans = [];
      $('span[data-phone],span[data-email],span[data-contact],.hidden-phone,.protected-email').each(function() {
        hiddenSpans.push({ tag: this.tagName, attrs: JSON.stringify(this.attribs).slice(0,100) });
      });

      // Check .listing-links
      const listingLinks = $('ul.listing-links, .listing-links.contact-links, .contact-links').html();

      console.log('   tel links:', telLinks.join(' | ') || '(none)');
      console.log('   mailto links:', mailLinks.join(' | ') || '(none)');
      console.log('   wa links:', waLinks.join(' | ') || '(none)');
      console.log('   listing-links HTML:', listingLinks ? listingLinks.trim().slice(0, 300) : '(none)');
      if (revealBtns.length) console.log('   REVEAL BTNS:', JSON.stringify(revealBtns));
      if (hiddenSpans.length) console.log('   HIDDEN SPANS:', JSON.stringify(hiddenSpans));

      // Key indicator: is there a "show contact" type button?
      const showContactText = $('body').text().match(/show\s+(phone|email|contact|number)/i);
      if (showContactText) console.log('   ⚠️  FOUND "show contact" text:', showContactText[0]);

    } catch(e) {
      console.log('   ERROR:', e.message);
    }
  }
}

// ── TEST 3: probe the Listeo AJAX contact reveal ──────────────────────────────
async function probeListeoAjax() {
  sep('C. LISTEO THEME AJAX — probe contact reveal actions');

  const ajaxUrl = `${BASE}/wp-admin/admin-ajax.php`;
  const nonces  = ['3ef9ef723c', '652cab663a', 'ce3ef73ccf'];
  const nonce   = nonces[0]; // from the page investigation
  const postId  = '5535';

  // Common Listeo / WordPress listing AJAX actions for contact reveal
  const actions = [
    'listeo_get_listing_contact',
    'listeo_reveal_contact',
    'listeo_show_phone',
    'listeo_show_email',
    'listing_contact',
    'get_listing_contact',
    'wp_ajax_listing_contact',
    'listeo_send_enquiry_form',
    'listeo_booking_form',
    'listeo_listing_contact',
    'wpl_hide_email',
    'wpl_hide_phone',
    'listeo_listing_data',
  ];

  for (const action of actions) {
    await sleep(300);
    try {
      const r = await http.post(ajaxUrl,
        new URLSearchParams({ action, post_id: postId, nonce, id: postId }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 8000 }
      );
      const body = JSON.stringify(r.data);
      // Only print if response contains something interesting (phone/email/number pattern)
      if (/\d{7,}|@[a-z]+\.[a-z]|success|phone|email/i.test(body)) {
        console.log(`  ✅ action=${action}: ${body.slice(0, 300)}`);
      } else {
        console.log(`  action=${action}: ${r.status} → ${body.slice(0, 80)}`);
      }
    } catch(e) {
      const code = e.response ? e.response.status : 'timeout';
      if (code !== 400) console.log(`  action=${action}: ${code}`);
    }
  }
}

// ── TEST 4: check if custom endpoint exists ────────────────────────────────────
async function checkCustomEndpoints() {
  sep('D. CHECK CUSTOM REST ENDPOINTS');
  const endpoints = [
    `${BASE}/wp-json/`,                                          // discover all
    `${BASE}/wp-json/listeo/v1/listing/5535`,
    `${BASE}/wp-json/listeo/v1/contact`,
    `${BASE}/wp-json/wp/v2/listing/5535?acf_format=standard`,   // ACF format
    `${BASE}/wp-json/wp/v2/listing?per_page=1&_fields=id,slug,title,meta,acf,link`,
  ];
  for (const url of endpoints) {
    await sleep(300);
    try {
      const r = await http.get(url);
      if (url.includes('wp-json/') && !url.includes('listing')) {
        // Just show namespace list
        const d = r.data;
        if (d.namespaces) console.log('REST namespaces:', d.namespaces.join(', '));
        if (d.routes) {
          const routes = Object.keys(d.routes).filter(k => /listing|contact|phone|email/i.test(k));
          console.log('Relevant routes:', routes.slice(0,10).join('\n'));
        }
      } else {
        const body = JSON.stringify(r.data).slice(0, 400);
        console.log(`\n  GET ${url}`);
        console.log('  RESPONSE:', body);
      }
    } catch(e) {
      console.log(`  ${url.split('/').slice(-2).join('/')} → ${e.response ? e.response.status : e.message}`);
    }
  }
}

// ── TEST 5: look at listing HTML for the "reveal" click pattern ───────────────
async function findRevealPattern() {
  sep('E. LISTEO CONTACT REVEAL BUTTON — exact HTML pattern');
  const r = await http.get(`${BASE}/listing/hussain-al-shemsi-chartered-accountants-sharjah/`);
  const $ = cheerio.load(r.data);

  // Look for all buttons, links, or any element with data-listing-id or click handlers
  console.log('\n-- All elements near "contact" or "phone" text:');
  $('a, button, span, div').each(function() {
    const text = $(this).text().trim().toLowerCase();
    const attrs = this.attribs || {};
    if (/show|reveal|click|view|contact|phone|number/i.test(text) && text.length < 50) {
      console.log('  TAG:', this.tagName, 'TEXT:', text, 'ATTRS:', JSON.stringify(attrs).slice(0,150));
    }
  });

  // Dump the specific HTML block containing the listing contact section
  console.log('\n-- .listing-contact-details or similar sections:');
  const contactSections = [
    '.listing-contact', '.contact-details', '.listing-social-links',
    '#listing-contact', '.listing-contact-details', '#contact-btn',
    '#listing-phone', '#listing-email', '.listing-actions',
    '.booking-tab', '.listing-info-details'
  ];
  for (const sel of contactSections) {
    const el = $(sel);
    if (el.length) {
      console.log(`\n  ${sel} (found):`);
      console.log('  ' + el.first().html().trim().slice(0, 400));
    }
  }

  // Dump the section title "contact" / "details" area
  console.log('\n-- ALL DATA attributes on the page:');
  $('[data-listing-id],[data-post-id],[data-id],[data-type],[data-action]').each(function() {
    console.log('  ', this.tagName, JSON.stringify(this.attribs).slice(0, 200));
  });

  // Find the full HTML around listing-links
  console.log('\n-- FULL HTML around contact-links (parent 2 levels up):');
  const cl = $('ul.listing-links, .contact-links').first();
  if (cl.length) {
    let parent = cl.parent().parent();
    console.log(parent.html() ? parent.html().trim().slice(0, 1000) : 'not found');
  }
}

(async () => {
  try {
    await checkFullRestResponse();
    await checkMultipleListings();
    await probeListeoAjax();
    await checkCustomEndpoints();
    await findRevealPattern();
  } catch(e) {
    console.error('FATAL:', e.message);
    if (e.stack) console.error(e.stack.slice(0,500));
  }
})();
