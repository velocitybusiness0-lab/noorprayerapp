import { DuaEntry } from "../../dua.types";

/** Morning, evening, sleep, after salah, and food duas. */
export const DUA_ENTRIES_DAILY: DuaEntry[] = [
  {
    id: "morning-sayyid",
    categoryId: "morning-evening",
    title: "Morning remembrance",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah.",
    translation:
      "We have entered the morning and the dominion belongs to Allah, and all praise is for Allah.",
    source: "Abu Dawud 5068",
    whenToRecite: "As part of morning adhkar after Fajr.",
  },
  {
    id: "evening-amsayna",
    categoryId: "morning-evening",
    title: "Evening remembrance",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah.",
    translation:
      "We have entered the evening and the dominion belongs to Allah, and all praise is for Allah.",
    source: "Abu Dawud 5068",
    whenToRecite: "As part of evening adhkar before Maghrib/Isha.",
  },
  {
    id: "morning-alhamdulillah",
    categoryId: "morning-evening",
    title: "Praise upon waking",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration:
      "Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation:
      "All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.",
    source: "Sahih al-Bukhari 6312",
    whenToRecite: "Upon waking from sleep.",
  },
  {
    id: "sleep-name",
    categoryId: "sleep",
    title: "Before sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: "In Your name, O Allah, I die and I live.",
    source: "Sahih al-Bukhari 6314",
    whenToRecite: "When lying down to sleep.",
  },
  {
    id: "sleep-pillow",
    categoryId: "sleep",
    title: "Sleeping on the right side",
    arabic: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَوَجَّهْتُ وَجْهِي إِلَيْكَ",
    transliteration: "Allahumma aslamtu nafsi ilayk, wa wajjahtu wajhi ilayk...",
    translation: "O Allah, I submit myself to You and turn my face toward You...",
    source: "Sahih al-Bukhari 6313; Sahih Muslim 2710",
    whenToRecite: "When lying on the right side before sleep.",
  },
  {
    id: "after-salah-istighfar",
    categoryId: "after-salah",
    title: "After finishing salah",
    arabic: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah.",
    translation: "I seek Allah's forgiveness (three times).",
    source: "Sahih Muslim 591",
    whenToRecite: "Immediately after completing the prayer.",
  },
  {
    id: "after-salah-tahlil",
    categoryId: "after-salah",
    title: "After salah remembrance",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ",
    transliteration:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd...",
    translation:
      "There is no god but Allah alone, with no partner. His is the dominion and His is the praise...",
    source: "Sahih Muslim 594",
    whenToRecite: "After the obligatory prayers.",
  },
  {
    id: "food-before",
    categoryId: "food",
    title: "Before eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah.",
    translation: "In the name of Allah.",
    source: "Sahih Muslim 2018; Abu Dawud 3767",
    whenToRecite: "Before beginning a meal.",
  },
  {
    id: "food-after",
    categoryId: "food",
    title: "After eating",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration:
      "Alhamdulillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
    translation:
      "All praise is for Allah who fed me this and provided it for me with no might or power from myself.",
    source: "Abu Dawud 4023; at-Tirmidhi 3458",
    whenToRecite: "After finishing a meal.",
  },
  {
    id: "food-drink",
    categoryId: "food",
    title: "After drinking milk",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ",
    transliteration: "Allahumma barik lana fihi wa zidna minhu.",
    translation: "O Allah, bless it for us and give us more of it.",
    source: "Abu Dawud 3730; at-Tirmidhi 3455",
    whenToRecite: "After drinking milk.",
  },
];
