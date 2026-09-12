export type Language = 'am' | 'om' | 'en'

type LandingCopy = {
  languageName: string
  nav: { home: string; vision: string; values: string; gallery: string }
  eyebrow: string
  title: string
  lead: string
  explore: string
  introLabel: string
  introTitle: string
  introBody: string
  visionLabel: string
  visionTitle: string
  visionBody: string
  valuesLabel: string
  valuesTitle: string
  values: Array<{ title: string; body: string }>
  galleryLabel: string
  galleryTitle: string
  galleryBody: string
  footer: string
}

export const landingCopy: Record<Language, LandingCopy> = {
  am: {
    languageName: 'አማርኛ',
    nav: { home: 'መነሻ', vision: 'ራዕይ', values: 'እሴቶች', gallery: 'ማዕከለ ስዕላት' },
    eyebrow: 'የአዲስ አበባ ደቡባዊ መግቢያ',
    title: 'አቃቂ ቃሊቲ',
    lead: 'ማህበረሰብ፣ ኢንዱስትሪ እና አረንጓዴ ቦታዎች በአንድ ላይ የሚያድጉበት ክፍለ ከተማ።',
    explore: 'ክፍለ ከተማውን ይወቁ',
    introLabel: 'ስለ አቃቂ ቃሊቲ',
    introTitle: 'በሰዎቹና በቦታው የሚገለጽ ክፍለ ከተማ',
    introBody: 'አቃቂ ቃሊቲ የአዲስ አበባ ደቡባዊ ክፍል ሲሆን የመኖሪያ ሰፈሮችን፣ የኢንዱስትሪ ቀጠናዎችን እና በማደግ ላይ ያሉ የህዝብ ቦታዎችን ያገናኛል። ይህ ገጽ የክፍለ ከተማውን መልክ፣ ዕድገት እና የማህበረሰብ ሕይወት ያሳያል።',
    visionLabel: 'ራዕያችን',
    visionTitle: 'ተደራሽ፣ አሳታፊ እና ለኑሮ ምቹ አቃቂ ቃሊቲ',
    visionBody: 'ነዋሪዎች በውሳኔ ሂደት የሚሳተፉበት፣ የህዝብ ቦታዎች የሚጠበቁበት እና አገልግሎት በግልጽነት የሚሰጥበት ክፍለ ከተማ ማየት።',
    valuesLabel: 'የምንከተላቸው እሴቶች',
    valuesTitle: 'የጋራ እድገት የሚመራባቸው መርሆዎች',
    values: [
      { title: 'ተሳትፎ', body: 'የነዋሪዎችን ድምጽ መስማትና በጋራ መሥራት።' },
      { title: 'ግልጽነት', body: 'መረጃን ግልጽ፣ ቀላል እና ተደራሽ ማድረግ።' },
      { title: 'ፍትሃዊነት', body: 'ለሁሉም ማህበረሰቦች እኩል ትኩረት መስጠት።' },
      { title: 'አገልግሎት', body: 'ሰዎችንና የዕለት ተዕለት ፍላጎታቸውን ቀዳሚ ማድረግ።' },
    ],
    galleryLabel: 'የአቃቂ ቃሊቲ ገጽታ',
    galleryTitle: 'ቦታዎች፣ ሰዎች እና የጋራ ጊዜያት',
    galleryBody: 'ከክፍለ ከተማው አስተዳደር ግቢና የማህበረሰብ ዝግጅቶች የተወሰዱ ፎቶዎች።',
    footer: 'አቃቂ ቃሊቲ ክፍለ ከተማ',
  },
  om: {
    languageName: 'Afaan Oromoo',
    nav: { home: 'Fuula jalqabaa', vision: 'Mul’ata', values: 'Duudhaa', gallery: 'Kuusaa suuraa' },
    eyebrow: 'Karra kibbaa Finfinnee',
    title: 'Aqaaqii Qaallittii',
    lead: 'Kutaa magaalaa hawaasni, industiriin fi iddoowwan magariisaa waliin guddatan.',
    explore: 'Kutaa magaalichaa baruuf',
    introLabel: 'Waa’ee Aqaaqii Qaallittii',
    introTitle: 'Kutaa magaalaa namootaa fi iddoowwan isaatiin beekamu',
    introBody: 'Aqaaqii Qaallittiin kutaa kibbaa Finfinnee keessatti argama. Naannolee jireenyaa, iddoowwan industirii fi iddoowwan uummataa guddachaa jiran walitti fida. Fuulli kun bifa kutaa magaalichaa, guddina isaa fi jireenya hawaasaa agarsiisa.',
    visionLabel: 'Mul’ata keenya',
    visionTitle: 'Aqaaqii Qaallittii dhaqqabamaa, hirmaachisaa fi jireenyaaf mijataa',
    visionBody: 'Kutaa magaalaa jiraattonni murtii keessatti hirmaatan, iddoowwan uummataa eegaman, tajaajilli iftoominaan kennamu ijaaruu.',
    valuesLabel: 'Duudhaa keenya',
    valuesTitle: 'Qajeelfamoota guddina waloo keenya',
    values: [
      { title: 'Hirmaannaa', body: 'Sagalee jiraattotaa dhaggeeffachuu fi waliin hojjechuu.' },
      { title: 'Iftoomina', body: 'Odeeffannoo ifaa, salphaa fi dhaqqabamaa taasisuu.' },
      { title: 'Haqa qabeessummaa', body: 'Hawaasa hundaaf xiyyeeffannoo walqixa kennuu.' },
      { title: 'Tajaajila', body: 'Namootaa fi fedhii isaanii guyyaa guyyaa dursa kennuu.' },
    ],
    galleryLabel: 'Bifa Aqaaqii Qaallittii',
    galleryTitle: 'Iddoowwan, namootaa fi yeroo waliin dabarsine',
    galleryBody: 'Suuraalee mooraa bulchiinsa kutaa magaalichaa fi sagantaalee hawaasaa irraa fudhataman.',
    footer: 'Kutaa Magaalaa Aqaaqii Qaallittii',
  },
  en: {
    languageName: 'English',
    nav: { home: 'Home', vision: 'Vision', values: 'Values', gallery: 'Gallery' },
    eyebrow: 'Addis Ababa’s southern gateway',
    title: 'Akaki Kality',
    lead: 'A sub-city where community, industry, and greener public spaces grow together.',
    explore: 'Explore the sub-city',
    introLabel: 'About Akaki Kality',
    introTitle: 'A sub-city shaped by its people and its place',
    introBody: 'Akaki Kality sits at the southern edge of Addis Ababa, connecting residential communities, industrial areas, and growing public spaces. This page offers a view of the places, progress, and community life that give the sub-city its character.',
    visionLabel: 'Our vision',
    visionTitle: 'An accessible, participatory, and liveable Akaki Kality',
    visionBody: 'To build a sub-city where residents take part in decisions, public places are cared for, and services are delivered with openness and respect.',
    valuesLabel: 'What guides us',
    valuesTitle: 'Principles for shared progress',
    values: [
      { title: 'Participation', body: 'Listen to residents and work with the community.' },
      { title: 'Openness', body: 'Make information clear, simple, and accessible.' },
      { title: 'Fairness', body: 'Give every community equal care and attention.' },
      { title: 'Service', body: 'Put people and their everyday needs first.' },
    ],
    galleryLabel: 'Scenes from Akaki Kality',
    galleryTitle: 'Places, people, and shared moments',
    galleryBody: 'Photographs from the sub-city administration grounds and community events.',
    footer: 'Akaki Kality Sub-city',
  },
}

export const galleryImages = [
  { src: '/images/subcity-office.jpeg', alt: 'Akaki Kality sub-city office and gardens' },
  { src: '/images/community-welcome.jpeg', alt: 'Community welcome at the sub-city compound' },
  { src: '/images/tree-planting.jpeg', alt: 'Tree planting at the sub-city compound' },
  { src: '/images/akaki-kality-campus.jpeg', alt: 'Landscaped grounds at Akaki Kality' },
  { src: '/images/community-gathering.jpeg', alt: 'Community gathering at the sub-city entrance' },
  { src: '/images/green-campus.jpeg', alt: 'Green public grounds at Akaki Kality' },
  { src: '/images/cultural-celebration.jpeg', alt: 'Cultural program with the community' },
  { src: '/images/administration-office.jpeg', alt: 'An office inside the administration building' },
  { src: '/images/security-monitoring.jpeg', alt: 'Security monitoring system at the compound' },
] as const
