/**
 * The lyric band on an artist's page: a few hand-picked lines from their songs
 * (approved by Robert), one shown at random on each visit. Lines are copied
 * from the lyric sheets as sung and kept family-friendly. An artist without
 * lines shows no band.
 */
export type LyricLine = { line: string; title: string };

export const LYRIC_LINES: Record<string, LyricLine[]> = {
  "apex": [
    { line: "The mic is the trophy, the circle is the stage", title: "The Cypher Never Ends" },
    { line: "I sketched the whole empire on the back of a small page", title: "The Architect's Testimony" },
    { line: "I told them keep the chains, I'm focused on the lyrical tricks.", title: "The Unsigned Legend" },
    { line: "I treat the whole track like a massive balance sheet", title: "Beat Mogul's Ledger" },
    { line: "I operate in silence, the rhythm is never loud", title: "Code of the Phantom" },
  ],
  "deejay-zethu": [
    { line: "Andinxibanga brand, kodwa ndine-swagger", title: "Ndim Lo!" },
    { line: "Ndikhangela i-pin, ndifumana i-sticker.", title: "Ndithumelele iPin" },
    { line: "Ndikubona umi ngaphandle kwe-petrol station", title: "Ndifuna iRefund" },
    { line: "Ndidanisa ekhitshini ndiphethe ikomityi.", title: "Namhlanje Ndiyaziphilela" },
    { line: "Ndisiva i-bass ingena, umzimba uyavuka", title: "Ndiyaliva iPiano" },
  ],
  "echo-rae": [
    { line: "You don't talk in hashtags, you talk in moonlight and splice", title: "The Lake's Best Secret" },
    { line: "My comfort zone is the hum of a fridge in the night", title: "Woven from Quiet" },
    { line: "I’m clicking the backspace, erasing the line", title: "Ctrl+Z the Conversation" },
    { line: "I’m twirling so fast, a pastel blur in the room", title: "I Only Shine When I Spin" },
    { line: "I wrote out the feelings in a simple soft tune", title: "The Song I Wrote for Your Sleeves" },
  ],
  "fizz": [
    { line: "Wewe ni sugar, mimi ni chai", title: "Huoni Mapenzi Haya" },
    { line: "Moyo wangu ume-hack WiFi", title: "Rent Free" },
    { line: "We ndo kachumbari kwenye chipsi mayai", title: "No Cap on My Heart" },
    { line: "Smile yako ni kama jua la asubuhi", title: "Nakupenda Tu Huvyo" },
    { line: "Unapiga step kama Diamond stage", title: "Cheza Nami" },
  ],
  "j-cruz": [
    { line: "We burned the toast and ate it anyway", title: "Didn’t Mean to Stay" },
    { line: "But I like choosing you each evening", title: "Don’t Call It Fate" },
    { line: "Now there’s your sock beside the microphone", title: "You’re Still in My Way" },
    { line: "We stop for coffee neither of us needs", title: "Keep Looking Back" },
    { line: "That little sentence beats the whole speech", title: "You Talk Too Much" },
  ],
  "lea-babi": [
    { line: "Calculating what time it is for you", title: "Time Zone Mathematics" },
    { line: "Funny how memories hide inside routines", title: "Do You Still Drive By Here" },
    { line: "I turned my read receipts off for peace of mind", title: "Read Receipts Off" },
    { line: "Your side of the sink getting crowded lately", title: "Your Side of the Sink" },
    { line: "I had my walls up high to reject anything that felt too real", title: "System Override" },
  ],
  "litha-flow": [
    { line: "Ke bula fridge, ha ho na lebese", title: "Nna Ke Sharp!" },
    { line: "Data bundle e nka karolo ya yona", title: "Tjhelete E Ile Kae?" },
    { line: "Ka Friday ke fihla ke tshwere dipalesa", title: "Lerato La Weekend" },
    { line: "Ke etsa di-nails, ke behela batho appointment", title: "Ke Tla Fihla" },
    { line: "Rakgadi o hlaha a tshwere handbag", title: "Kajeno Rea Ithabisa" },
  ],
  "luv-tonez": [
    { line: "Kitchen table philosophy", title: "3AM Conversations" },
    { line: "Rooftop views of downtown dreams", title: "City Lights & Late Nights" },
    { line: "Pink flamingo motel sign", title: "Neon Heartbreak" },
    { line: "Frame by frame your smile unfolds", title: "Slow Motion" },
    { line: "Warmer than yellow, softer than white", title: "Rose Gold Feelings" },
  ],
  "neka": [
    { line: "I pack six outfits for two nights", title: "Carry Me Go" },
    { line: "Your love na workout wey no dey tone", title: "No Energy Left" },
    { line: "Your matter sweet pass hot suya stew", title: "Na Me Be The One" },
    { line: "But I hear football for background", title: "Wahala For Two" },
    { line: "You bring akara, you bring pap", title: "Soft Life Baby" },
  ],
  "nova-liyah": [
    { line: "Neon lights on all the matatus turning streets into a flame", title: "Nairobi Nights, 2099" },
    { line: "Where the women taught us courage and the ground taught us to breathe", title: "Daughters of the Solar Plains" },
    { line: "Your voice travels through the static, like a comet calling home", title: "Echoes From the Nebula" },
    { line: "I been quiet, now I’m noise", title: "Quantum Woman" },
    { line: "Where the noise turns into velvet and the chaos fades to space", title: "Portal of Stillness" },
  ],
  "saka": [
    { line: "Spent two hundred but I saved fifty", title: "Girl Math" },
    { line: "LinkedIn blocked, professional spite", title: "Block Party" },
    { line: "Red flags used to look like confetti", title: "Standards Rising" },
    { line: "My brain's a hamster on a wheel", title: "Queen of Overthinking" },
    { line: "Mirror, mirror on my phone", title: "Mirror Talk" },
  ],
  "thando-keys": [
    { line: "Stay till the lights come on", title: "Load-Shedding Love Song" },
    { line: "Ngithole imbali esicathulweni", title: "Pretoria in Full Purple" },
    { line: "Omakhelwane bafike ngamapuleti", title: "Stokvel Party Tonight" },
    { line: "Ihembe lakhe lisuka emsebenzini", title: "My Father's Hands" },
    { line: "There goes my concentration", title: "Choir Girl Smiles Back" },
  ],
  "virgo-dunstan": [
    { line: "Said, “That woman likes her plantains ripe”", title: "My Mama Asked Again" },
    { line: "Girl, you call yourself particular", title: "Particular" },
    { line: "When it came you moved the berries", title: "Two Forks" },
    { line: "I run a whole department", title: "Unpracticed" },
    { line: "I'm a grown man grinning", title: "Less Cool Around You" },
  ],
  "vxnti": [
    { line: "Sat while she explained the roses", title: "Rich on a Tuesday" },
    { line: "So I warm your food in silence", title: "Flowers Beside the Router" },
    { line: "Ironed out the sleeve together", title: "Cousin Got My Interview" },
    { line: "Barber said he knew my father", title: "No Pictures of Pops" },
    { line: "Juice box in the cupholder", title: "Unc Before Thirty" },
  ],
  "yano-sky": [
    { line: "My pain was real, so was my shelter", title: "Soft Landing" },
    { line: "When the room empties, you stay", title: "After the Hype" },
    { line: "My evening isn't for waiting", title: "Angisakulindi" },
    { line: "Sahleka kwaphuma izinyembezi", title: "Akusiyo Inhlanhla Yodwa" },
    { line: "Ngathi amanzi, wahleka", title: "Yimina Lo" },
  ],
  "cedar-line": [
    { line: "I said, “How crispy are we talking?”", title: "Kiss the Cook" },
    { line: "I baked a cake on purpose", title: "Over the Fence" },
    { line: "We split a plate of leftovers", title: "Still Got a Date" },
    { line: "I'll keep coupons in my wallet", title: "When We're Eighty" },
  ],
  "vegah-riot": [
    { line: "It was fear with better taste", title: "Still here" },
    { line: "Furniture remembers nothing", title: "Same chair" },
    { line: "The reception was your fault", title: "Wrong in person" },
    { line: "You had potential by the acre", title: "Before We met" },
    { line: "Every morning felt expensive", title: "Borrowed June" },
  ],
  "crimson-union": [
    { line: "Your concern has learned my schedule.", title: "Let Me Know" },
    { line: "Comfort makes a clever witness.", title: "Kept" },
    { line: "Memory is not a courtroom.", title: "Who Was There" },
    { line: "We made scripture out of chance.", title: "Patron Saints" },
    { line: "A chair is where I choose to sit.", title: "After Doctrine" },
  ],
  "dusk-cannon": [
    { line: "Every barrier eventually lifts.", title: "Concrete Hours" },
    { line: "Love is cheaper than my nerve.", title: "Bus Fare" },
    { line: "I thought love should look expensive", title: "Bent Bouquet" },
    { line: "Don't confuse constant motion with a road that leads somewhere.", title: "No Traction" },
    { line: "Still here, not grateful for the floor, not ashamed of wanting more.", title: "Still Here" },
  ],
};
