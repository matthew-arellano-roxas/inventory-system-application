export const keys = {
  reports: {
    all: ["reports"] as const,
    currentMonth: () => [...keys.reports.all, "current-month"] as const,
    monthly: () => [...keys.reports.all, "monthly"] as const,
    branch: () => [...keys.reports.all, "branch"] as const,
    product: () => [...keys.reports.all, "product"] as const,
  },
  announcements: {
    all: ["announcements"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
  },
  branches: {
    all: ["branches"] as const,
    
  },
};
