import { prisma } from '@root/lib/prisma';
import { ProductReportQuery } from '@/types/report.types';
import {
  buildInventoryExportFile,
  InventoryExportFile,
  InventoryExportFormat,
  InventoryExportSection,
} from './inventory-export';
import {
  getCurrentDayReport,
  getCurrentMonthReport,
  getProductReportSummary,
  getProductReports,
} from './report-read.service';
import { getFinancialReportByBranchId, getFinancialReportList } from './report-financial.service';

export const getInventoryExportFile = async (
  query?: ProductReportQuery,
  format: InventoryExportFormat = 'excel',
  timezone?: string,
): Promise<InventoryExportFile> => {
  const now = new Date();
  const resolvedTimeZone = (() => {
    if (!timezone?.trim()) return undefined;

    try {
      Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(now);
      return timezone;
    } catch {
      return undefined;
    }
  })();
  const getDateParts = (value: Date) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: resolvedTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(value);

    const readPart = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? '00';

    return {
      year: readPart('year'),
      month: readPart('month'),
      day: readPart('day'),
      hour: readPart('hour'),
      minute: readPart('minute'),
      second: readPart('second'),
    };
  };
  const formatDateTime = (value: Date) => {
    const parts = getDateParts(value);
    const formatted = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;

    return resolvedTimeZone ? `${formatted} (${resolvedTimeZone})` : formatted;
  };
  const formatDateOnly = (value: Date) => {
    const parts = getDateParts(value);
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  const fileStamp = (() => {
    const parts = getDateParts(now);
    return `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}`;
  })();
  const exportedOn = formatDateTime(now);

  const exportQuery: ProductReportQuery = {
    ...(query?.branchId != null ? { branchId: query.branchId } : {}),
    ...(query?.search ? { search: query.search } : {}),
    product_details: true,
  };
  const summaryQuery: ProductReportQuery = {
    ...(query?.branchId != null ? { branchId: query.branchId } : {}),
    ...(query?.search ? { search: query.search } : {}),
  };

  const [
    branches,
    categories,
    productReports,
    productSummary,
    dailyReports,
    monthlyReports,
    currentDaySummary,
    currentMonthSummary,
    stockMovements,
    operatingExpenses,
    financialReportList,
    branchFinancial,
  ] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    getProductReports(exportQuery),
    getProductReportSummary(summaryQuery),
    prisma.dailyReport.findMany({
      where: query?.branchId != null ? { branchId: query.branchId } : undefined,
      orderBy: [{ date: 'desc' }, { branchId: 'asc' }],
    }),
    prisma.monthlyReport.findMany({
      orderBy: { date: 'desc' },
    }),
    getCurrentDayReport(query?.branchId != null ? { branchId: query.branchId } : undefined),
    getCurrentMonthReport(),
    prisma.stockMovement.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.operatingExpense.findMany({ orderBy: { createdAt: 'desc' } }),
    query?.branchId == null ? getFinancialReportList() : Promise.resolve([]),
    query?.branchId != null ? getFinancialReportByBranchId(query.branchId) : Promise.resolve(null),
  ]);

  const lowStockReports = productSummary.lowStockReports as Array<Record<string, unknown>>;
  const branchNameMap = new Map<number, string>(branches.map((branch) => [branch.id, branch.name]));
  const categoryNameMap = new Map<number, string>(
    categories.map((category) => [category.id, category.name]),
  );
  const searchNeedle = query?.search?.trim().toLowerCase() ?? '';

  const filteredMovements = stockMovements.filter((movement) => {
    if (!searchNeedle) return true;

    return [movement.productId, movement.movementReason].some((part) =>
      String(part ?? '')
        .toLowerCase()
        .includes(searchNeedle),
    );
  });

  const filteredExpenses = operatingExpenses.filter((expense) => {
    if (query?.branchId != null && expense.branchId !== query.branchId) return false;
    if (!searchNeedle) return true;

    return [
      expense.id,
      expense.name,
      expense.branchId,
      expense.amount,
      branchNameMap.get(expense.branchId),
    ].some((part) =>
      String(part ?? '')
        .toLowerCase()
        .includes(searchNeedle),
    );
  });

  const totals =
    branchFinancial ??
    financialReportList.reduce(
      (acc, report) => ({
        totalRevenue: acc.totalRevenue + (Number(report.revenue) || 0),
        totalProfit: acc.totalProfit + (Number(report.profit) || 0),
        totalOpex: acc.totalOpex + (Number(report.operationExpenses) || 0),
        net: acc.net + (Number(report.netProfit) || 0),
      }),
      { totalRevenue: 0, totalProfit: 0, totalOpex: 0, net: 0 },
    );

  const sections: InventoryExportSection[] = [
    {
      title: 'Summary',
      columns: ['Metric', 'Value'],
      rows: [
        {
          Metric: 'Branch Filter',
          Value:
            query?.branchId != null ? (branchNameMap.get(query.branchId) ?? query.branchId) : 'All',
        },
        { Metric: 'Search Filter', Value: query?.search?.trim() || 'None' },
        { Metric: 'Products', Value: productReports.length },
        { Metric: 'Low Stock', Value: Number(productSummary.lowStockCount) || 0 },
        { Metric: 'Total Stock', Value: Number(productSummary.totalStock) || 0 },
        {
          Metric: 'Total Revenue',
          Value: Number('revenue' in totals ? totals.revenue : totals.totalRevenue) || 0,
        },
        {
          Metric: 'Total Profit',
          Value: Number('profit' in totals ? totals.profit : totals.totalProfit) || 0,
        },
        {
          Metric: 'Total OPEX',
          Value:
            Number('operationExpenses' in totals ? totals.operationExpenses : totals.totalOpex) ||
            0,
        },
        {
          Metric: 'Net',
          Value: Number('netProfit' in totals ? totals.netProfit : totals.net) || 0,
        },
        { Metric: 'Exported At', Value: exportedOn },
      ],
    },
    {
      title: 'Current Day',
      columns: ['Metric', 'Value'],
      rows: [
        {
          Metric: 'Branch Filter',
          Value:
            query?.branchId != null ? (branchNameMap.get(query.branchId) ?? query.branchId) : 'All',
        },
        { Metric: 'Revenue', Value: Number(currentDaySummary.revenue) || 0 },
        { Metric: 'Profit', Value: Number(currentDaySummary.profit) || 0 },
        { Metric: 'Damage', Value: Number(currentDaySummary.damage) || 0 },
      ],
    },
    {
      title: 'Current Month',
      columns: ['Metric', 'Value'],
      rows: [
        { Metric: 'Revenue', Value: Number(currentMonthSummary.revenue) || 0 },
        { Metric: 'Profit', Value: Number(currentMonthSummary.profit) || 0 },
        { Metric: 'Damage', Value: Number(currentMonthSummary.damage) || 0 },
        ...(query?.branchId != null
          ? [
              {
                Metric: 'Selected Branch',
                Value: branchNameMap.get(query.branchId) ?? query.branchId,
              },
              { Metric: 'Branch OPEX', Value: Number(branchFinancial?.operationExpenses) || 0 },
              { Metric: 'Branch Net', Value: Number(branchFinancial?.netProfit) || 0 },
            ]
          : []),
      ],
    },
    {
      title: 'Products',
      columns: [
        'Product ID',
        'Product',
        'Branch',
        'Category',
        'Sold By',
        'Cost',
        'Price',
        'Stock',
        'Revenue',
        'Gross Profit',
        'Created At',
      ],
      rows: productReports.map((report) => {
        const exportReport = report as Record<string, unknown>;
        const product = exportReport.product as
          | {
              name?: string;
              branchId?: number;
              categoryId?: number;
              soldBy?: string;
              costPerUnit?: number;
              sellingPrice?: number;
              createdAt?: Date;
            }
          | undefined;

        return {
          'Product ID': report.productId,
          Product: product?.name ?? `Product #${report.productId}`,
          Branch:
            product?.branchId != null
              ? (branchNameMap.get(product.branchId) ?? `Branch #${product.branchId}`)
              : 'N/A',
          Category:
            product?.categoryId != null
              ? (categoryNameMap.get(product.categoryId) ?? `Category #${product.categoryId}`)
              : 'N/A',
          'Sold By': product?.soldBy ?? 'N/A',
          Cost: product?.costPerUnit ?? '',
          Price: product?.sellingPrice ?? '',
          Stock: Number(report.stock) || 0,
          Revenue: Number(report.revenue) || 0,
          'Gross Profit': Number(report.profit) || 0,
          'Created At': product?.createdAt ? formatDateTime(product.createdAt) : '',
        };
      }),
    },
    {
      title: 'Low Stock',
      columns: ['Product ID', 'Product', 'Stock', 'Revenue', 'Gross Profit'],
      rows: lowStockReports.map((report) => ({
        'Product ID': Number(report.productId) || '',
        Product:
          typeof (report.product as { name?: unknown } | undefined)?.name === 'string'
            ? ((report.product as { name?: string }).name ?? '')
            : `Product #${report.productId ?? 'N/A'}`,
        Stock: Number(report.stock) || 0,
        Revenue: Number(report.revenue) || 0,
        'Gross Profit': Number(report.profit) || 0,
      })),
    },
    {
      title: 'Daily Reports',
      columns: ['Branch', 'Date', 'Revenue', 'Profit'],
      rows: dailyReports.map((report) => ({
        Branch: branchNameMap.get(report.branchId) ?? `Branch #${report.branchId}`,
        Date: formatDateOnly(report.date),
        Revenue: Number(report.revenue) || 0,
        Profit: Number(report.profit) || 0,
      })),
    },
    {
      title: 'Monthly Reports',
      columns: ['Date', 'Revenue', 'Profit', 'Stock'],
      rows: monthlyReports.map((report) => ({
        Date: formatDateOnly(report.date),
        Revenue: Number(report.revenue) || 0,
        Profit: Number(report.profit) || 0,
        Stock: Number(report.stock) || 0,
      })),
    },
    {
      title: 'Branch Financial',
      columns: ['Branch', 'Revenue', 'Profit', 'OPEX', 'Net'],
      rows: (branchFinancial != null ? [branchFinancial] : financialReportList).map((report) => ({
        Branch: report.branchName,
        Revenue: Number(report.revenue) || 0,
        Profit: Number(report.profit) || 0,
        OPEX: Number(report.operationExpenses) || 0,
        Net: Number(report.netProfit) || 0,
      })),
    },
    {
      title: 'Stock Movements',
      columns: [
        'Movement ID',
        'Product ID',
        'Type',
        'Reason',
        'Quantity',
        'Old Value',
        'New Value',
        'Created At',
      ],
      rows: filteredMovements.map((movement) => ({
        'Movement ID': movement.id,
        'Product ID': movement.productId,
        Type: movement.movementType,
        Reason: movement.movementReason,
        Quantity: movement.quantity,
        'Old Value': movement.oldValue,
        'New Value': movement.newValue,
        'Created At': formatDateTime(movement.createdAt),
      })),
    },
    {
      title: 'OPEX',
      columns: ['Expense ID', 'Expense', 'Branch', 'Amount', 'Created At'],
      rows: filteredExpenses.map((expense) => ({
        'Expense ID': expense.id,
        Expense: expense.name,
        Branch: branchNameMap.get(expense.branchId) ?? `Branch #${expense.branchId}`,
        Amount: expense.amount,
        'Created At': formatDateTime(expense.createdAt),
      })),
    },
  ];

  const exportSections =
    format === 'pdf'
      ? sections.flatMap((section) => {
          if (section.title !== 'Products') return [section];

          return [
            {
              title: 'Products Overview',
              columns: ['Product ID', 'Product', 'Branch', 'Category', 'Sold By', 'Created At'],
              rows: section.rows.map((row) => ({
                'Product ID': row['Product ID'],
                Product: row.Product,
                Branch: row.Branch,
                Category: row.Category,
                'Sold By': row['Sold By'],
                'Created At': row['Created At'],
              })),
            },
            {
              title: 'Products Financials',
              columns: ['Product ID', 'Cost', 'Price', 'Stock', 'Revenue', 'Gross Profit'],
              rows: section.rows.map((row) => ({
                'Product ID': row['Product ID'],
                Cost: row.Cost,
                Price: row.Price,
                Stock: row.Stock,
                Revenue: row.Revenue,
                'Gross Profit': row['Gross Profit'],
              })),
            },
          ];
        })
      : sections;

  return buildInventoryExportFile(
    {
      exportedOn,
      fileStamp,
      sections: exportSections,
    },
    format,
  );
};
