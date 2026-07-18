import { DuaEntry } from "../../dua.types";

/** Health, wealth, forgiveness, guidance, patience, and gratitude duas. */
export const DUA_ENTRIES_NEEDS: DuaEntry[] = [
  {
    id: "health-shifa",
    categoryId: "health",
    title: "Prayer for healing",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي",
    transliteration: "Allahumma Rabban-nasi adhhibil-ba'sa, ishfi Antash-Shafi.",
    translation: "O Allah, Lord of mankind, remove the harm and heal — You are the Healer.",
    source: "Sahih al-Bukhari 5743; Sahih Muslim 2191",
    whenToRecite: "When seeking recovery for yourself or someone who is ill.",
  },
  {
    id: "health-body",
    categoryId: "health",
    title: "Well-being of the body",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    transliteration:
      "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari.",
    translation:
      "O Allah, grant me well-being in my body, my hearing, and my sight.",
    source: "Abu Dawud 5090; an-Nasa'i 5496",
    whenToRecite: "Morning and evening for lasting health.",
  },
  {
    id: "wealth-rizq",
    categoryId: "wealth",
    title: "Prayer for lawful provision",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration:
      "Allahummak-fini bihalalika 'an haramika, wa aghnini bifadlika 'amman siwak.",
    translation:
      "O Allah, suffice me with what You have made lawful instead of what You have made unlawful, and make me independent of all others besides You.",
    source: "Jami' at-Tirmidhi 3563",
    whenToRecite: "When asking for barakah in rizq and freedom from need.",
  },
  {
    id: "wealth-barakah",
    categoryId: "wealth",
    title: "Blessing in provision",
    arabic: "اللَّهُمَّ بَارِكْ لِي فِي رِزْقِي",
    transliteration: "Allahumma barik li fi rizqi.",
    translation: "O Allah, bless me in my provision.",
    source: "General authentic meaning; cf. adhkar for barakah",
    whenToRecite: "When receiving income, food, or any provision.",
  },
  {
    id: "forgiveness-sayyid",
    categoryId: "forgiveness",
    title: "Sayyid al-Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ...",
    transliteration: "Allahumma Anta Rabbi, la ilaha illa Anta, khalaqtani wa ana 'abduka...",
    translation:
      "O Allah, You are my Lord — there is no god but You. You created me and I am Your servant...",
    source: "Sahih al-Bukhari 6306",
    whenToRecite: "Morning and evening; a complete master istighfar.",
  },
  {
    id: "forgiveness-short",
    categoryId: "forgiveness",
    title: "Seeking forgiveness",
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbighfir li wa tub 'alayya innaka Antat-Tawwabur-Rahim.",
    translation:
      "My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of Repentance, the Merciful.",
    source: "Abu Dawud 1516; at-Tirmidhi 3434",
    whenToRecite: "Often throughout the day; the Prophet ﷺ said it frequently.",
  },
  {
    id: "guidance-sirat",
    categoryId: "guidance",
    title: "Guide us to the straight path",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    transliteration: "Ihdinas-siratal-mustaqim.",
    translation: "Guide us to the straight path.",
    source: "Qur'an 1:6",
    whenToRecite: "In every salah; also when seeking clarity and direction.",
  },
  {
    id: "guidance-decision",
    categoryId: "guidance",
    title: "Istikharah opening",
    arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ",
    transliteration: "Allahumma inni astakhiruka bi'ilmik, wa astaqdiruka biqudratik...",
    translation:
      "O Allah, I seek Your guidance by Your knowledge, and I seek ability by Your power...",
    source: "Sahih al-Bukhari 1166",
    whenToRecite: "When deciding on a matter — full istikharah after two rak'ahs.",
  },
  {
    id: "patience-sabr",
    categoryId: "patience",
    title: "Prayer for beautiful patience",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",
    transliteration: "Rabbana afrigh 'alayna sabran wa tawaffana muslimin.",
    translation: "Our Lord, pour upon us patience and let us die as Muslims.",
    source: "Qur'an 7:126",
    whenToRecite: "In trials that need steadfastness and trust in Allah.",
  },
  {
    id: "gratitude-hamd",
    categoryId: "gratitude",
    title: "Praise for blessings",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
    transliteration: "Alhamdulillahil-ladhi bini'matihi tatimmus-salihat.",
    translation: "All praise is for Allah, by whose favour good deeds are completed.",
    source: "Ibn Majah 3803",
    whenToRecite: "When a blessing arrives or a good deed is completed.",
  },
];
