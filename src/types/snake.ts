export type VenomLevel = 'highly_venomous' | 'mildly_venomous' | 'non_venomous';

export type ActiveTime = 'nocturnal' | 'diurnal' | 'both';

export type Snake = {
  id: string;
  name: string;
  sinhalaName: string;
  sinhalaRoman: string;
  tamilName: string;
  tamilRoman: string;
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
