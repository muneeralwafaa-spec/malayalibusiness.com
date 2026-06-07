-- =========================================================
-- MalayaliBusiness.com — WordPress data import
-- Generated : 2026-05-19T17:49:25.666Z
-- Listings  : 465
-- Run this in: Supabase → SQL Editor → Run
-- =========================================================

-- STEP 1: Create migration-bot auth user
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new, is_super_admin)
VALUES (
  '00000000-0000-0000-0000-000000000099', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'migration-bot@malayalibusiness.com',
  '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012',
  now(), '{"provider":"email","providers":["email"]}',
  '{"full_name":"Migration Bot"}',
  now(), now(), '', '', '', '', false
) ON CONFLICT (id) DO NOTHING;

-- STEP 2: Create migration-bot profile
INSERT INTO profiles (id, email, full_name, username)
VALUES ('00000000-0000-0000-0000-000000000099', 'migration-bot@malayalibusiness.com', 'Migration Bot', 'migration-bot')
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Insert listings
DO $$
DECLARE
  _owner uuid := '00000000-0000-0000-0000-000000000099';
  cat_restaurants_food uuid;
  cat_grocery_supermarket uuid;
  cat_real_estate uuid;
  cat_healthcare_medical uuid;
  cat_education_training uuid;
  cat_beauty_wellness uuid;
  cat_technology_it uuid;
  cat_construction_interiors uuid;
  cat_retail_fashion uuid;
  cat_legal_finance uuid;
  cat_travel_tourism uuid;
  cat_automotive uuid;
BEGIN
  SELECT id INTO cat_restaurants_food FROM categories WHERE slug = 'restaurants-food';
  SELECT id INTO cat_grocery_supermarket FROM categories WHERE slug = 'grocery-supermarket';
  SELECT id INTO cat_real_estate FROM categories WHERE slug = 'real-estate';
  SELECT id INTO cat_healthcare_medical FROM categories WHERE slug = 'healthcare-medical';
  SELECT id INTO cat_education_training FROM categories WHERE slug = 'education-training';
  SELECT id INTO cat_beauty_wellness FROM categories WHERE slug = 'beauty-wellness';
  SELECT id INTO cat_technology_it FROM categories WHERE slug = 'technology-it';
  SELECT id INTO cat_construction_interiors FROM categories WHERE slug = 'construction-interiors';
  SELECT id INTO cat_retail_fashion FROM categories WHERE slug = 'retail-fashion';
  SELECT id INTO cat_legal_finance FROM categories WHERE slug = 'legal-finance';
  SELECT id INTO cat_travel_tourism FROM categories WHERE slug = 'travel-tourism';
  SELECT id INTO cat_automotive FROM categories WHERE slug = 'automotive';

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hussain-al-shemsi-chartered-accountants-sharjah', 'Hussain Al Shemsi Chartered Accountants – Sharjah', 'Hussain Al Shemsi Chartered Accountants is a trusted, full-service professional accounting and auditing firm licensed by the Ministry of Economy, United Arab',
    '+971503636231', 'info@hussainalshemsi.ae', 'http://www.hussainalshemsi.ae',
    'https://malayalibusiness.com/wp-content/uploads/2025/05/Final_HAS-logos_RGB_Page_1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2025/05/Final_HAS-logos_RGB_Page_1-1024x505.jpg',
    'Al Majaz 3, Sharjah, UAE', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hussain-al-shemsi-chartered-accountants-sharjah/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'futuremine', 'FutureMine', 'FutureMine (FMINE) bridges the gap between traditional finance and decentralized innovation by transforming illiquid real-world assets (RWAs) into accessible,',
    '+971569616506', 'info@futuremine.io', 'https://futuremine.io/',
    'https://malayalibusiness.com/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-08-at-1.49.04-PM-2.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-08-at-1.49.04-PM-1.jpeg',
    'Street - off Sheikh Zayed Road - Trade Centre - Trade Centre 2 - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/futuremine/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'charmcrafterz-llc', 'Charmcrafterz llc', 'Uae based customized personal and corporate gifts.',
    '+971522246476', 'charmcrafterz01@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2025/03/1000928298.jpg', 'https://malayalibusiness.com/wp-content/uploads/2025/03/1000928298.jpg',
    'New Al Falah', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/charmcrafterz-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'rackfab-storage-solutions-llc-warehouse-racking', 'Rackfab Storage Solutions LLC -Warehouse racking', 'Our expertise covers a wide range of storage solutions, including pallet racking, shelving systems, mezzanine floors, and customized fabrication works. By',
    '+971551488585', 'info@rackfab.ae', 'http://rackfab.ae',
    NULL, 'https://malayalibusiness.com/wp-content/uploads/2025/03/IMG-20250224-WA0237-520x397.jpg',
    'Abudhabi , Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rackfab-storage-solutions-llc-warehouse-racking/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'pos-machine-touch-screen-billing-setup-for-all-restaurant-and-retail-shops', 'POS MACHINE TOUCH SCREEN BILLING SETUP FOR ALL RESTAURANT AND RETAIL SHOPS', 'Complete pos machine setup hardware and software.',
    '+971505090314', 'egrostore@gmail.com', 'http://www.egrospos.com',
    'https://malayalibusiness.com/wp-content/uploads/2025/01/IMG-20250121-WA0228.jpg', 'https://malayalibusiness.com/wp-content/uploads/2025/01/1000436419.jpg',
    'Sharjha', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/pos-machine-touch-screen-billing-setup-for-all-restaurant-and-retail-shops/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'reveal-medical-center', 'Reveal Medical Center', 'At Reveal Medical Center, we are dedicated to providing top-notch healthcare services, ensuring that each patient receives personalized, compassionate care in',
    '+97143850250', 'info@reveal.ae', 'https://reveal.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2025/01/Reveal_Logo.jpg', 'https://malayalibusiness.com/wp-content/uploads/2025/01/Reveal-Clinic-Image.jpg',
    'The Elite Business Centre, Al Seedaf Road 1, Al Barsha, Al Barsha 1, Dubai, United Arab Emirates', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/reveal-medical-center/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mindtech-computers-laptops-accessories-online-store', 'Mindtech – Computers & Laptops Accessories Online Store', 'MindTech was launched few years back with a aim to provide the best gaming accessories and computer components in UAE. As a leading e-commerce store we offer',
    '+971539140313', 'info@mindtech.ae', 'https://mindtech.ae',
    NULL, NULL,
    '10 Al Raqqay St - Al Danah - E10 - Abu Dhabi United Arab Emirates', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mindtech-computers-laptops-accessories-online-store/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mardan-furniture-used-furniture-store-in-abu-dhabi-uae', 'Mardan Furniture – Used Furniture Store in Abu Dhabi, UAE', 'At Mardan Used Furniture Store in Abu Dhabi, we’re all about making sustainable living stylish, affordable, and a whole lot easier. Why spend a fortune when',
    '+971539140313', 'info@mardanfurniture.com', 'https://mardanfurniture.com',
    'https://malayalibusiness.com/wp-content/uploads/2025/01/2147758716.jpg', 'https://malayalibusiness.com/wp-content/uploads/2025/01/2147758716.jpg',
    'Mardan Furniture M-39 Mussafah, Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mardan-furniture-used-furniture-store-in-abu-dhabi-uae/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'axhubs-gaming-laptop-and-gaming-pcs-store-in-dubai-uae', 'AXHUBS – Gaming Laptop and Gaming PCs Store in Dubai, UAE', 'AXHUBS is a premium brand revolutionizing the gaming landscape in the UAE with cutting-edge gaming laptops and PCs tailored for gamers and tech enthusiasts',
    '+971539140313', 'info@axhubs.com', 'https://axhubs.com/',
    'https://malayalibusiness.com/wp-content/uploads/2025/01/2149829138.jpg', 'https://malayalibusiness.com/wp-content/uploads/2025/01/2149829138.jpg',
    'Khalid Bin Al Waleed Rd - Al Raffa - Dubai - United Arab Emirates', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/axhubs-gaming-laptop-and-gaming-pcs-store-in-dubai-uae/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'smart-hair-fixing', 'Smart Hair Fixing', 'The hair systems used in smart hair fixing are crafted from natural human hair or high-quality synthetic fibers. The base material is usually breathable,',
    '78358255', 'info@smarthairfixing.com', 'https://www.smarthairfixing.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/12/Favicon-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/12/Result-Nine.jpg',
    'OK Center, Mezzanine Floor, Office No. 140, Ruwi 112, Muscat, Oman', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/smart-hair-fixing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'flinzo-fashion-designing-flinzo-medical-apparels', 'Flinzo Fashion Designing (Flinzo Medical Apparels)', 'Welcome to Flinzo Fashion, your premier destination for premium healthcare apparel in the United Arab Emirates. We specialize in providing high-quality scrub',
    '+971544680306', 'info@flinzofashion.com', 'https://flinzofashion.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/12/logo-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/12/EXCLUSIVE-single@2x.png',
    'New industrial area- Ajman - UAE', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/flinzo-fashion-designing-flinzo-medical-apparels/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'acs-international-shipping-services-llc', 'ACS International Shipping Services LLC', 'For the past 20 years, ACS International Shipping Services LLC has been a trusted name in the logistics industry. Established in 2004, we have proudly',
    '+971507156882', 'acslogisticsdubai@gmail.com', 'https://acsdxb.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/12/FLIGHT-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/12/FLIGHT-4.jpg',
    'Jabel Ali Freezone', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/acs-international-shipping-services-llc-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'acs-international-shipping-services-llc', 'ACS International Shipping Services LLC', 'For the past 20 years, ACS International Shipping Services LLC has been a trusted name in the logistics industry. Established in 2004, we have proudly',
    '+971507156882', 'acslogisticsdubai@gmail.com', 'https://acsdxb.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/12/FLIGHT-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/12/FLIGHT-4.jpg',
    'Jabel Ali Freezone', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/acs-international-shipping-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'jamil-optics', 'Jamil Optics', 'Jamil Optics is one of the UAE’s premier eye care providers, with over 30 years of trusted experience serving our communities. With a vast selection of',
    '+971526464722', 'customersupport@jamiloptics.com', 'http://www.jamiloptics.com',
    NULL, NULL,
    'G NMC Medical Center Same Building, Al Shaiba Building- Tower - Al Nahda Sharjah - Opp: Al Maya Supermarket - Block B - Floor - Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jamil-optics/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'legal-translation-services', 'Legal Translation Services', 'Founded in 2014, and having 3 offices in UAE, Alif Global Legal Translation services is one of the leading legal translation agency in Dubai, UAE, and is',
    '+971543631302', 'info@alifglobal.ae', 'http://www.alifglobal.ae',
    'https://malayalibusiness.com/wp-content/uploads/2024/10/alif-global-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/10/Corporate-Tax-Registration-difc.jpeg',
    'Sheikh Zayed Rd - DIFC - Dubai-UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/legal-translation-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'serah-opticals-l-l-c', 'Serah Opticals L.L.C', 'Serah Opticals L.L.C',
    '+97142342329', 'thomas@serahopticals.com', 'http://www.serahopticals.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/09/unnamed.png', 'https://malayalibusiness.com/wp-content/uploads/2024/09/unnamed.png',
    'Reef mall Near Salah Al Din Metro Station', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/serah-opticals-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'virtue-corporate-services', 'Virtue Corporate Services', 'Virtue Corporate Services is a leading business setup consultancy in the UAE, dedicated to simplifying the path for businesses to build, scale, and succeed.',
    '+971501152351', 'info@virtuebizsetup.ae', 'https://virtuebizsetup.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/09/Logo-500-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/09/Logo-500-1.png',
    'Office 303, Saeed Tower 2, Sheikh Zayed Road,Dubai,UAE 452318', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/virtue-corporate-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'family-trusts-and-foundations', 'Family Trusts and Foundations', 'At Dubai Business Setup, we offer comprehensive company formation services in Dubai, along with specialised support for family office management. Our',
    '+971589500125', 'contact@dubaibusinesssetup.ae', 'https://www.dubaibusinesssetup.ae/renew-dubai-mainland-or-ded-trade-license/',
    'https://malayalibusiness.com/wp-content/uploads/2024/09/family-office.png', 'https://malayalibusiness.com/wp-content/uploads/2024/09/family-office.png',
    'Dubai, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/family-trusts-and-foundations/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'corporate-gifts-and-promotional-gifts', 'Corporate Gifts and Promotional Gifts', 'Naazme Gifts appears to be a company or brand specializing in unique and thoughtful gifts. Based on the name, one might infer that Naazme Gifts focuses on',
    '+971552558345', 'hello@naazme.com', 'https://naazme.com',
    NULL, NULL,
    '28th Street', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/corporate-gifts-and-promotional-gifts/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'pupa-publications-fze', 'PuPa Publications FZE', 'Pupa Publication',
    '+971545206235', 'pupapublicationsfze@gmail.com', 'http://PUPAPUBLICATIONS.COM',
    'https://malayalibusiness.com/wp-content/uploads/2024/09/PUPA-300x169-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/09/PUPA-300x169-1.png',
    'MADINATH ZAYED, ALDHAFRA REGION', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/pupa-publications-fze/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'zapbed-vacation-homes-rental', 'ZAPBED Vacation Homes Rental', 'ZAPBED is a dynamic and forward-thinking global hospitality team committed to delivering exceptional hospitality products and services. Our innovative use of',
    '+971503311346', 'jabbar@zaobed.com', 'https://www.zapbed.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/aahdhdjshdxn.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/aahdhdjshdxn.png',
    'The Executive Bay - Office number: 1403 - Tower B Al A''amal St - Business Bay - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/zapbed-vacation-homes-rental/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'thathas-cake-factory', 'Thathas cake factory', 'Thathas Cake Factory Pastry & Specialty Cafe, Abu Dhabi''s newest destination for handcrafted cakes and sweet treats, celebrates its grand opening in April',
    '+971506402203', 'muthutcr@yahoo.com', 'http://thathascake.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/Untitled-design-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/Untitled-design-1-768x1024.png',
    'Near Gravity Hotel apartment', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/thathas-cake-factory/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'logic-office-equipments-llc', 'LOGIC OFFICE EQUIPMENTS LLC', 'LOGIC office equipments LLC is a highly talented and experienced entrepreneurial team. We are dealing all major brands of printer/copier machines all over in',
    '+971544304433', 'naseer@logicequipments.com', 'https://logicequipments.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/logo-logic3.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/logo-logic3.png',
    'International city, V-19 Russia Cluster - Dubai , UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/logic-office-equipments-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'gitpac-accounting-and-bookkeeping', 'GITPAC Accounting and Bookkeeping', 'Welcome to GITPAC, your number one source for all your financial and accounting concerns. We are dedicated to providing you the best solutions to grow your',
    '+971509599471', 'vimal@gitpac.me', 'https://gitpacconsultancy.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/2021-12-22.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/2021-12-22.jpg',
    'Suite# 109, Al Mullah Building 1, Al Muteena, Deira, United Arab Emirates', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/gitpac-accounting-and-bookkeeping/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'business-heads', 'Business Heads', 'We are committed to the nation in achieving economic goals in whatever sector our organization operates, to advise and implement regulatory guidelines,',
    '+971503114049', 'nikhil.r@businessheads.ae', 'https://www.businessheads.ae/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/istockphoto-950986656-612x612-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/istockphoto-950986656-612x612-1.jpg',
    'Office 453, Hamsah A Building, (Ansar Gallery) Mezzanine Floor, Unique World Business Center Al Karama, Dubai -UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/business-heads/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'al-naqi-fresh-meat', 'Al Naqi fresh meat', 'Al Naqi isn''t just another chicken delivery service. We''re a passionate group of individuals dedicated to bringing the taste of farm-fresh, ethically sourced',
    '+971504129095', 'alnaqimeat@gmail.com', 'https://www.alnaqimeat.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/New-Project-2-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/zrzrf.png',
    'Ajman, UAE', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-naqi-fresh-meat/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'api-security-testing', 'API Security Testing', 'API security is the process of eliminating or minimizing attacks on APIs. APIs serve as a backend architecture for mobile and online apps. An API is an',
    '+918658663664', 'sales@qualysec.com', 'https://qualysec.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/Android-Security-Apps.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/Android-Security-Apps.jpeg',
    'No: 72, OJone India, Service Rd, LRDE Layout, Doddanekundi, India', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/api-security-testing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hiat-3d-designs', 'Hiat 3D designs', 'Welcome to Hiat 3D Designs, your premier destination for innovative 3D design solutions in Dubai. We specialize in creating stunning and precise 3D models for',
    '+971567367424', 'hhidhayathkm@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/New-Project-5.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/New-Project-5.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hiat-3d-designs/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'zozytech-it-solutions', 'ZozyTech IT Solutions', 'ZozyTech IT Solutions is a leading provider of IT solutions in UAE, with over 12 years of experience in the industry. We specialize in a wide range of IT',
    '+971564144494', 'info@zozytech.com', 'https://zozytech.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/New-Prohgv.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/New-Prohgv.png',
    'Spar Supermarket Building - Office M13, Block B, Al Ahliya Tower - Al Khalidiyah - Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/zozytech-it-solutions/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'aalam-digital-twin', 'Aalam Digital Twin', 'Welcome to Aalam Digital Twin, your cutting-edge partner in Ras Al Khaimah (RAK) for digital transformation solutions. We specialize in creating digital',
    '+971558958129', 'mufliebrahim@gmail.com', NULL,
    NULL, NULL,
    'RAK', 'ras_al_khaimah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aalam-digital-twin/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mab-accounting-auditing-llc-dubai-uae', 'MAB ACCOUNTING & AUDITING LLC, DUBAI UAE', 'MAB Auditing head quartered in Dubai. Being born in the emerging Business Capital of the world, it has gained popularity among the business sector from small',
    '+971559382569', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/hahahahah.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/hahahahah.png',
    '132 - 142 Salah Al Din St - Deira - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mab-accounting-auditing-llc-dubai-uae/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'mass-international-freight-llc', 'MASS International Freight LLC', 'GREETINGS FROM M A S S INTERNATIONAL FREIGHT LLC We are pleased to introduce ourselves as " M A S S INTERNATIONAL FREIGHT LLC " one of the leading freight',
    '+971529121254', 'info@massfreight.ae', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/2023-05-12.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/2023-05-12.jpg',
    'Warehouse No.16 , Community 242, 4A Street, Al Qusais Industrial Area 1,UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mass-international-freight-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'twayyibat-food-beverages-trading', 'Twayyibat Food & Beverages Trading', 'Welcome to Twayyibat Food & Beverages Trading, your trusted partner in the food and beverage industry. We specialize in sourcing and distributing',
    '+971503051434', 'abdurahimanmp@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/5-Popular-And-Healthy-Winter-Vegetables-In-India.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/5-Popular-And-Healthy-Winter-Vegetables-In-India.jpg',
    'Dubai & RAK', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/twayyibat-food-beverages-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'zamzam-typing', 'ZAMZAM TYPING', 'Welcome to Zam Zam Typing, your reliable service provider located in Al Bidiya, Fujairah, Dubai. We specialize in offering a wide range of typing and',
    '+971523895551', 'zamzamtyp@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/halahala.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/halahala.png',
    'Al bidiya, fujairah', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/zamzam-typing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'noor-al-zain-travel-agency', 'NOOR AL ZAIN TRAVEL AGENCY', 'Welcome to Noor Al Zain Travel Agency, your trusted travel partner located in Al Muteena, Deira. We specialize in providing comprehensive travel services,',
    '561742455', 'shahidjvc@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/qtq_95.webp', 'https://malayalibusiness.com/wp-content/uploads/2024/08/qtq_95.webp',
    'No. S2-13 Wardat Al Wadi Real Estate, Opp Pak Darbar Restaurant, Al Muteena, Deira - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/noor-al-zain-travel-agency/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'story-hut-media-llc', 'Story Hut Media LLC', 'Welcome to Story Hut Media LLC, your creative hub located in Dubai. We specialize in delivering innovative media solutions, from compelling storytelling to',
    '+971569402024', 'info@storyhutmedia.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-08-at-16.25.44_386a2c01.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-08-at-16.25.44_386a2c01.jpg',
    'dubai UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/story-hut-media-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'bestpoint-electronics-trading-llc', 'Bestpoint Electronics trading LLC', 'Welcome to Bestpoint Electronics Trading LLC, your trusted source for quality electronics in Deira, Dubai. We specialize in offering a wide range of',
    '+971565464941', 'afzalmanoly@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/kkhgfg.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/kkhgfg.png',
    '2 5a St - Deira - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bestpoint-electronics-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'barcodelinks-electronics-trading-llc', 'Barcodelinks Electronics trading LLC', 'Barcode Links is a United Arab Emirates company of reference in the automatic identification and mobility sector . We offer our customers the widest and most',
    '+971527106979', 'husni@barcodelinksme.com', 'https://www.barcodelinksme.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/2024-06-13.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/2024-06-13.png',
    'Al Mulla Building - No.39 - Al Souq Al Kabeer - BurDubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/barcodelinks-electronics-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'assal-restaurant', 'Assal restaurant', 'Welcome to Assal Restaurant, your go-to dining spot located at Sheikh Marwan Building in Umm Al Quwain, Dubai. We offer a diverse menu featuring a blend of',
    '+971552398080', 'pktmuneer@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/2023-08-19.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/2023-08-19.jpg',
    'Umm Al quwain Sheik marvan building, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/assal-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'turbo-buff-auto-general-repairing-llc', 'Turbo Buff Auto General Repairing LLC', 'Turbo Buff Your Ultimate Automotive Solution Based in Al Quoz, Dubai, Turbo Buff strikes as the leading destination for automotive solutions. We the',
    '564188536', 'accounts@turbobuff.ae', 'https://turbobuff.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/TB_1-2.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/gturbo.png',
    'Warehouse No. 03, Plot 369-209 , Street No. 26 - Al Quoz Industrial Area 4, Dubai,UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/turbo-buff-auto-general-repairing-llc-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'turbo-buff-auto-general-repairing-llc', 'Turbo Buff Auto General Repairing LLC', 'Turbo Buff Your Ultimate Automotive Solution Based in Al Quoz, Dubai, Turbo Buff strikes as the leading destination for automotive solutions. We the',
    '564188536', 'accounts@turbobuff.ae', 'https://turbobuff.ae/',
    NULL, NULL,
    'Warehouse No. 03, Plot 369-209 , Street No. 26 - Al Quoz Industrial Area 4, Dubai,UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/turbo-buff-auto-general-repairing-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'coco-ai', 'COCO AI', 'At COCO AI, we are pioneers in the realm of Smart Transportation Technologies, driving the future of urban mobility through innovation, data-driven solutions,',
    '+971506012605', 'fayadmuhammed17@gmail.com', 'https://coco-ai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/the_coco_ai_logo.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/the_coco_ai_logo.jpeg',
    'Al Ain, Abu Dhabi, UAE', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/coco-ai/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'magic-eyes-optics', 'Magic Eyes Optics', 'Welcome to Magic Eyes Optics, your trusted destination for premium eyewear and optical services. Conveniently located behind ADCB Bank in Fujairah, Dubai,',
    '+971562901371', 'simsonsusai2021@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/Black-op.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/Black-op.png',
    'Behind ADCB bank, Fujaira, Al Fujayrah, United Arab Emirates', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/magic-eyes-optics/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'tres-leches-cafe', 'Tres leches cafe', 'Welcome to Tres Leches Cafe, your cozy and inviting cafe located in Mohamed Bin Zayed City - ME-9, Abu Dhabi. We specialize in serving a variety of delightful',
    '+971503076559', 'leches2024@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/2024-07-31.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/2024-07-31.jpg',
    'Mohamed Bin Zayed City - ME-9 - Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/tres-leches-cafe/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sap-business-one-erp-support-b-one-addons', 'SAP Business one ERP support, B one addons', 'SAP B one',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/Purple-Turquoise-Colorful-Happy-World-Computer-Literacy-Day-Instagram-Post_20240806_184000_0000.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/Purple-Turquoise-Colorful-Happy-World-Computer-Literacy-Day-Instagram-Post_20240806_184000_0000.png',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sap-business-one-erp-support-b-one-addons/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'dubai-trading-confectionary-co-llc', 'Dubai Trading & Confectionary Co. LLC', 'Dubai Trading and Confectionery Company were established in the year 1966 by a local person named Mr. Abdul Rahim Abdullah Al Saeedi who is the owner,',
    '+971505283718042262146', 'dtcc1974@eim.ae', 'https://www.dtccae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/download.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/download.png',
    'Sheikha Latifa, 18-20, Al Khor Street, Al Ras – 112, Deira, Dubai.', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dubai-trading-confectionary-co-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'supertech-computer-trading-llc', 'Supertech Computer Trading LLC', 'Supertech Computer Trading is a leading sub-distributor and B2B supplier based in the Middle East and Africa region. We are an authorized reseller of renowned',
    '+971503248695', 'faisal@supertechuae.com', 'https://supertechwebstore.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/IMG_20170521_093335.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/IMG_20170521_093335.jpg',
    'Al Zarooni Building Al Raffa Street PO BOX: 242167 Bur Dubai, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/supertech-computer-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'wercore-cleaning-and-pest-control-services-llc', 'Wercore cleaning and pest control services LLC', 'Wercore Cleaning and Pest Control Services LLC was formed in 2013 with the intention of providing affordable, efficient and ecologically sound pest management',
    '+971564185050', 'sales@wercore.com', 'https://wercore.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/271588689_1016804842201452_2482685139458869719_n.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/271588689_1016804842201452_2482685139458869719_n.jpg',
    '35 B. , 3rd Floor, zomoroda Building, Umm Hurair Street, Karama', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/wercore-cleaning-and-pest-control-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'tesse-middle-east-building-materials-trading-llc', 'TESSE MIDDLE EAST BUILDING MATERIALS TRADING LLC', 'TESSE located in a large domestic sanitary ware production base. Our factory has advanced production lines, the firs-class quality management as well as',
    '+971564339040', 'gm@tesseme.com', 'http://www.tesseme.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/fc.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/fc.png',
    'Suburbia Damac Building, Jebel Ali, UAE & Al Jurf 3, Safeer Real Estate Building, Ajman, UAE', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/tesse-middle-east-building-materials-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'decor-team-wll', 'Decor Team WLL', 'Decor Team W.L.L carries a wide range of experience in the Fit out works, Interior Design, Electrical, AC/ HVAC/ Air conditioning works, Plumbing, Carpentry/',
    '+971569121420', 'ameenyes@yahoo.co.uk', 'https://decorteambh.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/gagaga.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/gagaga.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/decor-team-wll/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'global-plus-accounting-tax-services', 'Global Plus Accounting & Tax Services', 'Welcome to Global Plus Accounting & Tax Services, your premier partner for comprehensive financial solutions. We specialize in providing top-notch',
    '+971588202644', 'infoglobalplus1@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/yayayay.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/yayayay.png',
    'OFFICE-10,MUSAFFAH-34 - near NEW LABOUR COURT - Musaffah', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/global-plus-accounting-tax-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'startech-secuirity-system', 'STARTECH SECUIRITY SYSTEM', 'Startech designs, plans and implements system integrations with cutting edge technology that is steps ahead of its rivals to help clients monitor, control and',
    '+971553562007', 'info@startechuae.com', 'http://startechuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/344770295_134990939491353_3899352630728306166_n.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/344770295_134990939491353_3899352630728306166_n.jpg',
    'AL AIN ,SANAIYA ,HESSA BINT MOHAMMED STREET ,LAGEETAG BUILDING ,SHOP NO : 5', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/startech-secuirity-system/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'tiger-tyres', 'Tiger tyres', 'Welcome to Tiger Tyres, your trusted tyre specialist located in Al Kharran, Ras Al Khaimah, United Arab Emirates. We offer a comprehensive range of',
    '581203997', 'tigertyres2013@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/2023-12-26.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/2023-12-26.jpg',
    'Al kharran, Ras al khaimah , United Arab Emirates', 'ras_al_khaimah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/tiger-tyres/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'oottupura-catering-services-llc', 'Oottupura Catering Services LLC', 'Welcome to Oottupura Catering Services LLC, your trusted partner for exceptional catering solutions in Dubai Investment Park 2. Located at Al Hijaz Labour',
    '+971563043520', 'oottupuracatering@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/oottupura-30.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/oottupura-30.jpg',
    'Dubai investment Park 2, Al Hijaz Labour Camp, Ground Floor', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/oottupura-catering-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'oottupura-restaurant-llc-jabel-ali', 'Oottupura Restaurant LLC Jabel Ali', 'Welcome to Oottupura Restaurant LLC, your premier dining destination in the Jabal Ali Industrial Area, located on the Mezzanine Floor of Grand Hypermarket. We',
    '+97148844757', 'oottupuradxb@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/IMG_20210527_210703.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/IMG_20210527_210703.jpg',
    'Jabel Ali Industrial Area , Grand hypermarket, Mezzanine Floor', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/oottupura-restaurant-llc-jabel-ali/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'oottupura-restaurant-llc-aiko-mall', 'Oottupura Restaurant LLC Aiko Mall', 'Welcome to Oottupura Restaurant LLC, your go-to dining destination at Dubai Investment Park 1, Aiko Mall M20. We specialize in offering a rich and diverse',
    '+971488337310', 'oottupuradxb@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/92352c20-b28b-49f5-ba19-daa6830d0fba-h.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/92352c20-b28b-49f5-ba19-daa6830d0fba-h.jpeg',
    'Dubai investment Park 1, Aiko Mall M20', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/oottupura-restaurant-llc-aiko-mall-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'oottupura-restaurant-llc-aiko-mall', 'Oottupura Restaurant LLC Aiko Mall', 'Welcome to Oottupura Restaurant LLC, your go-to dining destination at Dubai Investment Park 1, Aiko Mall M20. We specialize in offering a rich and diverse',
    '+971488337310', 'oottupuradxb@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/92352c20-b28b-49f5-ba19-daa6830d0fba-h.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/08/92352c20-b28b-49f5-ba19-daa6830d0fba-h.jpeg',
    'Dubai investment Park 1, Aiko Mall M20', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/oottupura-restaurant-llc-aiko-mall/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'alsaab-fixtures', 'Alsaab Fixtures', 'Welcome to Alsaab Fixtures and Maintenance Services, your trusted partner for all your fixtures and maintenance needs. We specialize in providing top-notch',
    '+971529787878', 'fanzeem@outlook.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/08/xwvuyev.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/xwvuyev.png',
    'Abu Dhabi, United Arab Emirates', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alsaab-fixtures/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'bello-bus-rental-l-l-c', 'Bello Bus Rental L.L.C', 'Welcome to Bello Bus Rental L.L.C, operating as Ultimate Transport Solutions. We provide comprehensive passenger transportation services across the Emirates,',
    '+97142855786', 'bellobus@live.com', 'https://bellodubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/35-Seater-1-520x397.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/35-Seater-1-520x397.jpg',
    'Office 101, M Floor , Unique World Business Center, Hamsah A Block, Karama, Dubai, UAE.', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bello-bus-rental-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'rafha-trading-llc', 'RAFHA TRADING LLC', 'Rafha Trading llc established at the Emirates of Sharjah in United Arab Emirates is focusing on the import, export and distribution of personal protective',
    '025588444', 'sales@rafhatrading.com', 'https://www.rafhatrading.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/sososo.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/sososo.png',
    '18 Maleha St - Warehouses Land - Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rafha-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'home-town-restaurant-llc', 'Home Town Restaurant LLC', 'Welcome to Home Town Restaurant LLC, your cozy dining spot located at Shop No: 35, Ground Floor, Safeer Mall, Al Nahda, Sharjah. We specialize in offering a',
    '067401474', 'hometownrestaurants@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/IMG-20240730-WA0006-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/IMG-20240730-WA0006-1.jpg',
    'Shop No :35, Ground Floor, Safeer Mall, Al Nahda, SHJ', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/home-town-restaurant-llc-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'home-town-restaurant-llc', 'Home Town Restaurant LLC', 'Welcome to Home Town Restaurant LLC, your cozy dining spot located at Shop No: 35, Ground Floor, Safeer Mall, Al Nahda, Sharjah. We specialize in offering a',
    '067401474', 'hometownrestaurants@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/IMG-20240730-WA0006-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/IMG-20240730-WA0006-1.jpg',
    'Shop No :35, Ground Floor, Safeer Mall, Al Nahda, SHJ', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/home-town-restaurant-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'food-junction-restaurant', 'FOOD JUNCTION RESTAURANT', 'Welcome to Food Junction Restaurant, your ultimate dining destination in Baniyas East, Abu Dhabi. We offer a diverse menu that blends traditional and',
    '+971543144077', 'foodjunctionbaniyas@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2022-12-17.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2022-12-17.jpg',
    'baniyas east abu dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/food-junction-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'pine-pack-timber', 'Pine Pack Timber', 'PINE PACK Timber “Your Wood Partner” We are one of the fastest growing establishment aiming at serving the packaging needs of esteemed clients such as wooden',
    '+971586839007', 'info@pine-pack.com', 'http://www.pine-pack.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/dddddds-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/dddddds-1.png',
    'Plot No.8, Phase 3, Saih Shuaib, Dubai Industrial City', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/pine-pack-timber/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'jeyes-building-cleaning-services', 'Jeyes Building Cleaning Services', 'JEYES is a UAE-based Professional Cleaning Services in Dubai providing both house cleaning services and commercial cleaning delivering quality jobs. We',
    '+971507723194', 'info@jeyesclean.com', 'http://www.jeyesclean.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/onlyjeyes.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/onlyjeyes.png',
    'Fahad Bldg - near Abu Hail Center - Deira - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jeyes-building-cleaning-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'iris-accounting-bookkeeping', 'Iris Accounting & Bookkeeping', 'Iris Accounting & Bookkeeping is the top-notch accounting and tax consultancy firm in UAE. We hold a grip of our core competencies and provide expertise',
    '+971504967825', 'info@irisaccounts.com', 'https://irisaccounts.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/iiiiii.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/iiiiii.png',
    'Al Mansoor Building, Near Al Musalla Tower, Al Fahidi Metro Station Exit-4, Burdubai, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/iris-accounting-bookkeeping/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'travoppo', 'Travoppo', 'Welcome to Travoppo At Travoppo.com, we believe that every journey begins with a single step, and we are here to make that step as seamless and exciting as',
    '+971521978229', 'travoppo@gmail.com', 'https://travoppo.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/Untitled-design-74.webp', 'https://malayalibusiness.com/wp-content/uploads/2024/07/Untitled-design-74.webp',
    'Barsha, dubai, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/travoppo/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'triumph-attestation-services', 'TRIUMPH ATTESTATION SERVICES', 'We have a simple attestation process that allows our customers to place an order easily, effectively, and quickly. Once you have entered your details, you are',
    '+971561308260', 'phjunaid2255@gmail.com', 'https://www.triumphattest.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/jfvkon.png', 'https://malayalibusiness.com/wp-content/uploads/2024/07/jfvkon.png',
    'Center - Office 106, Al Hilal Bank Building - near Al Twar - Al Qusais - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/triumph-attestation-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'airborne-travel-and-tourism', 'Airborne travel and tourism', 'We at Airborne Travel and Tourism ensure that customers are best served ! Airline booking has been and still continues to be our forte.The rates that we',
    '+971507259786', 'jishar@airbornetravels.com', 'https://airbornetravels.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/airbored.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/airbored.png',
    'Rawdat Al Karama Bulding, Karama, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/airborne-travel-and-tourism/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'nilgiri-general-trading', 'NILGIRI GENERAL TRADING', 'At Nilgiri General Trading, we are passionate about bringing the world''s finest fruits and vegetables to the United Arab Emirates and to our partners in India',
    '+971528689758', 'sherin.pa@nilgiriuae.com', 'https://nilgiriuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/New-nil.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/New-nil.png',
    'Shop B24, The Fresh Market, Ras Al Khor Industrial Area 3, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/nilgiri-general-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'marts-gulf-contracting-llc', 'Marts gulf contracting LLC', 'Founded in 1998, Marts Gulf has grown both vertically and horizontally in order to provide turnkey services to our clients. Marts Gulf’s philosophy of doing',
    '+971506291402', 'info@martsgulf.com', 'https://martsgulf.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/1-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/1-1.jpg',
    '# FL 01, New al Safiya Building, Near Abu Hail Metro Station, P.O. Box: 27657, Dubai, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/marts-gulf-contracting-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'fathima-grocery', 'Fathima Grocery', 'Welcome to Fathima Grocery, your neighborhood store located at the Municipality Building in Al Foha, Al Ain, UAE. We offer a wide range of fresh produce,',
    '+971557832190', 'shafeerk223@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2020-05-12.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2020-05-12.jpg',
    'Muncipality Building, Al Foha, Al Ain, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fathima-grocery/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'al-wady-rent-a-car-llc', 'Al Wady rent a car llc', 'Welcome to Al Wady Rent a Car LLC, your trusted partner for car rentals in Dubai. Conveniently located behind Al Tawar Center, we offer a wide range of',
    '+971588474001', 'optionsrent@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/1-Mercedes-S-Class-plug-in-1024x576.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/1-Mercedes-S-Class-plug-in-1024x576.jpg',
    'Behind Al tawar center, dubai, uae', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-wady-rent-a-car-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'miznas-cafeteria', 'Miznas Cafeteria', 'Welcome to Miznas Cafeteria, your favorite spot for a delightful dining experience in Ajman. Located at Rashidiya Towers in Al Rashidiya 2, Miznas Cafeteria',
    '067417761', 'miznasajman@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2020-10-02.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2020-10-02.jpg',
    'Rashidiya Towers, Al Rashidiya 2, Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/miznas-cafeteria/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'swagat-restaurant-l-l-c', 'Swagat restaurant L L C', 'Swagat Restaurant LLC',
    '+971504823100', 'francetechcont@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2f709c75-7190-4b0f-80ac-1d1bfb1b36eb-t.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2f709c75-7190-4b0f-80ac-1d1bfb1b36eb-t.jpeg',
    'Al Quisais Damascus Street', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/swagat-restaurant-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'mubasher-cafeteria-restaurant', 'Mubasher cafeteria & restaurant', 'Mubasher Cafeteria & Restaurant',
    '+971502559199', 'hassanchalil999@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2022-04-16.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2022-04-16.jpg',
    '392 Al Rasheed Rd - Deira - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mubasher-cafeteria-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'marhaba-mandi', 'Marhaba mandi', 'Welcome to Marhaba Mandi, your ultimate destination for authentic Mandi cuisine in Al Qusais 2. Conveniently located near Habib Bank on Damascus Street, we',
    '+971528097974', 'marahabamandi@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/IMG_6404-1-1200x900-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/IMG_6404-1-1200x900-1.jpg',
    'Near habib bank Damascuss street Al Qusais 2', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/marhaba-mandi/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'network-international', 'Network International', 'For over 30 years, Network International has delivered innovative payment solutions, driving revenue and profitability for customers while supporting business',
    '+971565041958', 'hari.padigala@network.global', 'https://www.network.ae/en',
    'https://malayalibusiness.com/wp-content/uploads/2024/08/worko.png', 'https://malayalibusiness.com/wp-content/uploads/2024/08/worko.png',
    'Level 1, Network Building 23rd Street, Opp. Al Salam Mosque, Al Barsha 2 Dubai, United Arab Emirates', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/network-international/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'tasty-ville-restaurant', 'Tasty Ville Restaurant', 'Welcome to Tasty Ville Restaurant, your casual dining spot in Sharjah. Located near the Police headquarters on Al Zahra''a Street in Maysaloon, Al Sharq, Tasty',
    '+971503755797', 'tastyville@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2023-10-20.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2023-10-20.jpg',
    'Near Police headquarters - Al Zahra''a St - Maysaloon - Al Sharq - Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/tasty-ville-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'star-grill-restaurant', 'Star Grill Restaurant', 'Welcome to Star Grill Restaurant, your go-to casual dining spot on Rolla Street, opposite Ibrahim Khaleej Masjid and near City Mart Supermarket in Bur Dubai.',
    '+971543009298', 'info@stargrill.ae', 'https://livecart.ae/stargrill',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2022-07-23.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2022-07-23.jpg',
    'Rolla Street Opp. Ibrahim Khaleej Masjid Near city mart supermarket, Bur Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/star-grill-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'panacea-it-infrastructure-llc', 'Panacea IT Infrastructure LLC', 'In the current economic world, IT infrastructure outsourcing has become a continuing growth-oriented firm in their size and complexity, since the need for',
    '+971553991441', 'info@panaceame.com', 'https://panaceame.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/008.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/008.jpg',
    'Business Bay', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/panacea-it-infrastructure-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'oh-my-grill', 'OH MY GRILL', '"OMG! OH MY GRILL أقوى شاورما بالإمارات، أول مطعم في الأمارات متخصص في شاورما الصاج ، حيث تحضر الشاورما على الصاج شاورما أوه ماي جريل على الصاج أزكى طعم وأكثر',
    '026322533', 'ohmygrill3@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/07/413040899_17917601351839418_45519470631264014_n.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/413040899_17917601351839418_45519470631264014_n.jpg',
    'Ahl Almajd st. Khalidiyah, Abu Dhabi, United Arab Emirates', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/oh-my-grill/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'zam-zam-mandi-restaurant', 'ZAM ZAM MANDI RESTAURANT', 'ZamZam Mandi restaurant opened its doors in for its first customer in 2009 with the intention of bringing the authentic middle eastern dining experience at',
    '+971503275428', 'info@zamzam-mandi.com', 'https://bestmandigroup.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/rsw_984h_821.webp', 'https://malayalibusiness.com/wp-content/uploads/2024/07/rsw_984h_821.webp',
    'Zamzam Mandi Restaurant, Near Mutheena Park, Opposite Marco Polo Hotel, Next to Aster Clinic, Mutheena, Deira, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/zam-zam-mandi-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mixmax-group-of-companies', 'MIXMAX Group of companies', 'MIXMAX Group has grown with Doha, State of Qatar. Started as a small trading division with three individuals in 2005, the Group has since expanded into a',
    '+97444411216', 'info@mixmax-group.com', 'https://mixmax-group.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/267946700_3029436903979869_1231947905753452851_n.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/267946700_3029436903979869_1231947905753452851_n.jpg',
    'Alain Phase 4, Salwa Road, PO Box – 40236, Doha, State of Qatar', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mixmax-group-of-companies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'adaminte-chayakkada', 'ADAMINTE CHAYAKKADA', 'When food is your first love and feeding people is your passion, magic happens. My childhood is full of memories of food. I inherited my love for food from my',
    '+9714586565', 'mv.nizam@gmail.com', 'https://www.ackd.in/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2023-07-07.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2023-07-07.jpg',
    'Damascus Street, Al Qusais', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/adaminte-chayakkada/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'ayurdhara-ayurvedic', 'AYURDHARA AYURVEDIC', 'Ayurveda is the ancient Indian system of medicine, which treats the body and mind psychosomatic treatment -A truly holistic and integral medical system',
    '+971564647343', 'mail@aacdubai.com', 'https://ayurdharaayurvedic.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/1-9.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/1-9.jpg',
    '301 Al Balorah Bldg, 3rd Floor, 48 2 B Street, Karama', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ayurdhara-ayurvedic/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'aura-ayurveda', 'AURA AYURVEDA', 'Aura Ayurveda Clinic Sharjah provides Traditional Ayurvedic treatment and therapies in a comfortable holistic and natural environment. You will enjoy',
    '+971564483493', 'info@ayurvedayogasharjah.com', 'https://ayurvedayogasharjah.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2020-09-10.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2020-09-10.jpg',
    'Suite 201,202, Al Rostamani Bldg, Above Suzuki Showroom, Near Nesto Hypermarket, King Faisal Street, Sharjah, UAE', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aura-ayurveda/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ix-gamers', 'IX GAMERS', 'Apart from www.ixgamersuae.com online store we have www.innoxuae.com and physical store as well in Dubai, UAE and growing to have more stores across the',
    '+971545841732', 'info@ixgamersuae.com', 'https://ixgamersuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2024-03-181.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2024-03-181.jpg',
    '#28, Computer Plaza (Al Ain Center), Near Al Fahidi Metro Station, Bur Dubai, Dubai – UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ix-gamers/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'fitox-gym', 'FITOX GYM', 'Fitox is an innovative and affordable Fitness Center in Bur Dubai, Dubai, UAE. Specializing in Personal Fitness Training, Sports Performance Improvements,',
    '+971566090298', 'info@fitoxgym.com', 'https://fitoxgym.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2021-11-25.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2021-11-25.jpg',
    'Easa Saleh Al Gurg Building, Mezanine Floor, Khalid Bin Al Waleed Road, Dubai, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fitox-gym/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'spot-grill-multi-cuisine-restaurant', 'SPOT GRILL Multi cuisine restaurant', 'Birthday parties, friends, family meet, official meet-ups or party orders; We can host you all.',
    '+971569660787', 'info@spotgrill.com', 'https://spotgrill.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/2023-12-10.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/2023-12-10.jpg',
    '44-36 S118, Rollah - Al Marija St', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/spot-grill-multi-cuisine-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hot-wheels-luxury-car-transport', 'HOT WHEELS LUXURY CAR TRANSPORT', 'Hot wheels Luxury Transport is a number one limousine service in Dubai, serving personal and corporate transportation needs for our clients since 2011. Our',
    '+971556940500', 'info@hotwheelslimo.ae', 'http://www.hotwheelslimo.ae',
    'https://malayalibusiness.com/wp-content/uploads/2024/07/1419407135_DSC_0007-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/07/1419407135_DSC_0007-1.jpg',
    '1 8a Street - Al Qusais - Al Qusais 2', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hot-wheels-luxury-car-transport/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'obstetrician-gynecologist-in-dubai-best-women-clinic', 'Obstetrician-gynecologist in Dubai| Best women clinic', 'Dr. Mozhgan, with 25 years of expertise in women''s health, specializes in aesthetic gynecology, female sexual dysfunction, and complex surgeries. As a member',
    '+971501840126', 'drsayyad2@gmail.com', 'https://drmozhgansayyad.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/05/Mozhgan-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/05/Mozhgan-1.png',
    'Novomed clinic, Street 10c villa 41 - Jumeirah 1 - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/obstetrician-gynecologist-in-dubai-best-women-clinic/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'bonvo-concepts-tourism', 'Bonvo Concepts Tourism', 'At Bonvo, we''re not just another travel agency. We''re here to revolutionize your travel experience, turning it into a dynamic journey of self-discovery and',
    '+971528282525', 'bonvouae@gmail.com', 'http://www.bonvo.in',
    'https://malayalibusiness.com/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-24-at-12.51.37-PM-1.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-24-at-12.51.37-PM-1.jpeg',
    'Office No : 1,Lobby Level,Crowne Plaza Hotel,Deira-Salah aL Din', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bonvo-concepts-tourism-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'al-hidayah-islamic-center-dubai', 'Al Hidayah Islamic Center- DUBAI', 'Welcome to Al Hidayah Islamic Center, a place where values, knowledge, and community come together to create a vibrant and nurturing environment for',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/1701729714963.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/1701729714963.jpeg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-hidayah-islamic-center-dubai/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'maker-interior', 'Maker Interior', 'Dubai Maker Interior Design Companies in Dubai (Noor Al Misbah Technical Services LLC )is specializes in the full-scope turnkey contracts on interior',
    '+971508307760', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/marker.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/marker.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/maker-interior/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'multivision-interior-decoration-llc', 'Multivision Interior Decoration LLC', 'Multivision Interiors as a reputable Interior design company Dubai is totally focussed on its objectives and makes sure to provide you solutions that blend',
    '+971508307760', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/50151338_367177854095553_8385050830776041472_n.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/50151338_367177854095553_8385050830776041472_n.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/multivision-interior-decoration-llc-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'olive-media-uae', 'Olive Media UAE', 'We are OLIVE PHOTOGRAPHY Team is a professional photography and videography we offer the best price',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/olive.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/ol.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/olive-media-uae/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'santy-textiles', 'Santy Textiles', 'We''re proud to introduce ourselves as the manufacturers of Pure Kanchipuram Silk Sarees for over a century.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/slider-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/slider-1.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/santy-textiles/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'realmagic-trading-llc', 'Realmagic Trading LLC', 'Real Magic retail kiosks is committed in providing its shoppers with an unequaled selection of exclusive magic tricks, toys, games and novelties brands from',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/inportexport-feature-updated.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/inportexport-feature-updated.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/realmagic-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'siyana-travel-and-tourism', 'SIYANA TRAVEL AND TOURISM', 'We are very excited to introduce Siyana Tours & Holidays LLC as the one-stop provider for all your travel needs and requirements. We label ourselves as',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/SAUDI-VISA.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/SAUDI-VISA.jpg',
    'Sho no. 03, Al Qusais Building, Near Forune plaza Hotel, Al Qusais, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/siyana-travel-and-tourism/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-beaa-trading', 'Al Beaa Trading', 'Al Beaa is a twenty five year old fastener company providing industrial merchandise and exceptional service across Middle East. With our extensive supply',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/04/baa.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/04/baa.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-beaa-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'auditing', 'Auditing', 'Taxpert Auditing Firm is a leading provider of comprehensive auditing services, specializing in tax compliance and financial auditing. With a team of highly',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/03/IMG_0592-1.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/IMG_0379-1024x1024.jpeg',
    'Iris bay tower , business bay', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/auditing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'shuhaib-dental-clinic-llc', 'Shuhaib Dental Clinic Llc', NULL,
    '+971509420027', 'sdcajman@gmail.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/03/dental-department-1624775519.jpg.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/dental-department-1624775519.jpg.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/shuhaib-dental-clinic-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'panoor-restaurant', 'Panoor Restaurant', 'Panoor Restaurant is established in the year 1983. It is one of the leading non veg restaurants across UAE and expanding across GCC also. From a humble',
    '+97142558775', 'panoorrest@gmail.com', 'http://www.panoorrestaurant.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/F59A1604-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/F59A1604-1024x683.jpg',
    'Panoor Restaurant', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/company-profile/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'yashasviworld-fashion-online-store', 'YashasviWorld – Fashion Online Store', 'One of the best Fashion Online Store',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/03/Fast-fashion.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/Fast-fashion.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/yashasviworld-fashion-online-store/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'grease-trap-installation-supply', 'Grease trap installation&supply', 'Welcome to SAM Tech, where we redefine spaces to reflect your vision and enhance your lifestyle. As a leading fit-out contractor, we specialize in',
    '+971565657217', 'service@fitoutdubai.com', 'https://fitoutdubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/IMG-20240327-WA0021-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/IMG-20231223-WA0042-576x1024.jpeg',
    'Near karama bus station', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/grease-trap-installationsupply/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'call-dr-ahmad-tahlak', 'Call – Dr.Ahmad Tahlak', 'The goal of Ahmad Tahlak Consultancy in Dubai is to create experiences, not just call centres. With the help of call.ae, normal phone calls may become',
    '+971043482900', 'info@call.ae', 'https://www.call.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/home-banner-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/home-banner-1.jpg',
    'Al Hawai Tower, Office 203, Sheikh Zayed Road', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/call-dr-ahmad-tahlak/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'js-global-cost-reduction-risk-management', 'JS GLOBAL COST REDUCTION & RISK MANAGEMENT', 'We have extended our portfolio to cater to a much wider spectrum by involving experienced and acclaimed domain experts.',
    '+971507385880', 'jayasree.v@jsconsultants.in', 'https://jsconsultants.in/',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/jayasreemaam.png', 'https://malayalibusiness.com/wp-content/uploads/2024/03/jayasreemaam.png',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/js-global-cost-reduction-risk-management/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'dubai-business-setup', 'Dubai Business Setup', 'Setting up a business in Dubai is easy with dubaibusinesssetup.ae. We simplify the process, handling registration and licensing for you. Take advantage of',
    '+971589500125', 'contact@dubaibusinesssetup.ae', 'https://www.dubaibusinesssetup.ae/uk/',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/Dubai-Business-Setup-Professional-Business-Setup-Consultants-in-Dubai.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/Dubai-Business-Setup-Professional-Business-Setup-Consultants-in-Dubai.jpg',
    'Office: 2017, Level 20 post office 50435 Conrad Hotel Building Sheikh Zayed Road Dubai UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dubai-business-setup/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'falcon-premier-real-estate', 'FALCON PREMIER Real Estate', 'Falcon Premier is the best real estate company for classic residences among the many properties available in the Dubai real estate market. We think it''s',
    '+971566873199', 'falconpremier2@gmail.com', 'https://www.falconpremier.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/hm-about-img1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/hm-about-img1.jpg',
    'Unit no:4001-4004, 40th floor, Platinum Tower, Cluster -I, Jumeirah Lake Towers - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/falcon-premier-real-estate/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'wood-barrow-art-crafts', 'Wood Barrow Art Crafts', 'As a leading wooden manufacturing company, Wood Barrow is at the forefront of providing premium wooden products for individuals and enterprises. We provide',
    '+971581421506', 'marketing.woodbarrow@gmail.com', 'http://www.woodbarrow.ae',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-02-21-at-11.28.13-AM-1.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-02-21-at-11.28.13-AM-1.jpeg',
    'Near Al safi Waters, Al Jerf', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/wood-barrow-art-crafts/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'weirdo-general-trading', 'Weirdo General Trading', 'Welcome to the weird and wonderful world of Weirdo General Trading!',
    '+971539140313', 'office@example.com', 'https://weirdotrading.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/instagram-post-01.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/instagram-post-01.jpg',
    '1702, lake Central tower, Business bay, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/weirdo-general-trading-7/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'adotz-trading', 'ADOTZ TRADING', '1. Promotional Items & Corporate Gifts',
    '+971522127656', 'info@adotztrading.com', 'http://www.adotztrading.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/03/794633d33903e030779061ca11513de0-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/794633d33903e030779061ca11513de0-1.jpg',
    '6th Floor, The Meydan GrandStand, Meydan Road, Nad Al Sheba, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/adotz-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hayla-couture', 'Hayla Couture', 'ridal and evening gown shop also offering bridal accessories like tiaras, veils and wedding ring pil',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/03/01.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/01.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hayla-couture/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'arabarch-consulting', 'ARABARCH Consulting', 'ArabArch prides itself on being a customer-centric company that aims to understand the needs of our clients and offer sustainable projects that focus on',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/03/project-13-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/03/project-13-1.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/arabarch-consulting/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'advanced-industries-group', 'Advanced Industries Group', 'Advanced Industries Group, is a market leading contracting & specialized manufacturing company with over 50 years’ experience in the field of interior',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/03/slider7.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/03/slider7.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/advanced-industries-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'avaar-properties', 'AVAAR properties', 'AVAAR properties offers market leading services to its investors. Apart from real estate consultancy and brokerage, we also act as a Fund Manager, Co-Fund',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Minimalistic20Kerala20home203-525x328-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/Minimalistic20Kerala20home203-525x328-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/avaar-properties/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'driven-properties', 'Driven Properties', 'Driven Properties offers property investment and consultation services to help individuals find their ideal property that will meet their budget and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/gen_4_4061.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/gen_4_4061.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/driven-properties/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'schemes-electrical-and-mechanical-equipment-company-llc', 'Schemes Electrical and Mechanical Equipment Company LLC', 'Schemes Electrical & Mechanical Equipment Company LLC was established in 1994, a subsidiary of SCHEMES International General Trading & Contracting Co',
    '+971517670117', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logo-1-4.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/about_part_img.png',
    'Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/schemes-electrical-and-mechanical-equipment-company-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'telal-al-jefen-general-contracting-l-l-c', 'Telal Al Jefen General Contracting L.L.C.', 'Telal is a UAE based company founded to provide comprehensive value engineering and construction solutions at the most competitive prices in the market.',
    '+971578943725', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/301698381_408753164693970_5934027022601314008_n.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/301698381_408753164693970_5934027022601314008_n.jpg',
    'Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/telal-al-jefen-general-contracting-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'cosmocorr-technical-services', 'Cosmocorr Technical Services', 'COSMOCORR provides multi-disciplinary engineering solutions, support, project management to Offshore/Onshore and Marine sector. What makes us different is',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/ff01ea_19b1c6c45a1e444c9e25543bfb402259mv2-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/ff01ea_19b1c6c45a1e444c9e25543bfb402259mv2-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/cosmocorr-technical-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'network-cargo', 'Network Cargo', 'International Cargo Services Express Delivery Service Sea cargo service UK,USA,EUROPE,GCC SPECIAL SE',
    '+971473746433', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1-4.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/network-cargo/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'magicbuildingtrading', 'Magicbuildingtrading', 'MAGIC BUILDING TRADING (L.L.C)',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-1-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-1-3.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/magicbuildingtrading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'teklite-trading-llc', 'TEKLITE TRADING LLC', 'TEK Electrical Cables Trading LLC is a reliable and premier supplier of quality electrical cables and components for Ships, Onshore, Offshore, Commercial, and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/teklite-about-img2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/teklite-about-img2.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/teklite-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'maitha-general-trading-llc', 'MAITHA GENERAL TRADING LLC', 'The MGT Group established since 1978, with more than 400 employees. Over the past 30 plus years, the MGT Group expanded in the different locations around the',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/MGT-01-01-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-5.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/maitha-general-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-tamimi-engineering-services-l-l-c', 'AL TAMIMI ENGINEERING SERVICES L.L.C', 'Al Tamimi Engineering Services LLC established in 1996, have immense pleasure in introducing ourselves as an Electro-mechanical Installation and Maintenance',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-7.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-7.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-tamimi-engineering-services-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'jini-trading-co-l-l-c', 'JINI TRADING CO (L.L.C)', 'At JINI, we follow one principle – VALUE FOR MONEY. With a range of products from lamps, fittings, cables, switches, controls, accessories, tools, we are',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-26.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-26.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jini-trading-co-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'almuharikpumpstrading', 'Almuharikpumpstrading', 'Al Muharik is an Umbrella For Water Solution With Many Brand Names Identity Quality Products and Services.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1695378739_4c63cf2d38c389337fe4-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1695378739_4c63cf2d38c389337fe4-1.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/almuharikpumpstrading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mac-media-advertising', 'MAC Media Advertising', 'We make your dream design perfectly. Customer satisfaction is core concentration...... The world today is defined by information, Whether its news, interview',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-31-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-31-1.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mac-media-advertising/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'logic-office-equipments', 'Logic Office Equipments', 'LOGIC office equipments LLC is a highly talented and experienced entrepreneurial team. We are dealing all major brands of printer/copier machines all over in',
    '+971517670117', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/cs.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/cs.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/logic-office-equipments/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'alef-ya-translation-documents-clearing-services', 'Alef Ya Translation & Documents Clearing Services', 'Alef Ya (meaning A to Z in Arabic); as the name itself denotes it is a Dubai based innovative Establishment that clinches covetable position as one of the',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/294197588_356664186642588_4429884153948157559_n.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/294197588_356664186642588_4429884153948157559_n.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alef-ya-translation-documents-clearing-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'joon-tourism-llc', 'JOON TOURISM LLC', 'JOON TOURISM LLC , a local destination management company for Dubai. We Offer comprehensive travel programs to corporate and individual travelers with variety',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/jon1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/jon1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/joon-tourism-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'expert-rangers', 'Expert Rangers', 'Expert Rangers is a Dubai based company, specialized in Adventure tour programmes, and expedition activities , and unique Desert based adventure activity',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/e1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/e1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/expert-rangers/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'wordcare-translations', 'Wordcare Translations', 'Legal Translation, Business Setup, Corporate Services',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/FOYBBk5XsAAWVOT.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/FOYBBk5XsAAWVOT.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/wordcare-translations-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'techies-in-town', 'TECHIES IN TOWN', 'Techies in Town is one of the leading IT Infrastructure Solutions companies based in Dubai that pioneers in IT AMC service, support and networking with its',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/techu1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/techu1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/techies-in-town/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'celltown-mobiles', 'Celltown Mobiles', 'Cell phone store in Dubai, Complete range of luxury mobiles Vivo,oppo,samsung,apple,gionee,honor Second hand mobiles,unlocking,reparing acessories etc',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/cell-town-the-house-of-accessories-honey-park-road-surat-fvg6g6l0u9.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2-5.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/celltown-mobiles/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-safi-trading-company-llc', 'Al Safi Trading Company LLC', 'Welcome to alsafifalcongroup.com. An online portal to showcase some of the fantastic cookware, what we have. Cookware is a great product because there''s',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/safi1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/safi1.jpg',
    'Umm Al Quwain', 'umm_al_quwain', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-safi-trading-company-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'bvs-global-uae', 'BVS Global UAE', 'Since 2010, BVS Global has executed over 2 million service requests in 182 countries that include 58 global and 13 government contracts. Our team of',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1031796.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1031796.jpeg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bvs-global-uae/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sunstars-movers', 'Sunstars Movers', 'Our aim at Sunstars Movers is to provide you with the best relocation services for your home, office, commercial, and industrial relocation needs. Relocating',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/office-movers-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/office-movers-1.png',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sunstars-movers/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'highline-travel-tourism-llc', 'Highline Travel & Tourism LLC', 'HIGHLINE Travel & Tourism is full service travel agency located in heart of Dubai - Near West hotel, Naif Deira. We are a travel company with perfect',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/highline1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/highline1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/highline-travel-tourism-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'kier-group', 'Kier Group', 'We are committed to delivering for communities and leaving lasting legacies through our work.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/downloadbbb.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/downloadbbb.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kier-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'v4u-electricals-trading-llc', 'V4U ELECTRICALS TRADING LLC', 'V4U ELECTRICALS TRADING LLC IN DUBAI UAE, WE ARE SUPPLIERS FOR BULLETTE LED LIGHTS IN UAE, LED LIGHTS IN UAE, ABB IN UAE, HAGER IN UAE, CRABTREE IN UAE, KDK',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/downloadvvv.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/downloadvvv.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/v4u-electricals-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'smooth-solution-building-material-tradng-l-l-c', 'Smooth Solution Building Material Tradng L.L.C', 'his credit report details the findings of our investigation into SMOOTH SOLUTION BUILDING MATERIALS TRADING LLC (BRANCH) . During the preparation of this',
    '+971575345285', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-29-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-29-1.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/smooth-solution-building-material-tradng-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'iqraa-house-hold-trading-llc-idealpack', 'Iqraa House Hold Trading Llc – IDEALPACK', 'DEAL PACK LLC was established at United Arab Emirates in 2006, as a company for marketing and distribution of different varieties of food packaging materials',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-28-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-28-1.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/iqraa-house-hold-trading-llc-idealpack/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'wings-enterprises', 'Wings Enterprises', 'Wings Enterprises, Inc. is a small woman-owned business that has been operating in the District of Columbia for over 30 years. With our extensive experience,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-27-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-27-1.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/wings-enterprises/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'keynes-constructions-and-interiors-llc', 'KEYNES CONSTRUCTIONS AND INTERIORS LLC', 'KEYNES GROUP Is Growing Rapidly Into UAE’s Leading Company In Delivering Exceptional Service. As The Industry Moves Forward So Does Our Company.Our Journey',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-26-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-26-1.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/keynes-constructions-and-interiors-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'white-sand-interiors', 'White Sand Interiors', 'It’s amazing what a small space with limited lighting can be turned into if a professional designer gets their hands on it!',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-24-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-24-1.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/white-sand-interiors/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'lebami-building-contracting-l-l-c', 'LEBAMI BUILDING CONTRACTING L.L.C', 'Founded in 2006, we are recognized as a leader in industrial construction activities for exceptional quality, timely completion, safety and unparalleled',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-22-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-22-2.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lebami-building-contracting-l-l-c-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'lebami-building-contracting-l-l-c', 'LEBAMI BUILDING CONTRACTING L.L.C', 'Founded in 2006, we are recognized as a leader in industrial construction activities for exceptional quality, timely completion, safety and unparalleled',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-22-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-22-1.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lebami-building-contracting-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hawkline-international', 'Hawkline International', 'Hawkline international is one of the leading independent, companies in the Gulf region with products and services in oil and gas, power, chemicals,',
    '+971517670117', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/unnamed.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/unnamed.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hawkline-international/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'zelta-media', 'Zelta Media', 'Solution we provide As the best web development company in Dubai, our utmost priority is to deliver results to your brand.Connect with your customers and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-6.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-6.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/zelta-media/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sah-al-injaaz', 'Sah al Injaaz', 'Our operational roots go back to 2002, when Ajman holding established and grew a dedicated cleaning services company in-house maintenance department to',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-18-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-18-1.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sah-al-injaaz/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mbm-modern-building-maintenance-co-llc', 'MBM Modern Building Maintenance Co. LLC', 'Modern Building Maintenance, popularly known as MBM, is a subsidiary of AG Facilities Solutions We were established in 1977. Today, MBM provides effective,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-17-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-17-1.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mbm-modern-building-maintenance-co-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'medon-pharmacy-llc', 'Medon Pharmacy LLC', 'Medon Pharmacies” was started in the year 2012 in Dubai. It is a leading Retail Pharmacy Group in the UAE with 25+ Outlets. The growth has been an instant and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-123.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-16-1.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/medon-pharmacy-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'zain-properties', 'Zain Properties', 'Zain Middle East Properties LLC is a professional well established real estate company, specialized in sales, lease and property management of residential and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/QRYZqbFutS1gLtUqQAcQXlL5MQve0oqcugrpwVBI.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/QRYZqbFutS1gLtUqQAcQXlL5MQve0oqcugrpwVBI.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/zain-properties/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-anboori-trading-llc', 'AL ANBOORI TRADING LLC', 'Al Anboori Trdg LLC is located in Dubai, UAE. Company is working in Electrical Goods business activities.',
    '+971539140313', 'office@example.com', NULL,
    NULL, NULL,
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-anboori-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-khalili-dynamic-electrical-l-l-c', 'AL KHALILI DYNAMIC ELECTRICAL L.L.C,', 'AL KHALILI DYNAMIC ELECTRICAL L.L.C,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-68.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-68.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-khalili-dynamic-electrical-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'classic-extrusions-llc', 'Classic Extrusions LLC', 'Leadership & Innovation are two terms usually associated with Elite Group of Companies. Driven by passion and dedication, we provide a complete range of',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-67.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-67.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/classic-extrusions-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'alrajhiconstruction', 'Alrajhiconstruction', 'Nearly twenty years ago, has been building name«Al-Rajhi Company for the construction and reconstruction of Contracting and Real Estate Investment»where',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-66.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-66.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alrajhiconstruction/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'industrial-quarry-and-cement', 'Industrial Quarry and Cement', 'Industrial Quarry and cement was established in Fujairah, UAE in 2003 to be a leader in the mining industry. Industry Quarry and cement (IQC) of limestone and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-65.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-65.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/industrial-quarry-and-cement/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'actava-trading', 'Actava Trading', 'Actava Trading is a privately-owned trading company, which covers the entire range of agricultural commodities for physical delivery.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-64.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-64.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/actava-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sine-electricals', 'Sine Electricals', 'Sine Electricals',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-63.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-63.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sine-electricals/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-saeedi-group', 'Al Saeedi Group', 'Since Al Saeedi Group’s inception in 1988, our standard for success has been based on a commitment to providing Total Tyre Solutions through continuous',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-62.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-62.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-saeedi-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-dawar-electrical-material-l-l-c', 'AL DAWAR ELECTRICAL MATERIAL ( L L C )', 'AL DAWAR ELECTRICAL MATERIAL ( L L C )',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-61.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-61.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-dawar-electrical-material-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'power-factor-electromechanical-works', 'POWER FACTOR ELECTROMECHANICAL WORKS', 'POWER FACTOR – established in 1993 and managed by a team of Experts, we have a reputation as UAE’s most reliable maintenance company. We are committed to',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-60.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-60.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/power-factor-electromechanical-works/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'royal-parco-supermarket', 'Royal Parco Supermarket', 'Royal Parco Supermarket',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-59.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-59.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/royal-parco-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'lims-super-market-llc', 'LIMS Super Market LLC', 'Ours is one of the fastest growing business houses in the whole of Dubai and we have ventured into a number of diverse industries like food and beverage,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-45.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-58.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lims-super-market-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'alshamssupermarket', 'Alshamssupermarket', 'Al Shams supermarket',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-57.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-57.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alshamssupermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'alazher-supermarket', 'Alazher supermarket', 'Al Azher Supermarket',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-56.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-56.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alazher-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'dar-al-amanah-supermarket', 'DAR AL AMANAH SUPERMARKET', 'DAR AL AMANAH SUPERMARKET',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-55.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-55.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dar-al-amanah-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'classic-equipment-trading-co-llc', 'Classic Equipment Trading Co LLC', 'Classic Equipment Trading Co LLC',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-14-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-14-3.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/classic-equipment-trading-co-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'green-hypermarket-l-l-c', 'GREEN HYPERMARKET L.L.C', 'GREEN HYPERMARKET L.L.C',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-54.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-54.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/green-hypermarket-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'fresh-spot-supermarket-llc', 'Fresh Spot Supermarket LLC', 'Fresh Spot Supermarket LLC',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T155552.808.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T155552.808.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fresh-spot-supermarket-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'tawreed-al-madina-supermarket', 'Tawreed Al Madina Supermarket', 'Al Madina Group was established in 1971 to fulfil the market needs for high quality retail solutions. From the rarest foods to the freshest produce, we',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/main-qimg-8b332640caa4ce32c2b477db1aa682f0-lq.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/main-qimg-8b332640caa4ce32c2b477db1aa682f0-lq.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/tawreed-al-madina-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'village-supermarket', 'Village Supermarket', 'Founders Nick and Perry Sumas immigrated to the United States from Greece. The brothers started working at a produce stand in South Orange, New Jersey shortly',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T154731.674.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T154731.674.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/village-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'wadi-al-baraka-supermarket', 'Wadi Al Baraka Supermarket', 'Wadi Al Baraka Supermarket',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T154314.488.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T154314.488.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/wadi-al-baraka-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'istanbul-supermarket-llc', 'Istanbul Supermarket LLC', 'What started in 1988 as a small warehouse doubling as a shop has now evolved into a leading chain of 16 supermarkets across the UAE.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-53.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-53.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/istanbul-supermarket-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'k-k-supermarket', 'K.K Supermarket', 'K.K Supermarket',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T152938.945.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T152938.945.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/k-k-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'al-faal-supermarket', 'Al Faal Supermarket', 'Al Faal Supermarket',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Al-Faal-General-Trading-LLC.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T152402.412.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-faal-supermarket/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'nirvana-travel-tourism', 'Nirvana Travel & Tourism', 'Nirvana was founded in 2007 with the paramount goal of providing its clientele with an unrivaled level of care and elevating travel and hospitality to new',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-52-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-52-1.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/nirvana-travel-tourism/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'saadi-travel-tourism-l-l-c', 'Saadi Travel & Tourism L.L.C', 'Talent Travel & Tourism LLC” based in Dubai mainly focused into the travel and tourism Industry, we are a one stop shop for all travel concierge services,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-51.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-51.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/saadi-travel-tourism-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'talent-travel-tourism-llc', 'Talent Travel & Tourism LLC', 'Talent Travel & Tourism LLC” based in Dubai mainly focused into the travel and tourism Industry, we are a one stop shop for all travel concierge services,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logo-37.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-50.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/talent-travel-tourism-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'alrihla-global-tours', 'ALRIHLA GLOBAL TOURS', 'Rihlatravel is an attempt in providing comprehensive travel experiences. Travel has always been a factor of risk and uncertainty. Travel needs thorough study',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-49.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-49.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alrihla-global-tours-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'jaxa-chartered-accountants', 'Jaxa Chartered Accountants', 'JAXA Chartered Accountants (FTA approved Tax Agent) is an ISO 9001-2015 certified firm of experienced Chartered Accountants, Auditors and Tax Specialists',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-48.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-48.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jaxa-chartered-accountants/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'excellence-auditing-business-consultants', 'Excellence Auditing & Business Consultants', 'Excellence is a registered trademark of Excellence Group, established in 2015 and located in the business hub of the world - Dubai, United Arab Emirates.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-47.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-47.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/excellence-auditing-business-consultants/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'msi-alnoman-ravi-chartered-accountants', 'MSI Alnoman & Ravi Chartered Accountants', 'MSI Auditors is an award-winning & experienced audit firm with over 3 decades of auditing experience and expertise, making us one of the pioneering audit',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-46.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-46.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/msi-alnoman-ravi-chartered-accountants/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'trc-pamco-middle-east', 'TRC PAMCO Middle East', 'TRC PAMCO Middle East is a sector-neutral boutique consulting firm that provides a wide array of Accounting, Auditing, Management Consulting & Advisory',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-45.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-45.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/trc-pamco-middle-east/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'trc-pamco-middle-east', 'TRC PAMCO Middle East', 'With professional CAs and MBAs working around the clock and building long-term relationships with our clients and delivering what we promise, Petra',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-44.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-44.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/trc-pamco-middle-east-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'emke-group', 'EMKE GROUP', 'LULU GROUP INTERNATIONAL (LuLu Group) is a highly diversified conglomerate with successful business entities in strategic locations worldwide. Founded by the',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T122758.154.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T122758.154.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/emke-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sun-group-international', 'SUN GROUP INTERNATIONAL', 'The origins of SUN Group lie in the business activities of the Khemka family dating back to the 1900s. Comprising both operating and investment companies, SUN',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-43.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-43.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sun-group-international/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'buimerc-corporation', 'Buimerc Corporation', 'Buimerc Corporation Ltd, headquartered in Dubai, is an investment company that identifies and invests in a range of quality asset classes, including firms',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-42.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-42.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/buimerc-corporation/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'athena-education', 'ATHENA EDUCATION', 'Founded in 2015, Athena Education is a prominent K-12 educational group, based in Dubai, United Arab Emirates. Currently operating 9 schools – 5 in Dubai and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T121819.977.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T121819.977.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/athena-education/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'nts-group-of-companies', 'NTS GROUP OF COMPANIES', 'Which began its journey under the prestigious ownership of Dr Francis Cleetus – an innovative and creative industrialist from India. NTS Group is established',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-41.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-41.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/nts-group-of-companies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'royal-palace-group-of-companies', 'ROYAL PALACE GROUP OF COMPANIES', 'We, Excellence Global FZC LLC, have great pleasure in announcing our Reference Book Projects featuring non-resident Malayalis in various countries in the',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logo-uae.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-40.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/royal-palace-group-of-companies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'uhy-james-chartered-accountants', 'UHY James Chartered Accountants', 'Led by a team of financial experts in leadership roles carrying over 200+ years of experience, UHY James (Chartered Accountants and Advisory LLC) is a leading',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T115453.756.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T115453.756.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/uhy-james-chartered-accountants/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ibmc-financial-professional-group', 'IBMC FINANCIAL PROFESSIONAL GROUP', 'IBMC FINANCIAL PROFESSIONAL GROUP',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T114917.829.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T114917.829.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ibmc-financial-professional-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'safety-marine-services', 'Safety Marine Services', 'The Safety Services Group was established in 1993 with the merger of Safety Marine Services - Sharjah, U.A.E., Safety Audit Services - United Kingdom and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-39.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-39.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/safety-marine-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'blastline-llc', 'BLASTLINE LLC', 'Founded in October of 1991 and based in Dammam, Saudi Arabia, Al-Humaidi Est. is a trusted marketplace for all industrial protective coating equipment and',
    '+971517670117', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/12112016051767011744195424.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/12112016051767011744195424.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/blastline-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'elite-group-of-companies', 'Elite Group of Companies', 'In a span of a decade, Elite Group of Companies has grown from being a single company to a conglomerate with businesses dealing with architectural and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T113423.864.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T113423.864.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/elite-group-of-companies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'kj-auto-spare-parts-co-llc', 'KJ AUTO SPARE PARTS CO. LLC.', 'K J Auto Spare Parts Co LLC, established in 1994 by Mr. Raman Kutty Jayaram, is now one of the largest Private Sector enterprises in UAE and Oman. The',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T113052.886.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T113052.886.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kj-auto-spare-parts-co-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'libertyprintingpress', 'Libertyprintingpress', 'Liberty Printing Press is one of the leading print solution companies in the Middle East integrating a design studio, offset printing press, screen printing',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T112657.743.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T112657.743.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/libertyprintingpress/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'dhanya-group-of-companies', 'Dhanya Group of Companies', 'Dhanya Group was established in 1982, under the able leadership of Mr. John Mathai.Headquartered in Sharjah, U.A.E, we have an extensive network across the',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-38.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-38.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dhanya-group-of-companies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-amani-tvr-group', 'Al Amani TVR Group', 'Al Amani TVR Group',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T111958.412.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T111958.412.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-amani-tvr-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'dafoos-group', 'DAFOOS GROUP', 'DAFOOS Fire & Security was incorporated in 1988 by Mr PCS Pillai and today is one of market leaders in the Fire Protection Industry in United Arab',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/3-13-164862492158.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/3-13-164862492158.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dafoos-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'malsons-trading-co-little-rose', 'Malsons Trading Co( Little Rose)', 'Malsons Trading Co( Little Rose)',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-36.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-36.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/malsons-trading-co-little-rose/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'century-glass-llc', 'Century Glass LLC', 'Founded in 1977 by Frank Tiano, Century Glass is a family-run business proudly supplying exceptional work to the greater Boston area. From day one, our',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-35.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-35.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/century-glass-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'inframe-productions-l-l-c', 'INFRAME PRODUCTIONS L.L.C', 'INFRAME PRODUCTIONS L.L.C',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/17032016072226838_blobpng.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-34.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/inframe-productions-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'client-advertising', 'Client Advertising', 'Client Advertising is a total solution system that offers its clients the most effective and efficient means to reach their customers. Intrinsic to our name',
    '+971520171130', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-33.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-33.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/client-advertising/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'creative-group', 'Creative Group', 'Our goal is to serve our client with utmost professionalism, respect & provides highest quality of service with competitive market rates. If you ar e',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-6.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-6.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/creative-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'vista-eco-solutions', 'Vista Eco Solutions', 'Welcome to Vista Eco Solutions, your trusted partner in Solar PV Energy Solutions. As a leading EPC (Engineering, Procurement, and Construction) solar energy',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-14-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-14-2.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/vista-eco-solutions/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'ikon-advertising-marketing-services-fz-llc', 'Ikon Advertising & Marketing Services FZ LLC', 'IKON ADVERTISING & MARKETING SERVICES FZ LLC',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-32.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-32.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ikon-advertising-marketing-services-fz-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'shotokan-karate-club-jka-dubai', 'SHOTOKAN KARATE CLUB (JKA DUBAI)', 'An Internationally known organization, was established in Dubai, UAE in 2011. Our organization is member of Japan Karate Association (JKA UAE). Approved by',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-13-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-13-3.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/shotokan-karate-club-jka-dubai/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'ias-media', 'IAS MEDIA', 'IAS Media stands as a leading media entity based in the vibrant landscape of UAE-Dubai. Our commitment lies in providing diverse media solutions that propel',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T101925.789.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T101925.789.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ias-media/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'kairali-kalakendram', 'Kairali Kalakendram', 'The Asha Sharath Kairali Kalakendram is a school of performing and visual arts committed to nurturing, teaching, staging and promoting traditional Indian',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/about-1-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/about-1-677x1024.jpg',
    'Qusais-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kairali-kalakendram/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'planworks-communications', 'Planworks Communications', 'Planworks offer a design-led service to clients, looking for a creative team who can respond to their individual requirements. Our 360 degree turnkey design',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T101310.941.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T101310.941.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/planworks-communications/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'star-al-manaal-tourism-llc', 'Star Al Manaal Tourism LLC', 'Enjoy an evening onboard our Canal Dhow Cruise with views of the Dubai skyline and Burj Khalifa, the worlds’ tallest building from the newly opened Dubai Canal.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-12-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-12-3.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/star-al-manaal-tourism-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'chemistry-advertising', 'Chemistry Advertising', 'advertising and marketing. it''s the combined form of bringing success to boost a brand, whatsoever and we are chemistry advertising who believes in the',
    '+97142506179', 'info@chemistryadvertisingme.com', 'https://www.chemistryadvertisingme.com/Default.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-31.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-31.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/chemistry-advertising/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'metro-auto-maintenance-workshop-llc', 'Metro Auto Maintenance Workshop LLC', 'Metro Auto Maintenance workshop specializes in vehicle repair & servicing in Sharjah, United Arab Emirates. Over 2 decades of serving the region with',
    '+97165441095', 'metroamw@emirates.net.ae', 'http://www.metroamw.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/003.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/003.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/metro-auto-maintenance-workshop-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-mansoori-garage', 'Al Mansoori Garage', 'Aravind Nair is the managing director of Al Mansoori Garage, which provides expert and re- liable auto-care services for all makes and models of vehicles. The',
    '+97142858359', 'garage@eim.ae', 'https://www.instagram.com/almansoorigarage/?igshid=NTc4MTIwNjQ2YQ',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/GP-Banner-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/GP-Banner-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-mansoori-garage/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-amani-spare-parts-llc', 'Al Amani Spare Parts LLC', 'Germanparts.ae is owned by Naser Mohsin Auto Spare Parts LLC. Based out of Abu Dhabi, Naser Mohsin Auto Spare Parts LLC commenced operations in 2006 and now',
    '+971544041836', 'sales@germanparts.ae', 'https://germanparts.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T094926.320.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T094926.320.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-amani-spare-parts-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'bin-dasmal-group', 'Bin Dasmal Group', 'Bin Dasmal Group is a forty-year Group of Companies founded and headed by Mr. Khalifa Abdulla Bin Dasmal, headquartered in Dubai.',
    '+97143380111', 'bindasmalgroup@bindasmal.com', 'https://www.bindasmal.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Banner-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/Banner-3.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bin-dasmal-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-alwan-al-sehriah-auto-paint-trading', 'Al Alwan Al Sehriah Auto Paint Trading', 'Twitter',
    '+97165323881', 'dasautoservices@gmail.com', 'https://aiwa.ae/company/Das-Auto-Services-LLC',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/17052017042210260_dasjpg.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-26T094007.214.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-alwan-al-sehriah-auto-paint-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'arabian-travel-agency', 'Arabian Travel Agency', 'Having served the country for over four decades, we have evolved into a company providing complete travel solutions, ranging from simple flight bookings to',
    '+97165047333', 'info@atauae.com', 'http://atauae.com/index.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/bg-home-c3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/bg-home-c3.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/arabian-travel-agency/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-hind-travels', 'Al Hind Travels', 'Alhind Tours & Travels Pvt. Ltd. is the leading travel company with strong presence in India and overseas. In GCC countries, we operate with the tradename',
    '+9714952389900', 'b2c@alhindonline.com', 'https://www.alhind.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-30.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-30.jpg',
    'Ras Al Khaimah', 'ras_al_khaimah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-hind-travels/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'yo-nuts', 'Yo Nuts', 'Yo! Nuts is a young brand in UAE that brings Chocolates, Candies, Nuts, Dried Fruits and many more',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/yonuts.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1nuts.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/yo-nuts/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'emerald-decor-works-llc', 'Emerald Decor Works LLC', 'Emerald Decor Works LLC is a full-service interior design company located in Ajman, specializing in both residential and commercial design. Whether you need a',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1-2.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/emerald-decor-works-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'starling-eye', 'Starling Eye', 'Starling Eye is a company designed by UAE-based trendsetters in telematics. We are an emerging name in the field of security and surveillance, Gps tracking',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/starling-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/starling-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/starling-eye/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'highline-training-and-educations', 'Highline Training and Educations', 'Highline Training & Education Group is a reputed Training and education provider in the UAE since 2001. We started our operations as a Best Education',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logo-highline.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-5.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/highline-training-and-educations/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'universal-martial-arts-academy', 'Universal Martial Arts Academy', 'We offer training for both adults and children of any age group in Karate, Kung Fu, Wushu, Kalaripayattu, and Judo. We help you to develop your skills in any',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/590x375-1696332556_8b76efc5a74f22a8c2cd.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-11-5.jpg',
    'Karama-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/universal-martial-arts-academy/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'al-kanz-fitness', 'AL KANZ FITNESS', 'Welcome to Al Kanz Fitness Gym, a treasure trove of health and vitality captured in just 100 words. Our gym is dedicated to empowering individuals on their',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1690189009_b9147f4e30b9ebba6724.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1690189009_b9147f4e30b9ebba6724-1024x683.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-kanz-fitness/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'kalabhavan-sharjah', 'Kalabhavan Sharjah', 'Kalabhavan is a rich promise to the cultural revival of the country. Kalabhavan stands for the promotion of cultural talents, on a scale never before',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-5.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-5.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kalabhavan-sharjah/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'prime-express', 'Prime Express', 'Prime Express International Courier is a premier company offering local, national and international courier services and has offices worldwide.',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/prime1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/prime1.jpg',
    'Karama, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/prime-express/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-thiqah-aman-tours', 'Al Thiqah Aman tours', 'Al Thiqah Aman tours is a trusted travel agency in Sharjah. We are one of the top Tourism companies in UAE. Since 2017 Al Thiqah Aman tours stepping ahead of',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/thigah-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/thigah-1.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-thiqah-aman-tours/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'vision-institute', 'Vision Institute', 'About Vision We are one of the leading Educational and Training Institutes in UAE. We offer training from various industries like Language, IT,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10-4.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/vision-institute/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'flex-facility-management-llc', 'FLEX FACILITY MANAGEMENT LLC', 'Facility management is a crucial aspect of modern-day businesses. It encompasses a wide range of services that aim to ensure the smooth operation of physical',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/facility.webp', 'https://malayalibusiness.com/wp-content/uploads/2024/02/facility.webp',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/flex-facility-management-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'austin-academy', 'Austin Academy', 'We are one of the leading Educational and Training Institute for executives in Dubai .We offer training from various industries like Administration,',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-9-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-9-3.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/austin-academy/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'oscar-institute', 'OSCAR INSTITUTE', 'OSCAR INSTITUTE was started in 1993 by Mr. K.P. Paulose to impart training in Information Technology, Languages & Secretarial Practice. Now we offer',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-8-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-8-3.jpg',
    'Al Rigga-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/oscar-institute/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'funbooth', 'Funbooth', 'Stay in the loop with Funbooth’s latest news and updates. Our engaging blog is your go-to source for all things fun and entertaining. From event planning tips',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7-4.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/funbooth/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'yathiq-businessmen-service', 'YATHIQ Businessmen Service', 'YATHIQ Businessmen Service',
    '+971585899131', 'yathiqdcs@gmail.com', 'https://local.infobel.ae/AE100598538/yathiq_marketing_services_est-dubai.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-29.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-29.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/yathiq-businessmen-service/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hussain-al-shemsi-chartered-accountants', 'Hussain Al Shemsi Chartered Accountants', 'Our team consist of professionals which includes one of the best groups of Chartered Accountants in UAE who is confident and equipped with appropriate skills',
    '+97167479800', 'mandapathil@gmail.com', 'https://www.halsca.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T224515.898.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T224515.898.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hussain-al-shemsi-chartered-accountants/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'najma-consultancy-hr-training-consultancy-dubai', 'Najma Consultancy | HR & Training Consultancy Dubai', 'It gives us immense pleasure to introduce ourselves as one of the leading Occupational, Training, and Human Resources Consultancy in UAE. Established in 1997',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-6-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-6-4.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/najma-consultancy-hr-training-consultancy-dubai/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'tass-hamjit-financial-advisory-llc', 'Tass & Hamjit Financial Advisory LLC', 'We are a multi service firm offering broad range of services in assurance (audit), advisory (consulting) , compliance, tax and legal domains. We predominantly',
    '+971581004046', 'uae@tasshamjit.com', 'https://www.tasshamjit.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T224114.367.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T224114.367.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/tass-hamjit-financial-advisory-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'dr-it-fixing', 'Dr.IT Fixing', 'Our laptop doctor is here to help you take care of your MacBooks and iMacs. We know that when it comes to laptops, there’s a lot to think about and we’re here',
    '+971507823018', 'harikrn1122@gmail.com', 'https://dritfixing.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/FrD-2.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/FrD-2.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dr-it-fixing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'engage-sports-arena', 'Engage Sports Arena', 'Engage Sports Arena is founded by JB in 2014, with the high aim of making people healthy and making sports their hobby. Jamal Backer is an enthusiastic and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-3-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-3-3.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/engage-sports-arena/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'indian-social-centre-ajman', 'Indian Social Centre Ajman', 'Indian Social Centre Ajman is an established UAE-based socio-cultural association of Non-Resident Indians in Ajman.',
    '+971526993225', 'jassim@me.com', 'https://www.facebook.com/iscajman/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T223326.032.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T223354.917.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/indian-social-centre-ajman/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'alrihla-global-tours', 'ALRIHLA GLOBAL TOURS', 'ALRIHLA GLOBAL TOURS',
    '+971581672333', 'info@rihlatravel.com', 'https://www.rihlatravel.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T223027.184.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T223027.184.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alrihla-global-tours/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'al-mihad-training-center', 'Al Mihad Training Center', 'Al Mihad Training Centre is a division of Al Mihad Education Group which was established in 1997 in Dubai. Since its inception, it has been striving to offer',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-14-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-14-1.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-mihad-training-center/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'le-vrai-perfumes', 'Le Vrai Perfumes', 'Le Vrai Perfumes',
    '+971581450097', 'ramsidkthnv@gmail.com', 'https://facebook.com/levraiperfumes/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T222730.524.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T222730.524.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/le-vrai-perfumes/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'clazziq-building-materials-trading', 'CLAZZIQ BUILDING MATERIALS TRADING', 'Clazziq INC is a highly skilled door hardware company having comprehensive line of door hardware including lever handles, locks, exit devices, door closers,',
    '+13055069084', 'vincent@clazziq.com', 'https://clazziq.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T222251.299.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T222251.299.jpg',
    'Wingecarribee Shire Council, New South Wales, Australia', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/clazziq-building-materials-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sky-lark-shipping', 'SKY LARK SHIPPING', 'Welcome to the alluring and extremely fascinating world of Skylark Shipping LLC. We have established ourselves as a prominent shipping company by providing',
    '+97143970828', 'skylarkshipping@gmail.com', 'https://skylarkshipping.com/about.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-28.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-28.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sky-lark-shipping/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'delta-grace-heavy-machines-repairing', 'DELTA GRACE HEAVY MACHINES REPAIRING', 'DELTA GRACE HEAVY MACHINES REPAIRING was established in 2019',
    '+971517670117', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2-1-520x86.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2-1-520x86.png',
    'Sanaya-Abudhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/delta-grace-heavy-machines-repairing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'lapadma-wellness', 'LaPadma Wellness', 'La Padma',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-13-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-13-2.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lapadma-wellness/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'globallogistics', 'Globallogistics', 'In 2006 the young and energetic team comprising of Mr. Asif Mujawar, Mr. Jiss Mathew and Mr. Naveen Prakash, established Global Logistics with the vision to',
    '+912267757000', 'info@globallogistics.co.in', 'https://globallogistics.co.in/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-27.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-27.jpg',
    'india', 'ras_al_khaimah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/globallogistics/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'dr-shyams-ayurvedic-centre', 'DR SHYAMS AYURVEDIC CENTRE', 'The story of Ayurveda, the Science of Life, draws its concepts and practices from the Vedas, which is five thousand years of wisdom distilled into a system of',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-12-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-12-2.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dr-shyams-ayurvedic-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'colourzone', 'Colourzone', 'Colourzone was founded in the year 2003 specializing in high end decorative paint finishes. Through the years colourzone expanded its services to cover all',
    '+971523635208', 'info@colourzones.com', 'https://colourzones.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/ColourZone-Women-Lead.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/ColourZone-Women-Lead.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/colourzone/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'beefurb', 'Beefurb', 'We lead the charge in innovation, delivering affordable devices worldwide through the art of refurbishment. Our commitment to quality knows no bounds, and our',
    '+971539140313', 'office@example.com', 'https://www.beefurb.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-4-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-4-3.jpg',
    'Karama-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/beefurb/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'jezara-furniture-upholstery', 'Jezara Furniture Upholstery', 'Jezara Furniture Upholstery Based in UAE, last 32 years we are in the market, our prime focus and forte are to provide superior quality furnishings solutions',
    '42636936', 'sp94472@gmail.com', 'https://www.yellowpages.ae/sellers/jezara-furniture-upholstery',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T215903.361.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2024-02-25T215903.361.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jezara-furniture-upholstery/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'shorin-ryu-karate-centre', 'Shorin Ryu Karate Centre', 'he Shorin Ryu Karate Academy teaches traditional Matsubayashi Shorin Ryu karate and and its practical application in self-defense contexts. We also seek to',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-4-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-4-2.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/shorin-ryu-karate-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'family-super-market-mobile-sales-and-service', 'Family super market mobile sales and service', 'Family super market mobile sales and service',
    '+971566653673', 'sp94472@gmail.com', 'https://www.facebook.com/familiesmankhool/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-100.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-100.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/family-super-market-mobile-sales-and-service/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'explore-education', 'Explore Education', 'Explore Education was conceptualized in 2015 keeping in mind the growing need of specialist and professionals in every industry. As one of the leading',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1-1.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/explore-education/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'amber-ventures-trading-llc', 'Amber Ventures Trading LLC', 'Amber Ventures Trading LLC',
    '+97143279988', 'ramesh@majestea.in', 'http://ambervt.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-99.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-99.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/amber-ventures-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'jas-dubai', 'JAS DUBAI', 'It is with great pleasure that I welcome you to our school; one of Dubai’s happiest, oldest, and most successful schools. We opened our doors for the first',
    '+97148846485', 'kannankara999@gmail.com', 'https://jebelalischool.org/discover-jas/welcome/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-98.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-98.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jas-dubai/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'sindin-management-training-institute', 'Sindin Management Training Institute', 'SINDIN Management Training Institute Dubai is a UAE''s largest & leading The SMTI Dubai was established by a group of professionals, industry experts and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-4.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sindin-management-training-institute/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'silver-star-karate-sharjah', 'Silver Star Karate Sharjah', 'Silver Star Karate Center, Sharjah is a thriving Fitness training centre approved by UAE Karate Federation and Ministry of Youth and Sports UAE. We are',
    '+971532208802', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10-3.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/silver-star-karate-sharjah/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'gulf-ark-international-llc', 'Gulf Ark International LLC', 'UAE is a fast-growing market especially in the area of fresh food products, production, distribution and marketing. Dubai has set high standard of economic',
    '+971564038700', 'gulfarkinfo@gmail.com', 'https://www.linkedin.com/company/gulf-ark-international-llc-dubai/?originalSubdomain=ae',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-96.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-97.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/gulf-ark-international-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ocean-fair-international-group-fze', 'Ocean Fair International Group FZE', 'OFI’s ever-growing client base and longstanding partnerships are a true testament to its ongoing pursuit of delivering superior value to customers. With over',
    '+97148217444', 'operations@oceanfair.com', 'https://seavendors.com/item/ocean-fair-international-group-fze/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-95.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-95.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ocean-fair-international-group-fze/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'crown-dental-lab', 'Crown Dental Lab', 'Crown Dental Lab is a dental laboratory based in UAE & INDIA with over 20+ years of experience in the industry and well established reputation for quality',
    '+97167443852', 'crownlabajman1@yahoo.com', 'https://crowndentallabintl.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-93.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-25.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/crown-dental-lab/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'minerva-diagnostic-lab', 'Minerva Diagnostic Lab', 'Neuberg Diagnostics (Middle East) Laboratory is an established medical reference laboratory, operational in Dubai since September 2008. This laboratory has',
    '+97143343727', 'nml.customercare@neubergdiagnostics.com', 'https://neubergdiagnostics.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-92.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-92.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/minerva-diagnostic-lab/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'mampilly-medical-centre', 'MAMPILLY MEDICAL CENTRE', 'Sharjah''s Trusted Medical Center',
    '065616464', 'info@mampillymc.com', 'https://mampilly-medical-center.business.site/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-24.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-24.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mampilly-medical-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'abrahams-medical-centre', 'Abrahams Medical Centre', 'Abrahams Medical centre is a fully accredited Medical Centre with its standards of medical care approved by the Ministry of Health, U.A.E. It has a team of',
    '+971509345595', 'receptionabrahams@gmail.com', 'https://abrahamsmedical.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/depositphotos_63732323-stock-photo-laptop-with-medical-diagnostic-software.webp', 'https://malayalibusiness.com/wp-content/uploads/2024/02/depositphotos_63732323-stock-photo-laptop-with-medical-diagnostic-software.webp',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/abrahams-medical-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'shanthi-medical-centre', 'Shanthi Medical Centre', 'Shanthi Medical Centre',
    '+971553438055', 'shanthmed@gmail.com', 'https://www.okadoc.com/en-ae/clinic/sharjah/dr-shanthi-medical-centre',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/thumb1_22.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-23.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/shanthi-medical-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'kerala-ayurvedic-center-llc', 'Kerala Ayurvedic Center LLC', 'Best Ayurvedic Clinic In Dubai Health is not merely a matter of the state of the body, since it is obvious that we are much more than just this material form.',
    '+97143966630', 'info@kacdubai.com', 'https://www.keralaayurvedicdubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-22.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-22.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kerala-ayurvedic-center-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'al-shifa-ayurvedic-treatment-centre', 'Al Shifa Ayurvedic Treatment Centre', 'Al Shifa Ayurvedic Treatment Centre opened its doors in 1992 in Ajman, UAE, and soon gained a reputation as UAE’s one of the best wellness clinics. The center',
    '+97167408646', 'info@alshifaayurveda.ae', 'https://www.alshifaayurveda.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-21.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-21.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-shifa-ayurvedic-treatment-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'ideal-medical-center', 'Ideal Medical Center', 'Ideal Medical Center',
    '026224611', 'id_clinic@hotmail.com', 'https://www.facebook.com/IdealMedicalCentre/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-20.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-20.jpg',
    'Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ideal-medical-center/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'primacare-speciality-clinic', 'Primacare Speciality Clinic', 'We dedicate ourselves to achieve excellence in healthcare ensuring utmost attention, medical and personal care for the patien',
    '+97143966123', 'info@primacare-clinics.com', 'https://primacare-clinics.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-89.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-89.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/primacare-speciality-clinic/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'healers-medical-center-llc', 'Healers Medical Center LLC', 'Our aim is to provide medical care in most pleasant and simplified way. We take our best efforts to explain and educate you about your medical condition and',
    '+971563726565', 'hmcappointments@gmail.com', 'http://healersmedical.com/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-88.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-88.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/healers-medical-center-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'allied-medical-center', 'Allied Medical Center', 'Allied Medical Center (AMC) Dubai, formerly known as Allied Diagnostics, was established in 1997 and pioneered the development of free-standing multi-modality',
    '800255433', 'info@alliedmedicalcenter.net', 'https://www.alliedmedicalcenter.net/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/depositphotos_69170339-stock-photo-smart-medical-doctor-hand-showing.webp', 'https://malayalibusiness.com/wp-content/uploads/2024/02/depositphotos_69170339-stock-photo-smart-medical-doctor-hand-showing.webp',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/allied-medical-center/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'info-smcdubai-com', 'info@smcdubai.com', 'Dr Sirajudeen Medical Centre (DSMC) has been serving people from all walks of life for almost 3 decades with exceptional health care. With eminent doctors',
    '+97143345955', 'info@smcdubai.com', 'https://smcdubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/maxresdefault.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/maxresdefault.jpg',
    'Karama, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/infosmcdubai-com/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'apollo-medical-centre-llc', 'Apollo Medical Centre LLC', 'Apollo Medical Centre was born out of a desire to provide cost-effective yet specialized and superior quality healthcare services to the growing population of',
    '+97126397733', 'apollomedicalcenter@gmail.com', 'https://apollogulf.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/slider-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/slider-1-1024x700.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/apollo-medical-centre-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'dr-jasna-s-ayurveda-clinic-treatment-center', 'Dr Jasna’s Ayurveda Clinic & Treatment Center', 'Dr Jasna''s Ayurveda Clinic is an Ayurvedic Clinic In Bur Dubai that providing Traditional Ayurvedic healing therapies in a comfortable holistic and natural',
    '+971554009339', 'info@drjasnasayurveda.com', 'https://www.drjasnasayurveda.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-87.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-87.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dr-jasnas-ayurveda-clinic-treatment-center/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'reef-car-rental', 'Reef car rental', 'Reef Car Rentral',
    '+971502423551', 'imthiyasc@gmail.com', 'https://reefcars.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Website_landing_page_3000X1300_EN-v2.jpg.ximg_.l_full_m.smart_.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/Website_landing_page_3000X1300_EN-v2.jpg.ximg_.l_full_m.smart_.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/reef-car-rental/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'jbg-group', 'JBG Group', 'Since its founding in United Arab Emirates in 2015, JBG Technical Services LLC has become the leading company of Interior Fit Out in United Arab Emirates and',
    '+97143446277', 'info@jbggroup.ae', 'https://www.jbggroup.ae/index.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-86.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-86.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jbg-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sitespower-technical-services-l-l-c', 'Sitespower Technical Services L. L. C', 'Sitespower Technical Services L. L. C0',
    '+97142955360', 'sitespowerae@gmail.com', 'https://connect.ae/profiles/dubai/sites-power-technical-service-(l.l.c)/profile-id=er0129788',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-85.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-85.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sitespower-technical-services-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hsjb-business-consulting', 'HSJB Business Consulting', 'Our performance management system is a result oriented approach developed by performance experts that provides organizations with a clear strategy and tactics',
    '+971547930095', 'deepesh@hsjbglobal.com', 'https://hsjbglobal.com/best-business-consultancy-in-kerala-contact/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-84.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-84.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hsjb-business-consulting/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'designs-of-planet-earth-adv-llc', 'Designs Of Planet Earth Adv LLC', 'At Designs Of Planet Earth, we believes that strategic thinking and compelling creative provides meaningful journeys and eﬃcient outcome. Our focus is to',
    '42636936', 'vidhu@itzdope.com', 'https://www.linkedin.com/in/designs-of-planet-earth-212753205/?originalSubdomain=ae',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1612106687480.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1612106687480.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/designs-of-planet-earth-adv-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'lotus-flowers-trading-llc', 'Lotus Flowers Trading LLC', 'Lotus Flowers Trading LLC',
    '+971588809162', 'naishndkm@gmail.com', 'https://www.instagram.com/lutos_flowers_tr_llc/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-82.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-83.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lotus-flowers-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'malabar-businessman-services-vat-consultancy', 'MALABAR BUSINESSMAN SERVICES & VAT CONSULTANCY', 'MALABAR BUSINESS MAN SERVICES & VAT CONSULTANCY',
    '+971502345360', 'mahbukp@gmail.com', 'https://malabarbusinessmanservices.business.site/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/2020-12-10.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/2020-12-10.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/malabar-businessman-services-vat-consultancy/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ideal-zone-business-setup', 'IDEAL ZONE BUSINESS SETUP', 'IDEAL ZONE BUSINESS SETUP',
    '+971588115599', 'connectaashiq@gmail.com', 'https://www.linkedin.com/company/idealzone/about/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-19.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-19.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ideal-zone-business-setup/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'sharjah-to-jebel-ali-carlift', 'Sharjah to Jebel Ali Carlift', 'Founded in 2015, SANS has become one of the leading passenger transportation company in UAE. SANS spread the seeds by providing passenger bus transportation',
    '+971508848270', 'sharjahjeb@gmail.com', 'https://sharjahtojebelalicarlift.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-80.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-80.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sharjah-to-jebel-ali-carlift/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'arafa-services', 'ARAFA SERVICES', 'ARAFA Services as a business offers two interconnected solutions as well as other related services. ARAFA Services is a specialised agency that offers temping',
    '+35627555254', '3419019@gmail.com', 'https://www.arafaservices.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/supermarket-worker-supplying-fruit-department-with-food.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/supermarket-worker-supplying-fruit-department-with-food.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/arafa-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'yadunandani-business-services', 'Yadunandani business services', 'YADUNANDANI BUSINESS SERVICE',
    '+917892158961', 'info@yadunandani.com', 'https://yadunandani.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-17.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-17.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/yadunandani-business-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ascentia-global-corporate-services-llc', 'Ascentia Global Corporate Services LLC', 'Forming a business isn’t as easy as it seems. People go through several tips and suggestions to ensure they set up or proceed with their businesses',
    '+97145682200', 'shiju@ascentiame.com', 'https://ascentiame.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-16.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-16.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ascentia-global-corporate-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'kulfichai', 'KULFICHAI', 'Don’t people deserve pure?',
    '+971556007362', 'minarwebstore@gmail.com', 'https://kulfichai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-78.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-78.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kulfichai/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'alrimh-al-thahabi-building-material-trading-llc', 'Alrimh Al Thahabi Building Material Trading LLC', 'AL RIMH a part of DADCO holdings was established and registered in 2015 with its main office located in Sharjah, U.A.E. As a group, we have witnessed',
    '+97165777783', 'shameer@alrimh.com', 'https://www.alrimh.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-77.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-77.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alrimh-al-thahabi-building-material-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ultimate-karate-centre', 'ULTIMATE KARATE CENTRE', 'Welcome to Uptown Karate Center, your premier destination for martial arts excellence in the heart of . Established with a passion for promoting traditional',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-4.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ultimate-karate-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'nimr-al-khaleej-karate', 'NIMR AL KHALEEJ KARATE', 'The Gulf Tiger Karate Centre was founded in Sharjah with the aim of promoting Martial Arts in Sharjah, Dubai and Major parts of UAE. Certified by the UAE',
    '+971539140313', 'office@example.com', 'https://www.gulftigerkarate.com/about-us',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/a1p.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/a1p.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/nimr-al-khaleej-karate/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'leads-education', 'Leads Education', 'In the globalization era we embrace all aspects of human diversity and value its necessity to ensure a vibrant working community. We are committed to',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-9-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-9-2.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/leads-education/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'aaa-middle-east', 'AAA Middle East', 'Emergency Roadside Assistance is exactly what the name implies – an Emergency service rendered by the official Arabian Automobile Association throughout UAE',
    '42636936', 'info@aaaemirates.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/aaaemirates_com__src_public_uploads_aboutus_5703fab602ce24f6a9e6042d8229d0ea2a42b952_png-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/aaaemirates_com__src_public_uploads_aboutus_5703fab602ce24f6a9e6042d8229d0ea2a42b952_png-1024x321.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aaa-middle-east-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'aaa-middle-east', 'AAA Middle East', 'Emergency Roadside Assistance is exactly what the name implies – an Emergency service rendered by the official Arabian Automobile Association throughout UAE',
    '42636936', 'info@aaaemirates.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/aaaemirates_com__src_public_uploads_aboutus_5703fab602ce24f6a9e6042d8229d0ea2a42b952_png-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/aaaemirates_com__src_public_uploads_aboutus_5703fab602ce24f6a9e6042d8229d0ea2a42b952_png-1024x321.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aaa-middle-east/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'minar-webstore', 'MINAR WEBSTORE', 'What’s unique about ships? Those big chunky pieces of metal floating around transporting goods and people around all the time? They have been vital to the',
    '+971539140313', 'office@example.com', 'https://minarwebstore.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/honeyshoot6456-copy-1536x1024-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/honeyshoot6456-copy-1536x1024-1.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/minar-webstore/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'day-dome-fitness-center', 'Day Dome Fitness Center', 'Suit yourself to various of services we are offering. You may choose to relax or indulge to extreme. Life is better with Daydome Fitness.',
    '42636936', 'info@daydome-fitness.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-8-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-8-2.jpg',
    'Qusais-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/day-dome-fitness-center/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'dalma-ayurvedic', 'Dalma Ayurvedic', 'We at Dalma Ayurvedic provide excellent Ayurveda treatments and it has a team of Doctors who strictly follows traditional methods and systems. We know the',
    '42636936', 'mail@dalmaayurvedic.com', 'https://www.dalmaayurvedic.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7-3.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dalma-ayurvedic/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'desert-ayurvedic-alternative-medicine-centre', 'Desert Ayurvedic Alternative Medicine Centre', 'Desert Ayurvedic Centre in the heart of Rolla having a decade of legacy in sharjah. We are having nexus with yoga and naturopathy and we are weaving',
    '42636936', 'info@desertayurveda.com', 'https://desertayurvedauae.com/about',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/actyoga_in__wp-content_uploads_2018_07_Logo-actyoga_png-1-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/actyoga_in__wp-content_uploads_2018_07_Logo-actyoga_png-1-1024x321.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/desert-ayurvedic-alternative-medicine-centre-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'desert-ayurvedic-alternative-medicine-centre', 'Desert Ayurvedic Alternative Medicine Centre', 'Desert Ayurvedic Centre in the heart of Rolla having a decade of legacy in sharjah. We are having nexus with yoga and naturopathy and we are weaving',
    '42636936', 'info@desertayurveda.com', 'https://desertayurvedauae.com/about',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/actyoga_in__wp-content_uploads_2018_07_Logo-actyoga_png-1-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/actyoga_in__wp-content_uploads_2018_07_Logo-actyoga_png-1-1024x321.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/desert-ayurvedic-alternative-medicine-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'act-yoga', 'ACT YOGA', 'Workshops | Teacher training Retreats | Group Yoga Classes | Individual Coaching and Counselling Teachings from traditional yoga texts. Asana, Pranayama,',
    '42636936', 'joinus@actyogafitness.com', 'https://actyoga.in/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-4-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-4-3.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/act-yoga/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'jfs-logistics', 'JFS Logistics', 'JFS logistics has rapidly emerged as a frontrunner in the Middle East''s logistics and supply chain management industry, excelling in various roles within this',
    '+97142521786', 'info@jfslogistics.com', 'https://jfslogistics.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-76.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-76.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jfs-logistics/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'global-accounting-practitioners-llc', 'Global Accounting Practitioners LLC', 'Your One Stop Solution for VAT and Accounting Services. Lead by a Chartered Accountant, we are a brand where you deal directly with experts. We are proud and',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/banner-m2.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/banner-m2.png',
    'Business Bay-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/global-accounting-practitioners-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'samawa-trading-co-l-l-c', 'Samawa Trading Co L.L.C', 'Samawa Trading Co L.L.C',
    '+97142277995', 'ebuy@samawaglobal.com', 'https://samawa.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-19-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-75.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/samawa-trading-co-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'metro-printing-press-ltd', 'Metro Printing Press LTD', 'Metro Printing Press LTD',
    '42636936', 'mzsons@emirates.net.ae', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-3-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-3-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/metro-printing-press-ltd/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'prestige-diesel-trading-llc', 'PRESTIGE DIESEL TRADING LLC', 'Prestige Diesel Trading ventured into fuel trading,  bunkering and recycling of petroleum products in UAE by founding its headquarters in Ajman in 2008.',
    '+971509900786', 'info@prestigedieseltrading.com', 'https://www.prestigedieseltrading.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-74.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-74.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/prestige-diesel-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'noor-al-hayat-tourism-llc', 'NOOR AL HAYAT TOURISM LLC', 'Embark on a journey where dreams take flight and memories become destinations. With Noor al Hayat Tourism , we don''t just offer trips; we curate experiences',
    '42636936', 'support@nooralhayattourism.com', 'https://nooralhayattourism.com/about/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-4.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/noor-al-hayat-tourism-llc-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'noor-al-hayat-tourism-llc', 'NOOR AL HAYAT TOURISM LLC', 'Embark on a journey where dreams take flight and memories become destinations. With Noor al Hayat Tourism , we don''t just offer trips; we curate experiences',
    '42636936', 'support@nooralhayattourism.com', 'https://nooralhayattourism.com/about/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-4.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-4.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/noor-al-hayat-tourism-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'silver-line-constrction-machinary-rental', 'Silver Line Constrction & Machinary Rental', 'Silver Line is one of the largest Rental Company serving to Construction, Marine Oil and Gas industry in All GCC coun tries. Since its inception nearly a',
    '+97145762626', 'infodubai@silverlinerental.com', 'https://silverlinerental.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-73.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-73.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/silver-line-constrction-machinary-rental/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'fajar-trading', 'FAJAR TRADING', 'Al Fajer Trading L.L.C, was established in the year 1973. Over the years Al Fajer Trading L.L.C has developed an excellent sourcing network and it represents',
    '+971433329853331095', 'info@fajerest.ae', 'https://fajerest.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-15.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-15.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fajar-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-shams-tours', 'AL SHAMS TOURS', 'Al Shams Tours is organized and managed by knowledgeable, reputable professionals from tourism industry. The services we render to the incoming tourists and',
    '42636936', 'info@alshamstours.com', 'https://www.alshamstours.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/a3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/a3.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-shams-tours/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sirajco-international-trading-llc', 'Sirajco International Trading LLC', 'Established in 1988, years of experience, sound infrastructure facility and highly experienced professionals and technicians, Siraj International Aluminium',
    '+97148878778', 'info@sirajinternational.com', 'https://sirajinternational.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-71.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-71.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sirajco-international-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'nikhil-remya-arts-centre', 'Nikhil & Remya Arts Centre', 'Nikhil & Remya Arts Centre',
    '42636936', 'info@nikhilandremya.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2-3.jpg',
    'Qusais-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/nikhil-remya-arts-centre/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'forum-group', 'Forum Group', 'Welcome to Forum Group, where ambition takes flight and success knows no boundaries. Imagine a constellation of thriving businesses, each illuminating a',
    '+97142221182', 'info@forumgroup.ae', 'https://www.forumgroup.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-70.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-70.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/forum-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'future-gulf-contracting', 'Future Gulf Contracting', 'Since first established in 2005, Future Gulf Contracting company has earned its name as most trustworthy quality service provider in the field of construction',
    '+9714251104041', 'info@fgcuae.com', 'http://fgcuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-14.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-14.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/future-gulf-contracting/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sahicon-group', 'SAHICON GROUP', 'Our operation since year 1992 under its parent companies and registered with Gov. Sector in India, its name as N.ALI Construction, N.M.S construction &',
    '+919479230044', 'info@sahicon.com', 'https://sahicon.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-69.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-69.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sahicon-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'hakadha-delivery-services', 'Hakadha delivery services', 'Hakadha delivery services',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-3.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/hakadha-delivery-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'bronet-group', 'BRONET GROUP', 'Bronet Group , Headquartered In The UAE With Its Diverse Portfolio, Operating Across 14 Countries In 3 Continents. Since Its Beginning As A Small Family',
    '+97142523475', 'info@bronetgroup.com', 'https://bronetgroup.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-13.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-13.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bronet-group-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'bronet-group', 'BRONET GROUP', 'Bronet Group , Headquartered In The UAE With Its Diverse Portfolio, Operating Across 14 Countries In 3 Continents. Since Its Beginning As A Small Family',
    '+97142523475', 'info@bronetgroup.com', 'https://bronetgroup.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-13.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-13.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bronet-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'bigmart', 'BIGMART', 'BIGmart is one of the largest hypermarket and supermarket chains in the UAE. The brand was launched in the region in 2007 as a family business, aiming to',
    '+97125512771', 'info@bigmart.ae', 'https://bigmart.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-68.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-68.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bigmart/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'medtech-turnkey-projects-contracting-co', 'Medtech Turnkey Projects Contracting Co', 'Welcome to Medtech – one of GCC’s leading suppliers of medical and laboratory equipment. We provide the world’s best medical & laboratory equipment’s as',
    '42636936', 'info@med-tech.com', 'https://medtechae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-67.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-67.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/medtech-turnkey-projects-contracting-co/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'vijo-fitness-and-lifestyle', 'VIJO FITNESS AND LIFESTYLE', 'We, VIJO FITNESS AND LIFESTYLE, with our main office in Dubai, is a growing Fitness Brand and a Team of certified Personal Trainers and Transformation',
    '+971586100154', 'info@vijofitness.com', 'https://www.vijofitness.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-65.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-66.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/vijo-fitness-and-lifestyle/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'lyon-shipping', 'Lyon Shipping', 'Welcome to Lyon Shipping, your premier destination for global transport and logistics solutions that prioritize exceptional service from start to finish. Our',
    '+971551085854', 'info@lyonshipping.com', 'https://lyonshipping.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-64.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-64.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lyon-shipping/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'star-freight-service-fzco', 'Star Freight Service FZCO', 'Star Freight finds its origins in 1995 as a small trucking and brokerage company called Logistics and Distribution Services through our Reno Trucking.',
    '7752043110', 'ops@starfs.com', 'https://starfs.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-12.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-12.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/star-freight-service-fzco/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'ech', 'ECH', 'First digital business setup company in the country established in 2016. Highly experienced team of professionals from 21 countries ,32 language speakers.',
    '+97142390790', 'ask@echuae.com', 'https://www.echuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-11.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-11.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ech/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'better-media', 'BETTER MEDIA', 'Better Media is a multi-disciplinary agency and Video Production Company in Dubai offering unique and distinctive marketing and branding solutions. Since',
    '+971567727257', 'info@betteradvdubai.com', 'https://betteradvdubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logowhite.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-63.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/better-media/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'avenue-professional-document-clearing', 'Avenue Professional Document Clearing', 'As a leader in the Public Relations sector in the GCC, Mr. Shafeeq Pothuva Chola has been providing top-notch document clearing services for the last eight',
    '+971544733708', 'info@avenueprofessional.com', 'https://www.avenueprofessional.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-10.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-10.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/avenue-professional-document-clearing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'abc-merchantile-fzco', 'ABC MERCHANTILE FZCO', 'ABC Group is dedicated to make the world a better place through innovative business and inspiring luxury living. Having the largest collection of',
    '+97148820073', 'info@abcmercantile.ae', 'https://www.abcgroupinternational.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-61.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-61.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/abc-merchantile-fzco/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'carbon-whale-sustainable-innovations-pvt-ltd', 'Carbon & Whale Sustainable Innovations Pvt.Ltd', 'Building and Construction',
    '+971539140313', 'join@carbonandwhale.com', NULL,
    NULL, NULL,
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/carbon-whale-sustainable-innovations-pvt-ltd/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'equator-travels', 'EQUATOR TRAVELS', 'Equator travel management is a leading tour based in dubai',
    '+971503778393', 'info@equatortravels.com', 'https://equatortravels.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-59.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-59.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/equator-travels/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'gcc-vision-events-management', 'GCC VISION EVENTS MANAGEMENT', 'We organize B2B Middle East Events & Exhibitions where you can meet and connect with a large number of businesses from the region. Our events are',
    '+971529974124', 'info@gccvisions.com', 'https://www.gccvisions.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-58.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-58.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/gcc-vision-events-management/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mvast-corporate-services', 'MVAST CORPORATE SERVICES', 'MVAST provides innovative and economical solutions for every stage and segment of a business, ensuring quality that ensures steady advancement and success. We',
    '+97147181080', 'info@mvastcsp.com', 'https://mvastcsp.com/about.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-56-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-56-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mvast-corporate-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'fixcare-technical-services', 'Fixcare Technical services', 'Air-Conditioning Ventilations & Air Filtration Systems Installation & Maintenance | Carpentry Workshop | Computer Network & Infrastructure',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-56.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-56.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fixcare-technical-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'rf-combine', 'RF Combine', 'Founded in 1984, RF Combine is a business conglomerate with a strong presence across food production, distribution, retail and hospitality.',
    '+971042585144', 'feedback@nellara.com', 'https://nellara.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-55.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-55.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rf-combine/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'eduglider', 'Eduglider', 'EduGlider is the best education consultant in UAE and a Official Partner of the British Council and Pearson''s, associated with top universities and colleges',
    '+971569933174', 'info@eduglider.com', 'https://eduglider.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/09/WhatsApp-Image-2024-06-13-at-11.18.47.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/09/WhatsApp-Image-2024-06-13-at-11.18.47.jpeg',
    'Dubai, United Arab Emirates', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/eduglider/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'legal-maxim-consultants-f', 'Legal Maxim Consultants F', 'Legal Maxims is known for offering superior legal solutions that are also proactive, practical, and economical. Our lawyers and Consultants have a wealth of',
    '+97142278125', 'mail@legalmaxims.com', 'https://www.legalmaxims.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-53.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-53.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/legal-maxim-consultants-f/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'royal-screen-electronics', 'ROYAL SCREEN ELECTRONICS', 'Royal Screen Electronics established in 2002, is an IT System Integration Company in UAE and has extended its portfolio to other GCC Countries in vertical of',
    '+97142248283', 'info@royalcreenuae.com', 'https://royalscreenuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-52-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-52-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/royal-screen-electronics/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-ras-typing-and-documents-clearing-al-ras-typing-and-documents-clearing', 'AL RAS TYPING AND DOCUMENTS CLEARING AL RAS TYPING AND DOCUMENTS CLEARING', 'AL RAS TYPING AND DOCUMENTS',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-52.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-52.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-ras-typing-and-documents-clearing-al-ras-typing-and-documents-clearing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'venus-hamba-restaurant', 'Venus Hamba Restaurant', 'Serving up the best taste in Udupi style cooking for over 30 years!',
    '+97143352113', 'venusgroupdxb@gmail.com', 'https://www.zomato.com/dubai/venus-hamba-restaurant-qusais',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-9.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-9.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/venus-hamba-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'gafoorka-s-thattukada', 'Gafoorka’s Thattukada', 'Gafoorkas Thattukada is a perfect place situated near Lulu Hypermarket Karama- Dubai to taste the best dishes, established as one of the most popular entrants',
    '+971568449000', 'info@gafoorkas.com', 'https://www.gafoorkas.com/about.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-8.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-8.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/gafoorkas-thattukada/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'milan-veg-restaurant', 'MILAN VEG RESTAURANT', 'Milan Veg Restaurant is a well known&reputed Vegetarian Restaurant located at Dubai serving 100% pure vegetarian food since 1986.',
    '+97142612050', 'restaurants@pasonsme.com', 'https://www.zomato.com/dubai/milan-vegetarian-restaurant-qusais',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-7.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-7.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/milan-veg-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'rainbow-hospitality', 'Rainbow Hospitality', 'Our first restaurant opened in 1978 and has since become one of the jewels of the U.A.E. We are an all-time favorite among the residents and tourists alike.',
    '+97165733925', 'info@rainbowhospitalityuae.com', 'http://rainbowhospitalityuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-6.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-6.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rainbow-hospitality/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'best-engineering', 'BEST ENGINEERING', 'Best Engineering was founded in 1994 and has since earned an outstanding reputation for excellence in Stainless Steel and other metal fabrication industry.',
    '+97165350287+97165350240', 'nfo@bestengineeringdubai.com', 'http://bestengineeringdubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/small_image.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/small_image.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/best-engineering/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'tekab-company-limited', 'TEKAB COMPANY LIMITED', 'TEKAB COMPANY LLC, part of GIBCA Group, was established in 1990, in U.A.E., as one of the leading manufacturers of Instrumentation, Control, Data Cables and',
    '+97165034900', 'general@tekab.com', 'https://www.tekab.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/thumb_firen.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/thumb_firen.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/tekab-company-limited/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'trillet-technical-services', 'Trillet Technical Services', 'Trillet Technical Services provides top-quality solutions in the cold chain industry, reputed as the most trusted refrigerated van and truck body',
    '+97120547139337', 'office@example.com', 'https://trillettech.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-30.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-30.jpg',
    'Jebel Ali-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/trillet-technical-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'pranavam-arts', 'Pranavam Arts', 'Learning Indian classical dance is impossible without the internal-improvement. This path is open to everyone and we would love to help not only to dance',
    '42636936', 'pranavamdance@gmail.com', 'https://www.pranavamdubai.com/about.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/home.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/home.jpg',
    'Karama-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/pranavam-arts/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'aim-dance-academy', 'AIM Dance Academy', 'Are you looking for a great technique in a relaxed family atmosphere? We are happy to announce the opening of AIM DANCE ACADEMY! Our AIM is to give children',
    '42636936', 'info@aim-danceacademy.com', 'https://www.citysearch.ae/aim-dance-academy-dubai-dubai',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aim-dance-academy/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'safe-power-electrical-l-l-c', 'Safe Power Electrical L.L.C', 'Safe Power Electrical L.L.C. has been operating in U.A.E. since 2007 and have developed extensive experience in the field of low voltage switchgear and',
    '42636936', 'mail@safepoweruae.com', 'https://www.safepoweruae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/co-panels.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/co-panels.jpg',
    'Fujairah', 'fujairah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/safe-power-electrical-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'excel-industry-co-llc', 'EXCEL INDUSTRY CO. LLC', 'Excel Industry Co LLC is a privately owned, multi-disciplinary engineering and manufacturing company. Headquartered in Ajman, UAE, Excel has experienced',
    '42636936', 'enquiry@excel-uae.com', 'https://excel-uae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-3.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/excel-industry-co-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mondial-travel-tourism-and-logistics', 'Mondial Travel Tourism and Logistics', 'Core Business Entities:',
    '42636936', 'admin1@mondial.ae', 'https://www.mondial.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/bnr_abts.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/bnr_abts.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mondial-travel-tourism-and-logistics/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'phoenix-trading-co-llc', 'Phoenix Trading Co. LLC', 'Phoenix Trading Co. LLC stands proudly as one of the foremost importers and stockists of premium electrical wires, cables, accessories, and related products,',
    '42636936', 'info@phoenix-me.com', 'https://phoenix-me.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-6-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7-2.jpg',
    'Karama-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/phoenix-trading-co-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'doors-indoors', 'Doors & Indoors', 'Inside Design experts, Architectural Interior Finishes, Turnkey Interior Fit-outs, Corporate Workplace Solutions, Specialized imprinting, calligraphy and',
    '42636936', 'info@doorsandindoors.com', 'http://www.doorsandindoors.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/arabiantalks_com__uploads_logo_56d417dad4e01_webp.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-3.jpg',
    'Al Quoz-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/doors-indoors/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'bridgeway-real-estate', 'Bridgeway Real Estate', 'Bridgeway Real Estate',
    '42636936', 'info@bridgeway.ae', 'http://bridgewaygroup.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-4-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-4-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bridgeway-real-estate/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'wisdom-educational-institute', 'Wisdom Educational Institute', 'Wisdom Group is a leading group of educational institutes in United Arab Emirates (UAE) that imparts trainings for different educational streams, management',
    '42636936', 'info@wisdom.ae', 'https://wisdom.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/wisdom-educational-institute/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'amber-al-madina', 'Amber Al Madina', 'AmberClub, the loyalty program for Amber. Supermarkets and Hypermarkets has over 100K members now. Receive offers tailored to your shopping history directly',
    '42636936', 'amber-majaz@amberuae.com', 'https://www.amberuae.com/Stores.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/www_amberuae_com__images_logo-white_png.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/01-1.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/amber-al-madina/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'world-of-stars-advertising', 'World of Stars Advertising', 'Integrated communication approach',
    '42636936', 'info@wosaworld.com', 'https://wosaworld.com/',
    NULL, NULL,
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/world-of-stars-advertising/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'sara-trident-emirates-llc', 'SARA TRIDENT EMIRATES LLC', 'The SARA Group is a marketing organization providing comprehensive ‘Retail and Distribution’ services in the Kingdom of Saudi Arabia and the United Arab',
    '+97143555595', 'info@saragroups.com', 'https://saragroups.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-51.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-51.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sara-trident-emirates-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'arbrit', 'Arbrit', 'There are no crossroads when it comes to health and safety training, and therefore our task is to provide quality, valuable training nationally in order to',
    '+97143313815', 'training@arbritonline.com', 'https://arbritsafety.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-5.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-5.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/arbrit/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-ershad-group', 'AL ERSHAD GROUP', 'Almost 22 years ago, we began our journey by opening a small retail shop at Abudhabi that sold Electronics products. Today, we still sell Electronic products,',
    '+97143585183', 'info@alershadgroup.com', 'https://www.alershadgroup.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-50.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-50.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-ershad-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'city-bay-cargo-llc', 'CITY BAY CARGO LLC', 'City Cargo LLC situated in Hor Al Naz Deira, opposite Abu Bakar metro station, Dubai U.A.E. The specialization of our company to provide best cargo &',
    '+971552040680', 'lafyas@gmail.com', 'https://ae.arabplaces.com/dubai/city-bay-cargo-llc-569938',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-49.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-49.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/city-bay-cargo-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'defender-security-services-llc', 'Defender Security Services LLC', 'We guarantee industry specific security research. Using the latest technologies to create and implement leading-edge security solutions makes us unique. Our',
    '+97142661888', 'info@defendersecurity.ae', 'https://www.defendergroup.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/defender-logo-header.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-47.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/defender-security-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-safeer-events', 'Al Safeer Events', 'Al Safeer Events is a top event planner & Management company in Ras Al Khaimah, Dubai and all over UAE. We are a company that embraces life within you.',
    '+971506701334', 'alsafeerevents@gmail.com', 'https://www.alsafeeruae.com/index.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/award_alsafeer.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/award_alsafeer.jpg',
    'Ras Al Khaimah', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-safeer-events/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'fast-track-land-cargo-l-l-c', 'Fast Track Land Cargo L.L.C', 'Fast Track Cargo Clearing & Forwarding LLC was established in 2008 with a vision to be a strategic logistical partner for businesses and brands across the',
    '+97142398414', 'ftccf@fasttrackuae.com', 'http://fasttrackuae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/intro.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/intro.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fast-track-land-cargo-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'gulf-first-shipping-llc', 'GULF FIRST SHIPPING LLC', 'GULF FIRST provides a full range of professional freight forwarding services to businesses in a variety of industries worldwide. Whether you’re looking for',
    '+97142655123', 'info@gulffirst.com', 'https://gulffirst.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/gulf-first.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-46.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/gulf-first-shipping-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'click-international', 'CLICK INTERNATIONAL', 'Click International is your business incorporation and on-the-ground corporate solutions specialist. Our team strives to be dynamic, disruptive, and',
    '+966543757222', 'info@click.com.sa', 'https://clickyourbusiness.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-45.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-45.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/click-international/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'gulf-brothers-hair-fixing', 'GULF BROTHERS HAIR FIXING', 'Are you having "a good hair day"? For many, the state of our hair, particularly when it’s bad, can completely knock our self-confidence and be a',
    '+971501747600', 'info@gulfbrothers.net', 'https://gulfbrothers.net/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Asset-1@3x.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/i1.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/gulf-brothers-hair-fixing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'golden-point-advertising', 'GOLDEN POINT ADVERTISING', 'Golden Point Ads strives to take your business to great heights through our result-oriented digital marketing and advertising solutions. We assure you that',
    '+97143989188', 'yousuf@goldenadds.com', 'https://goldenadds.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-4-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-4-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/golden-point-advertising/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'abh-international-shipping-co', 'ABH INTERNATIONAL SHIPPING CO', 'ABH INTERNATIONAL SHIPPING is an expanding regional logistics company with a strong commitment to innovation, technology and service excellence, which provide',
    '+971529818073', 'info@abhshipping.com', 'https://www.abhshipping.com/home',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-14.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/6bfaaf73-fa97-46f3-a7a4-fa893ab00780_image.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/abh-international-shipping-co/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'equity-plus', 'EQUITY PLUS', 'Since 2006, EquityPlus has been the pioneer of advertising innovation and has transformed businesses across the UAE with a powerful blend of strategic',
    '+971508115120', 'marketing@equityplusdubai.com', 'https://equityplusdubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-43.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-43.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/equity-plus/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-mamzar-printing-press', 'Al Mamzar Printing Press', 'Al Mamzar Printing Press is a client oriented printing establishment that caters a variety of clients in a range of industries across the world. Since being',
    '+97165349371', 'amprint@eim.ae', 'https://www.almamzarprint.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-13.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-41.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-mamzar-printing-press/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'cuisine-de-malabar', 'Cuisine de Malabar', 'uisine de Malabar is a small restaurant at the bottom of the Fortune Tower in cluster C, which serves food from the Malabar coastal region of northern Kerala,',
    '+97142517729', 'mcuisinede@gmail.com', 'https://www.tripadvisor.com/Restaurant_Review-g295424-d20057208-Reviews-Cuisine_de_Malabar-Dubai_Emirate_of_Dubai.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1_cXJkSsWsfnD7fGO5FG1Z_Q.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1_cXJkSsWsfnD7fGO5FG1Z_Q.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/cuisine-de-malabar/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'parco', 'PARCO', 'PARCO is a fully integrated energy company and is one of the largest companies in Pakistan’s corporate sector. A Joint Venture between the Government of',
    '021111392567', 'info@parco.com.pk', 'https://www.parco.com.pk/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/parco/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'royal-grill-restaurant', 'Royal Grill restaurant', '+971 4 882 9020',
    '+97148829020', 'info@royalgrill.com', 'https://www.rgrill.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/royal-grill-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'eat-drink-restaurant', 'Eat & Drink Restaurant', 'The History of Eat & Drink emerged from humble beginning to become a renowned name in the restaurant and catering industry. We started as a cafeteria,',
    '+971554153183', 'info@eatanddrink.ae', 'https://www.eatanddrink.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/world-food-day-2020.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/world-food-day-2020.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/eat-drink-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'f-mart', 'F MART', 'Freshly baked food, fresh fruits and vegetables, fresh juices and beverages and quality everyday grocery items but selected based on the requirements in each',
    '+97142714800', 'info@fmart.ae', 'https://fmart.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-39.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-39.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/f-mart/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'kalyan-silks', 'Kalyan Silks', 'Kalyan Silks is an Indian textile retailer founded by T. S. Kalyanaraman. At present, the ownership of the company rests with T. S. Pattabhiraman. It is a',
    '+9714872434000', 'customerservice@kalyansilks.com', 'https://kalyansilks.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-12.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-38.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kalyan-silks/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'lakeshore-aesthetics-and-wellness-center', 'Lakeshore Aesthetics and Wellness Center', 'Lakeshore Aesthetics and Wellness Center is a multi-speciality medical facility that offers world-class diagnostics and treatment processes. Situated in Al',
    '+97142649312', 'lakeshoremcuae@gmail.com', 'https://www.lakeshoreclinics.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Lakeshore-logo-image61fcd925765de.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-37.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lakeshore-aesthetics-and-wellness-center/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'lallummas-restaurant', 'Lallummas Restaurant', 'Growing up around our mother Lallumma, our culinary experience was always different and unique. With influences from Mysore to Wayanad, & Mahe to',
    '+97142621885', 'info@lallummas.com', 'https://lallummas.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/istockphoto-1316145932-612x612-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/istockphoto-1316145932-612x612-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lallummas-restaurant/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'emirates-first', 'Emirates First', 'Emirates First Business Service LLC (efirst) is a leading Business Consultant in UAE offering the best services in helping aspiring entrepreneurs to set up',
    '+971542061008', 'info@efirst.ae', 'https://efirst.ae/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-36.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-36.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/emirates-first/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'truslink-trading', 'Truslink Trading', 'Truslink Trading LLC established in the year 2018 with Head Office at Dubai, UAE and engaged in wholesale and retail of Cosmetics, Household products,',
    '+971565482779', 'info@truslinktrading.com', 'https://truslinktrading.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-11.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/Frame-1171276126.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/truslink-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'cinta-fresh', 'Cinta Fresh', 'At CintaFresh, we’re dedicated to crafting desserts that seamlessly blend old traditions with innovative technology. Our primary product, Palada Payasam,',
    '065356650', 'feedback@cintafresh.com', 'https://cintafresh.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-35.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/cinta-fresh/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'cleantel-cleaning-services', 'CLEANTEL CLEANING SERVICES', 'We have over 40 years of commercial cleaning experience. The name Cleantel was coined from ‘Clean Telephone’ since this was the initial service provided by',
    '065725466', 'info@cleantel.me', 'https://cleantel.me/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-34.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-34.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/cleantel-cleaning-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'credence-technical-surveyors-and-loss-adjustors', 'CREDENCE TECHNICAL SURVEYORS AND LOSS ADJUSTORS', 'Credence Technical Surveyors and Loss Adjusters LLC (CTS) is an independent firm of Surveyors, Loss Assessors and Loss Adjusters based in Abu Dhabi and Dubai,',
    '+971525706323', 'admin@credence.ae', 'https://www.credence.ae/index.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/welcome-img.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/welcome-img.jpg',
    'Abu Dhabi', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/credence-technical-surveyors-and-loss-adjustors/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'modern-hair-fixing', 'MODERN HAIR FIXING', 'At Modern Hair Fixing Studio, our journey began with a singular vision - to revolutionize the hair replacement industry and restore not just hair but also',
    '+97165567442', 'info@modernhairfizinggcc.com', 'https://modernhairfixinggcc.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-33.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-33.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/modern-hair-fixing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'moopans-group', 'MOOPANS GROUP', 'With a small and humble beginning, Moopans Group has come a long way through a huge transformation, overcoming a multitude of challenges. Thanks to the',
    '+971565114040', 'mr@moopansgroup.ae', 'https://moopansgroup.ae/index.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-32.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1.jpg',
    'Fujairah', 'fujairah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/moopans-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'al-hayat-industries', 'Al Hayat Industries', 'AL Hayat Industries provides quality Melamine Dinnerware and Kitchenware under the brand name "DYANSTY". Our business has a long tradition having been founded',
    '+97165427119', 'hayat.hayatind@gmail.com', 'https://dynastymelamine.com/index.html',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-31.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-31.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-hayat-industries/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mr-glass-forum-group', 'Mr Glass – Forum Group', 'Al Salamah Autoglass is a leading supplier of automotive glass in UAE based in the emirate of Sharjah. Having more than two decades of experience in the',
    '+97165422262', 'asg@mrglass.ae', 'https://mrglass.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-29.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-29.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mr-glass-forum-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'colorius', 'Colorius', 'Colorius is one of the leading advertising companies in the region from past 11 years. Advertising includes print production, creative production, Gifts &',
    '+97142636936', 'info@colorius.ae', 'https://colorius.ae/index',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-27.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-27.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/colorius/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'air-master-equipments-emirates-llc', 'AIR MASTER EQUIPMENTS EMIRATES LLC', 'Since 1987, Air Master Equipments Emirates L.L.C(HVAC Manufacturing Company in UAE) has been operating in the middle east and the sub-continent. Over the',
    '067436900', 'info@airmaster.ae', 'https://airmasteremirates.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-25.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-26.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/air-master-equipments-emirates-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'the-deep-seafood-company-llc', 'The Deep Seafood Company LLC', 'We use premium products and provide the best services in the industry. At all levels of the supply chain and through the entire logistics process, we are',
    '+97142844227', 'info@thedeepseafood.com', 'https://www.thedeepseafood.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logo-6.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-24.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/the-deep-seafood-company-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'damshique-transportation', 'DAMSHIQUE TRANSPORTATION', 'Damshique General Trading & Contracting Co. commenced in 2007  at Kuwait  created landmarks in the field of Accommodation & catering and',
    '+971585482008', 'info@damshique.com', 'https://www.damshique.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-23.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-23.jpg',
    'Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/damshique-transportation/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'bmg-properties', 'BMG PROPERTIES', 'BMG as an entity entered Dubai real estate market in the year 2005 as a small real estate firm. Almost a decade later its formation, in 2014 we launched',
    '+971589763213', 'info@bmgproperties.com', 'https://www.bmgproperties.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bmg-properties/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'idfresh-foods', 'IDFRESH FOODS', 'iD was founded in 2005, by 5 cousins, with a 50sqft store & 1 big dream - to ensure that people around the world gets access to fresh, nutritious &',
    '+919739910521', 'customercare@idfreshfood.com', 'https://www.idfreshfood.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-20.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-20.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/idfresh-foods/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'whetstone-consultancy', 'WHETSTONE CONSULTANCY', 'Whetstone Consultations was launched in 1999 by Cheri Britton Honeycutt, M.Ed. to train public and private healthcare providers how to engage in quality HIV',
    '+97142636936', 'whetstoneconsultations@gmail.com', 'https://www.whetstoneconsultations.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/image.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/image-1024x682.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/whetstone-consultancy/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'aasa-group', 'AASA Group', 'CP Holding is the majority shareholder of AASA and is a prominent family-owned business group with diverse investments globally.',
    '+97142420333', 'info@aasa.ae', 'https://www.aasa.ae/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/iStock_63807491_SMALL.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/iStock_63807491_SMALL.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aasa-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-hamd-legal-translation-llc', 'Al Hamd Legal Translation LLC', 'AlHamdh Translation is a leading translation agency established aiming of delivering highest quality deliverables in translation services at affordable rates,',
    '+971543482770', 'info@alhamd.ae', 'https://alhamd.ae/home',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-19.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-19.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-hamd-legal-translation-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'signmax-group-uae', 'Signmax Group UAE', 'Our production facility is spread over GCC – MEN with an area of 17000 square meters with more than 250 professional employees consisting of Project Managers,',
    '+97145844786', 'info@signmaxdubai.com', 'https://www.signmaxdubai.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-17.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-17.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/signmax-group-uae/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'buyany-insurance', 'Buyany Insurance', 'Our platform is built on over a decade’s worth of insurance experience and expertise. We specialize in making a comparative analysis of the insurance products',
    '+97142644689', 'info@buyanyinsurance.com', 'https://www.buyanyinsurance.ae/en',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-16.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-16.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/buyany-insurance/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-mizan-group', 'Al Mizan Group', 'Almizan group is the safer way to pay because we keep your financial information private. It isn’t shared with anyone else when you shop,',
    '+97143434719', 'info@almizangroup.ae', 'https://almizangroup.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-15.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-15.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-mizan-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'crosbo-trading', 'CROSBO TRADING', 'From heavy tools to multipurpose power tools, Findout our range of tools & equiipments.',
    '+971508613790', 'sales@crosbo.com', 'https://crosbo.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/industrial-worker-crosbo.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/industrial-worker-crosbo.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/crosbo-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'century-travel', 'CENTURY TRAVEL', 'Booking a holiday is an emotive decision which if done properly, requires research, knowledge and expertise. At Century Travel we have a team of people who',
    '42636936', 'info@centurycyprus.com', 'https://centurycyprus.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/CT-Website-Header-Image-21-1-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/CT-Website-Header-Image-21-1-1024x321.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/century-travel/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'beveron-technologies', 'Beveron Technologies', 'Beveron Technologies is a pioneer in legaltech domain with world class solutions and our primary focus is to provide digital transformation service and',
    '+971557648808', 'info@beveron.com', 'https://www.beveron.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-01-09-at-9.52.06-AM-1-1.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-01-09-at-9.52.06-AM-1-1.jpeg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/beveron-technologies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ate-international-building-materials-llc', 'ATE International Building Materials LLC', 'Since its formation in 1989, ATE International has provided a wide range of building materials, systems and product to the construction industry in the UAE',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-3.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ate-international-building-materials-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'apt-digital', 'Apt Digital', 'The Apt Digital was founded on the belief that digital media and technology, if rightly supported with the APT marketing skills can do wonders when they work',
    '+971503198582', 'info@theaptdigital.com', 'https://www.theaptdigital.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-13.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-13.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/apt-digital/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'rhivu-capital', 'Rhivu Capital', 'Rhivu’s vision is to be the preferred choice of people for work and quality solutions.The markets are competitive, but we will not compromise on quality. We',
    '+971502831363', 'info@rhivucapital.com', 'https://www.rhivucapital.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-11-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-11-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rhivu-capital/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'kreston-menon', 'Kreston Menon', 'When a client – whether a large multinational conglomerate, a global bank, a large family office business or an SME – is trying to identify the ideal auditing',
    '42636936', 'info@krestonmenon.com', 'https://www.krestonmenon.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/global-2-scaled-1-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/global-2-scaled-1-1024x321.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/kreston-menon/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'universal-lighting-industries', 'Universal Lighting Industries', 'More than just a team of professionals, we are a group of individuals who are truly passionate about what we do. Our hearts beat with enthusiasm as we embark',
    '42636936', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/unilights_com__wp-content_uploads_2023_07_banner_png-1024x321.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/unilights_com__wp-content_uploads_2023_07_banner_png-1024x321.jpg',
    'Sharjah-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/universal-lighting-industries/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'gz-cars', 'GZ Cars', 'GZ Cars Company is a world-leading car dealer in the heart of Abu Dhabi, specializing in high-performance, luxury, and stylish cars. We’re keen on making a',
    '+971503340911', 'info@gzcars.com', 'https://gzcars.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/8J2HKe5CaA45Jm4MF3sa5kC8Jhit9uPO4h7KEjrK.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/8J2HKe5CaA45Jm4MF3sa5kC8Jhit9uPO4h7KEjrK.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/gz-cars/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'rich-mount-technical-services-contracting-llc', 'Rich mount Technical Services Contracting LLC', 'Founded in 2015. RICH MOUNT TECHNICAL SERVICES LLC is a professionally managed firm, engaged in domains such as civil works, Interior works, MEP work, Floor',
    '+97142950285', 'info@rich-mounts.com', 'https://www.rich-mounts.com/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/banner7.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/banner7.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rich-mount-technical-services-contracting-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'enke-group', 'ENKE Group', 'ENKE GROUP was created to focus on “Waste Water & Drinking Water Treatment Sector”. We always give to our customers high quality service with the best',
    '42636936', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/1-Stainless-Steel-Mechanical-Equipments-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/1-Stainless-Steel-Mechanical-Equipments-1.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/enke-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'fortune-technology-llc', 'Fortune Technology LLC', 'Fortune Technology LLC, being one among best ERP Provider in Dubai, and the production house of Fortuner ERP Application, one of the Best ERP software in UAE.',
    '+971555998708', 'info@fortunetechnologyllc.com​', 'https://www.fortunetechnologyllc.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10-2.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fortune-technology-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'al-manama-group-of-companies', 'Al Manama Group of Companies', 'Al Manama Group is one of the leading retail business groups in UAE Al Manama Group commenced its entry into the gracious market of United Arab Emirates in',
    '42636936', 'office@example.com', NULL,
    NULL, NULL,
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-manama-group-of-companies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'dunes-advertising-agency', 'Dunes Advertising Agency', 'We strive every day to learn more about the evolving world of digital marketing by keeping in-touch with the latest news and greatest technology.',
    '+966539151994', 'sales@dunesmediaksa.com', 'https://dunesmediaksa.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-8-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-8-1.jpg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dunes-advertising-agency/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-rimh', 'AL RIMH', 'AL RIMH a part of DADCO holdings was established and registered in 2015 with its main office located in Sharjah, U.A.E. As a group, we have witnessed',
    '+97165777783', 'sales@alrimh.com', 'https://www.alrimh.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7-1.jpg',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-rimh/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'fintax-international-llc', 'Fintax International LLC', 'Finance is considered the lifeblood of a business as it has the power to impact all areas of a business and how it works. It is crucial to have the support of',
    '+971503123433', 'info@fintaxintl.com', 'https://www.fintaxintl.com/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/istockphoto-955408648-612x612-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/istockphoto-955408648-612x612-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fintax-international-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sjs-accounting-and-bookkeeping', 'SJS Accounting and Bookkeeping', 'SJS Accounting and Bookkeeping Services Company Dubai is a team of experienced accountants and professionals, who provide affordable and timely, Services. We',
    '+97142644206', 'info@sjsaccounting.com', 'https://sjsaccounting.com/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-5-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-5-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sjs-accounting-and-bookkeeping/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'aden-medical-trading', 'Aden Medical Trading', 'Aden Medical Trading, established in 2010 is a fast growing company and a prominent name in the field of medical equipments, dental equipments, consumables',
    '+971506742359', 'info@adenmedical.com', 'https://adenmedical.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-4-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-4-1.jpg',
    'Sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aden-medical-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-rafa-furniture', 'Al Rafa Furniture', 'Whether you are furnishing your home or office, it can be a tiring, frustrating and time-consuming experience. You run around town only to find furniture that',
    '+971543304304', 'info@alrafafurniture.com', 'https://alrafafurniture.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/WhatsApp-Image-2021-03-20-at-12.40.28-PM-1-1024x600-1.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/WhatsApp-Image-2021-03-20-at-12.40.28-PM-1-1024x600-1.jpeg',
    'Ajman', 'ajman', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-rafa-furniture/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ayenz-general-contracting-llc', 'Ayenz General Contracting LLC', 'AYENZ General Contracting LLC dealing in wide range of Building Services, Turnkey Interior Solutions, M.E.P, General Maintenance andinfrastructure services.',
    '+971522331125', 'info@ayenz.ae', 'http://ayenz.com/uae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logos.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/LONGUE-1.png',
    'Abu Dhabi', 'abu_dhabi', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ayenz-general-contracting-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'festo-international', 'Festo International', 'As a third-generation family-owned company, we are financially independent and socially committed. We therefore think and act for the long term – in',
    '+97142417443', 'info_mena@festo.com', 'https://www.festo.com/ae/en/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/EA_SMS_Overview_29765c_26_fix952x536.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/EA_SMS_Overview_29765c_26_fix952x536.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/festo-international/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'mahassu-technical-services-llc', 'Mahassu Technical Services LLC', 'Mahassu Technical Services LLC is a diversified organization for cleaning services including all types of facilities such as after construction, residential,',
    '+97143413110', 'nfo@mahassu.ae', 'https://mahassu.ae/index.php',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/logo-2-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/bg-1_03_03.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mahassu-technical-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'nasmat-al-sabah-general-trading-llc', 'Nasmat Al Sabah General Trading LLC', 'Nasmat Al Sabah General Trading LLC, was born in Dubai in the year 1986. Its motive was to import quality branded products direct from the manufacturers and',
    '42636936', 'info@nasmat.ae', 'https://nasmat.ae/about-us/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/basikfoods_com__nasmat_wp-content_uploads_2020_05_logon-2_png.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/choithram.png',
    'Qusais-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/nasmat-al-sabah-general-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'bickstreen-co', 'Bickstreen & Co', 'Brick Street Resto Lounge is the perfect hangout spot to enjoy delicious food and drinks with friends and family. Located in the Al Qusais area of Dubai, we',
    '+971509626300', 'info@mysite.com', 'http://brickstreetdubai.com',
    NULL, NULL,
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bickstreen-co/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'mastergram-advertising-llc', 'MASTERGRAM ADVERTISING LLC', 'Mastergram Digital is the digital & Web development arm of Mastergram. We specialise in Website design & development, Ecommerse, Mobile Apps, Web',
    '+97142636936', 'info@mastergrampartners.com', 'https://mastergramdigital.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/e-commerce.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/e-commerce.png',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/mastergram-advertising-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'deneb-contracting', 'Deneb Contracting', 'DENEB is a group of companies located in United Arab Emirates, with its head office in the global city and the business hub of the middle east, DUBAI. The',
    '+97142944741', 'info.civil@denebgroup.com', 'https://www.denebgroup.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2.png',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/deneb-contracting/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'royal-pools-and-gardens', 'Royal Pools and Gardens', 'Royal pool & Gardens is wide range Specializing in Construction of Swimming Pool, Fountain, Waterfall, Landscaping, Hardscape, Gardens Irrigation, all',
    '+9710505254062', 'royal@poolsgardens.com', 'https://www.poolsgardens.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Backyardpool-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/Backyardpool-1-1024x766.png',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/royal-pools-and-gardens/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-khair-caapital', 'Al Khair Caapital', 'ALKHAIR CAPITAL (Dubai) LTD. is a leading financial services company with extensive experience in asset management, advisory services and private equity. It',
    '+97145189111', 'info@alkhaircapital.ae', 'https://www.alkhaircapital.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-1-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-1-1.png',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-khair-caapital/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'fann-marketing', 'Fann Marketing', 'We’re a team of designers, developers and product experts passionate about technology and bringing ideas to life. We care about building products that meet',
    '+97143286764', 'info@fannmarketing.com', 'https://fannmarketing.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-1.png',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fann-marketing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'al-muqarram-group', 'Al Muqarram Group', 'The golden age of industrialization in the great nation of the United Arab Emirates is what compelled the inception of Al Muqarram Group. Founded in 1999, Al',
    '065942000', 'nfo@muqarram.com', 'https://muqarram.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/6.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/6.png',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/al-muqarram-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'zeptium-technologies', 'Zeptium Technologies', 'Zeptium Technologies is one of the best and leading Hardware sales and service center in Dubai, UAE. Your business needs to equip its users with hardware and',
    '+97142850050', 'jaffar@zeptium.com', 'https://zeptium.com/Index.aspx',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/about2-scaled.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/about2-1024x569.jpg',
    'dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/zeptium-technologies/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'ad-ports-group', 'AD Ports Group', 'Through organic growth and partnerships, AD Ports Group has developed over the years into an integrated premier enabler of trade, industrialisation, and',
    '800102030', 'media@adports.ae', 'https://www.adportsgroup.com/en',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/thumbnail-overview.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/thumbnail-overview.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/ad-ports-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'solution-hub', 'Solution hub', 'At Solution Hub, we are your steadfast companion on the path to success in the thriving business landscape of Dubai. With more than 10 years of unwavering',
    '+971505767577', 'info@solutionhub.ae', 'https://solutionhub.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/immigration_consultants.jpeg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/immigration_consultants.jpeg',
    'Al Karama - Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/solution-hub/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'aasc-management-consultancies-co-llc', 'AASC Management Consultancies Co LLC', 'AASC is one of the best business consultants in Kerala, that a business can hire to win in the present market. Be in planning a new business or a new product',
    '+97150205990', 'office@example.com', 'https://aascglobal.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/AASC-Social-media-icon-1.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/AASC-Social-media-icon-1.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/aasc-management-consultancies-co-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'bluedot', 'BlueDot', 'Bluedot is the Middle East''s most sought after supplier of Air Charters, Air Ambulance and Medical Travel Assistance. For the basic explanation that the group',
    '+971539140313', 'office@example.com', 'https://www.bluedotairambulance.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/bluedot-charters-and-air-ambulance-service-co-2022-03-17-6233a9d46b118-tiny.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-8.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bluedot/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'space-interiors-and-exhibitions-llc', 'SPACE INTERIORS AND EXHIBITIONS LLC', 'At Space Interiors, we are not just designers; we are dream believers. We believe in the potential of our clients, the power of the brands we collaborate',
    '+971539140313', 'office@example.com', 'https://spaceme.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/interior-design.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/interior-design.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/space-interiors-and-exhibitions-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'sayej-al-amal-technical-services', 'Sayej al Amal Technical Services', 'SADA AL AMAL TECHNICAL SERVICES are established with a team of well experienced professionals worked in various industrial projects in UAE, in the field of',
    '+971539140313', 'office@example.com', 'https://sites.google.com/view/saa-technical-service/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/SADADD-birds.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-5.jpg',
    'Al Qusais 2, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/sayej-al-amal-technical-services/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'master-movers', 'Master Movers', 'Master  Movers is an award-winning Storage Services and Movers in Dubai based, international and domestic relocation and storage providers. Bringing decades',
    '+971539140313', 'office@example.com', 'https://mastermovers.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/603dcdcf38fd26bh-01.jpg.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/603dcdcf38fd26bh-01.jpg.png',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/master-movers/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'syntra-global-llc', 'Syntra Global LLC', 'Syntra Global is a leading provider of processing, packaging, inspection, and automation machines in the Middle East. Several world-renowned manufacturers are',
    '+971539140313', 'office@example.com', 'https://www.syntraglobal.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-1.jpg',
    'Nad Al Sheba, Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/syntra-global-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'wattlecorp-cyber-risk-management-services-llc', 'Wattlecorp Cyber Risk Management Services LLC', 'Founded in 2018, Wattlecorp is now one of the leading cybersecurity companies in India. Powered by a strong team of professionals in cybersecurity with a',
    '+971539140313', 'office@example.com', 'https://www.wattlecorp.com/',
    NULL, 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-9.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/wattlecorp-cyber-risk-management-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'metroplus-advertising-llc', 'Metroplus Advertising LLC', 'Full-service agency ‘Metroplus Advertising’ works closely with clients to customize solutions for their advertising needs. From simple reception signage, shop',
    '+971539140313', 'office@example.com', 'https://www.metroplusads.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/IHG-05-1024x732-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/IHG-05-1024x732-1.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/metroplus-advertising-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'in-safe-steel-constructions-contracting-llc', 'IN SAFE STEEL CONSTRUCTIONS CONTRACTING LLC', 'Established in 2007, IN SAFE STEEL CONSTRUCTIONS CONTRACTING LLC. is a leading steel fabricating company in the UAE, specializing in custom steel fabrication',
    '+971539140313', 'office@example.com', 'https://insafme.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/photo-1600965581129-eef8a214ec9d.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/photo-1600965581129-eef8a214ec9d.jpg',
    'Abu Hail,Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/in-safe-steel-constructions-contracting-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'finazle-tax-auditing', 'Finazle Tax & Auditing', 'We are an experienced accounting firm in Dubai, and we need to provide our clients with a transparent and consistent service. We create efficient,',
    '+971539140313', 'office@example.com', 'https://finazle.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/pexels-photo-5673488-1024x683-2.webp', 'https://malayalibusiness.com/wp-content/uploads/2024/02/pexels-photo-5673488-1024x683-2.webp',
    'Barsha-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/finazle-tax-auditing/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'roadways-customs-clearing-and-transport-llc', 'ROADWAYS CUSTOMS CLEARING AND TRANSPORT LLC', 'Our firm has been providing Customs Clearance & Transport services in Dubai for many years, and we have a team of professionals for your Support.',
    '+971539140313', 'office@example.com', 'http://roadways.ae',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Service-4-300x240-1.gif', 'https://malayalibusiness.com/wp-content/uploads/2024/02/Service-4-300x240-1.gif',
    'Hatta', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/roadways-customs-clearing-and-transport-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_restaurants_food, 'bismi-international-general-trading-llc', 'BISMI INTERNATIONAL GENERAL TRADING LLC', 'BISMI group, with its existence in UAE since 2001, is one of the most progressive organizations dealing in Wholesale, Retail, Fruits and Vegetables, Food',
    '+971539140313', 'office@example.com', 'https://bismi.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/bismi-logo-1-2.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/about-home-1.jpg',
    'DIP- 2,Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bismi-international-general-trading-llc-2/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'nexus-elite-properties-llc', 'Nexus elite properties LLC', 'The Nexus Elite Group is an established leader in the provision of high quality business and legal support services for nearly two decades. We have',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-7.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/nexus-elite-properties-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'rhivu-capital-management-consultancy', 'Rhivu Capital Management Consultancy', 'Rhivu Capital Management Consultancy’s mission is to provide our clients with effective,efficient and quality solutions and services with integrity and',
    '+971539140313', 'office@example.com', 'https://www.rhivucapital.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/hr-510x364-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/hr-510x364-2.jpg',
    'Burjman -Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rhivu-capital-management-consultancy/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'eduproffs-training-institute', 'Eduproffs Training Institute', 'EduProf is an institutitue dedicated to providing top-notch exam preparation services for students aiming to excel in various competitive exams. With a proven',
    '+971539140313', 'office@example.com', 'https://eduprofinternational.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/medium-shot-girl-posing-with-graduation-background-1536x1022-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/medium-shot-girl-posing-with-graduation-background-1536x1022-1.jpg',
    'Burjman,Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/eduproffs-training-institute/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'lucky-lines-trading', 'Lucky Lines Trading', 'Lucky LInes Trading',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/landeor.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/landeor.jpg',
    'Deira-Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/lucky-lines-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'marjaan-general-trading', 'Marjaan General Trading', 'Marjan General Trading',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/images-2.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/marjaan-general-trading/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'karate-kid-martial-arts', 'Karate Kid Martial Arts', 'Fitness is all about training one’s mind, strengthening the physique and enhancing the coordination between them. It creates a complete transformation',
    '+971539140313', 'office@example.com', 'https://karatekiduae.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/BG9A85611234567i-1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/BG9A85611234567i-1.jpg',
    'Muhaisnah-4, Dubai, UAE', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/karate-kid-martial-arts/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_real_estate, 'coolland-aircondition-and-refrigeration-spare-parts-trading-llc', 'Coolland Aircondition and Refrigeration Spare Parts Trading LLC', 'Cool Land is a Air Conditioner and Refrigerator Spare Parts Trading LLC. Our wide range of inventory includes Spare parts of airconditioning, refrigeration,',
    '+971539140313', 'office@example.com', NULL,
    NULL, 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-12.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/coolland-aircondition-and-refrigeration-spare-parts-trading-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'dubai-sun-sand-travel-tourism-l-l-c', 'DUBAI SUN & SAND TRAVEL & TOURISM L.L.C', 'Dubai Sun and Sand Travel & Tourism LLC established in 2000 based in Dubai, United Arab Emirates.This establishment is keen to do services in Visa',
    '+971539140313', 'info@dssdxb.com', 'http://dubaisunandsands.com',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/image1.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/image1.jpg',
    'Karama ,Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/dubai-sun-sand-travel-tourism-l-l-c/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_education_training, 'abstract-art', 'Abstract Art', 'Abstract art uses visual language of shape, form, color and line to create a composition which may exist with a degree of independence from visual references',
    '+971539140313', 'office@example.com', NULL,
    NULL, 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-10-1.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/abstract-art/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_grocery_supermarket, 'skyzone-cargo-services-llc', 'SKYZONE CARGO SERVICES LLC', 'SkyZone Cargo offers the most modern and efficient service in the international logistics market, working strongly with Air Cargo, Shipping and Customs',
    '+971539140313', 'office@example.com', 'https://www.skyzonecargo.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/about.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/about.jpg',
    'Abu Dhabi
Ajman
Dubai
Fujairah
Ras Al Khaima
Sharjah
Umm Al Quwain', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/skyzone-cargo-services-llc/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'jack-group', 'Jack Group', 'Jack Group is a provider of drafting and design services, offering a comprehensive range of solutions to transform your vision into reality. With our team of',
    '+971539140313', 'office@example.com', 'https://jackgroups.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/Screenshot-2024-02-14-100752.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/Screenshot-2024-02-14-100752.png',
    'sharjah', 'sharjah', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/jack-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_healthcare_medical, 'fayeda-tourism', 'Fayeda Tourism', 'Fayeda Travel & Tourism LLC has proven itself as a tourism and hospitality empire since its inception in the United Arab Emirates in 2006. All the success',
    '+971539140313', 'office@example.com', 'https://fayedatourism.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-2.jpg',
    'Abu hail', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/fayeda-tourism/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'boon-international-llc', 'Boon International LLC', 'Boon enjoys a prestigious reputation as one of the finest interior fit-out, facility management, exhibitions and MEP works in UAE. Boon specializes in the',
    '+971539140313', 'office@example.com', 'https://boonuae.ae/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/contact_footer.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/contact_footer.jpg',
    'Al Qusais ,Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/boon-international/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'rocmount-tech', 'Rocmount Tech', 'Rocmount Technical Services Contracting LLC’s team is one of the experienced group in UAE for 20 years in the field of Steel, Aluminium, Partitions, Pergolas,',
    '+971539140313', 'office@example.com', 'https://www.rocmounttech.com/',
    NULL, 'https://malayalibusiness.com/wp-content/uploads/2024/02/download-11.jpg',
    'Dubai', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/rocmount-tech/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'bustan-almas-building-material', 'Bustan Almas Building Material', 'Al Bustan Building Material LLC',
    '+971517670117', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/bustan-al-almas-building-materials-trading-llc-2024-01-19-65aa173c4106f-tiny.jpg', 'https://malayalibusiness.com/wp-content/uploads/2024/02/bustan-al-almas-building-materials-trading-llc-2024-01-19-65aa173c4106f-tiny.jpg',
    'Umm Al Quwain', 'umm_al_quwain', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/bustan-almas/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'calltekky', 'CallTekky', 'CallTekky is the best and reliable quality platform for all kinds of Information and communication technology products, maintenance and services. We are the',
    '+97142636936', 'info@calltekky.com', 'https://www.calltekky.com/',
    'https://malayalibusiness.com/wp-content/uploads/2024/02/call-logo-2.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-09-02-at-10.43.50-AM.jpeg',
    'Abu hail', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/calltekky/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO listings (
    owner_id, category_id, slug, name, description,
    phone, email, website, logo_url, cover_url,
    address, emirate, plan, status, is_featured, is_verified,
    rating_avg, review_count, languages, services, gallery_urls
  ) VALUES (
    _owner, cat_beauty_wellness, 'alwafaa-group', 'Alwafaa Group', 'Alwafaa Group- founded in the year of 2002, is a prominent IT and Online Solutions providers across the Middle East. An ISO 2008 Certified & Google',
    '+971539140313', 'office@example.com', NULL,
    'https://malayalibusiness.com/wp-content/uploads/2024/02/alwafaa_group.png', 'https://malayalibusiness.com/wp-content/uploads/2024/02/alwafaa-news.jpg',
    'Abu Hail, Dubai, U.A.E.', 'dubai', 'basic', 'pending', false, false,
    0, 0,
    ARRAY['English', 'Malayalam'],
    ARRAY['source:https://malayalibusiness.com/listing/alwafaa-group/'],
    '{}'
  ) ON CONFLICT (slug) DO NOTHING;

END;
$$;

-- Done. 465 listings inserted (duplicates skipped via ON CONFLICT).