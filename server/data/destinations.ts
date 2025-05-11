export const destinations = [
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    description: "A transcontinental city straddling Europe and Asia, Istanbul offers a blend of historical sites, vibrant culture, and delicious cuisine. With your Bahraini passport, you can enjoy visa-free entry for up to 90 days.",
    imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    rating: 4.8,
    reviewCount: 2345,
    flightTime: "~3.5 hours",
    bestSeason: "Apr-Jun, Sep-Nov",
    languages: ["Turkish", "English"],
    currency: "Turkish Lira",
    currencyCode: "TRY",
    exchangeRate: 93.45, // BHD to TRY
    timeDifference: "+0 hours from Bahrain",
    visaStatus: "Visa-free for Bahrainis",
    visaInfo: "No visa required for stays up to 90 days within a 180-day period",
    muslimFriendly: {
      prayer: true,
      halal: true,
      alcohol: false, // Alcohol is available
      privacy: false
    },
    costIndicators: {
      meal: { min: 10, max: 20 },
      transport: { min: 0.5, max: 1 },
      hotel: { min: 30, max: 60 },
      attraction: { min: 2, max: 5 }
    },
    embassy: {
      address: "Maçka Cad. Narcis Apt. No: 35/5, Teşvikiye, Şişli, Istanbul",
      phone: "+90 212 259 81 41",
      emergency: "+90 532 546 7235"
    },
    documents: [
      {
        name: "Passport",
        status: "required",
        description: "Must be valid for at least 6 months beyond your stay"
      },
      {
        name: "Visa",
        status: "required",
        description: "No visa required for stays up to 90 days within a 180-day period"
      },
      {
        name: "Return Ticket",
        status: "recommended",
        description: "Proof of return or onward travel may be requested"
      },
      {
        name: "Travel Insurance",
        status: "recommended",
        description: "Not mandatory but highly recommended"
      },
      {
        name: "COVID-19 Requirements",
        status: "info",
        description: "No current restrictions for Bahraini travelers"
      }
    ]
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    description: "A city of superlatives, Dubai offers luxury shopping, ultramodern architecture, and a vibrant nightlife. For Bahraini citizens, travel is easy with just your ID card or GCC passport.",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    rating: 4.9,
    reviewCount: 3456,
    flightTime: "~1 hour",
    bestSeason: "Nov-Apr",
    languages: ["Arabic", "English"],
    currency: "UAE Dirham",
    currencyCode: "AED",
    exchangeRate: 9.72, // BHD to AED
    timeDifference: "+0 hours from Bahrain",
    visaStatus: "Visa on arrival",
    visaInfo: "Bahraini citizens can enter with ID card or GCC passport",
    muslimFriendly: {
      prayer: true,
      halal: true,
      alcohol: false, // Alcohol is available but restricted
      privacy: true
    },
    costIndicators: {
      meal: { min: 15, max: 35 },
      transport: { min: 1, max: 3 },
      hotel: { min: 50, max: 150 },
      attraction: { min: 5, max: 25 }
    },
    embassy: {
      address: "Bahrain Embassy is in Abu Dhabi, not Dubai",
      phone: "+971 2 665 7500",
      emergency: "+971 50 600 0404"
    },
    documents: [
      {
        name: "Passport/ID",
        status: "required",
        description: "GCC National ID or valid passport"
      },
      {
        name: "Visa",
        status: "info",
        description: "Not required for Bahraini citizens"
      },
      {
        name: "Return Ticket",
        status: "info",
        description: "Not typically required for GCC citizens"
      },
      {
        name: "COVID-19 Requirements",
        status: "info",
        description: "No current restrictions for Bahraini travelers"
      }
    ]
  },
  {
    id: "kuala-lumpur",
    name: "Kuala Lumpur",
    country: "Malaysia",
    description: "Malaysia's capital is a melting pot of cultures offering incredible cuisine, shopping and Muslim-friendly facilities. Bahraini travelers can enjoy visa-free entry for up to 90 days.",
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    rating: 4.7,
    reviewCount: 1890,
    flightTime: "~7 hours",
    bestSeason: "Mar-Sep",
    languages: ["Malay", "English", "Chinese", "Tamil"],
    currency: "Malaysian Ringgit",
    currencyCode: "MYR",
    exchangeRate: 10.89, // BHD to MYR
    timeDifference: "+5 hours from Bahrain",
    visaStatus: "Visa-free for Bahrainis",
    visaInfo: "No visa required for stays up to 90 days",
    muslimFriendly: {
      prayer: true,
      halal: true,
      alcohol: false, // Available but not prominent
      privacy: true
    },
    costIndicators: {
      meal: { min: 3, max: 10 },
      transport: { min: 0.3, max: 1 },
      hotel: { min: 20, max: 60 },
      attraction: { min: 1, max: 5 }
    },
    embassy: {
      address: "No. 5, Lorong U-Thant, Off Jalan U-Thant, 55000 Kuala Lumpur",
      phone: "+60 3 2148 7373",
      emergency: "+60 12 626 7090"
    },
    documents: [
      {
        name: "Passport",
        status: "required",
        description: "Must be valid for at least 6 months beyond your stay"
      },
      {
        name: "Visa",
        status: "info",
        description: "No visa required for stays up to 90 days"
      },
      {
        name: "Return Ticket",
        status: "required",
        description: "Proof of return travel is required"
      },
      {
        name: "Travel Insurance",
        status: "recommended",
        description: "Highly recommended for international travel"
      },
      {
        name: "COVID-19 Requirements",
        status: "info",
        description: "No current restrictions for Bahraini travelers"
      }
    ]
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    description: "Paradise on Earth, the Maldives offers pristine beaches, crystal clear waters, and luxury accommodations. Bahraini citizens enjoy visa on arrival for tourist stays.",
    imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    rating: 4.9,
    reviewCount: 2100,
    flightTime: "~5 hours",
    bestSeason: "Nov-Apr",
    languages: ["Dhivehi", "English"],
    currency: "Maldivian Rufiyaa",
    currencyCode: "MVR",
    exchangeRate: 40.92, // BHD to MVR
    timeDifference: "+3 hours from Bahrain",
    visaStatus: "Visa on arrival",
    visaInfo: "Free visa on arrival for 30 days for Bahraini citizens",
    muslimFriendly: {
      prayer: true,
      halal: true,
      alcohol: false, // Available only in resort islands
      privacy: true
    },
    costIndicators: {
      meal: { min: 15, max: 40 },
      transport: { min: 5, max: 20 },
      hotel: { min: 100, max: 500 },
      attraction: { min: 10, max: 50 }
    },
    documents: [
      {
        name: "Passport",
        status: "required",
        description: "Must be valid for at least 6 months beyond your stay"
      },
      {
        name: "Visa",
        status: "info",
        description: "Free visa on arrival for 30 days"
      },
      {
        name: "Return Ticket",
        status: "required",
        description: "Proof of return travel is required"
      },
      {
        name: "Hotel Reservation",
        status: "required",
        description: "Confirmed reservation for your entire stay"
      },
      {
        name: "Travel Insurance",
        status: "recommended",
        description: "Highly recommended for international travel"
      },
      {
        name: "COVID-19 Requirements",
        status: "info",
        description: "No current restrictions for Bahraini travelers"
      }
    ]
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    description: "The capital of Egypt offers ancient wonders, rich history, and cultural experiences. Bahraini travelers can obtain a visa on arrival for tourism purposes.",
    imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    rating: 4.5,
    reviewCount: 1785,
    flightTime: "~2.5 hours",
    bestSeason: "Oct-Apr",
    languages: ["Arabic", "English"],
    currency: "Egyptian Pound",
    currencyCode: "EGP",
    exchangeRate: 82.12, // BHD to EGP
    timeDifference: "+1 hour from Bahrain",
    visaStatus: "Visa on arrival",
    visaInfo: "Visa on arrival available for Bahraini citizens for stays up to 30 days",
    muslimFriendly: {
      prayer: true,
      halal: true,
      alcohol: false, // Available but not prominent
      privacy: false
    },
    costIndicators: {
      meal: { min: 2, max: 10 },
      transport: { min: 0.2, max: 1 },
      hotel: { min: 15, max: 50 },
      attraction: { min: 1, max: 5 }
    },
    embassy: {
      address: "10 Ahmed Nessim St., Giza, Cairo",
      phone: "+20 2 3748 6144",
      emergency: "+20 100 600 0404"
    },
    documents: [
      {
        name: "Passport",
        status: "required",
        description: "Must be valid for at least 6 months beyond your stay"
      },
      {
        name: "Visa",
        status: "required",
        description: "Visa on arrival available for 30 days, fee approximately $25"
      },
      {
        name: "Return Ticket",
        status: "recommended",
        description: "Proof of return travel may be requested"
      },
      {
        name: "Hotel Reservation",
        status: "recommended",
        description: "Proof of accommodation may be requested"
      },
      {
        name: "Travel Insurance",
        status: "recommended",
        description: "Highly recommended for international travel"
      },
      {
        name: "COVID-19 Requirements",
        status: "info",
        description: "No current restrictions for Bahraini travelers"
      }
    ]
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    description: "This vibrant city offers colorful markets, beautiful architecture and rich cultural experiences. Bahraini citizens can stay up to 90 days without a visa.",
    imageUrl: "https://images.unsplash.com/photo-1597212720128-3332d0e3a837?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    rating: 4.6,
    reviewCount: 1560,
    flightTime: "~6 hours",
    bestSeason: "Mar-May, Sep-Nov",
    languages: ["Arabic", "French", "Berber"],
    currency: "Moroccan Dirham",
    currencyCode: "MAD",
    exchangeRate: 25.86, // BHD to MAD
    timeDifference: "-3 hours from Bahrain",
    visaStatus: "Visa-free for Bahrainis",
    visaInfo: "No visa required for stays up to 90 days",
    muslimFriendly: {
      prayer: true,
      halal: true,
      alcohol: false, // Available but limited
      privacy: false
    },
    costIndicators: {
      meal: { min: 3, max: 15 },
      transport: { min: 0.3, max: 1.5 },
      hotel: { min: 20, max: 70 },
      attraction: { min: 2, max: 8 }
    },
    embassy: {
      address: "10, Rue Tiddas, Hassan, Rabat",
      phone: "+212 537 767 051",
      emergency: "+212 661 205 222"
    },
    documents: [
      {
        name: "Passport",
        status: "required",
        description: "Must be valid for at least 6 months beyond your stay"
      },
      {
        name: "Visa",
        status: "info",
        description: "No visa required for stays up to 90 days"
      },
      {
        name: "Return Ticket",
        status: "recommended",
        description: "Proof of return travel may be requested"
      },
      {
        name: "Hotel Reservation",
        status: "recommended",
        description: "Proof of accommodation may be requested"
      },
      {
        name: "Travel Insurance",
        status: "recommended",
        description: "Highly recommended for international travel"
      },
      {
        name: "COVID-19 Requirements",
        status: "info",
        description: "No current restrictions for Bahraini travelers"
      }
    ]
  }
];
