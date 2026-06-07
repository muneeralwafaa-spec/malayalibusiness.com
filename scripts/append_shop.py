import os

path = r'C:/Users/munee/OneDrive/Desktop/malayalibusiness/scripts/migration-v2.sql'

def pg_str(v):
    if v is None:
        return 'NULL'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        if not v:
            return "ARRAY[]::text[]"
        escaped = [s.replace("'", "''") for s in v]
        return "ARRAY[" + ",".join("'" + e + "'" for e in escaped) + "]"
    escaped = str(v).replace("'", "''")
    return "'" + escaped + "'"

rows = [
    ("kk-biryani-pack","kerala-kitchen-dubai","Kerala Kitchen Dubai","kerala-kitchen-dubai",
     "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80",
     "Dubai","Dubai-ml",True,"+971501234567","+971501234567",
     "product","Malabar Biryani Meal Pack (2 pax)","Biryani-ml",
     "Authentic Malabar-style chicken biryani with raita, pickle and pappadam. Flash-frozen, ready to heat.",
     "Biryani desc ml",
     "Food & Grocery","Food ml",55,68,"AED",None,None,
     "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
     ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80"],
     4.9,312,True,True,True,None,[],["Biryani","Frozen"],["Biryani-ml"],1),
]

# Since Python escaping is tricky with the Malayalam chars, let us write the SQL directly
sql_to_append = """

-- =============================================================================
-- 8. SHOP LISTINGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS shop_listings (
  id               text         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  listing_id       uuid,
  vendor_slug        text,
  vendor_name        text        NOT NULL DEFAULT '',
  vendor_name_ml     text,
  vendor_logo_url    text,
  vendor_emirate     text        NOT NULL DEFAULT 'Dubai',
  vendor_emirate_ml  text,
  vendor_verified    boolean     NOT NULL DEFAULT false,
  vendor_whatsapp    text,
  vendor_phone       text,
  listing_type       text        NOT NULL DEFAULT 'product'
                     CHECK (listing_type IN ('product','appointment','quote','direct_service','contact_only')),
  name               text        NOT NULL,
  name_ml            text,
  description        text,
  description_ml     text,
  category           text        NOT NULL DEFAULT 'General',
  category_ml        text,
  price              numeric     NOT NULL DEFAULT 0,
  original_price     numeric,
  currency           text        NOT NULL DEFAULT 'AED',
  unit               text,
  unit_ml            text,
  image_url          text,
  images             text[]      NOT NULL DEFAULT '{}',
  rating_avg         numeric     NOT NULL DEFAULT 0,
  review_count       integer     NOT NULL DEFAULT 0,
  is_active          boolean     NOT NULL DEFAULT true,
  is_featured        boolean     NOT NULL DEFAULT false,
  is_bestseller      boolean     NOT NULL DEFAULT false,
  duration           text,
  slots              text[]      NOT NULL DEFAULT '{}',
  tags               text[]      NOT NULL DEFAULT '{}',
  tags_ml            text[]      NOT NULL DEFAULT '{}',
  sort_order         integer     NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE shop_listings
  ADD COLUMN IF NOT EXISTS vendor_slug        text,
  ADD COLUMN IF NOT EXISTS vendor_name_ml     text,
  ADD COLUMN IF NOT EXISTS vendor_logo_url    text,
  ADD COLUMN IF NOT EXISTS vendor_emirate_ml  text,
  ADD COLUMN IF NOT EXISTS vendor_verified    boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vendor_whatsapp    text,
  ADD COLUMN IF NOT EXISTS vendor_phone       text,
  ADD COLUMN IF NOT EXISTS category           text,
  ADD COLUMN IF NOT EXISTS category_ml        text,
  ADD COLUMN IF NOT EXISTS unit               text,
  ADD COLUMN IF NOT EXISTS unit_ml            text,
  ADD COLUMN IF NOT EXISTS currency           text        NOT NULL DEFAULT 'AED',
  ADD COLUMN IF NOT EXISTS duration           text,
  ADD COLUMN IF NOT EXISTS slots              text[]      NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags               text[]      NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags_ml            text[]      NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS images             text[]      NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_featured        boolean     NOT NULL DEFAULT false;

ALTER TABLE shop_listings ALTER COLUMN listing_id DROP NOT NULL;

ALTER TABLE shop_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_listings_public_read" ON shop_listings;
CREATE POLICY "shop_listings_public_read"
  ON shop_listings FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "shop_listings_auth_insert" ON shop_listings;
CREATE POLICY "shop_listings_auth_insert"
  ON shop_listings FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_shop_vendor_slug ON shop_listings(vendor_slug);
CREATE INDEX IF NOT EXISTS idx_shop_category    ON shop_listings(category);
CREATE INDEX IF NOT EXISTS idx_shop_emirate     ON shop_listings(vendor_emirate);
CREATE INDEX IF NOT EXISTS idx_shop_featured    ON shop_listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_shop_type        ON shop_listings(listing_type);

"""

with open(path, 'a', encoding='utf-8') as f:
    f.write(sql_to_append)

print("Structure SQL written OK")

# Now build seed SQL with proper escaping
def row_sql(rid, vslug, vname, vname_ml, vlogo, vem, vem_ml, vver, vwa, vph,
            ltype, nm, nm_ml, desc, desc_ml, cat, cat_ml, price, orig, cur,
            unit, unit_ml, imgurl, imgs, rating, rcnt, active, featured, bestseller,
            dur, slots, tags, tags_ml, sord):
    return (
        f"({pg_str(rid)},{pg_str(vslug)},{pg_str(vname)},{pg_str(vname_ml)},{pg_str(vlogo)},"
        f"{pg_str(vem)},{pg_str(vem_ml)},{pg_str(vver)},{pg_str(vwa)},{pg_str(vph)},"
        f"{pg_str(ltype)},"
        f"{pg_str(nm)},{pg_str(nm_ml)},{pg_str(desc)},{pg_str(desc_ml)},"
        f"{pg_str(cat)},{pg_str(cat_ml)},{pg_str(price)},{pg_str(orig)},{pg_str(cur)},"
        f"{pg_str(unit)},{pg_str(unit_ml)},"
        f"{pg_str(imgurl)},{pg_str(imgs)},"
        f"{pg_str(rating)},{pg_str(rcnt)},{pg_str(active)},{pg_str(featured)},{pg_str(bestseller)},"
        f"{pg_str(dur)},{pg_str(slots)},{pg_str(tags)},{pg_str(tags_ml)},{pg_str(sord)})"
    )

seed_data = [
    # Kerala Kitchen
    row_sql('kk-biryani-pack','kerala-kitchen-dubai','Kerala Kitchen Dubai',
            'കേരള കിച്ചണ്‍ ദുബായ്',
            'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80',
            'Dubai','ദുബായ്',True,'+971501234567','+971501234567',
            'product',
            'Malabar Biryani Meal Pack (2 pax)',
            'മലബാർ ബിരിയാണി മീൽ പാക്ക് (2 പേർക്ക്)',
            'Authentic Malabar-style chicken biryani with raita, pickle and pappadam. Flash-frozen, ready to heat. Serves 2.',
            'ആധികാരിക മലബാർ ചിക്കൻ ബിരിയാണി, റൈത്ത, അച്ചാർ, പപ്പടം സഹിതം. 2 പേർക്ക്.',
            'Food & Grocery','ഭക്ഷണം',55,68,'AED',
            None,None,
            'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
            ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80'],
            4.9,312,True,True,True,None,[],
            ['Biryani','Frozen','Ready to Heat'],['ബിരിയാണി','ഫ്രോസണ്‍'],1),

    row_sql('kk-sadya-pack','kerala-kitchen-dubai','Kerala Kitchen Dubai',
            'കേരള കിച്ചണ്‍ ദുബായ്',
            'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80',
            'Dubai','ദുബായ്',True,'+971501234567','+971501234567',
            'product',
            'Kerala Sadya Box (10 items)','കേരള സദ്യ ബോക്സ് (10 ഇനം)',
            'Full Kerala Sadya: rice, sambar, rasam, avial, olan, thoran, payasam and more. Perfect for Onam or any celebration.',
            'ചോറ്, സാമ്പാർ, രസം, അവിയൽ, ഓലൻ, തോരൻ, പായസം ഉൾപ്പെടെ 10 ഇനം.',
            'Food & Grocery','ഭക്ഷണം',120,None,'AED',
            None,None,
            'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80',
            ['https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80'],
            4.8,189,True,True,False,None,[],
            ['Sadya','Onam','Traditional'],['സദ്യ','ഓണം'],2),

    row_sql('kk-catering','kerala-kitchen-dubai','Kerala Kitchen Dubai',
            'കേരള കിച്ചണ്‍ ദുബായ്',
            'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80',
            'Dubai','ദുബായ്',True,'+971501234567','+971501234567',
            'quote',
            'Event Catering Package','ഇവന്റ് കാറ്ററിംഗ് പാക്കേജ്',
            'Full Kerala catering for weddings, corporate events, and celebrations. Menu customization available. Serves 20-500+ guests.',
            'വിവാഹം, കോർപ്പറേറ്റ് ഇവന്റ്, ആഘോഷങ്ങള്ക്ക്. 20-500+ പേർക്ക്.',
            'Services','സേവനം',0,None,'AED',
            'Custom quote','ക്വോട്ട് ലഭിക്കും',
            'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
            ['https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80'],
            4.7,56,True,False,False,None,[],
            ['Catering','Events','Wedding'],['കാറ്ററിംഗ്','വിവാഹം'],3),

    # Menon Health
    row_sql('mh-gp-consult','menon-health-clinic-sharjah','Menon Health Clinic',
            'മേനോൻ ഹെൽത്ത് ക്ലിനിക്',
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80',
            'Sharjah','ഷാർജ',True,'+971555678901','+971555678901',
            'appointment','GP Consultation','GP കണ്‍സൾട്ടേഷൻ',
            'General physician consultation with Malayalam-speaking doctor. Includes basic health check and prescription.',
            'മലയാളം സംസാരിക്കുന്ന ഡോക്ടർമായി GP കണ്‍സൾട്ടേഷൻ.',
            'Healthcare','ആരോഗ്യം',120,None,'AED',
            'per session','ഒരു സെഷൻ',
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
            ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80'],
            4.9,428,True,True,True,'30 min',
            ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'],
            ['Doctor','GP','Consultation','Malayalam'],['ഡോക്ടർ','GP'],4),

    row_sql('mh-dental','menon-health-clinic-sharjah','Menon Health Clinic',
            'മേനോൻ ഹെൽത്ത് ക്ലിനിക്',
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80',
            'Sharjah','ഷാർജ',True,'+971555678901','+971555678901',
            'appointment','Dental Checkup & Cleaning','ഡെന്റൽ ചെക്കപ്പ് & ക്ലീനിംഗ്',
            'Full dental examination with professional scaling and cleaning. X-ray included.',
            'ദന്ത പരിശോധന, ക്ലീനിംഗ്, X-ray ഉൾപ്പെടെ.',
            'Healthcare','ആരോഗ്യം',250,None,'AED',
            'per session','ഒരു സെഷൻ',
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80',
            ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80'],
            4.7,203,True,False,False,'45 min',
            ['9:30 AM','11:00 AM','2:30 PM','4:00 PM'],
            ['Dental','Teeth','Cleaning'],['ദന്തം','ക്ലീനിംഗ്'],5),

    row_sql('mh-health-package','menon-health-clinic-sharjah','Menon Health Clinic',
            'മേനോൻ ഹെൽത്ത് ക്ലിനിക്',
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80',
            'Sharjah','ഷാർജ',True,'+971555678901','+971555678901',
            'direct_service','Annual Family Health Package','വാർഷിക ഫാമിലി ഹെൽത്ത് പാക്കേജ്',
            'Comprehensive health package for 4 family members: blood tests, ECG, X-ray, doctor consultation, and health report.',
            '4 കുടുംബാംഗങ്ങൾക്ക്: ബ്ലഡ് ടെസ്റ്റ്, ECG, X-ray, ഡോക്ടർ കണ്‍സൾട്ടേഷൻ.',
            'Healthcare','ആരോഗ്യം',799,1200,'AED',
            None,None,
            'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80',
            ['https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80'],
            4.8,87,True,True,True,None,[],
            ['Health Package','Family','Checkup'],['ഹെൽത്ത് പാക്കേജ്','ഫാമിലി'],6),

    # Asha Beauty
    row_sql('ab-bridal','asha-beauty-salon-ajman','Asha Beauty Salon',
            'ആശ ബ്യൂട്ടി സലോൻ',
            'https://images.unsplash.com/photo-1560066984-138daaa0c1c0?w=100&q=80',
            'Ajman','അജ്മാൻ',True,'+971506789012','+971506789012',
            'appointment','Kerala Bridal Package','കേരള ബ്രൈഡൽ പാക്കേജ്',
            'Full bridal makeover: Kerala Ayurvedic facial, silk saree draping, bridal mehendi, hair styling, and makeup.',
            'കേരള ആയുർവേദ ഫേഷ്യൽ, സാരി ഉടുപ്പ്, മെഹന്തി, ഹെയർ & മേക്കപ്പ് ഉൾപ്പെടെ.',
            'Beauty & Wellness','സൌന്ദര്യം',850,1100,'AED',
            'full day','ഒരു ദിവസം',
            'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80',
            ['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80',
             'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80'],
            5.0,94,True,True,True,'5-6 hours',
            ['8:00 AM','9:00 AM'],
            ['Bridal','Mehendi','Makeup','Kerala'],['ബ്രൈഡൽ','മെഹന്തി'],7),

    row_sql('ab-facial','asha-beauty-salon-ajman','Asha Beauty Salon',
            'ആശ ബ്യൂട്ടി സലോൻ',
            'https://images.unsplash.com/photo-1560066984-138daaa0c1c0?w=100&q=80',
            'Ajman','അജ്മാൻ',True,'+971506789012','+971506789012',
            'appointment','Kerala Ayurvedic Facial','കേരള ആയുർവേദ ഫേഷ്യൽ',
            'Rejuvenating Ayurvedic facial using natural herbal ingredients from Kerala. Suitable for all skin types.',
            'കേരള ആയുർവേദ ഹർബൽ ഘടകങ്ങൾ ഉപയോഗിച്ചുള്ള ഫേഷ്യൽ.',
            'Beauty & Wellness','സൌന്ദര്യം',180,None,'AED',
            'per session','ഒരു സെഷൻ',
            'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
            ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'],
            4.8,167,True,False,True,'60 min',
            ['10:00 AM','11:30 AM','1:00 PM','3:00 PM','5:00 PM'],
            ['Facial','Ayurvedic','Skincare'],['ഫേഷ്യൽ','ആയുർവേദ'],8),

    row_sql('ab-mehendi','asha-beauty-salon-ajman','Asha Beauty Salon',
            'ആശ ബ്യൂട്ടി സലോൻ',
            'https://images.unsplash.com/photo-1560066984-138daaa0c1c0?w=100&q=80',
            'Ajman','അജ്മാൻ',True,'+971506789012','+971506789012',
            'contact_only','Custom Mehendi Design','കസ്റ്റം മെഹന്തി ഡിസൈൻ',
            'Traditional and Arabic mehendi designs for hands and feet. Home visits available for bridal parties.',
            'ട്രഡീഷണൽ, അറബി മെഹന്തി ഡിസൈൻ.',
            'Beauty & Wellness','സൌന്ദര്യം',120,None,'AED',
            'from','മുതൽ',
            'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80'],
            4.9,78,True,False,False,None,[],
            ['Mehendi','Henna','Bridal'],['മെഹന്തി','ഹെന്ന'],9),

    # TechMalayali
    row_sql('tm-website','techmalayali-it-solutions','TechMalayali IT Solutions',
            'ടെക് മലയാളി ഐടി',
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d4?w=100&q=80',
            'Dubai','ദുബായ്',True,'+971521234599','+971521234599',
            'quote','Business Website Development','ബിസിനസ് വെബ്സൈറ്റ് ഡെവലപ്മെന്റ്',
            '5-page professional website with mobile optimization, SEO setup, contact form, WhatsApp integration. Delivered in 2 weeks.',
            '5-പേജ് പ്രൊഫഷണൽ വെബ്സൈറ്റ്, മൊബൈൽ, SEO, WhatsApp.',
            'Technology','ടെക്നോളജി',2500,None,'AED',
            'from','മുതൽ',
            'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80',
            ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80'],
            4.9,43,True,True,True,None,[],
            ['Website','Web Dev','SEO'],['വെബ്സൈറ്റ്','SEO'],10),

    row_sql('tm-app','techmalayali-it-solutions','TechMalayali IT Solutions',
            'ടെക് മലയാളി ഐടി',
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d4?w=100&q=80',
            'Dubai','ദുബായ്',True,'+971521234599','+971521234599',
            'quote','Mobile App Development','മൊബൈൽ ആപ്പ് ഡെവലപ്മെന്റ്',
            'iOS & Android app development for your business. UI/UX design, API integration, app store submission included.',
            'iOS & Android ആപ്പ്. UI/UX ഡിസൈൻ, API, ആപ്പ് സ്റ്റോർ സബ്മിഷൻ.',
            'Technology','ടെക്നോളജി',8000,None,'AED',
            'from','മുതൽ',
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
            ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80'],
            4.8,28,True,False,False,None,[],
            ['App','iOS','Android'],['ആപ്പ്','iOS'],11),

    row_sql('tm-seo','techmalayali-it-solutions','TechMalayali IT Solutions',
            'ടെക് മലയാളി ഐടി',
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d4?w=100&q=80',
            'Dubai','ദുബായ്',True,'+971521234599','+971521234599',
            'direct_service','Monthly SEO & Social Media Package','മാസ SEO & സോഷ്യൽ മീഡിയ പാക്കേജ്',
            'Monthly SEO optimization, Google My Business management, Instagram + Facebook content (12 posts/month), monthly report.',
            'SEO, Google My Business, Instagram + Facebook (12 പോസ്റ്റ്/മാസം), റിപ്പോർട്ട്.',
            'Technology','ടെക്നോളജി',1200,None,'AED',
            'per month','പ്രതിമാസം',
            'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80',
            ['https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80'],
            4.7,61,True,True,False,None,[],
            ['SEO','Social Media','Marketing'],['SEO','സോഷ്യൽ മീഡിയ'],12),

    # Nair Legal
    row_sql('nl-visa','nair-associates-legal','Nair & Associates Legal',
            'നായർ & അസോസിയേറ്റ്സ്',
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&q=80',
            'Abu Dhabi','അബുദാബി',True,'+971554567890','+971044567890',
            'appointment','Visa Consultation (Golden Visa / Employment)',
            'വിസ കണ്‍സൾട്ടേഷൻ (ഗോൾഡൻ വിസ / എംപ്ലോയ്മെന്റ്)',
            '1-hour consultation with experienced UAE visa specialist. Covers Golden Visa eligibility, family visa, and employment visa.',
            'UAE വിസ സ്പെഷ്യലിസ്റ്റുമായി 1 മണിക്കൂർ കണ്‍സൾട്ടേഷൻ.',
            'Legal & Finance','നിയമം & ഫിനാൻസ്',350,None,'AED',
            'per consultation','ഒരു കണ്‍സൾട്ടേഷൻ',
            'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80',
            ['https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80'],
            4.9,156,True,True,True,'60 min',
            ['10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'],
            ['Visa','Golden Visa','Legal'],['വിസ','ഗോൾഡൻ വിസ'],13),

    row_sql('nl-company','nair-associates-legal','Nair & Associates Legal',
            'നായർ & അസോസിയേറ്റ്സ്',
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&q=80',
            'Abu Dhabi','അബുദാബി',True,'+971554567890','+971044567890',
            'quote','Company Formation in UAE','UAE-ല്‍ കമ്പനി രൂപീകരണം',
            'Complete company setup: LLC, Freezone, or Mainland. Includes trade license, MOA, bank account opening assistance.',
            'LLC, Freezone, Mainland -- ട്രേഡ് ലൈസൻസ്, MOA, ബാങ്ക് അക്കൗണ്ട്.',
            'Legal & Finance','നിയമം & ഫിനാൻസ്',3500,None,'AED',
            'from','മുതൽ',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
            ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'],
            4.8,72,True,True,False,None,[],
            ['Company','Freezone','LLC','Business Setup'],['കമ്പനി','ഫ്രീസോൻ'],14),
]

seed_sql = """INSERT INTO shop_listings (
  id, vendor_slug, vendor_name, vendor_name_ml, vendor_logo_url,
  vendor_emirate, vendor_emirate_ml, vendor_verified, vendor_whatsapp, vendor_phone,
  listing_type,
  name, name_ml, description, description_ml,
  category, category_ml, price, original_price, currency,
  unit, unit_ml,
  image_url, images,
  rating_avg, review_count, is_active, is_featured, is_bestseller,
  duration, slots, tags, tags_ml, sort_order
) VALUES
"""
seed_sql += ",\n".join(seed_data)
seed_sql += "\nON CONFLICT (id) DO NOTHING;\n"

with open(path, 'a', encoding='utf-8') as f:
    f.write(seed_sql)

print("All shop SQL appended successfully")
with open(path, encoding='utf-8') as fcheck:
    lines = fcheck.readlines()
    print(f"Total lines in migration-v2.sql: {len(lines)}")
