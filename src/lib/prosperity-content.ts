import type { Language } from '@/lib/landing-content'

type ProsperityContent = {
  eyebrow: string
  title: string
  intro: string
  photoAltOne: string
  photoAltTwo: string
  visionLabel: string
  visionTitle: string
  visionIntro: string
  milestones: Array<{ year: string; text: string }>
  goalLabel: string
  goalTitle: string
  goalBody: string
  valuesLabel: string
  valuesTitle: string
  valuesIntro: string
  values: Array<{ title: string; body: string }>
  objectivesLabel: string
  objectivesTitle: string
  objectivesIntro: string
  objectives: Array<{ title: string; body: string }>
}

export const prosperityContent: Record<Language, ProsperityContent> = {
  am: {
    eyebrow: 'የብልፅግና ፓርቲ',
    title: 'ራዕይ፣ እሴቶች እና ዓላማዎች',
    intro:
      'የብልፅግና ፓርቲ የቀረበው ራዕይ፣ ጥቅል ዓላማ፣ እሴቶች እና ዋና ዋና ዓላማዎች።',
    photoAltOne: 'በህዝባዊ ዝግጅት ላይ የተገኙ ተሳታፊዎች',
    photoAltTwo: 'በህዝባዊ ዝግጅት ላይ የተገኙ ተሳታፊዎች',
    visionLabel: 'ራዕይ',
    visionTitle: 'ከተስፋ ወደ ዓለም አቀፍ የብልፅግና አርአያ',
    visionIntro: 'ፓርቲው ያቀረበው የረጅም ጊዜ የራዕይ መስመር።',
    milestones: [
      { year: '2018', text: 'ከተስፋ ወደ ምጨበጥ ብርሃን' },
      { year: '2023', text: 'የአፍሪካ ብልፅግና ተምሳሌት' },
      { year: '2050', text: 'ዓለም አቀፍ ብልፅግና አርአያ' },
    ],
    goalLabel: 'ጥቅል ዓላማ',
    goalTitle: 'የብልፅግና ጥቅል ዓላማ',
    goalBody: 'የበለጸገች ኢትዮጵያ እውን ማድረግ።',
    valuesLabel: 'እሴቶች',
    valuesTitle: 'የፓርቲው የተገለጹ እሴቶች',
    valuesIntro: 'ፓርቲው ያቀረባቸው ዋና ዋና የፖለቲካና ማህበራዊ እሴቶች።',
    values: [
      {
        title: 'ህብረ ብሔራዊ አንድነት',
        body:
          'አንድ የፖለቲካና የኢኮኖሚ ማህበረሰብ መገንባት ነው። ህብረ ብሔራዊ ማለት የሃይማኖት ወይም ሌሎች ማንነቶችን ያቀፈና ማንንም ያላገለለ ማህበረሰብ ማለት ነው።',
      },
      {
        title: 'የዜጎች ክብብር',
        body:
          'ኢትዮጵያዊያንን በእኩል ዓይን የሚያይና የሚዳኝ፣ ፍትሃዊ ተጠቃሚነታቸውን የሚያረጋግጥ፣ የብሔር ብሔረሰቦች መብትና ነፃነት የሚረጋገጥበት እና እውነተኛ ህብረ ብሔራዊነት የሚጠናከርበት የፖለቲካ ኢኮኖሚ ሥርዓት መፍጠር። በዋና ዋና የሀገሪቱ ጉዳዮች ላይ ሁሉም ዜጋ በውሳኔ ሂደት እንዲሳተፍ እና የሀሳብ፣ የሥልጣንና የመብት ክፍፍል ፍትሃዊ እንዲሆን ማድረግ።',
      },
      {
        title: 'ነፃነት',
        body:
          'ዜጎች የራሳቸውን የሕይወት ራዕይ የመምረጥና በመረጡት መንገድ የመኖር መብት እንዲረጋገጥ ማድረግ። የዜጎችን ሁለንተናዊ ተሳትፎ በማሳደግ የሀገሪቱን ፖለቲካዊና ኢኮኖሚያዊ ችግሮች በዘላቂነት መፍታት፣ የመሰብሰብ፣ የመደራጀት፣ የመጻፍና ሀሳብን በነፃነት የመግለጽ፣ የመምረጥና የመመረጥ መብቶችን ማረጋገጥ።',
      },
    ],
    objectivesLabel: 'ዓላማዎች',
    objectivesTitle: 'የብልፅግና ፓርቲ ዓላማዎች',
    objectivesIntro: 'የቀረቡት ዋና ዋና የፓርቲው ዓላማዎች በአራት የሥራ መስኮች ተደራጅተው።',
    objectives: [
      {
        title: 'ሀገረ መንግስትና አንድነት',
        body: 'ጠንካራ፣ ዴሞክራሲያዊ፣ ቅቡልነት ያለውና ዘላቂ ሀገረ መንግስት እና ህብረ ብሔራዊ አንድነት መገንባት።',
      },
      {
        title: 'አካታች ኢኮኖሚ',
        body: 'ልማትንና ፍትሃዊ ተጠቃሚነትን የሚያረጋግጥ አካታች የኢኮኖሚ ሥርዓት መገንባት።',
      },
      {
        title: 'ማህበራዊ ልማት',
        body: 'ሁለንተናዊ ብልፅግና የሚያስፍን ማህበራዊ ልማትን ማረጋገጥ።',
      },
      {
        title: 'የውጭ ግንኙነት',
        body: 'ሀገራዊ ክብርንና ጥቅምን ማዕከል ያደረገ የውጭ ግንኙነት ማካሄድ።',
      },
    ],
  },
  om: {
    eyebrow: 'Paartii Badhaadhinaa',
    title: 'Mul’ata, duudhaa fi kaayyoo',
    intro:
      'Mul’ata, kaayyoo waliigalaa, duudhaa fi kaayyolee ijoo Paartii Badhaadhinaa irraa dhiyaatan.',
    photoAltOne: 'Hirmaattota sagantaa uummataa irratti argaman',
    photoAltTwo: 'Hirmaattota sagantaa uummataa irratti argaman',
    visionLabel: 'Mul’ata',
    visionTitle: 'Abdii irraa gara fakkeenya badhaadhina addunyaatti',
    visionIntro: 'Daandii mul’ataa yeroo dheeraa paartichi dhiyeesse.',
    milestones: [
      { year: '2018', text: 'Abdii irraa gara ifa qabatamaatti' },
      { year: '2023', text: 'Fakkeenya badhaadhina Afrikaa' },
      { year: '2050', text: 'Fakkeenya badhaadhina addunyaa' },
    ],
    goalLabel: 'Kaayyoo waliigalaa',
    goalTitle: 'Kaayyoo waliigalaa badhaadhinaa',
    goalBody: 'Itoophiyaa badhaate dhugoomsuu.',
    valuesLabel: 'Duudhaa',
    valuesTitle: 'Duudhaa paartichi ibse',
    valuesIntro: 'Duudhaa siyaasaa fi hawaasummaa ijoo paartichi dhiyeesse.',
    values: [
      {
        title: 'Tokkummaa sab-daneessaa',
        body:
          'Hawaasa siyaasaa fi dinagdee tokko ijaaruu. Sab-daneessummaan hawaasa amantii fi eenyummaa garaagaraa hammatee nama kamiyyuu hin qoodne jechuudha.',
      },
      {
        title: 'Kabaja lammiilee',
        body:
          'Sirna siyaas-dinagdee Itoophiyaanota hunda ija walqixaatiin ilaalu, haqa qabeessa ta’een murteessu, fayyadamummaa haqaa isaanii mirkaneessu, mirgaa fi bilisummaa sabootaafi sablammootaa kabachiisu, akkasumas sab-daneessummaa dhugaa cimsu uumuu. Dhimmoota biyyaalessaa gurguddoo irratti lammiileen hundi murtii keessatti akka hirmaatan, qoodinsi yaadaa, aangoo fi mirgaa haqaa akka ta’u gochuu.',
      },
      {
        title: 'Bilisummaa',
        body:
          'Lammiileen mul’ata jireenyaa isaanii filachuu fi karaa filatan jiraachuu akka danda’an mirga isaanii mirkaneessuu. Hirmaannaa lammiilee bal’isuun rakkoolee siyaasaa fi dinagdee biyyattii karaa waaraatiin hiikuu; mirga walga’ii, gurmaa’uu, barreessuu, yaada bilisaan ibsachuu, filachuu fi filatamuu mirkaneessuu.',
      },
    ],
    objectivesLabel: 'Kaayyolee',
    objectivesTitle: 'Kaayyolee Paartii Badhaadhinaa',
    objectivesIntro: 'Kaayyoleen ijoo dhiyaatan dameewwan hojii afur keessatti qindaa’aniiru.',
    objectives: [
      {
        title: 'Mootummaa fi tokkummaa',
        body: 'Mootummaa cimaa, dimokraatawaa, fudhatama qabu fi waaraa, akkasumas tokkummaa sab-daneessaa ijaaruu.',
      },
      {
        title: 'Dinagdee hirmaachisaa',
        body: 'Sirna dinagdee hirmaachisaa guddinaa fi fayyadamummaa haqaa mirkaneessu ijaaruu.',
      },
      {
        title: 'Misooma hawaasummaa',
        body: 'Misooma hawaasummaa badhaadhina hunda galeessa babal’isu mirkaneessuu.',
      },
      {
        title: 'Hariiroo alaa',
        body: 'Hariiroo alaa kabajaa fi faayidaa biyyaalessaa giddu galeessa godhate gaggeessuu.',
      },
    ],
  },
  en: {
    eyebrow: 'Prosperity Party',
    title: 'Vision, values and objectives',
    intro:
      'The vision, overall goal, values and principal objectives presented by the Prosperity Party.',
    photoAltOne: 'Participants attending a public event',
    photoAltTwo: 'Participants attending a public event',
    visionLabel: 'Vision',
    visionTitle: 'From hope toward a global model of prosperity',
    visionIntro: 'The long-term vision milestones presented by the party.',
    milestones: [
      { year: '2018', text: 'From hope toward tangible light' },
      { year: '2023', text: 'A model of African prosperity' },
      { year: '2050', text: 'A global model of prosperity' },
    ],
    goalLabel: 'Overall goal',
    goalTitle: 'Overall prosperity goal',
    goalBody: 'To realize a prosperous Ethiopia.',
    valuesLabel: 'Values',
    valuesTitle: 'Values presented by the party',
    valuesIntro: 'The principal political and social values presented by the party.',
    values: [
      {
        title: 'Multinational unity',
        body:
          'To build one political and economic community. In this formulation, multinationalism means a society that embraces religious and other identities without excluding anyone.',
      },
      {
        title: 'Respect for citizens',
        body:
          'To create a political-economic system that treats Ethiopians equally, ensures equitable benefit, protects the rights and freedoms of nations and nationalities, and strengthens genuine multinationalism. It also calls for citizens to participate in decisions on major national issues and for the distribution of ideas, power and rights to be fair.',
      },
      {
        title: 'Freedom',
        body:
          'To protect citizens’ right to choose their own vision for life and live in the manner they choose. It also calls for broader citizen participation to address political and economic problems sustainably and for the protection of the rights to assemble, organize, write, express ideas freely, vote and stand for election.',
      },
    ],
    objectivesLabel: 'Objectives',
    objectivesTitle: 'Prosperity Party objectives',
    objectivesIntro: 'The stated objectives are organized here into four principal areas.',
    objectives: [
      {
        title: 'State-building and unity',
        body: 'Build a strong, democratic, legitimate and sustainable state together with multinational unity.',
      },
      {
        title: 'Inclusive economy',
        body: 'Build an inclusive economic system that advances development and equitable benefit.',
      },
      {
        title: 'Social development',
        body: 'Secure social development that supports comprehensive prosperity.',
      },
      {
        title: 'Foreign relations',
        body: 'Conduct foreign relations centered on national dignity and national interest.',
      },
    ],
  },
}
