import { QURAN } from './quran.generated';
import type { Dhikr } from './types';

/*
 * Morning, evening and night adhkar.
 *
 * Quran text is never typed here: it comes from QURAN (generated from the
 * Tanzil text by `npm run quran:import`). Hadith Arabic is typed and, like every
 * translation and grading, is marked reviewed: false until a scholar checks it
 * against the source. Urdu and English are plain-meaning drafts.
 */
export const ADHKAR: Dhikr[] = [
  {
    id: 'ayat-al-kursi',
    title: 'Ayat al-Kursi',
    sessions: ['morning', 'evening', 'night'],
    arabic: QURAN['ayat-al-kursi'].text,
    script: 'quran',
    urdu:
      'اللہ، اس کے سوا کوئی معبود نہیں، وہ زندہ ہے، سب کو قائم رکھنے والا ہے۔ نہ اسے اونگھ آتی ہے نہ نیند۔ آسمانوں اور زمین میں جو کچھ ہے سب اسی کا ہے۔ کون ہے جو اس کی اجازت کے بغیر اس کے پاس سفارش کرے؟ وہ جانتا ہے جو ان کے آگے ہے اور جو ان کے پیچھے ہے، اور وہ اس کے علم میں سے کسی چیز کا احاطہ نہیں کر سکتے سوائے اس کے جو وہ چاہے۔ اس کی کرسی آسمانوں اور زمین پر چھائی ہوئی ہے، اور ان کی حفاظت اسے تھکاتی نہیں، اور وہ بلند و عظیم ہے۔',
    english:
      'Allah — there is no god but Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and the earth. Who can intercede with Him except by His permission? He knows what is before them and what is behind them, and they encompass nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and preserving them does not tire Him. He is the Most High, the Most Great.',
    count: 1,
    virtue:
      'Whoever recites it in the evening is protected until morning, and whoever recites it in the morning is protected until evening.',
    source: 'Quran 2:255 · virtue: An-Nasa\'i (al-Kubra), al-Hakim',
    grade: 'Sahih',
    reviewed: false,
  },
  {
    id: 'al-ikhlas',
    title: 'Surah Al-Ikhlas',
    sessions: ['morning', 'evening'],
    arabic: QURAN['al-ikhlas'].text,
    script: 'quran',
    urdu: 'کہو: وہ اللہ ایک ہے۔ اللہ بے نیاز ہے۔ نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے۔ اور کوئی اس کا ہمسر نہیں۔',
    english: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, and there is none comparable to Him.',
    count: 3,
    virtue: 'Recite Al-Ikhlas, Al-Falaq and An-Nas three times morning and evening; they will suffice you against everything.',
    source: 'Quran 112 · virtue: Abu Dawud 5082, Tirmidhi 3575',
    grade: 'Hasan',
    reviewed: false,
  },
  {
    id: 'al-falaq',
    title: 'Surah Al-Falaq',
    sessions: ['morning', 'evening'],
    arabic: QURAN['al-falaq'].text,
    script: 'quran',
    urdu: 'کہو: میں صبح کے رب کی پناہ مانگتا ہوں، ہر اس چیز کے شر سے جو اس نے پیدا کی، اور اندھیری رات کے شر سے جب وہ چھا جائے، اور گرہوں میں پھونکنے والیوں کے شر سے، اور حسد کرنے والے کے شر سے جب وہ حسد کرے۔',
    english: 'Say: I seek refuge in the Lord of daybreak, from the evil of what He created, from the evil of darkness when it settles, from the evil of those who blow on knots, and from the evil of an envier when he envies.',
    count: 3,
    source: 'Quran 113 · virtue: Abu Dawud 5082, Tirmidhi 3575',
    grade: 'Hasan',
    reviewed: false,
  },
  {
    id: 'an-nas',
    title: 'Surah An-Nas',
    sessions: ['morning', 'evening'],
    arabic: QURAN['an-nas'].text,
    script: 'quran',
    urdu: 'کہو: میں لوگوں کے رب کی پناہ مانگتا ہوں، لوگوں کے بادشاہ کی، لوگوں کے معبود کی، اس وسوسہ ڈالنے والے کے شر سے جو پیچھے ہٹ جاتا ہے، جو لوگوں کے دلوں میں وسوسہ ڈالتا ہے، جنوں میں سے ہو یا انسانوں میں سے۔',
    english: 'Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers in the hearts of mankind, from among jinn and mankind.',
    count: 3,
    source: 'Quran 114 · virtue: Abu Dawud 5082, Tirmidhi 3575',
    grade: 'Hasan',
    reviewed: false,
  },
  {
    id: 'sayyid-al-istighfar',
    title: 'Sayyid al-Istighfar',
    sessions: ['morning', 'evening'],
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    urdu:
      'اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں۔ تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں۔ میں اپنے اوپر تیری نعمتوں کا اقرار کرتا ہوں اور اپنے گناہ کا اعتراف کرتا ہوں، پس مجھے بخش دے، کیونکہ تیرے سوا کوئی گناہ نہیں بخشتا۔',
    english:
      'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
    count: 1,
    virtue: 'Whoever says it with conviction in the day and dies before evening, or at night and dies before morning, is among the people of Paradise.',
    source: 'Sahih al-Bukhari 6306',
    grade: 'Sahih',
    reviewed: false,
  },
  {
    id: 'bismillah-alladhi',
    title: 'In the name of Allah, with whose name nothing harms',
    sessions: ['morning', 'evening'],
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim",
    urdu: 'اللہ کے نام سے جس کے نام کے ساتھ زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سننے والا، جاننے والا ہے۔',
    english: 'In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.',
    count: 3,
    virtue: 'Whoever says it three times in the morning and evening, nothing will harm him.',
    source: 'Abu Dawud 5088, Tirmidhi 3388',
    grade: 'Hasan',
    reviewed: false,
  },
  {
    id: 'subhanallah-wa-bihamdihi',
    title: 'Glory be to Allah and praise be to Him',
    sessions: ['morning', 'evening'],
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    urdu: 'اللہ پاک ہے، اپنی تعریف کے ساتھ',
    english: 'Glory be to Allah, and praise be to Him.',
    count: 100,
    virtue:
      'Whoever says it 100 times morning and evening, no one will bring anything better on the Day of Resurrection, except one who said the same or more.',
    source: 'Sahih Muslim 2692',
    grade: 'Sahih',
    reviewed: false,
  },
  {
    id: 'tahlil-100',
    title: 'None has the right to be worshipped but Allah',
    sessions: ['morning'],
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir",
    urdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے اور تعریف اسی کے لیے ہے، اور وہ ہر چیز پر قادر ہے۔',
    english: 'None has the right to be worshipped but Allah alone, with no partner. His is the dominion and His is the praise, and He has power over all things.',
    count: 100,
    virtue: 'Whoever says it 100 times in a day: it equals freeing ten slaves, 100 good deeds are written, 100 sins erased, and it is protection from Shaytan that day until evening.',
    source: 'Sahih al-Bukhari 6403, Sahih Muslim 2691',
    grade: 'Sahih',
    reviewed: false,
  },
  {
    id: 'audhu-bikalimat',
    title: 'Refuge in the perfect words of Allah',
    sessions: ['evening'],
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    urdu: 'میں اللہ کے کامل کلمات کی پناہ مانگتا ہوں ہر اس چیز کے شر سے جو اس نے پیدا کی۔',
    english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    count: 3,
    virtue: 'Said in the evening, it protects from harm that night.',
    source: 'Sahih Muslim 2709 · three times: Tirmidhi 3604',
    grade: 'Sahih',
    reviewed: false,
  },
  {
    id: 'baqarah-285-286',
    title: 'Last two verses of Al-Baqarah',
    sessions: ['night'],
    arabic: QURAN['baqarah-285-286'].text,
    script: 'quran',
    urdu:
      'رسول اُس پر ایمان لائے جو اُن کے رب کی طرف سے اُن پر نازل ہوا، اور مومن بھی۔ سب اللہ، اس کے فرشتوں، اس کی کتابوں اور اس کے رسولوں پر ایمان لائے۔ ہم اس کے رسولوں میں فرق نہیں کرتے۔ اور انہوں نے کہا: ہم نے سنا اور مان لیا، اے ہمارے رب! ہم تیری بخشش چاہتے ہیں اور تیری ہی طرف لوٹنا ہے۔ اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔ جو نیکی کمائی اس کا فائدہ اسی کو، جو برائی کمائی اس کا وبال اسی پر۔ اے ہمارے رب! اگر ہم بھول جائیں یا غلطی کریں تو ہماری پکڑ نہ فرما۔ اے ہمارے رب! ہم پر ایسا بوجھ نہ ڈال جیسا ہم سے پہلے لوگوں پر ڈالا۔ اے ہمارے رب! ہم سے وہ نہ اٹھوا جس کی ہم میں طاقت نہیں۔ ہم سے درگزر فرما، ہمیں بخش دے، ہم پر رحم فرما۔ تو ہی ہمارا مولیٰ ہے، پس کافروں کے مقابلے میں ہماری مدد فرما۔',
    english:
      'The Messenger believes in what was sent down to him from his Lord, and so do the believers. All believe in Allah, His angels, His books and His messengers: "We make no distinction between any of His messengers." And they say, "We hear and obey. Your forgiveness, our Lord; to You is the return." Allah does not burden a soul beyond its capacity. It gains what it has earned and bears what it has committed. Our Lord, do not take us to task if we forget or make a mistake. Our Lord, do not place on us a burden like the one You placed on those before us. Our Lord, do not burden us with what we cannot bear. Pardon us, forgive us and have mercy on us. You are our Protector, so help us against the disbelieving people.',
    count: 1,
    virtue: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him.',
    source: 'Quran 2:285–286 · virtue: Sahih al-Bukhari 5009, Sahih Muslim 807',
    grade: 'Sahih',
    reviewed: false,
  },
];

export const adhkarFor = (session: 'morning' | 'evening' | 'night') =>
  ADHKAR.filter((d) => d.sessions.includes(session));

export const findDhikr = (id: string) => ADHKAR.find((d) => d.id === id);
