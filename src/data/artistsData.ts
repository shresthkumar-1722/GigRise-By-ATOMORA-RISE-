import { Artist, B2BLead } from '../types';

import acousticSketch from '../assets/images/artist_acoustic_sketch_1791797119686.jpg';
import jazzSaxSketch from '../assets/images/artist_jazz_sax_sketch_1791797133298.jpg';
import livePainterSketch from '../assets/images/artist_live_painter_sketch_1791797146407.jpg';
import violinistSketch from '../assets/images/artist_violinist_sketch_1791797157582.jpg';

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'art-01',
    name: 'Julian Vance',
    handle: '@julianacoustic',
    category: 'Acoustic Soloist',
    genre: 'Indie Folk & Warm Fingerstyle',
    location: 'Tiong Bahru & River Valley',
    city: 'Singapore',
    coordinates: { lat: 1.2865, lng: 103.8322 },
    distanceKm: 2.1,
    rating: 4.96,
    reviewCount: 68,
    baseHourlyRate: 160,
    minimumHours: 2,
    fairPriceEstimated: 480, // 3h set
    bio: 'Storyteller with a 1974 Gibson acoustic, weaving warm organic timber textures through private garden celebrations, intimate acoustic vows, and sunset terraces.',
    handwrittenQuote: '“Let every timber chord hold space for quiet memories between toasts.”',
    sketchImage: acousticSketch,
    repertoire: ['Harvest Moon - Neil Young', 'Skinny Love - Bon Iver', 'Bloom - The Paper Kites', 'Slow Burn - Kacey Musgraves', 'Original Folk Etudes'],
    badges: ['Punctual Maestro', 'Zero Cancellation Record', 'Shield Verified'],
    instruments: ['Acoustic Guitar', 'Harmonica', 'Stomp Box'],
    shieldVerified: true,
    gigPoints: 3420,
    totalGigsCompleted: 42
  },
  {
    id: 'art-02',
    name: 'Miles Chen',
    handle: '@milesquartet',
    category: 'Jazz & Blues',
    genre: 'Cool Twilight Saxophone & Bossa Nova',
    location: 'Dempsey Hill & Orchard',
    city: 'Singapore',
    coordinates: { lat: 1.3048, lng: 103.8115 },
    distanceKm: 3.8,
    rating: 4.98,
    reviewCount: 94,
    baseHourlyRate: 220,
    minimumHours: 2,
    fairPriceEstimated: 660,
    bio: 'Tenor and alto saxophonist trained at Montreux academies. Translates vintage jazz clubs into tranquil courtyard gatherings, cocktail hour serenades, and ambient rooftop dinners.',
    handwrittenQuote: '“Jazz is an unhurried conversation whispered on a twilight breeze.”',
    sketchImage: jazzSaxSketch,
    repertoire: ['Autumn Leaves - Miles Davis style', 'Wave - Antônio Carlos Jobim', 'In a Sentimental Mood - Ellington', 'Cantaloupe Island - Herbie Hancock'],
    badges: ['Top Rated Virtuoso', 'Escrow Preferred', 'Shield Verified'],
    instruments: ['Tenor Saxophone', 'Alto Saxophone', 'Muted Trumpet'],
    shieldVerified: true,
    gigPoints: 4890,
    totalGigsCompleted: 61
  },
  {
    id: 'art-03',
    name: 'Clara Delacroix',
    handle: '@claraliveart',
    category: 'Live Painting',
    genre: 'Impressionist Oil & Botanical Gouache',
    location: 'Botanic Gardens & Bukit Timah',
    city: 'Singapore',
    coordinates: { lat: 1.3138, lng: 103.8159 },
    distanceKm: 4.5,
    rating: 4.99,
    reviewCount: 77,
    baseHourlyRate: 250,
    minimumHours: 3,
    fairPriceEstimated: 750,
    bio: 'Plein-air master transforming the live emotions of your nuptials or milestone jubilee into an heirloom oil canvas painted directly in front of your guests as the evening unfolds.',
    handwrittenQuote: '“A live painting breathes with the pulse of the room, keeping laughter wet on canvas.”',
    sketchImage: livePainterSketch,
    repertoire: ['Live Ceremony Keepsake (24x36 Canvas)', 'Reception Golden Hour Portraits', 'Botanical Guestbook Vignettes'],
    badges: ['Heirloom Artisan', '100% Five-Star Reviews', 'Shield Verified'],
    instruments: ['Fine Linen Easel', 'French Oil Paints', 'Pastel Gouache'],
    shieldVerified: true,
    gigPoints: 5120,
    totalGigsCompleted: 53
  },
  {
    id: 'art-04',
    name: 'Seraphina Lin',
    handle: '@seraphinastrings',
    category: 'Classical Strings',
    genre: 'Chamber Violin & Contemporary Elegance',
    location: 'Marina Bay & Civic District',
    city: 'Singapore',
    coordinates: { lat: 1.2895, lng: 103.8545 },
    distanceKm: 1.4,
    rating: 4.95,
    reviewCount: 82,
    baseHourlyRate: 190,
    minimumHours: 2,
    fairPriceEstimated: 570,
    bio: 'Conservatory first-chair soloist pairing timeless Bach sonatas with modern Bridgerton-style romantic string arrangements under glass conservatory roofs and cathedral halls.',
    handwrittenQuote: '“The resonance of horsehair and maple touches what spoken toasts cannot reach.”',
    sketchImage: violinistSketch,
    repertoire: ['Bach Partita No. 2', 'Wildest Dreams (String Adaptation)', 'Air on the G String', 'Merry-Go-Round of Life (Hisaishi)'],
    badges: ['Concertmaster Gold', 'Instant Escrow Acceptance', 'Shield Verified'],
    instruments: ['1890 Italian Master Violin', 'Acoustic Carbon Bow'],
    shieldVerified: true,
    gigPoints: 3980,
    totalGigsCompleted: 48
  }
];

export const INITIAL_B2B_LEADS: B2BLead[] = [
  {
    id: 'lead-01',
    plannerName: 'Evelyn Hart',
    companyName: 'Atelier Bloom Weddings',
    eventTitle: 'Botanical Orangery Wedding - 120 Guests',
    budget: 850,
    eventDate: '2026-11-14',
    requiredGenre: 'Acoustic Soloist or Classical Strings',
    location: 'Fort Canning Green, Singapore',
    status: 'OPEN'
  },
  {
    id: 'lead-02',
    plannerName: 'Marcus Thorne',
    companyName: 'Equinox Luxury Gatherings',
    eventTitle: 'Private Rooftop Gala Dinner',
    budget: 1200,
    eventDate: '2026-11-20',
    requiredGenre: 'Jazz & Blues Quartet or Saxophone Soloist',
    location: 'Marina Bay Sands Private Pavilion',
    status: 'OPEN'
  },
  {
    id: 'lead-03',
    plannerName: 'Sophia Lee',
    companyName: 'Artisan Heritage Celebrations',
    eventTitle: 'Silver Jubilee & Live Canvas Keepsake',
    budget: 950,
    eventDate: '2026-12-05',
    requiredGenre: 'Live Painting or Impressionist Canvas',
    location: 'Chijmes Heritage Hall',
    status: 'OPEN'
  }
];
