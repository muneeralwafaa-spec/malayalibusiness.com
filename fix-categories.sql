INSERT INTO listings (owner_id, slug, name, tagline, description, emirate, phone, whatsapp, email, website, plan, status, is_featured, is_verified, category_id)
SELECT
  (SELECT id FROM auth.users LIMIT 1),
  slug, name, tagline, description, emirate::uae_emirate, phone, whatsapp, email, website, 'free', 'active', false, false,
  (SELECT id FROM categories WHERE categories.slug = cat_slug)
FROM (VALUES
  -- Audit & Accounting
  ('audit-acc-1','Al Baraka Accounting LLC','Expert VAT & Accounting Services','Professional accounting, VAT filing and bookkeeping for UAE businesses.','Dubai','+97142345678','+97142345678','info@albarakaaccounting.ae','','audit-accounting'),
  ('audit-acc-2','Kerala Accounts & Tax','Your Trusted Financial Partner','Chartered accountants specializing in VAT, corporate tax and payroll.','Sharjah','+97165432100','+97165432100','','','audit-accounting'),
  ('audit-acc-3','Gulf Finance Consultants','Audit | Tax | Advisory','Comprehensive audit and accounting solutions for SMEs across UAE.','Abu Dhabi','+97124567890','+97124567890','','','audit-accounting'),

  -- Catering & Bakery
  ('catering-1','Kerala Kitchen Catering','Authentic Kerala Sadya & Catering','Traditional Kerala sadya, biriyani and full event catering across UAE.','Dubai','+971501234567','+971501234567','','','catering-bakery'),
  ('catering-2','Malabar Bakes','Homemade Kerala Sweets & Cakes','Custom cakes, Kerala snacks and traditional sweets for all occasions.','Sharjah','+971552345678','+971552345678','','','catering-bakery'),
  ('catering-3','Nammude Kitchen','Wedding & Event Catering Specialists','Full catering services for weddings, corporate events and family gatherings.','Abu Dhabi','+971503456789','+971503456789','','','catering-bakery'),

  -- Cleaning Services
  ('clean-1','SparkClean UAE','Professional Cleaning Services','Deep cleaning, regular housekeeping and office cleaning across UAE.','Dubai','+971504567890','+971504567890','','','cleaning-services'),
  ('clean-2','Kerala Cleaners','Trusted Home & Office Cleaning','Experienced Malayali cleaning professionals for homes, villas and offices.','Sharjah','+971555678901','+971555678901','','','cleaning-services'),
  ('clean-3','Crystal Clean Services','Deep Cleaning & Sanitization Experts','Move-in/move-out cleaning, sofa cleaning and pest control services.','Dubai','+971506789012','+971506789012','','','cleaning-services'),

  -- Events & Entertainment
  ('event-1','Kerala Events UAE','Wedding & Event Management','Complete wedding planning and event management for Malayali community in UAE.','Dubai','+971507890123','+971507890123','','','events-entertainment'),
  ('event-2','Namma Events','Your Celebration Specialists','Stage setup, decoration, sound and light for all types of events.','Sharjah','+971558901234','+971558901234','','','events-entertainment'),
  ('event-3','Gulf Celebrations','Corporate & Social Events','Professional event management for corporate events, birthdays and weddings.','Abu Dhabi','+971509012345','+971509012345','','','events-entertainment'),

  -- Business Setup
  ('biz-1','QuickSetup UAE','Business Setup Made Easy','Company formation, trade license, freezone and mainland setup services.','Dubai','+971500123456','+971500123456','','','business-setup'),
  ('biz-2','PRO Services Kerala','Your PRO Services Partner','Trade license renewal, visa processing, Ejari, Tasheel and all government services.','Dubai','+971551234567','+971551234567','','','business-setup'),
  ('biz-3','Emirates Biz Consultants','Freezone & Mainland Specialists','Expert guidance for business setup in DMCC, DIC, JAFZA and mainland Dubai.','Dubai','+971502345678','+971502345678','','','business-setup'),

  -- Money Exchange
  ('money-1','Al Wafa Exchange','Fast & Reliable Money Transfer','Competitive rates for international money transfers and currency exchange.','Dubai','+971503456781','+971503456781','','','money-exchange'),
  ('money-2','Kerala Forex UAE','Best Exchange Rates Guaranteed','Trusted forex and remittance services for Malayali community in UAE.','Sharjah','+971554567892','+971554567892','','','money-exchange'),

  -- Manpower & Recruitment
  ('manpower-1','Gulf Manpower Solutions','Connecting Talent with Opportunity','Recruitment services for hospitality, construction and retail sectors.','Dubai','+971505678903','+971505678903','','','manpower-recruitment'),
  ('manpower-2','Kerala HR Consultants','Your Hiring Partner in UAE','Professional recruitment and HR consulting for Malayali professionals.','Dubai','+971556789014','+971556789014','','','manpower-recruitment'),

  -- Pharmacy
  ('pharma-1','Kerala Medical Centre','Your Neighbourhood Pharmacy','24-hour pharmacy with home delivery and prescription services.','Dubai','+971507890125','+971507890125','','','pharmacy'),
  ('pharma-2','Gulf Health Pharmacy','Quality Medicines & Healthcare','Full-service pharmacy with licensed pharmacists and health consultations.','Sharjah','+971558901236','+971558901236','','','pharmacy'),

  -- Printing & Advertising
  ('print-1','PrintXpress UAE','Fast & Quality Printing Solutions','Banners, brochures, business cards, flex boards and all printing needs.','Dubai','+971509012347','+971509012347','','','printing-advertising'),
  ('print-2','Kerala Prints','Affordable Printing for All','Offset and digital printing, signboards and promotional materials.','Sharjah','+971560123458','+971560123458','','','printing-advertising'),

  -- Technical Services
  ('tech-1','Cool Air Services','AC Maintenance & Repair Experts','AC installation, servicing and repair for homes and offices across UAE.','Dubai','+971501234569','+971501234569','','','technical-services'),
  ('tech-2','HomeFix UAE','Your Trusted Handyman Service','Plumbing, electrical, carpentry and all general maintenance services.','Dubai','+971552345670','+971552345670','','','technical-services'),
  ('tech-3','Kerala Technical Services','Electrical & Plumbing Specialists','Licensed electricians and plumbers for residential and commercial projects.','Sharjah','+971503456781','+971503456781','','','technical-services')

) AS t(slug, name, tagline, description, emirate, phone, whatsapp, email, website, cat_slug);
