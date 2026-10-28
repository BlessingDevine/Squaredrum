/**
 * "Start here" on an artist's page: three songs Robert picks for someone new
 * to the artist, each with one line on why. Titles are matched to the
 * artist's songs (case and accents ignored); an artist without picks shows no
 * section. Not popularity: these are choices. `album` picks between two
 * songs with the same title (an ALT take, say); `show` is the title shown on the card.
 */
export const START_HERE: Record<string, { title: string; why: string; album?: string; show?: string }[]> = {
  "thando-keys": [
    { title: "Jacaranda", why: "For the story: Pretoria in October, the streets gone purple." },
    { title: "One More Piano Solo", why: "For the dance floor: when the floor won't let the keys stop." },
    { title: "Umama", why: "For the quiet: a thank-you to the woman who raised him." },
  ],
  "apex": [
    { title: "The Art of the Come Up", why: "The origin story: starting from nothing, with every step earned and recorded." },
    { title: "Code of the Phantom", why: "The cold side: a flow that operates in silence and never gets loud." },
    { title: "The Unsigned Legend", why: "The independent streak: no contract needed, because the power is in the music." },
  ],
  "ash-revenant": [
    { title: "Mourning on a loop", why: "Where it starts: the routine of missing someone, played loud and on repeat." },
    { title: "Permanent Flinch", why: "Where it lingers: the flinch the body still remembers long after the loss." },
    { title: "What grows back", why: "Where it heals: bare ground after the worst, and something green breaking through." },
  ],
  "bantan": [
    { title: "Closer Than Close", why: "For the flirt: the title track, fluent in body language and allergic to small talk." },
    { title: "Too Fine to Beg", why: "For the dance floor: the heat turned up, smooth and sure of every move." },
    { title: "You Feel Like Home", why: "For the slow dance: the unhurried kind of love that feels like home." },
  ],
  "cedar-line": [
    { title: "Good at This", why: "Start here: the title track, a love that already made it through the hard part." },
    { title: "Gate Seventeen", why: "Then the distance: airports crossed, carried on front-porch harmonies and steel strings." },
    { title: "When We're Eighty", why: "Then the long view: plans made for the far end of a life together." },
  ],
  "crimson-union": [
    { title: "Text When Home", why: "The sweet start: devotion that sounds like caring, before the rules begin to tighten." },
    { title: "House Rules", why: "The turn: a love tightening one rule at a time, all of it sounding reasonable." },
    { title: "Former Believer", why: "The aftermath: a faith built for two, and what happens when one stops believing." },
  ],
  "danni-blaze": [
    { title: "No Dey Rush", why: "Play it first: the title track, with its one instruction, baby, calm down." },
    { title: "Body Dey Go Round", why: "Play it loud: a dance-floor anthem for when the whole floor leans in." },
    { title: "Memories", why: "Play it late: a slow-burning look back that refuses to fade." },
  ],
  "deejay-zethu": [
    { title: "Ndim Lo!", why: "Hear the hello: the title track, Ndim lo, this is me, shouted back by the crowd." },
    { title: "Ndifuna iRefund", why: "Hear the comedy: a heartbreak someone wants their money back for." },
    { title: "Namhlanje Ndiyaziphilela", why: "Hear the ending: today I'm living for myself, self-love over deep log drums." },
  ],
  "dusk-cannon": [
    { title: "Roof Access", why: "The reckless one: love on the roof you were never supposed to be on." },
    { title: "Nobody's Boyfriend", why: "The skint one: too broke to be what she deserves, too proud to say so." },
    { title: "Try Harder", why: "The furious one: three uniforms, no traction and a queue of people explaining why." },
  ],
  "echo-rae": [
    { title: "Snow Day Signal", why: "The beginning: patchy Wi-Fi, 5G feelings and a chorus begging you to come over." },
    { title: "Overthinking in 4K", why: "The overthinking era: every emoji and punctuation mark dissected for hidden meaning." },
    { title: "My Anxiety Takes the Day Off", why: "The quiet happy ending: the day the nerves clock off and calm finally wins." },
  ],
  "elkana": [
    { title: "Success Anthem", why: "One for the grind: the victory lap at the heart of Success & Heartbreak." },
    { title: "Read Receipts", why: "One for the damage: a love life lived on a screen, and what it leaves behind." },
    { title: "Healing Season", why: "One for the comeback: working on himself once the grind and heartbreak settle." },
  ],
  "fizz": [
    { title: "Main Character", why: "Press play for the lead role: she isn't just in the story, she's the star." },
    { title: "Cheza Nami", why: "Press play for the dance: one sweet, simple invitation, baby, let's have this dance." },
    { title: "Penzi Halina Formula", why: "Press play for the honesty: the big, unguarded admission that love was never maths." },
  ],
  "hollow-district": [
    { title: "Typing, Then Not", why: "From the phone: a love conducted entirely through a screen, one unsent reply at a time." },
    { title: "Last Orders", why: "From the bar: the close of one night back in the town everyone swore they'd leave." },
    { title: "Dad Says Nothing", why: "From the box room: moving home when it all falls apart, and a father's silence." },
  ],
  "iron-mirage": [
    { title: "Same Mirage", why: "The drive: chasing a town that moves further off the closer you get." },
    { title: "One-Way Vow", why: "The promise: the vow nobody else heard, and what's left after it breaks." },
    { title: "Old Mule", why: "The grit: the stubborn heart of it all, getting up anyway on a bad knee." },
  ],
  "j-cruz": [
    { title: "Let's Talk About It", why: "For the opener: the conversation everyone is avoiding, finally said out loud." },
    { title: "You’re Not That Subtle", why: "For the flirt: half teasing, half calling your bluff, and nobody is fooled." },
    { title: "Still Got Your Jacket", why: "For the soft side: a jacket left behind on purpose, and kept." },
  ],
  "knox-havoc": [
    { title: "Blame Me Later", why: "The whole saga: the crush everyone warned him about, played with zero remorse." },
    { title: "I'm Fine, This Is Great", why: "The punchline: a breakup he insists he is absolutely fine about." },
    { title: "Legend by Morning", why: "The night out: one long evening gone wrong, told like local folklore." },
  ],
  "lea-babi": [
    { title: "SOS", why: "Her centrepiece: silence on speakerphone, nobody talking but nobody gone." },
    { title: "Déjà Vu", why: "Her debut in miniature: honest about the patterns we keep repeating." },
    { title: "Half-Asleep & Honest", why: "Her softest side: loving someone most when they are half-asleep and honest." },
  ],
  "litha-flow": [
    { title: "Nna Ke Sharp!", why: "When the week goes wrong: their answer to everything, nna ke sharp, I'm good." },
    { title: "Kajeno Rea Ithabisa", why: "When it's Friday night: an anthem built for the whole floor to sing back." },
    { title: "Motho Wa Ka", why: "When you want warmth: one of the love songs tucked between the jokes." },
  ],
  "lucas-meno": [
    { title: "Take It Slow With Me", why: "The pace setter: R&B at walking pace, in no hurry for anyone." },
    { title: "Still Choosing You", why: "The promise: choosing someone carefully, and then actually meaning it." },
    { title: "Breathing Again", why: "The exhale: where the late nights finally give way to something calmer." },
  ],
  "lucid-arrows": [
    { title: "More Real Asleep", why: "From More Real Asleep: the title track, loving someone more vividly in dreams than in life." },
    { title: "Shuffle Us", why: "From Out of Order: a love story you could shuffle, because the plot never held still." },
    { title: "It Came Out Wrong", why: "From Nothing Left to Say It With: words failing exactly when they matter most." },
  ],
  "lumi-astra": [
    { title: "Orbit Me, Don't Stop Me", why: "For the romance: a crush treated like a cosmic event, measured in orbits." },
    { title: "Drop the Beat, Drop the Baggage", why: "For the club: the party album, with an exit ready for anyone who won't commit." },
    { title: "Rings of Saturn (On My Own)", why: "For the solo flight: the zero-gravity album at its most independent." },
  ],
  "lunah": [
    { title: "Love Me in Real Time", why: "Their thesis: love me in real time, or don't bother." },
    { title: "Low Battery, High Standards", why: "Their line in the sand: the battery runs low, the standards stay exactly put." },
    { title: "Tender, Not Weak", why: "Their soft side: proof that soft never meant giving in." },
  ],
  "lune-skylar": [
    { title: "Constellation Crush", why: "The cosmic side: a love story told in constellations, star-sized chorus and all." },
    { title: "Last Call at the Disco", why: "The disco side: rewinding to the disco era and refusing to come back." },
    { title: "The Day I Met the Moon", why: "The strange side: tuning in to the odd signals of falling for someone." },
  ],
  "luv-tonez": [
    { title: "The Gravity of Silence", why: "Where it pulls you in: the weight of everything left unsaid between two people." },
    { title: "Stardust Serenade", why: "Where it gets dreamy: a slow serenade with its head in the stars." },
    { title: "Frequency Match", album: "Luv Tonez III", show: "Frequency Match (ALT)", why: "Where it tries another way: the alternate take, three voices finding the same frequency." },
  ],
  "neilly-storm": [
    { title: "Champagne Problems", why: "At last call: champagne on the carpet and one more confession at 2 a.m." },
    { title: "Oops... I Like Him", why: "At the wrong moment: falling for the wrong one, and admitting it cheerfully." },
    { title: "What Do I Do Now", why: "At sunrise: the morning after, when the night finally asks what comes next." },
  ],
  "neka": [
    { title: "The Holy Moly", why: "For the dance floor, the title track, because tonight no be regular." },
    { title: "Mama I Get Am Now", why: "For the glow-up, the call home to say she finally made it." },
    { title: "Broken No Mean Finish", why: "For the heartache, picking up the pieces and trusting the heart to heal." },
  ],
  "noah-rust": [
    { title: "Same apology", why: "On Bad Example: the inheritance nobody asks for, the same apology at the same door." },
    { title: "Dashboard prayer", why: "On City Limits: bargaining with God out on the highway, between truck stops." },
    { title: "No excuse", why: "On No Excuse: the title track, no clever reasons, just the plain truth." },
  ],
  "nova-liyah": [
    { title: "Celestial Ancestors", why: "For the old soul: a prayer in neon, calling up to the ancestors." },
    { title: "Nairobi Nights, 2099", why: "For the city: Nairobi after dark, somewhere out in the year 2099." },
    { title: "Stardust in My Pulse", why: "For the heart: a love song that runs on starlight." },
  ],
  "pala": [
    { title: "Mboka Queen Vibes", why: "Closest to a title track: the Mboka Queen mood, named outright." },
    { title: "Girl Avec Attitude", why: "The attitude side, promised up front in a title that mixes two languages." },
    { title: "Love Mais Avec Classe", why: "The love side, kept stylish, just as the title promises." },
  ],
  "riven-cole": [
    { title: "Left on Read (Still Waiting)", why: "The late-teen chapter: a heart left on read and still waiting for a reply." },
    { title: "The Art of Letting Go", why: "The growing-up chapter: learning, slowly, how to let someone go." },
    { title: "The Man I'm Becoming", why: "The walk-it-off chapter: looking ahead to whoever is waiting on the other side." },
  ],
  "sadie-colton": [
    { title: "Already Winning", why: "Play it for the attitude: the title track of a breakup record with no tears in it." },
    { title: "Freshly Single Friday", why: "Play it for the night out: the ex is gone and Friday is for going out." },
    { title: "I Bought My Flowers", why: "Play it for the quiet side: a softer idea of what love should look like next time." },
  ],
  "saka": [
    { title: "Girl Math", why: "The funny one: Saka runs the numbers on dating now, out loud." },
    { title: "Block Party", why: "The loud one: a well-earned celebration once the red flags are behind." },
    { title: "Mirror Talk", why: "The honest one: a pep talk in the mirror when the jokes stop." },
  ],
  "sanza-benito": [
    { title: "Mboka Vibes Only", why: "Start with the mood: the title promises nothing but Mboka vibes." },
    { title: "Forever Ezali Plan", why: "Then the long game: a love song with forever right there in the title." },
    { title: "Mboka Girl, Come Back", why: "Then the plea: a plain call for a Mboka girl to come back." },
  ],
  "steel-vandal": [
    { title: "Factory Settings", why: "Love taken apart piece by piece until only the factory settings remain." },
    { title: "Compulsion Engine", why: "Obsession runs like a machine here, long after it stopped making sense." },
    { title: "Was It Ever You", why: "Standing by someone the world convicted, and asking if it is loyalty or pride." },
  ],
  "throne-static": [
    { title: "Your Exact Words", why: "Try this if you still replay an argument word for word in your head." },
    { title: "Some of It's True", why: "Try this if you were the villain in someone's story and half agree." },
    { title: "Good in Public", why: "Try this if you know a couple keeping up appearances for the neighbours." },
  ],
  "vegah-riot": [
    { title: "Three good months", why: "One for the summer fling: a romance that came with an end date." },
    { title: "Better on paper", why: "One for the crush who was better in theory than in person." },
    { title: "Now you want me", why: "One for the ex who finally calls back, long after it stopped mattering." },
  ],
  "virgo-dunstan": [
    { title: "Willingly", why: "The heart of it: a man rearranging his life on purpose, and saying so." },
    { title: "I Learned Your Order", why: "The small proof: the coffee order he learned without being asked." },
    { title: "Let Me Be Corny", why: "The playful side: he drops the cool and lets himself be corny." },
  ],
  "vxnti": [
    { title: "Bro Was the Uber", why: "A thank-you to the friend who drove him before he could afford the ride." },
    { title: "Rich on a Tuesday", why: "The money lands, nowhere to be, and the sun still up on a Tuesday." },
    { title: "Mama Uses the Front", why: "His mother finally walks through her own front door, and the porch lights up." },
  ],
  "yano-sky": [
    { title: "Ngibheke Kahle", why: "Her title song: a request to be looked at properly, and truly seen." },
    { title: "Usangikweleta", why: "Her dance-floor song: an ex who still owes her one last dance." },
    { title: "Soft Landing", why: "Her quiet song: remembering who caught her when she fell." },
  ],
};
