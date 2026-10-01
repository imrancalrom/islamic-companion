/*
 * Hadith of the day: short, well-known narrations from graded collections.
 * Arabic is the narration's key wording; translations are plain-meaning drafts.
 * All entries are pending scholar review.
 */
export type Hadith = { id: string; arabic: string; english: string; urdu: string; source: string; grade: 'Sahih' | 'Hasan' };

export const HADITH: Hadith[] = [
  { id: 'niyyah', arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', english: 'Actions are only by intentions.', urdu: 'اعمال کا دارومدار نیتوں پر ہے۔', source: 'Sahih al-Bukhari 1, Sahih Muslim 1907', grade: 'Sahih' },
  { id: 'speak-good', arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', urdu: 'جو اللہ اور آخرت کے دن پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے۔', source: 'Sahih al-Bukhari 6018, Sahih Muslim 47', grade: 'Sahih' },
  { id: 'love-for-brother', arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', english: 'None of you truly believes until he loves for his brother what he loves for himself.', urdu: 'تم میں سے کوئی مومن نہیں ہو سکتا جب تک اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔', source: 'Sahih al-Bukhari 13, Sahih Muslim 45', grade: 'Sahih' },
  { id: 'purity', arabic: 'الطُّهُورُ شَطْرُ الْإِيمَانِ', english: 'Purity is half of faith.', urdu: 'پاکیزگی آدھا ایمان ہے۔', source: 'Sahih Muslim 223', grade: 'Sahih' },
  { id: 'naseehah', arabic: 'الدِّينُ النَّصِيحَةُ', english: 'The religion is sincere advice.', urdu: 'دین خیر خواہی کا نام ہے۔', source: 'Sahih Muslim 55', grade: 'Sahih' },
  { id: 'leave-what-concerns-not', arabic: 'مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ', english: 'Part of the excellence of a person’s Islam is leaving what does not concern him.', urdu: 'آدمی کے اسلام کی خوبی یہ ہے کہ وہ بے مقصد باتوں کو چھوڑ دے۔', source: 'Tirmidhi 2317', grade: 'Hasan' },
  { id: 'good-word', arabic: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', english: 'A good word is charity.', urdu: 'اچھی بات صدقہ ہے۔', source: 'Sahih al-Bukhari 2989, Sahih Muslim 1009', grade: 'Sahih' },
  { id: 'smile', arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ', english: 'Your smile in the face of your brother is charity for you.', urdu: 'اپنے بھائی کے سامنے تمہارا مسکرانا تمہارے لیے صدقہ ہے۔', source: 'Tirmidhi 1956', grade: 'Hasan' },
  { id: 'anger', arabic: 'لَا تَغْضَبْ', english: 'Do not become angry.', urdu: 'غصہ نہ کرو۔', source: 'Sahih al-Bukhari 6116', grade: 'Sahih' },
  { id: 'quran-teach', arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', english: 'The best of you are those who learn the Quran and teach it.', urdu: 'تم میں سب سے بہتر وہ ہے جو قرآن سیکھے اور سکھائے۔', source: 'Sahih al-Bukhari 5027', grade: 'Sahih' },
  { id: 'consistent', arabic: 'أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', english: 'The most beloved deeds to Allah are the most consistent, even if small.', urdu: 'اللہ کو سب سے محبوب عمل وہ ہے جو ہمیشہ کیا جائے، چاہے تھوڑا ہو۔', source: 'Sahih Muslim 783', grade: 'Sahih' },
  { id: 'two-words', arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', english: 'Two words are light on the tongue, heavy on the scale and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azim.', urdu: 'دو کلمے زبان پر ہلکے، ترازو میں بھاری اور رحمٰن کو محبوب ہیں: سبحان اللہ وبحمدہ، سبحان اللہ العظیم۔', source: 'Sahih al-Bukhari 6406, Sahih Muslim 2694', grade: 'Sahih' },
  { id: 'muslim-safe', arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', english: 'The Muslim is the one from whose tongue and hand the Muslims are safe.', urdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔', source: 'Sahih al-Bukhari 10', grade: 'Sahih' },
  { id: 'knowledge-path', arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ', english: 'Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise.', urdu: 'جو علم کی تلاش میں کسی راستے پر چلے، اللہ اس کے لیے جنت کا راستہ آسان کر دیتا ہے۔', source: 'Sahih Muslim 2699', grade: 'Sahih' },
  { id: 'strong', arabic: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ', english: 'The strong one is not the one who wrestles others down; the strong one controls himself when angry.', urdu: 'طاقتور وہ نہیں جو پچھاڑ دے، طاقتور وہ ہے جو غصے کے وقت خود پر قابو رکھے۔', source: 'Sahih al-Bukhari 6114, Sahih Muslim 2609', grade: 'Sahih' },
  { id: 'mercy', arabic: 'مَنْ لَا يَرْحَمُ لَا يُرْحَمُ', english: 'Whoever shows no mercy will be shown no mercy.', urdu: 'جو رحم نہیں کرتا اس پر رحم نہیں کیا جاتا۔', source: 'Sahih al-Bukhari 5997, Sahih Muslim 2318', grade: 'Sahih' },
  { id: 'gentleness', arabic: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ', english: 'Allah is gentle and loves gentleness in all matters.', urdu: 'اللہ نرمی کرنے والا ہے اور ہر معاملے میں نرمی کو پسند کرتا ہے۔', source: 'Sahih al-Bukhari 6927', grade: 'Sahih' },
  { id: 'taqwa', arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ', english: 'Fear Allah wherever you are, follow a bad deed with a good one to wipe it out, and treat people with good character.', urdu: 'جہاں بھی ہو اللہ سے ڈرو، برائی کے بعد نیکی کرو وہ اسے مٹا دے گی، اور لوگوں سے اچھے اخلاق سے پیش آؤ۔', source: 'Tirmidhi 1987', grade: 'Hasan' },
  { id: 'ease', arabic: 'يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا', english: 'Make things easy and do not make them hard; give glad tidings and do not drive people away.', urdu: 'آسانی پیدا کرو، مشکل نہ بناؤ؛ خوشخبری دو، نفرت نہ دلاؤ۔', source: 'Sahih al-Bukhari 69', grade: 'Sahih' },
  { id: 'charity', arabic: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ', english: 'Charity does not decrease wealth.', urdu: 'صدقہ مال میں کمی نہیں کرتا۔', source: 'Sahih Muslim 2588', grade: 'Sahih' },
  { id: 'guide-to-good', arabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', english: 'Whoever guides to good has a reward like the one who does it.', urdu: 'جو نیکی کی طرف رہنمائی کرے اسے نیکی کرنے والے جتنا اجر ملتا ہے۔', source: 'Sahih Muslim 1893', grade: 'Sahih' },
  { id: 'hearts', arabic: 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ', english: 'Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.', urdu: 'اللہ تمہاری صورتوں اور مالوں کو نہیں دیکھتا، بلکہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔', source: 'Sahih Muslim 2564', grade: 'Sahih' },
];

/** The same hadith all day, changing at midnight. */
export function hadithFor(d: Date): Hadith {
  const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  return HADITH[day % HADITH.length];
}
