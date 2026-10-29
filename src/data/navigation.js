// Every destination below comes from cynbit.in's own header, footer or /navigation map.
// Taglines marked "site" are the site's own menu text; others are short neutral summaries.
export const SITE = 'https://www.cynbit.in';

export const CATEGORIES = ['Company', 'Expertise', 'Products', 'BitElevate', 'Resources', 'Legal'];

const make = (id, title, description, category, path, keywords = []) => ({
  id, title, description, category, path, url: SITE + path, keywords,
});

export const destinations = [
  make('home', 'Home', 'Cynbit Technologies homepage', 'Company', '/', ['main', 'start', 'landing']),
  make('story', 'Our Story', 'The vision behind Cynbit.', 'Company', '/story', ['about', 'about us', 'company', 'history', 'mission', 'who we are']),
  make('team', 'Our Team', 'Meet the architects.', 'Company', '/team', ['core team', 'people', 'founders', 'staff']),
  make('careers', 'Careers', 'Join the revolution.', 'Company', '/careers', ['jobs', 'hiring', 'openings', 'work with us', 'vacancies']),
  make('impact', 'Social Impact', 'Our global footprint.', 'Company', '/impact', ['manav seva', 'csr', 'community', 'initiatives', 'charity']),
  make('contact', 'Contact', 'Talk to the Cynbit team', 'Company', '/contact', ['support', 'email', 'phone', 'get in touch', 'discovery', 'quote', 'demo', 'help']),

  make('services', 'Services Hub', 'Tailored tech solutions.', 'Expertise', '/services', ['ai automation', 'agents', 'software development', 'web', 'mobile', 'cloud', 'aws', 'azure', 'seo', 'technical seo']),
  make('products', 'Product Suite', 'Next-gen toolkits.', 'Expertise', '/products', ['saas', 'software', 'toolkits', 'platforms']),
  make('case-studies', 'Case Studies', 'Real-world results.', 'Expertise', '/case-studies', ['portfolio', 'work', 'clients', 'results', 'testimonials']),

  make('studio', 'Cynbit Studio', 'Career intelligence.', 'Products', '/products#cynbit-studio', ['edtech', 'coding', 'resume', 'mock interview', 'job matcher', 'learning']),
  make('tenantease', 'TenantEase', 'Property ecosystem.', 'Products', '/products#tenantease', ['property', 'rent', 'tenant', 'landlord', 'real estate']),
  make('revio', 'Revio', 'AI Review Assistant.', 'Products', '/products#revio', ['reviews', 'reputation', 'sentiment', 'feedback', 'ratings']),

  make('bitelevate', 'BitElevate', 'Unstructured learning.', 'BitElevate', '/bitelevate', ['training', 'program', 'certification', 'mentorship', 'placement', 'ecosystem']),
  make('paths', 'Learning Paths', 'Architect your future.', 'BitElevate', '/bitelevate/paths', ['courses', 'roadmap', 'curriculum', 'tracks']),
  make('diaries', 'Student Diaries', 'Real stories. Raw journeys.', 'BitElevate', '/diaries', ['students', 'stories', 'journeys', 'testimonials']),

  make('blog', 'Blog', 'Expert articles and insights', 'Resources', '/blog', ['articles', 'insights', 'posts', 'news']),
  make('navigation', 'Navigation Map', 'Directory of every page', 'Resources', '/navigation', ['sitemap', 'site map', 'all pages', 'directory']),

  make('privacy', 'Privacy Policy', 'How data is handled', 'Legal', '/privacy', ['data', 'gdpr']),
  make('terms', 'Terms of Service', 'Terms of using the site', 'Legal', '/terms', ['conditions', 'legal']),
  make('cookies', 'Cookie Policy', 'How cookies are used', 'Legal', '/cookies', ['tracking', 'consent']),
];
