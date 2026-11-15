export type Hospital = {
  id: string;
  name: string;
  district: string;
  province: string;
  category: string;
  phone?: string;
};

// Published general contact numbers previously identified for review.
// Verify each number with the hospital before public release.
export const hospitals: Hospital[] = [
  { id: '1', name: 'National Hospital of Sri Lanka', district: 'Colombo', province: 'Western', category: 'National Referral Hospital', phone: '0112691111' },
  { id: '2', name: 'Colombo South Teaching Hospital', district: 'Colombo', province: 'Western', category: 'Teaching Hospital - Kalubowila', phone: '0112763261' },
  { id: '3', name: 'Colombo North Teaching Hospital', district: 'Gampaha', province: 'Western', category: 'Teaching Hospital - Ragama', phone: '0112959261' },
  { id: '4', name: 'Teaching Hospital Kandy', district: 'Kandy', province: 'Central', category: 'National Hospital - Kandy' },
  { id: '5', name: 'Teaching Hospital Jaffna', district: 'Jaffna', province: 'Northern', category: 'Teaching Hospital', phone: '0212222261' },
  { id: '6', name: 'Teaching Hospital Batticaloa', district: 'Batticaloa', province: 'Eastern', category: 'Teaching Hospital', phone: '0652222261' },
  { id: '7', name: 'Teaching Hospital Karapitiya', district: 'Galle', province: 'Southern', category: 'Teaching Hospital', phone: '0912223341' },
  { id: '8', name: 'Teaching Hospital Anuradhapura', district: 'Anuradhapura', province: 'North Central', category: 'Teaching Hospital', phone: '0252222261' },
  { id: '9', name: 'Teaching Hospital Kurunegala', district: 'Kurunegala', province: 'North Western', category: 'Teaching Hospital', phone: '0372233906' },
  { id: '10', name: 'Teaching Hospital Ratnapura', district: 'Ratnapura', province: 'Sabaragamuwa', category: 'Provincial General Hospital' },
  { id: '11', name: 'Provincial General Hospital Badulla', district: 'Badulla', province: 'Uva', category: 'General Hospital', phone: '0552222261' },
];
