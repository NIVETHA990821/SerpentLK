export type VenomLevel = 'highly_venomous' | 'mildly_venomous' | 'non_venomous';

export type ActiveTime = 'nocturnal' | 'diurnal' | 'both';

export type Snake = {
  id: string;
  name: string;
  sinhalaName: string;
  sinhalaRoman: string;
  tamilName: string;
  tamilRoman: string;
  // Other Tamil names in use (Sri Lankan and Tamil Nadu variants), shown and searchable.
  tamilOtherNames?: string[];
  // True when no established Tamil common name was found and tamilName is a
  // descriptive Tamil name built from Tamil words (not a transliteration).
  tamilNameDescriptive?: boolean;
  scientificName: string;
  family: string;
  venomous: boolean;
  venomLevel: VenomLevel;
  venomType: string;
  avgLengthCm: number;
  maxLengthCm: number;
  colours: string[];
  pattern: string;
  keyFeatures: string[];
  habitats: string[];
  activeTime: ActiveTime;
  provinces: string[];
  behaviour: string;
  description: string;
  lookAlikes: string[];
  biteSymptoms: string[];
  endemic: boolean;
  image: string;
};

export type District = {
  id: string;
  name: string;
  province: string;
};
