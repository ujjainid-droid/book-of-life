/* ==========================================================================
   margo Podcast Agent — Data Store & Taste Engine
   ========================================================================== */

const INITIAL_PODCAST_STORE = {
  // 1. ACTIVE STAGE (Max 1 Primary Serial to eliminate overwhelm!)
  nowPlaying: {
    id: "bone-valley",
    title: "Bone Valley",
    host: "Gilbert King & Kelsey Decker",
    type: "serial",
    genre: "Investigative True Crime & Justice",
    rating: 5,
    status: "active",
    notes: "Pulitzer Prize-winning author investigating Leo Schofield's wrongful conviction. Meticulous court reporting, deep human empathy, extraordinary sound design.",
    currentEpisode: 8,
    totalEpisodes: 14,
    tags: ["Wrongful Conviction", "Investigative Journalism", "Courtroom", "Florida", "Must-Listen"]
  },

  // 2. EPISODIC ROTATION (Drop-in, short bites, no plot fatigue)
  episodicQueue: [
    {
      id: "lazy-genius",
      title: "The Lazy Genius Podcast",
      host: "Kendra Adachi",
      type: "episodic",
      genre: "Self-Management & Habits",
      frequency: "Weekly",
      vibe: "Be a genius about what matters and lazy about what doesn't.",
      tags: ["Habits", "Organization", "Life Hacks"]
    },
    {
      id: "savvy-psychologist",
      title: "The Savvy Psychologist",
      host: "Dr. Monica Johnson",
      type: "episodic",
      genre: "Psychology & Mental Health",
      frequency: "Weekly",
      vibe: "Quick, science-backed emotional wellness and brain science.",
      tags: ["Psychology", "Science", "Mental Wellness"]
    },
    {
      id: "modern-mentor",
      title: "Modern Mentor",
      host: "Rachel Cooke",
      type: "episodic",
      genre: "Career & Leadership",
      frequency: "Weekly",
      vibe: "Short, actionable leadership and workplace sanity tips.",
      tags: ["Career", "Productivity", "Leadership"]
    },
    {
      id: "economics-everyday",
      title: "The Economics of Everyday Things",
      host: "Zachary Crockett (Freakonomics)",
      type: "episodic",
      genre: "Curiosity & Economics",
      frequency: "Weekly",
      vibe: "Fascinating, 15-minute micro-narratives behind quirky economies.",
      tags: ["Economics", "Curiosity", "Bite-Sized"]
    },
    {
      id: "beyond-todo",
      title: "Beyond the To-Do List",
      host: "Erik Fisher",
      type: "episodic",
      genre: "Productivity",
      frequency: "Bi-weekly",
      vibe: "Meaningful productivity conversations focused on living well.",
      tags: ["Productivity", "Mindset"]
    },
    {
      id: "wait-wait",
      title: "Wait Wait... Don't Tell Me!",
      host: "Peter Sagal (NPR)",
      type: "episodic",
      genre: "News & Humor",
      frequency: "Weekly (Small Doses)",
      vibe: "NPR news quiz — great in short, lighthearted doses.",
      tags: ["Humor", "News", "NPR"]
    },
    {
      id: "life-kit-health",
      title: "Life Kit: Health (NPR)",
      host: "NPR",
      type: "episodic",
      genre: "Health & Wellness",
      frequency: "Drop-in",
      vibe: "Actionable, evidence-backed medical and wellness advice.",
      tags: ["Health", "NPR", "Habits"]
    }
  ],

  // 3. CURATED RECOMMENDATIONS (Ready for next binge after Bone Valley)
  curatedQueue: [
    {
      id: "proof-s1",
      rank: 1,
      title: "Proof (Season 1: Russian Roulette)",
      hosts: "Susan Simpson & Jacinda Davis",
      type: "serial",
      genre: "Investigative Legal Justice",
      episodes: 15,
      recommendationReason: "The closest sibling to Bone Valley. A boots-on-the-ground reinvestigation of a 1996 Georgia conviction that uncovered witness tampering and new evidence.",
      starterEpisode: "Ep 1: The Incident at Hercules",
      tags: ["Wrongful Conviction", "Investigative", "Top Pick"]
    },
    {
      id: "bear-brook-s1",
      rank: 2,
      title: "Bear Brook (Season 1)",
      hosts: "Jason Moon (NHPR)",
      type: "serial",
      genre: "Gold Standard True Crime",
      episodes: 7,
      recommendationReason: "Considered one of the greatest podcasts ever made. Dignified, serious, groundbreaking story of the barrels that launched modern genetic genealogy.",
      starterEpisode: "Ep 1: Hide and Seek",
      tags: ["Forensics", "DNA", "NHPR", "Classic"]
    },
    {
      id: "letters-from-sing-sing",
      rank: 3,
      title: "Letters from Sing Sing",
      hosts: "Dan Slepian (NBC)",
      type: "serial",
      genre: "Wrongful Conviction & Humanity",
      episodes: 8,
      recommendationReason: "Direct investigative journalism into JJ Velazquez’s 25-year fight for exoneration. Unpacks systemic institutional hurdles with enormous heart.",
      starterEpisode: "Ep 1: The Letter",
      tags: ["Innocence", "NBC News", "Deep Empathy"]
    },
    {
      id: "hunting-warhead",
      rank: 4,
      title: "Hunting Warhead",
      hosts: "Daemon Fairless (CBC / VG)",
      type: "serial",
      genre: "Global Cyber Investigation",
      episodes: 6,
      recommendationReason: "Incredible, ethical, international investigative journalism. Gripping narrative pacing without sensationalism.",
      starterEpisode: "Ep 1: The Child Sex Abuse Ring",
      tags: ["CBC", "Cyber", "High Stakes"]
    },
    {
      id: "s-town",
      rank: 5,
      title: "S-Town",
      hosts: "Brian Reed (Serial / This American Life)",
      type: "serial",
      genre: "Literary Southern Mystery",
      episodes: 7,
      recommendationReason: "A poetic, deeply layered character study and mystery in Alabama. Masterclass in audio storytelling.",
      starterEpisode: "Chapter 1",
      tags: ["Character Study", "Serial", "Masterpiece"]
    }
  ],

  // 4. PARKED SERIALS (Safe in the hangar, off your active mental radar)
  parkedSerials: [
    { id: "already-gone", title: "Already Gone", host: "Nina Innsted", notes: "Respectful, solemn single-narrator Great Lakes cold cases." },
    { id: "someone-knows", title: "Someone Knows Something", host: "David Ridgen (CBC)", notes: "Deeply empathetic, community-based missing persons investigations." },
    { id: "cold-ongoing", title: "Cold (Future Seasons / Backlog)", host: "Dave Cawley", notes: "Gold standard audio archives. Finished S1–S3." },
    { id: "against-the-odds-bank", title: "Against the Odds", host: "Wondery", notes: "Survival stories. Finished Everest, Nome, Oceanos." },
    { id: "cbc-true-crime", title: "CBC True Crime Hub", host: "CBC", notes: "Uncover and investigative series collection." },
    { id: "heavyweight-ongoing", title: "Heavyweight", host: "Jonathan Goldstein", notes: "Human closure and moving personal quests." },
    { id: "swindled", title: "Swindled", host: "A Concerned Citizen", notes: "Dry, satirical, ethical breakdowns of corporate malfeasance." },
    { id: "manson", title: "You Must Remember Manson", host: "Karina Longworth", notes: "Hollywood cultural history and Manson family breakdown." },
    { id: "money-for-couples", title: "Money for Couples", host: "Ramit Sethi", notes: "Deep financial psychology conversations behind closed doors." }
  ],

  // 5. HALL OF FAME: COMPLETED SHOWS (Your vetted record)
  completed: [
    { title: "Against the Odds S40: Everest", rating: 5, category: "Survival" },
    { title: "Against the Odds S48: Nome Serum Run", rating: 5, category: "Survival" },
    { title: "Against the Odds S55: Oceanos", rating: 5, category: "Survival" },
    { title: "Betrayal S4", rating: 4, category: "Scam & Deceit" },
    { title: "Blink S1: Jake", rating: 4, category: "Mystery" },
    { title: "Cold S1: Susan Powell Case", rating: 5, category: "Investigative Masterpiece" },
    { title: "Cold S2: Justice for Joyce Yost", rating: 5, category: "Investigative Masterpiece" },
    { title: "Cold S3: The Search for Sheree", rating: 5, category: "Investigative Masterpiece" },
    { title: "Deadly Engagement (Dateline S1)", rating: 4, category: "Dateline" },
    { title: "Dirty John", rating: 5, category: "Psychological True Crime" },
    { title: "Five Miles from Home", rating: 4, category: "True Crime" },
    { title: "In the Dark S1: Jacob Wetterling", rating: 5, category: "Journalism Masterpiece" },
    { title: "In the Dark S2: Curtis Flowers", rating: 5, category: "Journalism Masterpiece" },
    { title: "In the Dark S6: Blood Relatives", rating: 5, category: "Journalism Masterpiece" },
    { title: "The Runaway Princesses (In the Dark)", rating: 5, category: "Journalism" },
    { title: "Love Trapped", rating: 4, category: "Deception" },
    { title: "Murder in the Moonlight", rating: 4, category: "Mystery" },
    { title: "The Last Appeal", rating: 4, category: "Legal Justice" },
    { title: "Serial S1: Adnan Syed", rating: 5, category: "Cultural Milestone" },
    { title: "Serial S12: Kids of Rutherford County", rating: 5, category: "Juvenile Justice" },
    { title: "Sequestered", rating: 4, category: "Legal" },
    { title: "Sweet Bobby", rating: 5, category: "Catfishing / Deception" },
    { title: "Tom Brown’s Body", rating: 5, category: "Texas Monthly Investigative" },
    { title: "Trace of Suspicion", rating: 4, category: "True Crime" },
    { title: "Uncover S1: Escaping NXIVM", rating: 5, category: "Cults / Investigation" },
    { title: "Uncover S30: Fake Baby", rating: 4, category: "Scam" },
    { title: "We Were Three", rating: 5, category: "Human Drama" },
    { title: "Wild Boys (Chameleon S3)", rating: 5, category: "Narrative Mystery" },
    { title: "World of Secrets S7: The Six Billion Dollar Gold Scam", rating: 5, category: "Global Financial Scam" },
    { title: "Your Own Backyard: Kristin Smart", rating: 5, category: "Journalism Masterpiece" },
    { title: "The Band Played On", rating: 4, category: "Historical / Narrative" }
  ],

  // 6. INTERESTED WATCHLIST (Categorized)
  interested: [
    { title: "Bear Brook S2", genre: "True Crime / Forensics", priority: "High" },
    { title: "Beyond All Repair", genre: "Family Secrets / Mystery", priority: "High" },
    { title: "Nobody Should Believe Me (S1 & S2)", genre: "Munchausen by Proxy / Medical", priority: "High" },
    { title: "Gone South S1", genre: "Southern True Crime", priority: "High" },
    { title: "Darknet Diaries", genre: "Cyber Crime / Hackers", priority: "Medium" },
    { title: "Dr. Death S1", genre: "Medical Malpractice", priority: "Medium" },
    { title: "Ear Hustle", genre: "Life Inside San Quentin", priority: "Medium" },
    { title: "Deep Questions with Cal Newport", genre: "Focus & Digital Minimalism", priority: "Medium" },
    { title: "Gangster Capitalism", genre: "Corruption / Scandals", priority: "Medium" },
    { title: "Missing & Murdered (S1 & S2)", genre: "Indigenous Justice (CBC)", priority: "Medium" },
    { title: "The Real Carrie Jade", genre: "Grifter / Con Artist", priority: "Medium" },
    { title: "Scam Factory", genre: "Scams & Deception", priority: "Medium" },
    { title: "Stop Rewind: The Lost Boy", genre: "Historical Mystery", priority: "Medium" }
  ],

  // 7. RESEARCH VAULT (Greenlit vs Parked)
  research: [
    { title: "American Scandal", status: "Greenlit", note: "Immersive scripted history by Lindsay Graham. Zero banter." },
    { title: "The Constant: A History of Getting Things Wrong", status: "Greenlit", note: "Smart, literary history of human errors." },
    { title: "Root of Evil: The Hodel Family", status: "Greenlit", note: "Black Dahlia lore & gripping family secrets." },
    { title: "Under the Influence", status: "Greenlit", note: "History and psychology of advertising. Superbly produced." },
    { title: "She Explores", status: "Greenlit", note: "Outdoor and solo travel narratives." },
    { title: "Buried Bones", status: "Greenlit", note: "Kate Winkler Dawson & Paul Holes historical forensics." },
    { title: "This American Life", status: "Greenlit", note: "Classic narrative journalism." },
    { title: "Hidden Brain", status: "Greenlit", note: "Shankar Vedantam on human behavior science." },
    { title: "Freakonomics Radio", status: "Greenlit", note: "Hidden side of everything." },
    { title: "Money with Katie", status: "Parked", note: "Pragmatic financial strategy." },
    { title: "Afford Anything", status: "Parked", note: "Paula Pant real estate & financial independence." },
    { title: "How to Money", status: "Parked", note: "Accessible personal finance." },
    { title: "BiggerPockets Money", status: "Parked", note: "Long-term wealth building." }
  ],

  // 8. TASTE BLACKLIST (Never recommend these formats)
  didNotLove: [
    { title: "Crime Junkie", reason: "Formulaic, sensationalized, lacking original investigation." },
    { title: "My Favorite Murder", reason: "Excessive conversational banter, comedy true crime format." },
    { title: "Normal Gossip", reason: "Low-stakes trivial gossip, rambling tone." },
    { title: "Small Town Murder", reason: "Comedy-murder blend, crude banter." },
    { title: "Rotten Mango", reason: "Dramatic high-pitch narration, sensationalist framing." },
    { title: "No Such Thing As A Fish", reason: "Pub banter comedy trivia format." },
    { title: "Park Predators", reason: "Repetitive formula narration." },
    { title: "Radiolab", reason: "Overproduced sound gimmicks, fragmented editing." },
    { title: "Pod Save America", reason: "Partisan political talk format." },
    { title: "The Happiness Lab", reason: "Generic pop psychology." },
    { title: "Trojan Horse Affair", reason: "Disappointing investigation trajectory." },
    { title: "Petty Crimes", reason: "Gossip banter format." },
    { title: "Deep Cover", reason: "Did not engage pacing." }
  ]
};

// Storage Controller for Margo
const PodcastStore = {
  STORAGE_KEY: 'MARGO_PODCAST_STATE',

  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nowPlaying && parsed.curatedQueue) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[PodcastStore] Error reading state:', e);
    }
    // Return initial seed and persist
    this.save(INITIAL_PODCAST_STORE);
    return JSON.parse(JSON.stringify(INITIAL_PODCAST_STORE));
  },

  save(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      // Dispatch custom event for real-time UI updates
      window.dispatchEvent(new CustomEvent('margo-podcast-updated', { detail: data }));
    } catch (e) {
      console.error('[PodcastStore] Error saving state:', e);
    }
  },

  // 1-Tap Promote Recommendation to Now Playing
  promoteToNowPlaying(recommendedShowId) {
    const data = this.load();
    const targetIdx = data.curatedQueue.findIndex(s => s.id === recommendedShowId);
    if (targetIdx === -1) return false;

    const promoted = data.curatedQueue[targetIdx];

    // Archive current now playing to completed or parked
    if (data.nowPlaying) {
      data.completed.unshift({
        title: data.nowPlaying.title,
        rating: 5,
        category: data.nowPlaying.genre
      });
    }

    // Set promoted as active
    data.nowPlaying = {
      id: promoted.id,
      title: promoted.title,
      host: promoted.hosts,
      type: "serial",
      genre: promoted.genre,
      rating: 5,
      status: "active",
      notes: promoted.recommendationReason,
      currentEpisode: 1,
      totalEpisodes: promoted.episodes,
      tags: promoted.tags
    };

    // Remove from curated queue
    data.curatedQueue.splice(targetIdx, 1);
    this.save(data);
    return true;
  },

  // Update Episode Progress
  updateProgress(currentEp, totalEp) {
    const data = this.load();
    if (data.nowPlaying) {
      data.nowPlaying.currentEpisode = Number(currentEp);
      if (totalEp) data.nowPlaying.totalEpisodes = Number(totalEp);
      this.save(data);
    }
  },

  // Skip recommendation (Park it and bring up next recommendation)
  skipRecommendation(recommendedShowId) {
    const data = this.load();
    const targetIdx = data.curatedQueue.findIndex(s => s.id === recommendedShowId);
    if (targetIdx === -1) return false;

    const skipped = data.curatedQueue.splice(targetIdx, 1)[0];
    if (!data.parkedSerials) data.parkedSerials = [];
    data.parkedSerials.unshift({
      id: skipped.id,
      title: skipped.title,
      host: skipped.hosts,
      notes: `Skipped from Next Up queue: ${skipped.genre}`
    });

    this.replenishCuratedQueue(data);
    this.save(data);
    return true;
  },

  // Mark recommendation as already listened (move to Completed archive)
  markRecommendationAlreadyListened(recommendedShowId, rating = 5) {
    const data = this.load();
    const targetIdx = data.curatedQueue.findIndex(s => s.id === recommendedShowId);
    if (targetIdx === -1) return false;

    const listened = data.curatedQueue.splice(targetIdx, 1)[0];
    if (!data.completed) data.completed = [];
    data.completed.unshift({
      title: listened.title,
      rating: rating,
      category: listened.genre
    });

    this.replenishCuratedQueue(data);
    this.save(data);
    return true;
  },

  replenishCuratedQueue(data) {
    if (!data.curatedQueue) data.curatedQueue = [];
    if (data.curatedQueue.length < 3 && data.interested && data.interested.length > 0) {
      const nextUp = data.interested.shift();
      data.curatedQueue.push({
        id: nextUp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: nextUp.title,
        hosts: "Investigative",
        type: "serial",
        genre: nextUp.genre || "Investigative",
        episodes: 8,
        recommendationReason: `From your interested watchlist (${nextUp.priority || 'High'} priority).`,
        starterEpisode: "Episode 1",
        tags: ["From Watchlist", nextUp.genre || "Investigation"]
      });
    }
  },

  // Reset to default
  resetDefaults() {
    this.save(INITIAL_PODCAST_STORE);
    return INITIAL_PODCAST_STORE;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INITIAL_PODCAST_STORE, PodcastStore };
}
