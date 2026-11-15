export type AidText = { title: string; description: string };
export type AidLanguage = 'en' | 'ta' | 'si';

type AidEntry = { en: AidText; ta: AidText; si: AidText };

export const firstAidSteps: Record<string, AidEntry> = {
  '1': {
    en: { title: 'Move Away Safely', description: 'Move away from the snake to avoid another bite. Do not attempt to catch or handle it.' },
    ta: { title: 'பாதுகாப்பாக விலகிச் செல்லுங்கள்', description: 'மீண்டும் பாம்பு கடிக்காமல் இருக்க அதிலிருந்து விலகிச் செல்லுங்கள். பாம்பைப் பிடிக்கவோ தொடவோ முயற்சிக்காதீர்கள்.' },
    si: { title: 'ආරක්ෂිතව ඉවත් වන්න', description: 'නැවත දෂ්ට කිරීමක් වළක්වා ගැනීමට සර්පයාගෙන් ඈත් වන්න. සර්පයා අල්ලා ගැනීමට හෝ ස්පර්ශ කිරීමට උත්සාහ නොකරන්න.' },
  },
  '2': {
    en: { title: 'Get Emergency Help', description: 'Arrange urgent transport to the nearest hospital. Do not delay for snake identification or home treatment.' },
    ta: { title: 'அவசர மருத்துவ உதவியைப் பெறுங்கள்', description: 'அருகிலுள்ள மருத்துவமனைக்குச் செல்ல உடனடியாக போக்குவரத்து ஏற்பாடு செய்யுங்கள். பாம்பை அடையாளம் காண்பதற்காகவோ வீட்டு வைத்தியத்திற்காகவோ தாமதிக்காதீர்கள்.' },
    si: { title: 'හදිසි වෛද්‍ය උපකාර ලබා ගන්න', description: 'ළඟම රෝහලට ඉක්මනින් යාමට ප්‍රවාහනය සූදානම් කරන්න. සර්පයා හඳුනා ගැනීමට හෝ නිවසේ ප්‍රතිකාර කිරීමට කාලය නාස්ති නොකරන්න.' },
  },
  '3': {
    en: { title: 'Keep the Person Still', description: 'Reassure the person and minimise movement. Avoid walking if possible. Arrange transport instead.' },
    ta: { title: 'நபரை அசையாமல் வைத்திருங்கள்', description: 'பாதிக்கப்பட்டவருக்கு ஆறுதல் கூறி, அசைவைக் குறையுங்கள். முடிந்தவரை நடப்பதைத் தவிர்த்து, வாகனத்தில் அழைத்துச் செல்ல ஏற்பாடு செய்யுங்கள்.' },
    si: { title: 'පුද්ගලයා නිශ්චලව තබන්න', description: 'පුද්ගලයා සන්සුන් කර චලනය අවම කරන්න. හැකි නම් ඇවිදීමෙන් වළකින්න. ඒ වෙනුවට ප්‍රවාහනය සූදානම් කරන්න.' },
  },
  '4': {
    en: { title: 'Remove Tight Items', description: 'Remove rings, watches, bracelets and tight clothing near the bite before swelling develops.' },
    ta: { title: 'இறுக்கமான பொருட்களை அகற்றுங்கள்', description: 'வீக்கம் ஏற்படுவதற்கு முன் கடிபட்ட இடத்திற்கு அருகிலுள்ள மோதிரங்கள், கடிகாரங்கள், வளையல்கள் மற்றும் இறுக்கமான ஆடைகளை அகற்றுங்கள்.' },
    si: { title: 'තදින් ඇති දේ ඉවත් කරන්න', description: 'ඉදිමීම ඇති වීමට පෙර දෂ්ට කළ ස්ථානය අසල ඇති මුදු, ඔරලෝසු, වළලු සහ තද ඇඳුම් ඉවත් කරන්න.' },
  },
  '5': {
    en: { title: 'Keep the Limb Still', description: 'Support the bitten limb and keep it still without tight compression. Do not apply a tourniquet.' },
    ta: { title: 'கடிபட்ட உறுப்பை அசையாமல் வைத்திருங்கள்', description: 'கடிபட்ட கை அல்லது காலுக்கு ஆதரவு கொடுத்து அசையாமல் வைத்திருங்கள். இறுக்கமாகக் கட்டாதீர்கள்; இரத்த ஓட்டத்தைத் தடுக்கும் கட்டைப் பயன்படுத்தாதீர்கள்.' },
    si: { title: 'දෂ්ට කළ අත හෝ පාදය නිශ්චලව තබන්න', description: 'දෂ්ට කළ අතට හෝ පාදයට ආධාර දී තදින් නොබැඳ නිශ්චලව තබන්න. රුධිර ගමනාගමනය නවත්වන තද බැඳුමක් යොදන්න එපා.' },
  },
  '6': {
    en: { title: 'Monitor and Inform', description: "Watch the person's breathing and responsiveness. Tell hospital staff the time and place of the bite if known." },
    ta: { title: 'கவனித்து தகவல் தெரிவியுங்கள்', description: 'பாதிக்கப்பட்டவரின் சுவாசத்தையும் பதிலளிக்கும் நிலையையும் கவனியுங்கள். கடித்த நேரமும் இடமும் தெரிந்தால் மருத்துவமனை ஊழியர்களிடம் தெரிவியுங்கள்.' },
    si: { title: 'නිරීක්ෂණය කර තොරතුරු දන්වන්න', description: 'පුද්ගලයාගේ හුස්ම ගැනීම සහ ප්‍රතිචාර දැක්වීම නිරීක්ෂණය කරන්න. දෂ්ට කළ වේලාව සහ ස්ථානය දන්නේ නම් රෝහල් කාර්ය මණ්ඩලයට කියන්න.' },
  },
};

export const firstAidDonts: Record<string, AidEntry> = {
  '1': {
    en: { title: 'Do Not Use a Tourniquet', description: 'Do not tie a rope, cloth or tight bandage around the bitten limb.' },
    ta: { title: 'இறுக்கமான கட்டைப் பயன்படுத்தாதீர்கள்', description: 'கடிபட்ட கை அல்லது காலைச் சுற்றிக் கயிறு, துணி அல்லது இறுக்கமான கட்டைப் போடாதீர்கள்.' },
    si: { title: 'තද බැඳුමක් යොදන්න එපා', description: 'දෂ්ට කළ අත හෝ පාදය වටා කඹයක්, රෙදි පටියක් හෝ තද වෙළුමක් බඳින්න එපා.' },
  },
  '2': {
    en: { title: 'Do Not Cut or Suck', description: 'Do not cut the bite or attempt to suck out venom.' },
    ta: { title: 'வெட்டவோ உறிஞ்சவோ வேண்டாம்', description: 'கடிபட்ட இடத்தை வெட்டாதீர்கள். நஞ்சை உறிஞ்சி வெளியேற்ற முயற்சிக்காதீர்கள்.' },
    si: { title: 'කපන්න හෝ උරා බොන්න එපා', description: 'දෂ්ට කළ තැන කපන්න එපා. විෂ උරා ඉවත් කිරීමට උත්සාහ නොකරන්න.' },
  },
  '3': {
    en: { title: 'Do Not Apply Ice', description: 'Do not apply ice, heat, chemicals or herbal pastes.' },
    ta: { title: 'பனிக்கட்டி வைக்காதீர்கள்', description: 'கடிபட்ட இடத்தில் பனிக்கட்டி, வெப்பம், இரசாயனப் பொருட்கள் அல்லது மூலிகைப் பசைகளைப் பயன்படுத்தாதீர்கள்.' },
    si: { title: 'අයිස් තබන්න එපා', description: 'දෂ්ට කළ ස්ථානයට අයිස්, උණුසුම, රසායනික ද්‍රව්‍ය හෝ ඖෂධීය පැළෑටි ආලේපන යොදන්න එපා.' },
  },
  '4': {
    en: { title: 'Do Not Catch the Snake', description: 'Never attempt to capture, kill or handle the snake.' },
    ta: { title: 'பாம்பைப் பிடிக்க முயற்சிக்காதீர்கள்', description: 'பாம்பைப் பிடிக்கவோ கொல்லவோ கையாளவோ ஒருபோதும் முயற்சிக்காதீர்கள்.' },
    si: { title: 'සර්පයා අල්ලන්න එපා', description: 'සර්පයා අල්ලා ගැනීමට, මරා දැමීමට හෝ හැසිරවීමට කිසිවිටෙක උත්සාහ නොකරන්න.' },
  },
  '5': {
    en: { title: 'Do Not Delay Treatment', description: 'Do not wait for symptoms, traditional remedies or online identification.' },
    ta: { title: 'சிகிச்சையைத் தாமதிக்காதீர்கள்', description: 'அறிகுறிகள் தோன்றுவதற்காகவோ பாரம்பரிய வைத்தியத்திற்காகவோ இணையத்தில் பாம்பை அடையாளம் காண்பதற்காகவோ காத்திருக்காதீர்கள்.' },
    si: { title: 'ප්‍රතිකාර ප්‍රමාද කරන්න එපා', description: 'රෝග ලක්ෂණ මතු වන තුරු, සාම්ප්‍රදායික ප්‍රතිකාර සඳහා හෝ අන්තර්ජාලයෙන් සර්පයා හඳුනා ගන්නා තුරු බලා නොසිටින්න.' },
  },
};

export function getAidLanguage(language: string): AidLanguage {
  const normalized = language.toLowerCase();
  if (normalized === 'ta' || normalized.startsWith('ta-') || normalized.includes('tamil')) return 'ta';
  if (normalized === 'si' || normalized.startsWith('si-') || normalized.includes('sinhala')) return 'si';
  return 'en';
}

export function getAidText(
  section: 'steps' | 'donts',
  id: string,
  language: string,
  fallback: AidText
): AidText {
  const entry = (section === 'steps' ? firstAidSteps : firstAidDonts)[id];
  return entry?.[getAidLanguage(language)] ?? fallback;
}
