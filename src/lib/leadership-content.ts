import type { Language } from '@/lib/landing-content'

export type LeadershipProfile = {
  title: string
  name: string
  role: string
  paragraphs: readonly string[]
}

export const leadershipProfiles: Record<
  Language,
  readonly [LeadershipProfile, LeadershipProfile]
> = {
  am: [
    {
      title: 'የአቃቂ ቃሊቲ ክፍለ ከተማ ዋና ሥራ አስፈፃሚ መልዕክት',
      name: 'ወ/ሮ ሀንጋቱ መሀመድ',
      role: 'የአቃቂ ቃሊቲ ክ/ከተማ ዋና ሥራ አስፈፃሚ',
      paragraphs: [
        'የአቃቂ ቃሊቲ ክፍለ ከተማ ብልፅግና ፓርቲ ጽ/ቤት ህንፃ ግንባታ የጋራ ህልማችን እውን የሆነበት፤ የእድገት እና የቁርጠኝነት ተምሳሌት ሆኖ የሚታይ ታሪካዊ ስኬት በመሆኑ ለጠላው አባላት፣ የልማት አጋሮች እና ጠላው የክፍለ ከተማው አመራሮችና መዋቅር እንኳን ደስ አለችሁ።',
        'ይህ ህንፃ በቀላሉ የተገኘ ሳይሆን የፓርቲያችን አባላት፣ የልማት አጋሮች እና አመራሮች በጋራ ያረጋገጡት የልፋት ውጤት ነው። የእውቀት፣ የገንዘብ እና የግብዓት አስተዋፅኦ ያደረጋችሁ ሁሉ ለዚህ አንፀባራቂና ታሪካዊ ስኬት የነበራችሁ ፋይዳ ከፍተኛ በመሆኑ በክፍለ ከተማው ስም ምስጋናዬን አቀርባለሁ።',
        'ይህ ህንፃ የፓርቲያችንን ተቋም ግንባታ እውን የሚያደርግ፤ የፖለቲካ የበላይነትን እና የህዝብ ተጠቃሚነትን ለማረጋገጥ የምናደርገውን ጥረት የሚያግዝ ዘመናዊ መሠረተ ልማት ነው።',
        'የፓርቲ ስራችንን የበለጠ ውጤታማ ለማድረግ፤ የአባላትን የፖለቲካ አቅም ለመገንባት እና ህዝብን በተደራጀ መንገድ ለማገልገል የሚያስችለን ምቹ ሁኔታን ይፈጥራል። ህንፃው የልማት አጋሮቻችን እና የህዝባችን የጋራ ባለቤትነት የሚያንፀባርቅበት፤ ዲሞክራሲያዊ ባህላችንን ማሳያ የሚሆን ማዕከል እንዲሆን እንሰራለን።',
        'የግንባታው መጠናቀቅ የጀመርነውን የልማት ጉዞ የሚያፋጥን እና ለቀጣይ የላቁ አላማዎች መሳካት ጉልበት የሚሰጥ ነው። በሂደቱ ያሳያችሁት የላቀ ቁርጠኝነት ስሜት እና የተግባር አንድነት፤ በየዘርፉ የምናከናውናቸው ሌሎች የልማት ስራዎች ላይም መድገም ያለበት የላቀ አፈፃፀም ነው።',
        'በመጨረሻም፤ ይህ ህንፃ የጋራ እሴቶቻችን፣ የጋራ ትግላችን እና የሰላማችን መግለጫ ሆኖ እንዲቀጥል ሁላችንም በጋራ ልንጠብቀው ይገባል። የዚህ ህንፃ ግንባታ መሳካት ለሌሎች ስራዎቻችን መነሻ እንደሚሆን በመተማመን፤ ህዝብን ለማገልገል የምናደርገውን ጥረት አጠናክረን እንቀጥላለን። ለዚህ ታሪካዊ ስኬት ላበረከታችሁት ሁሉ አሁንም በድጋሚ ምስጋናዬን እያቀረብኩ፤ በቀጣይ የጋራ ስራዎቻችን አብረን እንድንቆም ጥሪዬን አስተላልፋለሁ።',
      ],
    },
    {
      title: 'የአቃቂ ቃሊቲ ክፍለ ከተማ ብልፅግና ፓርቲ ጽ/ቤት ኃላፊ መልዕክት',
      name: 'አቶ ተሃድሶ አበባው',
      role: 'የአቃቂ ቃሊቲ ክ/ከተማ ብልፅግና ፓርቲ ጽ/ቤት ኃላፊ',
      paragraphs: [
        'የአቃቂ ቃሊቲ ክፍለ ከተማ ብልፅግና ፓርቲ ጽ/ቤት ህንፃ ግንባታ መጠናቀቁን ምክንያት በማድረግ ለመላው የፓርቲያችን አባላት፣ ለልማት አጋሮቻችን እና ለመላው የክፍለ ከተማው አመራር መዋቅር በሙሉ የተሰማኝን ጥልቅ ደስታ በፓርቲያችን ስም እገልጻለሁ፤ እንኳን ደስ አለችሁ! ይህ ህንፃ የጋራ ጥረታችን ውጤት፤ የእድገታችን ማሳያ እና የጀመርነው የለውጥ ጉዞ አንዱ ማሳያ ነው።',
        'በግንባታው ሂደት በእውቀት፣ በገንዘብ እና በጉልበት ድጋፍ ያደረጋችሁልን ወገኖች ሁሉ፤ አርአያነት ያለው የፓርቲያችን ተልዕኮ መወጣታችሁን በታሪክ የምንመዘግበው ነው። ይህ ህንፃ ፓርቲውን በግንባር ከማጠናከር የዘለለ ትርጉም ያለው፤ የፓርቲያችንን የአሰራር ጥራት ወደ ላቀ ደረጃ የምናሸጋግርበት፤ የምክክር መድረክ እና የህዝብ አገልግሎት ማዕከል ነው።',
        'የዚህ ህንፃ መገንባት፤ የእያንዳንዱ አባልና ደጋፊ ቁርጠኝነት ጥምር ውጤት ነው። ይህንን አዲስ ምዕራፍ ስንከፍት፤ ህንፃው የሚፈልገውን ተገቢ እንክብካቤ በማድረግ እና በውስጡ የሚከናወኑ ተግባራትን በልህቀት በመምራት፤ ለህዝባችን የገባነውን ቃል ኪዳን በተግባር ለማሳየት ዝግጁ መሆናችንን ማረጋገጥ እፈልጋለሁ።',
        'በድጋሚ፤ ይህ ታላቅ ስኬት የሁላችንም ነው። የተጀመረውን የልማት እና የብልፅግና ጉዞ የበለጠ አጠናክረን እንቀጥላለን።',
        'ለዚህ ሁሉ ላደረጋችሁት ድጋፍና መስዋዕትነት ምስጋናዬን እያቀረብኩ፤ በቀጣይም በጋራ ለድል እንደምንበቃ ሙሉ እምነት አለኝ።',
      ],
    },
  ],
  om: [
    {
      title:
        'Ergaa Hojii Raawwachiiftuu Olaantuu Kutaa Magaalaa Aqaaqii Qaallittii',
      name: 'Aadde Hangaattuu Mahaammad',
      role: 'Hojii Raawwachiiftuu Olaantuu Kutaa Magaalaa Aqaaqii Qaallittii',
      paragraphs: [
        'Ijaarsi gamoo Waajjira Paartii Badhaadhinaa Kutaa Magaalaa Aqaaqii Qaallittii abjuu waloo keenya dhugoomsee, mallattoo guddinaa fi kutannoo ta’ee kan mul’atu milkaa’ina seena qabeessa waan ta’eef miseensota hunda, michoota misoomaa, hoggansaa fi caasaa kutaa magaalichaa hundaaf baga gammaddan jechuun barbaada.',
        'Gamoon kun salphaatti kan argame miti. Bu’aa dadhabbii miseensota paartii keenyaa, michoota misoomaa fi hoggantoonni waliin mirkaneessaniiti. Namoota beekumsa, maallaqaa fi galteedhaan gumaacha gootan hundaaf, milkaa’ina ifaa fi seena qabeessa kana keessatti gaheen keessan olaanaa waan ta’eef maqaa kutaa magaalichaatiin galata koo nan dhiyeessa.',
        'Gamoon kun ijaarsa dhaabbata paartii keenyaa dhugoomsa. Ol’aantummaa siyaasaa fi fayyadamummaa uummataa mirkaneessuuf carraaqqii goonu kan deeggaru bu’uuraalee misoomaa ammayyaati.',
        'Hojii paartii keenyaa caalaatti bu’a qabeessa gochuuf, dandeettii siyaasaa miseensotaa ijaaruu fi uummata karaa qindaa’een tajaajiluuf haala mijataa uuma. Gamichi abbummaa waloo michoota misoomaa fi uummata keenyaa kan calaqqisiisu, akkasumas aadaa dimokraatawaa keenya kan agarsiisu wiirtuu akka ta’u ni hojjenna.',
        'Xumuramuun ijaarsichaa imala misoomaa jalqabne ni saffisiisa; kaayyolee olaanoo itti aanan milkeessuufis humna kenna. Miirri kutannoo olaanaa fi tokkummaan hojii adeemsa kana keessatti agarsiiftan hojiiwwan misoomaa damee hundaan raawwannu keessattis irra deebi’amee mul’achuu qaba.',
        'Dhuma irratti, gamoon kun ibsa duudhaalee waloo, qabsoo waloo fi nageenya keenyaa ta’ee akka itti fufu hundi keenya waliin eeguu qabna. Milkaa’inni ijaarsa kanaa hojiiwwan keenya biroof ka’umsa akka ta’u amannee, uummata tajaajiluuf carraaqqii keenya cimsinee itti fufna. Milkaa’ina seena qabeessa kanaaf gumaacha gootan hundaaf ammas galata koo nan dhiyeessa; hojiiwwan waloo itti aanan keessattis waliin akka dhaabannu waamicha koo nan dabarsa.',
      ],
    },
    {
      title:
        'Ergaa Itti Gaafatamaa Waajjira Paartii Badhaadhinaa Kutaa Magaalaa Aqaaqii Qaallittii',
      name: 'Obbo Tahaaddisoo Ababaaw',
      role: 'Itti Gaafatamaa Waajjira Paartii Badhaadhinaa Kutaa Magaalaa Aqaaqii Qaallittii',
      paragraphs: [
        'Ijaarsi gamoo Waajjira Paartii Badhaadhinaa Kutaa Magaalaa Aqaaqii Qaallittii xumuramuu isaatiin, miseensota paartii keenyaa hunda, michoota misoomaa fi caasaa hoggansa kutaa magaalichaa maraaf gammachuu guddaa natti dhaga’ame maqaa paartii keenyaatiin nan ibsa. Baga gammaddan! Gamoon kun bu’aa carraaqqii waloo keenyaa, agarsiiftuu guddina keenyaa fi imala jijjiiramaa jalqabne keessaa tokko dha.',
        'Adeemsa ijaarsichaa keessatti beekumsa, maallaqaa fi humnaan kan nu deeggartan hundi ergama paartii keenyaa fakkeenya ta’een baatanii raawwachuu keessan seenaa keessatti galmeessina. Gamoon kun paarticha ijaarsa dhaabbataatiin cimsuu caalaa hiika qaba. Qulqullina hojii paartii keenyaa gara sadarkaa olaanaatti ceesisuuf, mariif waltajjii fi tajaajila uummataaf wiirtuu ta’a.',
        'Ijaaramuun gamoo kanaa bu’aa walitti makama kutannoo miseensaa fi deeggartuu hundaati. Boqonnaa haaraa kana yeroo bannu, gamichaaf kunuunsa barbaachisu gochuu fi hojiiwwan keessa isaa keessatti gaggeeffaman gahumsaan hoogganuun waadaa uummata keenyaaf seenne hojii irratti agarsiisuuf qophii ta’uu keenya mirkaneessuu barbaada.',
        'Ammas, milkaa’inni guddaan kun kan hunda keenyaati. Imala misoomaa fi badhaadhinaa jalqabame caalaatti cimsinee itti fufna.',
        'Deeggarsaa fi aarsaa kana hundaaf gootan galata koo nan dhiyeessa. Gara fuulduraattis waliin taanee injifannoo akka gonfannu amantii guutuun qaba.',
      ],
    },
  ],
  en: [
    {
      title: 'Message from the Chief Executive of Akaki Kality Prosperity Party (PR)',
      name: 'W/ro Hangatu Mohammed',
      role: 'Chief Executive of Akaki Kality Prosperity Party (PR)',
      paragraphs: [
        'The construction of the Akaki Kality Prosperity Party (PR) office building has made our shared dream a reality. It is a historic achievement and a visible symbol of growth and commitment. Congratulations to all members, development partners, and the party leadership and organizational structure.',
        'This building was not achieved easily. It is the result of the collective effort of our party members, development partners, and leaders. On behalf of the party, I thank everyone who contributed knowledge, money, and material resources. Your contribution to this visible and historic achievement was substantial.',
        'This building helps make the institutional development of our party a reality. It is modern infrastructure that supports our work to secure political leadership and public benefit.',
        'It creates the conditions needed to make our party work more effective, build the political capacity of members, and serve the public in an organized manner. We will work to make the building a center that reflects the shared ownership of our development partners and people and demonstrates our democratic culture.',
        'Completing the building will accelerate the development journey we have begun and give strength to the achievement of our next major objectives. The strong commitment and unity in action shown throughout this process should also be repeated in the other development work we carry out across every sector.',
        'Finally, we must protect this building together so that it continues to express our shared values, shared struggle, and peace. We believe that completing it will become a starting point for our other work, and we will strengthen our efforts to serve the public. I again thank everyone who contributed to this historic achievement and call on all of us to stand together in our future work.',
      ],
    },
    {
      title:
        'Message from the Head of the Akaki Kality Prosperity Party (PR) Office',
      name: 'Ato Tehadiso Abebaw',
      role: 'Head of the Akaki Kality Prosperity Party (PR) Office',
      paragraphs: [
        'On the completion of the Akaki Kality Prosperity Party (PR) office building, I express, in the name of our party, the deep joy I feel to all party members, our development partners, and the entire leadership structure. Congratulations! This building is the result of our collective effort, a sign of our growth, and one expression of the journey of change we have begun.',
        'We will record in history that everyone who supported the construction with knowledge, money, and labor fulfilled our party’s mission in an exemplary manner. This building means more than strengthening the party institutionally. It is a forum for consultation and a public service center through which we will move the quality of our party’s work to a higher level.',
        'The construction of this building is the combined result of the commitment of every member and supporter. As we open this new chapter, I want to affirm that we are ready to give the building proper care, lead the work carried out inside it with excellence, and demonstrate in practice the promise we made to our people.',
        'Once again, this major achievement belongs to all of us. We will continue to strengthen the development and prosperity journey that has begun.',
        'I thank you for all the support and sacrifice you have made. I fully believe that we will continue to achieve victory together.',
      ],
    },
  ],
}
