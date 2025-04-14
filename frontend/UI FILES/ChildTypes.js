// Child management related types

export interface ParentGuardian {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
  }
  
  export interface SpecialCareNeeds {
    allergies?: string[];
    medical_conditions?: string[];
    dietary_restrictions?: string[];
    medications?: string[];
    other_notes?: string;
  }
  
  export interface ChildBase {
    full_name: string;
    birth_date: string; // ISO date string
    gender: string;
    parents: ParentGuardian[];
    care_needs?: SpecialCareNeeds;
    session_type: "half-day" | "full-day";
    emergency_contact?: string;
    notes?: string;
  }
  
  export interface Child extends ChildBase {
    id: string;
  }
  
  export type ChildCreate = ChildBase;
  
  export interface ChildUpdate {
    full_name?: string;
    birth_date?: string; // ISO date string
    gender?: string;
    parents?: ParentGuardian[];
    care_needs?: SpecialCareNeeds;
    session_type?: "half-day" | "full-day";
    emergency_contact?: string;
    notes?: string;
  }
  