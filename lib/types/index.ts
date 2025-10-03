export type UUID = string;

export type Qualification = 
  | 'medikamente'
  | 'wundversorgung'
  | 'grundpflege'
  | 'behandlungspflege'
  | 'demenzbetreuung'
  | 'palliativpflege'
  | 'insulinverabreichung';

export type ShiftType = 'early' | 'late' | 'night';

export type TaskType = 
  | 'medikamente'
  | 'koerperpflege'
  | 'mobilisation'
  | 'wundversorgung'
  | 'ernaehrung'
  | 'dokumentation'
  | 'arztbesuch'
  | 'freizeitgestaltung';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TourStatus = 'planned' | 'active' | 'completed' | 'cancelled';

export interface Address {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ContactInfo {
  phone: string;
  email?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Schedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
  shiftType?: ShiftType;
}

export interface Employee {
  id: UUID;
  name: string;
  qualifications: Qualification[];
  availability: Schedule;
  maxHoursPerDay: number;
  contact: ContactInfo;
  status: 'active' | 'sick' | 'vacation' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CareRequirement {
  type: TaskType;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
  preferredTime?: string; // HH:mm
  duration: number; // Minuten
  requiredQualification: Qualification;
  notes?: string;
}

export interface MedicalRecord {
  allergies: string[];
  medications: Medication[];
  diagnoses: string[];
  mobilityLevel: 1 | 2 | 3 | 4 | 5; // 1=selbstständig, 5=komplett pflegebedürftig
  cognitiveState?: 'clear' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[]; // ['08:00', '20:00']
  notes?: string;
}

export interface Preferences {
  preferredEmployees?: UUID[];
  avoidEmployees?: UUID[];
  preferredTimeSlots?: TimeSlot[];
  specialRequests?: string;
}

export interface Resident {
  id: UUID;
  name: string;
  dateOfBirth: string;
  address: Address;
  careLevel: 1 | 2 | 3 | 4 | 5;
  requirements: CareRequirement[];
  medicalInfo: MedicalRecord;
  preferences: Preferences;
  contact: ContactInfo;
  insuranceNumber?: string;
  roomNumber?: string; // Für stationäre Pflege
  status: 'active' | 'inactive' | 'deceased';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: UUID;
  tourId: UUID;
  residentId: UUID;
  resident?: Resident; // Populated
  type: TaskType;
  scheduledTime: string; // ISO DateTime
  estimatedDuration: number; // Minuten
  actualDuration?: number; // Minuten
  requiredQualification: Qualification;
  status: TaskStatus;
  notes?: string;
  completedAt?: string;
  completedBy?: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  id: UUID;
  employeeId: UUID;
  employee?: Employee; // Populated
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  tasks: Task[];
  status: TourStatus;
  plannedStart: string; // HH:mm
  plannedEnd: string; // HH:mm
  actualStart?: string; // HH:mm
  actualEnd?: string; // HH:mm
  totalDistance?: number; // km
  notes?: string;
  optimizationScore?: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface WeekPlan {
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string;   // YYYY-MM-DD (Sunday)
  tours: Tour[];
  statistics?: WeekStatistics;
}

export interface WeekStatistics {
  totalTours: number;
  totalTasks: number;
  totalEmployees: number;
  totalResidents: number;
  averageTourDuration: number;
  completionRate: number;
  optimizationScore: number;
}

export interface AIOptimizationResult {
  originalTours: Tour[];
  optimizedTours: Tour[];
  improvements: {
    timeSaved: number; // Minuten
    distanceReduced: number; // km
    betterQualificationMatch: number; // %
  };
  reason: string;
}

export interface CreateEmployeeInput {
  name: string;
  qualifications: Qualification[];
  availability: Schedule;
  maxHoursPerDay: number;
  contact: ContactInfo;
}

export interface CreateResidentInput {
  name: string;
  dateOfBirth: string;
  address: Address;
  careLevel: 1 | 2 | 3 | 4 | 5;
  requirements: CareRequirement[];
  medicalInfo: MedicalRecord;
  preferences?: Preferences;
  contact: ContactInfo;
  insuranceNumber?: string;
  roomNumber?: string;
}

export interface CreateTaskInput {
  tourId: UUID;
  residentId: UUID;
  type: TaskType;
  scheduledTime: string;
  estimatedDuration: number;
  requiredQualification: Qualification;
  notes?: string;
}

export interface CreateTourInput {
  employeeId: UUID;
  date: string;
  shift: ShiftType;
  plannedStart: string;
  plannedEnd: string;
  notes?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

