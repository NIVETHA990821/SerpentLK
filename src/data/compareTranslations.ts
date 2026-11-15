export type CompareLanguage = 'en' | 'ta' | 'si';

export const compareTranslations = {
  en: {
    heading: 'Tell similar snakes apart', presets: 'Common look-alike pairs', first: 'First snake', second: 'Second snake', choose: 'Please choose two different snakes.', different: 'different', same: 'same',
    labels: ['Danger level', 'Venom type', 'Pattern', 'Key features', 'Length (avg / max)', 'Active', 'Habitat', 'Endemic'],
    yes: 'Yes', no: 'No', disclaimer: 'Highlighted rows show the differences. Never approach or handle an unknown snake. Appearance alone cannot reliably identify a snake.',
    pairs: ["Russell's Viper vs Sand Boa", 'Common Krait vs Wolf Snake', 'Cobra vs Rat Snake', 'Saw-scaled vs Hump-nosed Viper', 'Sea Snake vs Wart Snake', 'Sri Lanka Krait vs Barred Wolf Snake', 'Green vs Brown Vine Snake'],
  },
  ta: {
    heading: 'ஒத்த தோற்றமுள்ள பாம்புகளை வேறுபடுத்திப் பாருங்கள்', presets: 'ஒத்த தோற்றமுள்ள பொதுவான பாம்பு இணைகள்', first: 'முதல் பாம்பு', second: 'இரண்டாவது பாம்பு', choose: 'வெவ்வேறு இரண்டு பாம்புகளைத் தேர்ந்தெடுக்கவும்.', different: 'வேறுபாடு', same: 'ஒரே மாதிரி',
    labels: ['ஆபத்து நிலை', 'நஞ்சின் வகை', 'உடல் வடிவமைப்பு', 'முக்கிய அம்சங்கள்', 'நீளம் (சராசரி / அதிகபட்சம்)', 'செயலில் இருக்கும் நேரம்', 'வாழிடம்', 'இலங்கைக்கே உரியதா'],
    yes: 'ஆம்', no: 'இல்லை', disclaimer: 'வேறுபாடுள்ள வரிசைகள் தனிப்படுத்திக் காட்டப்படுகின்றன. அடையாளம் தெரியாத பாம்பை அணுகவோ கையாளவோ வேண்டாம். தோற்றத்தை மட்டும் வைத்து பாம்பை நம்பகமாக அடையாளம் காண முடியாது.',
    pairs: ['ரஸ்ஸல்ஸ் விரியன் / மணற்பாம்பு', 'கட்டுவிரியன் / ஓநாய்ப் பாம்பு', 'நாகப்பாம்பு / சாரைப்பாம்பு', 'சுருட்டை விரியன் / கூனிமூக்கு விரியன்', 'கடற்பாம்பு / மருக்கள் கொண்ட பாம்பு', 'இலங்கைக் கட்டுவிரியன் / பட்டை ஓநாய்ப் பாம்பு', 'பச்சைக் கொடிப்பாம்பு / பழுப்புக் கொடிப்பாம்பு'],
  },
  si: {
    heading: 'සමාන පෙනුමැති සර්පයන් වෙන්කර හඳුනාගන්න', presets: 'සමාන පෙනුමැති සර්ප යුගල', first: 'පළමු සර්පයා', second: 'දෙවන සර්පයා', choose: 'වෙනස් සර්පයන් දෙදෙනෙකු තෝරන්න.', different: 'වෙනස්', same: 'සමාන',
    labels: ['අවදානම් මට්ටම', 'විෂ වර්ගය', 'ශරීර රටාව', 'ප්‍රධාන ලක්ෂණ', 'දිග (සාමාන්‍ය / උපරිම)', 'සක්‍රීය කාලය', 'වාසස්ථාන', 'ශ්‍රී ලංකාවට ආවේණිකද'],
    yes: 'ඔව්', no: 'නැත', disclaimer: 'වෙනස්කම් ඇති පේළි ඉස්මතු කර ඇත. හඳුනා නොගත් සර්පයෙකු වෙත ළඟා නොවන්න හෝ අල්ලන්න එපා. පෙනුම පමණක් භාවිතයෙන් සර්පයෙකු විශ්වාසදායක ලෙස හඳුනාගත නොහැක.',
    pairs: ['තිත් පොළඟා / වැලි පිඹුරා', 'තෙල් කරවලා / වෘක සර්පයා', 'නයා / ගැරඬියා', 'වැලි පොළඟා / කුණකටුවා', 'මුහුදු සර්පයා / ගැටිති සර්පයා', 'ශ්‍රී ලංකා කරවලා / ඉරි සහිත වෘක සර්පයා', 'කොළ වැල් සර්පයා / දුඹුරු වැල් සර්පයා'],
  },
} as const;
