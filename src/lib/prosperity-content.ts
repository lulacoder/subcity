import type { Language } from '@/lib/landing-content'

type ProsperityContent = {
  eyebrow: string
  title: string
  intro: string
  visionLabel: string
  visionTitle: string
  visionMilestones: Array<{ year: string; text: string }>
  overallGoalLabel: string
  overallGoal: string
  valuesLabel: string
  valuesTitle: string
  values: Array<{ title: string; body: string }>
  objectivesLabel: string
  objectivesTitle: string
  objectives: string[]
  imageAltOne: string
  imageAltTwo: string
}

export const prosperityContent: Record<Language, ProsperityContent> = {
  am: {
    eyebrow: 'የብልፅግና ፓርቲ',
    title: 'ራዕይ፣ እሴቶች እና ዓላማዎች',
    intro: 'ፓርቲው ያስቀመጠው ራዕይ፣ ጥቅል ዓላማ፣ ዋና እሴቶች እና ዓላማዎች።',
    visionLabel: 'ራዕይ',
    visionTitle: 'የብልፅግና ፓርቲ ራዕይ',
    visionMilestones: [
      { year: '2018', text: 'ከተስፋ ወደ ምጨበጥ ብረሀን' },
      { year: '2023', text: 'የአፍሪካ ብልፅግና ተምሳሌት' },
      { year: '2050', text: 'ዓለም አቀፍ ብልፅግና አርአያ' },
    ],
    overallGoalLabel: 'የብልፅግና ጥቅል ዓላማ',
    overallGoal: 'የበለጸገች ኢትዮጵያ እውን ማድረግ',
    valuesLabel: 'እሴቶች',
    valuesTitle: 'የብልፅግና ፓርቲ ዋና እሴቶች',
    values: [
      {
        title: 'ህብረ ብሔራዊ አንድነት',
        body: 'አንድ የፓለቲካ እና ኢኮኖሚ ማህበረሰብ መገንባት ነው። ህብረ ብሔራዊ ስንል የሐይማኖት ወይም ሌላ ማንነቶችን ያቀፈና ማንንም ያላገለለ ማህበረሰብ ማለታችን ነው።',
      },
      {
        title: 'የዜጎች ክብብር',
        body: 'ኢትዮጵያዊያንን በእኩል ዓይን የሚያይና የሚዳኝ፣ ፍትሐዊ ተጠቃሚነታቸውን የሚያረጋግጥ፣ የብሔር ብሔረሰቦች መብትና ነፃነት የሚረጋገጥበት፣ እውነተኛ ህብረ ብሔራዊነት የሚረጋገጥበት፣ በዋና ዋና የሀገሪቱ ጉዳዮች ላይ ሁሉም ዜጋ ውሳኔ ላይ ተሳታፊ የሚሆንበት፣ የሀሳብ፣ ስልጣንና የመብት ክፍፍሉ ፍትሐዊ የሚሆንበት የፓለቲካዊ ኢኮኖሚ ስርዓት መፍጠርና አንድ የፓለቲካ እና ኢኮኖሚ ማህበረሰብ መገንባት።',
      },
      {
        title: 'ነፃነት',
        body: 'ዜጎች የራሳቸውን የህይወት ራዕይ የመምረጥና በመረጡት መንገድ የመኖር መብት እንዲረጋገጥ ማድረግ። የዜጎች ሁለንተናዊ ተሳትፎ በማሳደግ የሀገራችንን ፓለቲካዊና ኢኮኖሚያዊ ችግሮች በዘላቂነት መፍታት። ዜጎች የመሰብሰብ፣ የመደራጀት፣ የመጻፍና ሀሳብን በነፃነት የመግለጽ፣ የመምረጥና የመመረጥ መብቶችን ማረጋገጥ።',
      },
    ],
    objectivesLabel: 'ዓላማዎች',
    objectivesTitle: 'የብልፅግና ፓርቲ ዓላማዎች',
    objectives: [
      'ጠንካራ፣ ዴሞክራሲያዊ፣ ቅቡልነት ያለው፣ ዘላቂ ሀገረ መንግስት እና ህብረ ብሔራዊ አንድነት መገንባት።',
      'ልማትንና ፍትሐዊ ተጠቃሚነትን የሚያረጋግጥ አካታች የኢኮኖሚ ስርዓት መገንባት።',
      'ሁለንተናዊ ብልፅግና የሚያስፍን ማህበራዊ ልማትን ማረጋገጥ።',
      'ሀገራዊ ክብርንና ጥቅምን ማዕከል ያደረገ የውጭ ግንኙነት ማካሄድ።',
    ],
    imageAltOne: 'በህዝባዊ ስብሰባ ላይ የተቀመጡ ተሳታፊዎች',
    imageAltTwo: 'በህዝባዊ ስብሰባ ላይ የተቀመጡ ተሳታፊዎች እና የአበባ ማስዋቢያ',
  },
  om: {
    eyebrow: 'Paartii Badhaadhinaa',
    title: 'Mul’ata, duudhaalee fi kaayyoo',
    intro: 'Mul’ata, kaayyoo waliigalaa, duudhaalee ijoo fi kaayyoo Paartii Badhaadhinaa ibsaman.',
    visionLabel: 'Mul’ata',
    visionTitle: 'Mul’ata Paartii Badhaadhinaa',
    visionMilestones: [
      { year: '2018', text: 'Abdii irraa gara ifa qabatamaatti' },
      { year: '2023', text: 'Fakkeenya badhaadhinaa Afrikaa' },
      { year: '2050', text: 'Fakkeenya badhaadhinaa addunyaa' },
    ],
    overallGoalLabel: 'Kaayyoo waliigalaa',
    overallGoal: 'Itoophiyaa badhaate dhugoomsuu',
    valuesLabel: 'Duudhaalee',
    valuesTitle: 'Duudhaalee ijoo Paartii Badhaadhinaa',
    values: [
      {
        title: 'Tokkummaa sabdaneessaa',
        body: 'Hawaasa siyaasaa fi dinagdee tokko ijaaruu. Sabdaneessummaa jechuun hawaasa amantii fi eenyummaa biroo hunda hammatu, nama kamiyyuu hin hambisne jechuu dha.',
      },
      {
        title: 'Wal kabajuu lammiilee',
        body: 'Itoophiyaanota ija walqixaatiin ilaalu fi murteessu, fayyadamummaa haqaqabeessa isaanii mirkaneessu, mirgaa fi bilisummaa sabaa fi sablammootaa mirkaneessu, sabdaneessummaa dhugaa cimsu, dhimma gurguddoo biyyaarratti lammiin hundi murtee keessatti akka hirmaatu taasisu, akkasumas qoodinsa yaadaa, aangoo fi mirgaa haqaqabeessa taasisuun sirna siyaasaa-dinagdee fi hawaasa siyaasaa fi dinagdee tokko ijaaruu.',
      },
      {
        title: 'Bilisummaa',
        body: 'Lammiileen mul’ata jireenya isaanii filachuu fi karaa filatan jiraachuu akka danda’an mirga isaanii mirkaneessuu. Hirmaannaa lammiilee hunda galeessa guddisuun rakkoolee siyaasaa fi dinagdee biyya keenyaa itti fufiinsaan furuu. Mirga walga’uu, gurmaa’uu, barreessuu, yaada bilisaan ibsachuu, filachuu fi filatamuu mirkaneessuu.',
      },
    ],
    objectivesLabel: 'Kaayyoo',
    objectivesTitle: 'Kaayyoo Paartii Badhaadhinaa',
    objectives: [
      'Mootummaa cimaa, dimokraatawaa, fudhatama qabu fi waaraa, akkasumas tokkummaa sabdaneessaa ijaaruu.',
      'Sirna dinagdee hunda hammatu kan misoomaa fi fayyadamummaa haqaqabeessa mirkaneessu ijaaruu.',
      'Misooma hawaasummaa badhaadhina hunda galeessa babal’isu mirkaneessuu.',
      'Hariiroo alaa kabajaa fi faayidaa biyyaalessaa giddugaleessa godhate gaggeessuu.',
    ],
    imageAltOne: 'Hirmaattota walga’ii uummataa irratti taa’an',
    imageAltTwo: 'Hirmaattota walga’ii uummataa irratti taa’anii fi miidhagina abaaboo',
  },
  en: {
    eyebrow: 'Prosperity Party',
    title: 'Vision, values and objectives',
    intro: 'The party’s stated vision, overall objective, core values and objectives.',
    visionLabel: 'Vision',
    visionTitle: 'Prosperity Party vision',
    visionMilestones: [
      { year: '2018', text: 'From hope to tangible light' },
      { year: '2023', text: 'An African model of prosperity' },
      { year: '2050', text: 'A global model of prosperity' },
    ],
    overallGoalLabel: 'Overall objective',
    overallGoal: 'Realize a prosperous Ethiopia',
    valuesLabel: 'Values',
    valuesTitle: 'Prosperity Party core values',
    values: [
      {
        title: 'Multinational unity',
        body: 'Build one political and economic community. By multinational, this means a society that embraces religious and other identities and excludes no one.',
      },
      {
        title: 'Mutual respect among citizens',
        body: 'Create a political-economic system that sees and treats Ethiopians equally, ensures equitable benefit, guarantees the rights and freedoms of nations and nationalities, realizes genuine multinationalism, enables every citizen to participate in decisions on the country’s major issues, and makes the distribution of ideas, power and rights equitable—building one political and economic community.',
      },
      {
        title: 'Freedom',
        body: 'Ensure citizens’ right to choose their own vision for life and live in the way they choose. Increase citizens’ comprehensive participation to solve the country’s political and economic problems sustainably, and guarantee the rights to assemble, organize, write and express ideas freely, vote and stand for election.',
      },
    ],
    objectivesLabel: 'Objectives',
    objectivesTitle: 'Prosperity Party objectives',
    objectives: [
      'Build a strong, democratic, legitimate and sustainable state and multinational unity.',
      'Build an inclusive economic system that ensures development and equitable benefit.',
      'Ensure social development that advances comprehensive prosperity.',
      'Conduct foreign relations centered on national dignity and national interest.',
    ],
    imageAltOne: 'Attendees seated at a public gathering',
    imageAltTwo: 'Attendees seated at a public gathering beside a floral arrangement',
  },
}
