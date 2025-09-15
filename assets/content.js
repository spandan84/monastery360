// Monastery360 external content configuration
// Replace the sample content below with your actual data.
// This file is optional. If present, the app will use it; otherwise it falls back to built-in mocks.

window.MONASTERY_CONTENT = {
  monasteries: [
    {
      id: 'rumtek',
      name: 'Rumtek Dharma Chakra Centre Monastery',
      description: 'The largest monastery in Sikkim, seat of the Karmapa, known for its golden stupa and Tibetan Buddhist relics.',
      image: 'https://www.shutterstock.com/image-photo/gangtok-sikkim-india-may-30-600nw-2447966373.jpg',
      photos: [
        'https://www.shutterstock.com/image-photo/door-rumtek-monasteryalso-called-dharma-600nw-2285344679.jpg',
        'https://www.shutterstock.com/image-photo/rumtek-monastery-known-dharma-chakra-600nw-2654695593.jpg',
        'https://www.shutterstock.com/image-photo/exterior-dharma-chakra-center-rumtek-600nw-2606189285.jpg',
        'https://www.shutterstock.com/image-photo/beautiful-ceiling-wall-dharma-chakra-600nw-2611712417.jpg'
      ],
      contact: {
        phone: '+91-3592-290254',
        email: 'contact@rumtek.org',
        address: 'Rumtek, East Sikkim 737135'
      },
      nearbySpots: [
        { name: 'Gangtok City Center', distanceKm: 23 },
        { name: 'Tsomgo Lake', distanceKm: 46 },
        { name: 'Enchey Monastery', distanceKm: 21 }
      ],
      location: { lat: 27.2886861, lng: 88.5614622  },
      established: '16th century',
      type: 'Tibetan Buddhist monastery',
      highlights: ['Seat of the Karmapa in exile', 'famed for its sacred relics and Tibetan architecture']
    },

    {
      id: 'pemayangtse',
      name: 'Pemayangtse Monastery',
      description: 'A 17th-century Nyingma monastery famed for its ancient paintings, sculptures, and panoramic view of Kanchenjunga.',
      image: 'https://t3.ftcdn.net/jpg/04/28/14/14/360_F_428141483_7USn9OKlvj2nXihXpD4kVKlproOjRtaO.webp',
      photos: [
        'https://t4.ftcdn.net/jpg/01/65/41/19/360_F_165411960_NFzo9QyNAwaQ1kJnzcuFCCu0QnSX8e0L.webp',
        'https://t3.ftcdn.net/jpg/01/10/43/16/360_F_110431603_hWNamXPNJN4Hzit2cT5NwohGMM0KhcIE.webp',
        'https://t3.ftcdn.net/jpg/01/91/51/14/360_F_191511453_Gi6BTD42BLUI99wIpURfmO0rcDp7mDpt.webp',
        'https://t3.ftcdn.net/jpg/01/05/09/48/360_F_105094861_IGfmfZZMA2XoYj9GqArJQoLMpD3OAVvI.webp'
      ],
      contact: {
        phone: ['+91 3592 654321','AS demo'],
        email: ['contact@enchey-monastery.org','AS demo'],
        address: 'Pemayangtse Monastery, Pelling, West Sikkim, Sikkim 737113, India.'
      },
      nearbySpots: [
        { name: 'MG Marg', distanceKm: 3.2 },
        { name: 'Himalayan Zoological Park', distanceKm: 5.5 },
        { name: 'Rumtek Monastery', distanceKm: 21 }
      ],
      location: { lat: 27.3052201, lng: 88.2515852 },
      established: '16th 1650–1651',
      type: 'Tibetan Buddhist monastery',
      highlights: ['One of Sikkim’s oldest Nyingma monasteries', 'renowned for its purity', 'art', 'and hilltop views.']
    },

    {
      id: 'Phodong',
      name: 'Phodong Monastery',
      description: 'A serene hilltop monastery in North Sikkim, blending history, culture, and breathtaking Himalayan views.',
      image: 'https://c7.alamy.com/zooms/9/f7e3863509cd461ab4aad86283dbf3d2/eryxyg.jpg',
      photos: [
        'https://c7.alamy.com/zooms/9/0639801bad3849bfb013aa1be1c9fdd7/gd4yj8.jpg',
        'https://c7.alamy.com/zooms/9/b547a87ab6934b80ad81ee8845ab3c96/2st5fp6.jpg',
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/b0/6c/73/caption.jpg?w=800&h=400&s=1',
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/75/75/65/caption.jpg?w=700&h=400&s=1'
      ],
      contact: {
        phone: ['+91-3592-202218'],
        email: ['info@sikkimtourism.gov.in'],
        address: 'Phodong Monastery, Phodong, North Sikkim, Sikkim 737116, India.'
      },
      nearbySpots: [
        { name: 'Gangtok', distanceKm: 28 },
        { name: 'Seven Sisters Waterfall', distanceKm: 8 },
        { name: 'Mangan', distanceKm: 40 }
      ],
      location: { lat: 27.4128125, lng: 88.5804375 },
      established: 'Early 18th century (built in 1740, rebuilt in 1977',
      type: 'Buddhist Monastery (Kagyu sect)',
      highlights: ['Famous for its annual Chaam mask dance festival, vibrant murals, and being one of Sikkim’s six important monasteries.']
    },
  ],

  // Optional: attach a specific 360 video URL per tour
  tours: [
    {
      id: 'tour1',
      monasteryId: 'rumtek',
      title: 'Rumtek Monastery Grand Hall',
      description: 'Explore the magnificent main prayer hall with its intricate decorations and peaceful ambiance',
      image: 'https://www.shutterstock.com/image-photo/gangtok-sikkim-india-may-30-600nw-2447966373.jpg',
      duration: '3 minutes',
      featured: true,
      videoUrl: 'https://youtu.be/J8hUDrx5v6U?si=4k3jephzxDXg7prT'
    },
    {
      id: 'tour2',
      monasteryId: 'pemayangtse',
      title: 'Pemayangtse Monastery Panoramic Views',
      description: 'Experience breathtaking 360° views from the monastery courtyard overlooking Gangtok',
      image: 'https://t3.ftcdn.net/jpg/04/28/14/14/360_F_428141483_7USn9OKlvj2nXihXpD4kVKlproOjRtaO.webp',
      duration: '6 minutes',
      featured: true,
      video360Url: 'https://www.youtube.com/embed/8pR8F8aG8Zk'
    },
    {
      id: 'tour3',
      monasteryId: 'Phodong',
      title: 'Phodong Monastery',
      description: 'A serene hilltop monastery in North Sikkim, blending history, culture, and breathtaking Himalayan views.',
      image: 'https://c7.alamy.com/zooms/9/f7e3863509cd461ab4aad86283dbf3d2/eryxyg.jpg',
      duration: '',
      featured: true,
      video360Url: 'https://www.youtube.com/embed/8pR8F8aG8Zk'
    },
  ],

  // Digital archives content
  archives: [
    {
      id: 'archive1',
      title: 'Ancient Manuscripts of Sikkim',
      description: 'Collection of 15th century Buddhist texts digitized at high resolution.',
      image: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg',
      fileUrl: 'https://example.com/archives/ancient-manuscripts.pdf',
      type: 'manuscript'
    },
    {
      id: 'archive2',
      title: 'Sacred Murals – Rumtek',
      description: 'High resolution captures of key murals from Rumtek monastery.',
      image: 'https://images.pexels.com/photos/2775196/pexels-photo-2775196.jpeg',
      fileUrl: 'https://example.com/archives/rumtek-murals.zip',
      type: 'image'
    }
  ],

  // Optional: events fallback if Firebase is not used
  events: [
    { date: 'Mar 15', title: 'Losar Festival', desc: 'Tibetan New Year celebration at Rumtek Monastery', badge: 'Festival', color: 'bg-prayer-red' },
    { date: 'Apr 22', title: 'Buddha Jayanti', desc: 'Birth anniversary of Buddha across all monasteries', badge: 'Sacred Day', color: 'bg-monastery-gold' }
  ]
};
