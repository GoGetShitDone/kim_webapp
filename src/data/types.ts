export type EmployeeType = "full-time" | "part-time";

export interface BusinessProfile {
  id: string;
  name: string;
  brand: string;
  industry: "cafe" | "restaurant" | "retail" | "service";
  foundedAt: string;
  location: {
    city: string;
    district: string;
    addressLine1: string;
  };
  owner: {
    name: string;
    contactEmail: string;
    accountingTools: string[];
    taxPlatform: string;
  };
  description: string;
}

export interface FinancialSnapshot {
  month: string;
  grossRevenue: number;
  netRevenue: number;
  cogCost: number;
  operatingExpense: number;
  payrollExpense: number;
  marketingSpend: number;
  avgOrderValue: number;
  footTraffic: {
    weekdayAvg: number;
    weekendAvg: number;
  };
  notes?: string;
}

export interface FixedCost {
  category:
    | "rent"
    | "utilities"
    | "insurance"
    | "software"
    | "loan"
    | "other";
  description: string;
  amount: number;
  billingCycle: "monthly" | "quarterly" | "yearly";
  autoDebit: boolean;
}

export interface EmployeeSchedule {
  day: "월" | "화" | "수" | "목" | "금" | "토" | "일";
  startTime: string;
  endTime: string;
  totalHours: number;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  type: EmployeeType;
  hourlyRate?: number;
  monthlySalary?: number;
  hireDate: string;
  benefits: string[];
  deductions: string[];
  notes?: string;
  schedule: EmployeeSchedule[];
}

export interface TaxObligation {
  id: string;
  name: string;
  authority: "국세청" | "지방세청" | "국민연금" | "고용보험";
  type: "부가세" | "원천세" | "4대보험" | "지방세" | "기타";
  period: string;
  amount: number;
  dueDate: string;
  status: "예정" | "완료" | "확인필요";
  referenceDoc: string;
}

export interface ProductPerformance {
  sku: string;
  name: string;
  category: "signature" | "beverage" | "dessert" | "merch" | "service";
  avgMonthlySales: number;
  grossMargin: number;
  price: number;
  bestSeller: boolean;
  notes?: string;
}

export interface BusinessDataset {
  profile: BusinessProfile;
  financials: FinancialSnapshot[];
  fixedCosts: FixedCost[];
  employees: EmployeeProfile[];
  taxObligations: TaxObligation[];
  products: ProductPerformance[];
  ragFacts: string[];
}
