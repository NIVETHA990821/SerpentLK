import type { Snake } from '@/types/snake';
import type { AppLanguage } from './LanguageProvider';
import ta from './snake-details-ta.json';
import si from './snake-details-si.json';

type Detail = {
  description?: string;
  pattern?: string;
  keyFeatures?: string[];
  behaviour?: string;
  venomType?: string;
  biteSymptoms?: string[];
};
const data: Record<'ta' | 'si', Record<string, Detail>> = { ta, si };
export function localizedSnakeDetails(snake: Snake, language: AppLanguage) {
  const entry: Detail | undefined = language === 'en' ? undefined : data[language][snake.id];
  return {
    description: entry?.description ?? snake.description,
    pattern: entry?.pattern ?? snake.pattern,
    keyFeatures: entry?.keyFeatures ?? snake.keyFeatures,
    behaviour: entry?.behaviour ?? snake.behaviour,
    venomType: entry?.venomType ?? snake.venomType,
    biteSymptoms: entry?.biteSymptoms ?? snake.biteSymptoms,
    complete: language === 'en' || !!(entry?.description && entry?.pattern && entry?.keyFeatures && entry?.behaviour && (!snake.venomous || (entry.venomType && entry.biteSymptoms))),
  };
}

const locationWords: Record<'ta'|'si', Record<string,string>> = {
  ta: {
    'scrub':'புதர்நிலம்','gardens and villages':'தோட்டங்களும் கிராமங்களும்',
    'paddy fields':'நெல்வயல்கள்','forest':'காடு','forests':'காடுகள்',
    'grassland':'புல்வெளி','wetland':'ஈரநிலம்','urban':'நகர்ப்புறம்',
    'Western':'மேல் மாகாணம்','Central':'மத்திய மாகாணம்','Southern':'தென் மாகாணம்',
    'Northern':'வட மாகாணம்','Eastern':'கிழக்கு மாகாணம்','North Western':'வடமேல் மாகாணம்',
    'North Central':'வடமத்திய மாகாணம்','Uva':'ஊவா மாகாணம்','Sabaragamuwa':'சபரகமுவ மாகாணம்',
    'brown':'பழுப்பு','tan':'வெளிர் பழுப்பு','white':'வெள்ளை','black':'கருப்பு','green':'பச்சை',
    'yellow':'மஞ்சள்','grey':'சாம்பல்','gray':'சாம்பல்','red':'சிவப்பு','olive':'ஒலிவ் பச்சை',
  },
  si: {
    'scrub':'ලඳු කැලෑ','gardens and villages':'උද්‍යාන සහ ගම්මාන',
    'paddy fields':'කුඹුරු','forest':'වනාන්තරය','forests':'වනාන්තර',
    'grassland':'තණබිම්','wetland':'තෙත්බිම්','urban':'නාගරික ප්‍රදේශ',
    'Western':'බස්නාහිර පළාත','Central':'මධ්‍යම පළාත','Southern':'දකුණු පළාත',
    'Northern':'උතුරු පළාත','Eastern':'නැගෙනහිර පළාත','North Western':'වයඹ පළාත',
    'North Central':'උතුරු මැද පළාත','Uva':'ඌව පළාත','Sabaragamuwa':'සබරගමුව පළාත',
    'brown':'දුඹුරු','tan':'ලා දුඹුරු','white':'සුදු','black':'කළු','green':'කොළ',
    'yellow':'කහ','grey':'අළු','gray':'අළු','red':'රතු','olive':'ඔලිව් කොළ',
  },
};
export function localTerm(word: string, language: AppLanguage): string {
  return language === 'en' ? word : (locationWords[language][word] ?? word);
}
