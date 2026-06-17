// Shop Dynamic Clothing & Accessories Database
// Generates 50 products per category (Men, Women, Kids) for a total of 150 items.
// Using curated lists of Unsplash IDs to build 4-5 image galleries per product.

const menPhotoIds = [
  '1596755094514-f87e34085b2c', '1614975058789-41316d0e2e9c', '1521572267360-ee0c2909d518',
  '1617137968427-85924c800a22', '1624378439575-d8705ad7ae80', '1576995853123-5a10305d93c0',
  '1490114538077-0a7f8cb49891', '1618886614638-80e3c103d31a', '1507679799987-c73779587ccf',
  '1617137984095-74e4e5e3613f', '1488161628813-04466f872be2', '1505022610485-0249ba5b3675',
  '1539571696357-5a69c17a67c6', '1501196354995-cbb51c65aaea', '1492562080023-ab3db95bfbce'
];

const womenPhotoIds = [
  '1574169208507-84376144848b', '1595777457583-95e059d581b8', '1591047139829-d91aecb6caea',
  '1544005313-94ddf0286df2', '1520903928273-024851a27e4f', '1509551388413-e18d0ac5d495',
  '1485968579580-b6d095142e6e', '1603252109303-2751441dd157', '1609357605129-26f69add5d6e',
  '1551488831-00ddcb6c6bd3', '1494790108377-be9c29b29330', '1524504388940-b1c1722653e1',
  '1534528741775-53994a69daeb', '1517841905240-472988babdf9', '1581044777550-2cfa03e6b840'
];

const kidsPhotoIds = [
  '1519457431-44ccd64a579b', '1546015720-b8b30df5aa27', '1522771739844-6a9f6d5f14af',
  '1622290291468-a28f7a7dc6a8', '1515488042361-404e9250afef', '1503919545889-aef636e10ad4',
  '1602810318383-e386cc2a3ccf', '1611601679655-7c8bc197f0c6', '1507652313519-d4e9174996dd',
  '1566516171-4110b6012640', '1503919005314-079c13d9d20c', '1519689680058-324335c77eb2',
  '1513907697850-090001135ee8', '1607522370245-f157f7b3b3d1', '1604917621956-10dfa7cce2e7'
];

const materials = ['Organic Cotton', 'Supima Cotton', 'Merino Wool', 'Linen Blend', 'Heavyweight Terry', 'Raw Denim', 'Recycled Nylon'];
const fits = ['Relaxed Fit', 'Tailored Fit', 'Classic Fit', 'Oversized Fit', 'Slim Fit', 'Boxy Silhouette'];
const colors = ['Off-White', 'Ink Black', 'Concrete Gray', 'Slate Blue', 'Olive Green', 'Oatmeal Melange', 'Earthy Tan'];

function makeUrl(photoId) {
  return `https://images.unsplash.com/photo-${photoId}?w=700&auto=format&fit=crop&q=80`;
}

function generateGallery(category, index) {
  const ids = category === 'men' ? menPhotoIds : (category === 'women' ? womenPhotoIds : kidsPhotoIds);
  const gallery = [];
  // Gather 4 distinct photos by shifting offset based on index
  for (let i = 0; i < 4; i++) {
    const photoId = ids[(index + i) % ids.length];
    gallery.push(makeUrl(photoId));
  }
  return gallery;
}

function generateProducts() {
  const list = [];
  
  const menTemplates = [
    { title: 'Linen Button-Down Shirt', price: 2899 },
    { title: 'Waffle Crewneck Sweater', price: 3499 },
    { title: 'Heavyweight Boxy Tee', price: 1499 },
    { title: 'Canvas Chore Jacket', price: 4999 },
    { title: 'Tailored Linen Trouser', price: 3999 },
    { title: 'Organic Raw Denim Jacket', price: 5499 },
    { title: 'Structured Suit Blazer', price: 8999 },
    { title: 'Minimalist Oxford Shoe', price: 6499 },
    { title: 'Earthy Suede Overshirt', price: 4499 },
    { title: 'Casual Ribbed Beanie', price: 999 }
  ];

  const womenTemplates = [
    { title: 'Oversized Bouclé Crewneck', price: 3999 },
    { title: 'Ribbed Knit Midi Dress', price: 4899 },
    { title: 'Double-Breasted Trench Coat', price: 7999 },
    { title: 'Minimalist Linen Slip Dress', price: 3499 },
    { title: 'Merino Wool Fringe Scarf', price: 2499 },
    { title: 'Wide-Leg Crepe Trouser', price: 4299 },
    { title: 'Structured Silk Blouse', price: 5299 },
    { title: 'Pointed Suede Mule', price: 5899 },
    { title: 'Cropped Cashmere Cardigan', price: 6999 },
    { title: 'Relaxed Tailored Blazer', price: 7499 }
  ];

  const kidsTemplates = [
    { title: 'Organic Cotton Dungaree', price: 1899 },
    { title: 'Ribbed Baby Bonnet', price: 899 },
    { title: 'Fleece Teddy Zip Jacket', price: 2499 },
    { title: 'Sweatshirt & Jogger Set', price: 2899 },
    { title: 'Easy-Strap Canvas Sneaker', price: 1999 },
    { title: 'Ribbed Cotton Leggings', price: 1199 },
    { title: 'Cozy Wool Knit Mittens', price: 799 },
    { title: 'Quilted Sleep Sack', price: 3199 },
    { title: 'Sun Protection Bucket Hat', price: 999 },
    { title: 'Knitted Jumper Set', price: 3499 }
  ];

  // Helper to generate a category list of 50 items
  function populate(category, templates) {
    for (let i = 1; i <= 50; i++) {
      const template = templates[(i - 1) % templates.length];
      const mat = materials[(i + 1) % materials.length];
      const fit = fits[(i + 2) % fits.length];
      const col = colors[(i + 3) % colors.length];
      
      const prefix = i <= 10 ? 'Classic' : (i <= 20 ? 'Signature' : (i <= 30 ? 'Premium' : (i <= 40 ? 'Essential' : 'Archival')));
      const title = `${prefix} ${template.title} (${col})`;
      const id = `${category}-${i}`;
      
      const rating = (4.0 + (i % 11) * 0.1).toFixed(1);
      const reviewCount = 10 + (i * 9) % 490;
      
      const images = generateGallery(category, i);
      const price = template.price + (i % 5) * 200; // Vary prices slightly
      
      const description = `This ${title.toLowerCase()} is designed for everyday longevity and premium wear. Meticulously constructed from high-grade ${mat.toLowerCase()} in a ${fit.toLowerCase()} pattern. This product is structured to fall clean against the body. Made in India.`;

      const specs = {
        'Material': mat,
        'Fit': fit,
        'Color': col,
        'Care Instructions': mat.includes('Wool') || mat.includes('Silk') ? 'Dry clean only' : 'Machine wash cold, air dry',
        'Origin': 'Made in India',
        'Weave': 'Compact low-tension weave'
      };

      list.push({
        id,
        title,
        category,
        price,
        rating: parseFloat(rating),
        reviewCount,
        images,
        description,
        specs
      });
    }
  }

  populate('men', menTemplates);
  populate('women', womenTemplates);
  populate('kids', kidsTemplates);

  return list;
}

// Global products database
window.productsDb = generateProducts();

// Helper functions for easy querying
window.getProductById = function(id) {
  return window.productsDb.find(p => p.id === id);
};

window.getProductsByCategory = function(category) {
  return window.productsDb.filter(p => p.category === category);
};

window.getTrendingProducts = function(limit = 50) {
  // Let's mix men, women, kids to represent trending storefronts
  const trending = [];
  for (let i = 0; i < limit; i++) {
    const idx = (i * 3) % window.productsDb.length;
    // shift offset if we get collisions
    let p = window.productsDb[idx];
    if (trending.includes(p)) {
      p = window.productsDb[(idx + 1) % window.productsDb.length];
    }
    trending.push(p);
  }
  return trending;
};
