// =====================================================================
//  answers.js : réglages du calendrier + les 24 albums et leurs réponses
//  (majuscules, accents, tirets, apostrophes et espaces sont ignorés
//   lors de la vérification, et une petite faute de frappe est tolérée)
// =====================================================================
window.CONFIG = {
  year: 2026,            // année du calendrier
  month: 12,             // mois de départ (12 = décembre) : le jour 1 s'ouvre le 1er décembre
  totalDays: 24,
  attempts: 10,          // essais par question
  pointsPerQuestion: 2,  // points par bonne réponse
  hintPenalty: 1         // points perdus si on clique sur INDICES
};

// artist = nom affiché ; artists = toutes les réponses acceptées
// album = nom affiché ; albumAlt = autres réponses acceptées
window.ANSWERS = [
  { day: 1, img: "images/jour-01.jpg",
    album: "American Garage", albumAlt: ["Garage"],
    artist: "Pat Metheny Group",
    artists: ["Pat Metheny, Lyle Mays, Pat Metheny Group", "Pat metheny group", "Path Metheny group, Lyle Mays", "Path Metheny, Lyle Mays", "Pat Metheny", "Metheny", "Pat Metheny Lyle Mays", "Lyle Mays"],
    titles: ["Heartland", "Airstream", "The search", "American garage", "The epic"],
    year: "1979",
    spotify: "https://open.spotify.com/track/6y7jqkRyKwK42B94iQvQPn?si=BVIjq4LiRm-dNI9H12ydig&utm_source=copy-link" },

  { day: 2, img: "images/jour-02.jpg",
    album: "Misplaced Childhood", albumAlt: ["Displaced childhood"],
    artist: "Marillion", artists: ["Marillion"],
    titles: ["Pseudo silk kimono", "Kayleigh", "Lavender", "Bitter suite", "Heart of Lothian", "Waterhole", "Lords of the backstage", "Blind curve", "Childhood's end?", "White Feather"],
    year: "1985",
    spotify: "https://open.spotify.com/track/6qWIU0QKCQjwSHx7adGXKs?si=1_yYeF9QSPeKuI2XbLcA4w&utm_source=copy-link" },

  { day: 3, img: "images/jour-03.jpg",
    album: "The Snow Goose", albumAlt: ["Snow goose"],
    artist: "Camel", artists: ["Camel"],
    titles: ["The great marsh", "Rhayader", "Rhayader goes to town", "Sanctuary", "Fritha", "The snow goose", "The now goose", "Friendship", "Migration", "Rhayader alone", "Flight of the snow goose", "Preparation", "Dunkirk", "Epitaph", "Fritha alone", "La princesse perdue"],
    year: "1975",
    spotify: "https://open.spotify.com/track/5RETGB7Fe6KxAEXevMpmTu?si=BblreJ_CR_65SHhy476Zqg&utm_source=copy-link" },

  { day: 4, img: "images/jour-04.jpg",
    album: "The Art of Loving", albumAlt: ["Art of loving"],
    artist: "Olivia Dean", artists: ["Olivia Dean"],
    titles: ["The art of loving", "Nice to each other", "Lady lady", "Close up", "So easy", "Let alone the one you love", "Man I need", "Something inbetween", "Loud", "Baby step", "A couple minutes", "I've seen it"],
    year: "2025",
    spotify: "https://open.spotify.com/track/3Vd4fHzwS6pBS3muymjiDi?si=1AoxnJhtQvyKBe9GdO5NnA&utm_source=copy-link" },

  { day: 5, img: "images/jour-05.jpg",
    album: "No Jacket Required", albumAlt: [],
    artist: "Phil Collins", artists: ["Phil Collins"],
    titles: ["Sussudio", "Only you know and I know", "Long long way to go", "I Don't wanna know", "One more light", "Don't lose my number", "Who said I would", "Doesn't anybody stay together anymore", "Inside out", "Take me home", "We said hello Goodbye"],
    year: "1985",
    spotify: "https://open.spotify.com/track/765E8MK8PYdkDQilOkEDdD?si=SeeACeKyTeGAUGRG3o4jeA&utm_source=copy-link" },

  { day: 6, img: "images/jour-06.jpg",
    album: "Amandla", albumAlt: [],
    artist: "Miles Davis", artists: ["Miles Davis"],
    titles: ["Catembe", "Cobra", "Big time", "Hannibal", "Jo-jo", "Amandla", "Jilli", "Mr pastorius"],
    year: "1989",
    spotify: "https://open.spotify.com/track/6RIEY59i1gWwdDP65GKmID?si=InV6irwUTL6rkOpRXH1r5w&utm_source=copy-link" },

  { day: 7, img: "images/jour-07.jpg",
    album: "Goodbye Yellow Brick Road", albumAlt: ["Yellow brick road"],
    artist: "Elton John", artists: ["Elton John"],
    titles: ["Funeral for a friend", "Candle in the Wind", "Bennie and the jets", "Goodbye yellow brick road", "This song has no title", "Grey seal", "Jamaica jerk-off", "I've seen that movie too", "Sweet painted lady", "The ballad of danny bailey", "Dirty little girl", "All the girls love Alice", "Your sister can't twist", "Saturday night's alright", "Roy rogers", "Social disease", "Harmony"],
    year: "1973",
    spotify: "https://open.spotify.com/track/12yHvSYFXI7PGzNecUvIDu?si=zd-aHV3iTgOTqZPe824luw&utm_source=copy-link" },

  { day: 8, img: "images/jour-08.jpg",
    album: "Twentysomething", albumAlt: ["Twenty something"],
    artist: "Jamie Cullum", artists: ["Jamie Cullum"],
    titles: ["What a difference a day made", "These are the days", "Singin'in the rain", "Twentysomething", "But for now", "Old devil moon", "I could have danced all night", "Blame it on my youth", "I get a kick out of you", "All at sea", "Wind cries mary", "Lover, you should have come over", "It's about time", "Next year baby", "Everlasting love", "High and dry", "Frontin", "Can't we be friends?", "God only knows"],
    year: "2003",
    spotify: "https://open.spotify.com/track/4fOwKPYZUkIlFOzDNlp3RL?si=RpVC9aBWQ1yinAPLznnjDw&utm_source=copy-link" },

  { day: 9, img: "images/jour-09.jpg",
    album: "Internal Exile", albumAlt: [],
    artist: "Fish", artists: ["Fish"],
    titles: ["Shadowplay", "Credo", "Just good friends", "Favourite Stranger", "Lucky", "Dear friend", "Tongues", "Internal exile", "Something in the air", "Carnival man", "Poet's moon"],
    year: "1991",
    spotify: "https://open.spotify.com/track/0cNrpJGYvVifT4kGjlBWj6?si=-B0CuWcLR3alaFGOiKiODA&utm_source=copy-link" },

  { day: 10, img: "images/jour-10.jpg",
    album: "Eye in the Sky", albumAlt: [],
    artist: "The Alan Parsons Project", artists: ["The alan parsons project", "Alan Parsons", "Alan Parsons Project"],
    titles: ["Sirius", "Eye in the sky", "Children of the moon", "Gemini", "Silence and I", "You're gonna get your fingers burned", "Psychobabble", "Mammagamma", "Step by step", "Old and Wise"],
    year: "1982",
    spotify: "https://open.spotify.com/track/0hSs4vOZo1OkRiAOoLafrT?si=ILZhGySzQza70dtd1dC2zg&utm_source=copy-link" },

  { day: 11, img: "images/jour-11.jpg",
    album: "Travelling Without Moving", albumAlt: ["Traveling without moving"],
    artist: "Jamiroquai", artists: ["Jamiroquai"],
    titles: ["Virtual insanity", "Cosmic girl", "Use the force", "Everyday", "Alright", "High times", "Drifting along", "Didjerama", "Didjital vibrations", "Travelling without Moving", "You are my love", "Spend a lifetime", "Funktion"],
    year: "1996",
    spotify: "https://open.spotify.com/track/6y0Etr2KJr0sdcEp7ajoUK?si=lhGvPq83RH-fTuEf7CbEfA&utm_source=copy-link" },

  { day: 12, img: "images/jour-12.jpg",
    album: "Rumours", albumAlt: ["Rumors"],
    artist: "Fleetwood Mac", artists: ["Fleetwood Mac"],
    titles: ["Second Hand news", "Dreams", "Never going back again", "Don't stop", "Go your own way", "Songbird", "The chain", "You make loving fun", "I Don't want to know", "oh daddy", "Gold dust woman", "Silver springs"],
    year: "1977",
    spotify: "https://open.spotify.com/track/4xh7W7tlNMIczFhupCPniY?si=Fxmk1bfVTlyWQB-sMJiYyQ&utm_source=copy-link" },

  { day: 13, img: "images/jour-13.jpg",
    album: "Songs from the Big Chair", albumAlt: ["Songs from the big chair"],
    artist: "Tears for Fears", artists: ["Tears for fears"],
    titles: ["Shout", "The working hour", "Everybody wants to rule the world", "Mother talk", "I Believe", "Broken", "Head over heels", "Listen"],
    year: "1985",
    spotify: "https://open.spotify.com/track/2zMZktCS0HT1GHIgEsf6kx?si=ZtqiAwq3TO6GuqWtREWggw&utm_source=copy-link" },

  { day: 14, img: "images/jour-14.jpg",
    album: "Reggatta de Blanc", albumAlt: ["Reggata de blanc", "Regatta de blanc"],
    artist: "The Police", artists: ["The police", "Police"],
    titles: ["Message in a bottle", "Reggatta de blanc", "It's alright for you", "Bring on the night", "Deathwish", "Walking on the moon", "On any other day", "The bed's too big without you", "Contact", "Does everyone stare", "No time this time"],
    year: "1979",
    spotify: "https://open.spotify.com/track/1oYYd2gnWZYrt89EBXdFiO?si=JhKtZVirTj-cEjvC2SsP2w&utm_source=copy-link" },

  { day: 15, img: "images/jour-15.jpg",
    album: "Christopher Cross", albumAlt: [],
    artist: "Christopher Cross", artists: ["Christopher Cross"],
    titles: ["Say you'll be mine", "I really Don't know anymore", "Spinning", "Never be the same", "Poor Shirley", "Ride like the Wind", "The light is on", "Sailing", "Minstrel gigolo"],
    year: "1979",
    spotify: "https://open.spotify.com/track/7gUMShP1l20tC0xf17Zplk?si=UjXr5J6BTQSeEZxU-cswkw&utm_source=copy-link" },

  { day: 16, img: "images/jour-16.jpg",
    album: "In Square Circle", albumAlt: [],
    artist: "Stevie Wonder", artists: ["Stevie Wonder"],
    titles: ["Part-time lover", "I love you too much", "Whereabouts", "Stranger on the shore of love", "Never In your sun", "Spiritual walkers", "Land of La la", "Go home", "Overjoyed", "It's Wrong"],
    year: "1985",
    spotify: "https://open.spotify.com/track/2lnQcP5hr4RKR63TFvnI4k?si=DeAhgeqIRfWRE8OXazB3HQ&utm_source=copy-link" },

  { day: 17, img: "images/jour-17.jpg",
    album: "Brothers in Arms", albumAlt: [],
    artist: "Dire Straits", artists: ["Dire straits"],
    titles: ["So far Away", "Money for Nothing", "Walk of life", "Your latest trick", "Why worry", "Ride across the river", "The man's too strong", "One world", "Brothers in arms"],
    year: "1985",
    spotify: "https://open.spotify.com/track/5Hk4Mpex0s2ndUpDQ5v2rU?si=RgUHCwnAQIuzV0XGPiLMOw&utm_source=copy-link" },

  { day: 18, img: "images/jour-18.jpg",
    album: "Toto", albumAlt: [],
    artist: "Toto", artists: ["TOTO"],
    titles: ["Child's anthem", "I'll supply the love", "Georgy Porgy", "Manuela Run", "You are the flower", "Girl Goodbye", "Takin' it back", "Rockmaker", "Hold the line", "Angela"],
    year: "1978",
    spotify: "https://open.spotify.com/track/5jQcJ2st6yHWhUBjoDoZPH?si=zFKMB7qnQI6syE2jIbkcQw&utm_source=copy-link" },

  { day: 19, img: "images/jour-19.jpg",
    album: "Yellowjackets", albumAlt: ["Yellow jackets"],
    artist: "Yellowjackets", artists: ["Yellowjackets", "Yellow jackets"],
    titles: ["Matinee idol", "Imperial strut", "Sittin'in it", "Rush hour", "The hornet", "Priscilla", "It's almost gone"],
    year: "1981",
    spotify: "https://open.spotify.com/track/2J4JAUXA3rcqda4jWdGuSm?si=k6KUgXtBSzKfbB9diWEKNg&utm_source=copy-link" },

  { day: 20, img: "images/jour-20.jpg",
    album: "Let Me in Your Life", albumAlt: [],
    artist: "Aretha Franklin", artists: ["Aretha Franklin"],
    titles: ["Let me in your life", "Every natural thing", "Ain't Nothing like the real thing", "I'm in love", "Until you come back to me", "The masquerade is over", "With pen in hand", "Oh baby", "Eight days on the road", "If you Don't think", "A song for you"],
    year: "1974",
    spotify: "https://open.spotify.com/track/3iX0BMs9dX9CsgrHhiB173?si=7PhOERvSRTOzt6MB0wLHRw&utm_source=copy-link" },

  { day: 21, img: "images/jour-21.jpg",
    album: "The Dark Side of the Moon", albumAlt: ["Dark side of the moon", "Dark side"],
    artist: "Pink Floyd", artists: ["Pink Floyd"],
    titles: ["Speak to me", "Breathe", "On the run", "Time", "The great gig in the sky", "Money", "Us and them", "Any colour you like", "Brain damage", "Eclipse"],
    year: "1973",
    spotify: "https://open.spotify.com/track/1TKTiKp3zbNgrBH2IwSwIx?si=wOTqzgu6T0CnJGFA6V61dA&utm_source=copy-link" },

  { day: 22, img: "images/jour-22.jpg",
    album: "Point of Know Return", albumAlt: [],
    artist: "Kansas", artists: ["Kansas"],
    titles: ["Point of know return", "Paradox", "The spider", "Portrait", "Closet chronicles", "Lightning's hand", "Dust in the Wind", "Sparks of the tempest", "Nobody's home", "Hopelessly human"],
    year: "1977",
    spotify: "https://open.spotify.com/track/6zeE5tKyr8Nu882DQhhSQI?si=hGxjCjlURmSE9XQ5STdNzQ&utm_source=copy-link" },

  { day: 23, img: "images/jour-23.jpg",
    album: "Breakin' Away", albumAlt: ["Breaking away"],
    artist: "Al Jarreau", artists: ["Al Jarreau"],
    titles: ["Closer to your love", "My old friend", "We're in this love together", "Easy", "Our love", "Breakin' away", "Roof garden", "Teach me tonight", "Blue rondo a la turk"],
    year: "1981",
    spotify: "https://open.spotify.com/track/1CpDrx0Q7f2Wv3tBXDMt6z?si=reclFdsDQQmr_DYx1xJYNA&utm_source=copy-link" },

  { day: 24, img: "images/jour-24.jpg",
    album: "Positivity", albumAlt: [],
    artist: "Incognito", artists: ["Incognito"],
    titles: ["Still a friend of mine", "Smiling faces", "Where do we go from here", "Positivity", "Deep waters", "Pieces of a dream", "Talkin' Loud", "Thinking about tomorrow", "Do right", "Inversions", "Better days", "Keep the fires burning", "Givin' it up"],
    year: "1993",
    spotify: "https://open.spotify.com/track/6dHsH2lflw9oNBSJ8z60Q5?si=2RF7migiSwCc7vyssEVrUQ&utm_source=copy-link" }
];
