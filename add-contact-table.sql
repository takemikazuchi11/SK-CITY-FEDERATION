-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    phone VARCHAR(100),
    email VARCHAR(100),
    address VARCHAR(255) NOT NULL,
    hours VARCHAR(100),
    description TEXT NOT NULL
);

-- Insert initial contact data
INSERT INTO contacts (name, fullName, category, phone, email, address, hours, description) VALUES
('NYC', 'National Youth Commission', 'National Agency', '(02) 8426-8479', 'info@nyc.gov.ph', 'Provincial Capitol Complex, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'Promotes youth development and empowerment programs'),
('COA', 'Commission on Audit', 'Constitutional Body', '(02) 8951-3815', 'coa.reg4b@coa.gov.ph', 'Provincial Capitol Complex, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'Government auditing and financial oversight services'),
('BIR', 'Bureau of Internal Revenue', 'National Agency', '(04)3288-5006', 'rdo_63css@bir.gov.ph', 'Tawiran near TESDA and LTO, Calapan City ', '8:00 AM - 5:00 PM (Mon-Fri)', 'Tax collection and revenue services'),
('LANDBANK', 'Land Bank of the Philippines', 'Government Bank', '(043) 288-2470', 'lbpcalapanbr@yahoo.com.ph', 'Filipiniana Complex Sto Niño Calapan, Oriental Mindoro', '9:00 AM - 3:00 PM (Mon-Fri)', 'Agricultural and development banking services'),
('DBP', 'Development Bank of the Philippines', 'Government Bank', '+63432884399, +63432884620', 'calapan@dbp.ph', 'Sto. Nino, Calapan City, Oriental Mindoro ', '9:00 AM - 3:00 PM (Mon-Fri)', 'Development financing and banking services'),
('COMELEC', 'Commission on Elections', 'Constitutional Body', '+639285605369', 'comelec_ormindoro@yahoo.com.ph', 'COMELEC Office, Provincial Capitol Complex, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'Election administration and voter registration services'),
('Provincial Government', 'Provincial Government - Calapan City', 'Local Government', '(043) 286-7890', 'lgu.calapan@gmail.com', 'Calapan City Hall, Magsaysay Avenue, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'Local government services and administration'),
('City Government of Calapan', 'Calapan City Government', 'Local Government', '(043) 288 2496', 'mayor.calapan@gmail.com', 'Office of the City Mayor, Calapan City Hall, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'City executive office and administrative services'),
('SK FEDERATION', 'Sangguniang Kabataan Federation', 'Youth Organization', '(043) 286-9012', 'skcalapancityfederation@gmail.com', 'SK Federation Office, Calapan City Hall, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'Youth council federation and youth programs'),
('SANGGUNIAN PANGLUSOD', 'Sangguniang Panlungsod ng Calapan', 'Local Government', '(043) 286-0123', 'sanggunian.calapan@gmail.com', 'Session Hall, Calapan City Hall, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'City council legislative body and ordinance creation'),
('CITY POLICE', 'Calapan City Police Station', 'Law Enforcement', '09061791105, 09985985813', 'orminppo.popb.pnp@gmail.com', 'Calapan City Police Station, J.P. Rizal Street, Calapan City, Oriental Mindoro', '24/7 Emergency Services', 'Law enforcement and public safety services'),
('BFP CALAPAN', 'Bureau of Fire Protection - Calapan', 'Emergency Services', '911 / 28-7777/ 09156031561', 'bfp.calapan@bfp.gov.ph', 'BFP Calapan Fire Station, Magsaysay Avenue, Calapan City, Oriental Mindoro', '24/7 Emergency Services', 'Fire prevention, suppression, and emergency response'),
('CITY HEALTH', 'Calapan City Health Office', 'Health Services', '(043)288 7408', 'chsd_n@yahoo.com', 'City Health Office, Calapan City Hall Complex, Calapan City, Oriental Mindoro', '8:00 AM - 5:00 PM (Mon-Fri)', 'Public health services and medical assistance programs'),
('CDRRMO', 'City Disaster Risk Reduction and Management Office', 'Emergency Services', '09997356447, (043)288 6111, 09157449698', 'cdrrmo.calapan@gmail.com', 'CDRRMO Office, Calapan City Hall Complex, Calapan City, Oriental Mindoro', '24/7 Emergency Response', 'Disaster preparedness, response, and risk reduction management'); 