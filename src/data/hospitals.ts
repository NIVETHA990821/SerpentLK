
export type Hospital = {
  id: string;
  name: string;
  district: string;
  province: string;
  category: string;
};

export const hospitals: Hospital[] = [
  {
    id: '1',
    name: 'National Hospital of Sri Lanka',
    district: 'Colombo',
    province: 'Western',
    category: 'National Referral Hospital',
  },
  {
    id: '2',
    name: 'Colombo South Teaching Hospital',
    district: 'Colombo',
    province: 'Western',
    category: 'Teaching Hospital - Kalubowila',
  },
  {
    id: '3',
    name: 'Colombo North Teaching Hospital',
    district: 'Gampaha',
    province: 'Western',
    category: 'Teaching Hospital - Ragama',
  },
  {
    id: '4',
    name: 'Teaching Hospital Kandy',
    district: 'Kandy',
    province: 'Central',
    category: 'National Hospital - Kandy',
  },
  {
    id: '5',
    name: 'Teaching Hospital Jaffna',
    district: 'Jaffna',
    province: 'Northern',
    category: 'Teaching Hospital',
  },
  {
    id: '6',
    name: 'Teaching Hospital Batticaloa',
    district: 'Batticaloa',
    province: 'Eastern',
    category: 'Teaching Hospital',
  },
  {
    id: '7',
    name: 'Teaching Hospital Karapitiya',
    district: 'Galle',
    province: 'Southern',
    category: 'Teaching Hospital',
  },
  {
    id: '8',
    name: 'Teaching Hospital Anuradhapura',
    district: 'Anuradhapura',
    province: 'North Central',
    category: 'Teaching Hospital',
  },
  {
    id: '9',
    name: 'Teaching Hospital Kurunegala',
    district: 'Kurunegala',
    province: 'North Western',
    category: 'Teaching Hospital',
  },
  {
    id: '10',
    name: 'Teaching Hospital Ratnapura',
    district: 'Ratnapura',
    province: 'Sabaragamuwa',
    category: 'Provincial General Hospital',
  },
  {
    id: '11',
    name: 'Provincial General Hospital Badulla',
    district: 'Badulla',
    province: 'Uva',
    category: 'General Hospital',
  },
];
