type PrimitiveValue = string | number | null | undefined;

type WorksheetCellType = 'String' | 'Number';

type StyledWorksheetCell = {
  value: PrimitiveValue;
  styleId?: string;
  type?: WorksheetCellType;
};

type WorksheetCellInput = PrimitiveValue | StyledWorksheetCell;

export type InventoryExportFormat = 'excel' | 'pdf';

export type InventoryExportFile = {
  fileName: string;
  content: string;
  contentType: string;
};

export type InventoryExportRow = Record<string, PrimitiveValue>;

export type InventoryExportSection = {
  title: string;
  columns: string[];
  rows: InventoryExportRow[];
};

export type InventoryExportData = {
  exportedOn: string;
  fileStamp: string;
  sections: InventoryExportSection[];
};

const escapeXml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const isStyledWorksheetCell = (input: WorksheetCellInput): input is StyledWorksheetCell =>
  typeof input === 'object' && input !== null && !Array.isArray(input) && 'value' in input;

const detectStyleId = (column: string, value: PrimitiveValue): string => {
  const normalized = column.toLowerCase();

  if (
    normalized.includes('revenue') ||
    normalized.includes('profit') ||
    normalized.includes('amount') ||
    normalized.includes('cost') ||
    normalized.includes('price') ||
    normalized.includes('opex') ||
    normalized.includes('net') ||
    normalized.includes('damage')
  ) {
    return typeof value === 'number' ? 'Currency' : 'Text';
  }

  if (
    normalized.includes('stock') ||
    normalized.includes('quantity') ||
    normalized.includes('value')
  ) {
    return typeof value === 'number' ? 'Number' : 'Text';
  }

  if (
    normalized.includes('id') ||
    normalized.includes('count') ||
    normalized.includes('products')
  ) {
    return typeof value === 'number' ? 'Integer' : 'Text';
  }

  if (
    normalized.includes('date') ||
    normalized.includes('created') ||
    normalized.includes('exported')
  ) {
    return 'DateText';
  }

  return typeof value === 'number' ? 'Number' : 'Text';
};

const toWorksheetCell = (input: WorksheetCellInput, defaultStyleId?: string) => {
  const cell = isStyledWorksheetCell(input) ? input : { value: input };
  const inferredType: WorksheetCellType =
    cell.type ??
    (typeof cell.value === 'number' && Number.isFinite(cell.value) ? 'Number' : 'String');
  const styleId = cell.styleId ?? defaultStyleId;
  const styleAttr = styleId ? ` ss:StyleID="${styleId}"` : '';
  const value =
    inferredType === 'Number' && typeof cell.value === 'number' && Number.isFinite(cell.value)
      ? cell.value
      : escapeXml(cell.value);

  return `<Cell${styleAttr}><Data ss:Type="${inferredType}">${value}</Data></Cell>`;
};

const getCellTextLength = (input: WorksheetCellInput) => {
  const cell = isStyledWorksheetCell(input) ? input : { value: input };
  if (cell.value == null) return 0;
  return String(cell.value).length;
};

const buildWorksheetColumns = (rows: WorksheetCellInput[][]) => {
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const columns = Array.from({ length: columnCount }, (_, index) => {
    const maxLength = rows.reduce((max, row) => {
      const cell = row[index];
      return Math.max(max, cell == null ? 0 : getCellTextLength(cell));
    }, 0);
    const width = Math.min(220, Math.max(80, maxLength * 6.5 + 18));
    return `<Column ss:AutoFitWidth="1" ss:Width="${width.toFixed(0)}" />`;
  });

  return columns.join('');
};

const createWorksheet = (name: string, rows: WorksheetCellInput[][]) => {
  const columns = buildWorksheetColumns(rows);
  const xmlRows = rows
    .map((row, index) => {
      const defaultStyleId = index === 0 ? 'Header' : undefined;
      return `<Row ss:AutoFitHeight="1">${row
        .map((cell) => toWorksheetCell(cell, defaultStyleId))
        .join('')}</Row>`;
    })
    .join('');

  return `<Worksheet ss:Name="${escapeXml(name)}"><Table>${columns}${xmlRows}</Table></Worksheet>`;
};

const createWorkbook = (worksheets: Array<{ name: string; rows: WorksheetCellInput[][] }>) => {
  const sheetXml = worksheets.map((sheet) => createWorksheet(sheet.name, sheet.rows)).join('');

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Header">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1" />
      <Font ss:Bold="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" />
      </Borders>
      <Interior ss:Color="#DDEAF7" ss:Pattern="Solid" />
    </Style>
    <Style ss:ID="Text">
      <Alignment ss:Horizontal="Left" ss:Vertical="Top" ss:WrapText="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" />
      </Borders>
    </Style>
    <Style ss:ID="DateText">
      <Alignment ss:Horizontal="Center" ss:Vertical="Top" ss:WrapText="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" />
      </Borders>
    </Style>
    <Style ss:ID="Number">
      <Alignment ss:Horizontal="Center" ss:Vertical="Top" ss:WrapText="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" />
      </Borders>
      <NumberFormat ss:Format="0.00" />
    </Style>
    <Style ss:ID="Integer">
      <Alignment ss:Horizontal="Center" ss:Vertical="Top" ss:WrapText="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" />
      </Borders>
      <NumberFormat ss:Format="0" />
    </Style>
    <Style ss:ID="Currency">
      <Alignment ss:Horizontal="Right" ss:Vertical="Top" ss:WrapText="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" />
      </Borders>
      <NumberFormat ss:Format="&quot;PHP&quot; #,##0.00" />
    </Style>
  </Styles>
  ${sheetXml}
</Workbook>`;
};

const toWorksheetRows = (section: InventoryExportSection): WorksheetCellInput[][] => [
  section.columns,
  ...section.rows.map((row) =>
    section.columns.map((column) => ({
      value: row[column] ?? '',
      styleId: detectStyleId(column, row[column]),
    })),
  ),
];

const buildExcelExport = (data: InventoryExportData): InventoryExportFile => ({
  fileName: `${data.fileStamp}_report.xls`,
  contentType: 'application/vnd.ms-excel; charset=utf-8',
  content: createWorkbook(
    data.sections.map((section) => ({
      name: section.title,
      rows: toWorksheetRows(section),
    })),
  ),
});

const escapePdfText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatInteger = (value: number) => new Intl.NumberFormat('en-US').format(value);

const formatPdfValue = (column: string, value: PrimitiveValue) => {
  if (value == null) return '';
  if (typeof value !== 'number') return String(value);

  const styleId = detectStyleId(column, value);
  if (styleId === 'Currency') return `PHP ${formatNumber(value)}`;
  if (styleId === 'Integer') return formatInteger(value);
  return formatNumber(value);
};

const truncatePdfText = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  if (maxChars <= 3) return value.slice(0, Math.max(0, maxChars));
  return `${value.slice(0, maxChars - 3)}...`;
};

const computeColumnWidths = (section: InventoryExportSection, tableWidth: number) => {
  const minWidth = 54;
  const maxWeights = section.columns.map((column) => {
    const headerWeight = Math.max(column.length, 6);
    const rowWeight = section.rows.slice(0, 40).reduce((max, row) => {
      const value = formatPdfValue(column, row[column]);
      return Math.max(max, Math.min(value.length, 24));
    }, 0);
    return Math.max(headerWeight, rowWeight);
  });

  const totalWeight = maxWeights.reduce((sum, weight) => sum + weight, 0) || 1;
  const widths = maxWeights.map((weight) =>
    Math.max(minWidth, (weight / totalWeight) * tableWidth),
  );
  const currentWidth = widths.reduce((sum, width) => sum + width, 0);
  const scale = currentWidth > tableWidth ? tableWidth / currentWidth : 1;

  return widths.map((width) => width * scale);
};

const drawRect = (x: number, y: number, width: number, height: number, fillGray?: number) => {
  if (fillGray == null) return `${x} ${y} ${width} ${height} re S`;
  return `q ${fillGray.toFixed(2)} g ${x} ${y} ${width} ${height} re f Q ${x} ${y} ${width} ${height} re S`;
};

const drawText = (
  text: string,
  x: number,
  y: number,
  fontKey: 'regular' | 'bold',
  fontSize: number,
) =>
  `BT /${fontKey === 'bold' ? 'F2' : 'F1'} ${fontSize} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`;

const buildPdfExport = (data: InventoryExportData): InventoryExportFile => {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 36;
  const topY = 756;
  const bottomY = 42;
  const tableWidth = pageWidth - marginX * 2;
  const rowHeight = 20;
  const sectionHeaderHeight = 22;
  const cellPadding = 4;

  const pages: string[] = [];
  let currentOps: string[] = [];
  let currentY = topY;
  let pageNumber = 1;

  const startPage = () => {
    currentOps = [];
    currentY = topY;
    currentOps.push(drawText('Inventory Export Report', marginX, currentY, 'bold', 16));
    currentOps.push(
      drawText(`Generated: ${data.exportedOn}`, marginX, currentY - 18, 'regular', 9),
    );
    currentOps.push(
      drawText(`Page ${pageNumber}`, pageWidth - marginX - 42, currentY - 18, 'regular', 9),
    );
    currentOps.push(`${marginX} ${currentY - 26} m ${pageWidth - marginX} ${currentY - 26} l S`);
    currentY -= 42;
  };

  const finishPage = () => {
    pages.push(currentOps.join('\n'));
    pageNumber += 1;
  };

  const ensureHeight = (requiredHeight: number) => {
    if (currentY - requiredHeight >= bottomY) return;
    finishPage();
    startPage();
  };

  const drawTableHeader = (section: InventoryExportSection, widths: number[]) => {
    ensureHeight(sectionHeaderHeight + rowHeight);
    currentOps.push(
      drawRect(marginX, currentY - sectionHeaderHeight, tableWidth, sectionHeaderHeight, 0.9),
    );
    currentOps.push(drawText(section.title, marginX + 6, currentY - 16, 'bold', 11));
    currentY -= sectionHeaderHeight;

    let x = marginX;
    for (let index = 0; index < section.columns.length; index += 1) {
      const width = widths[index];
      currentOps.push(drawRect(x, currentY - rowHeight, width, rowHeight, 0.95));
      const maxChars = Math.max(4, Math.floor((width - cellPadding * 2) / 5.2));
      currentOps.push(
        drawText(
          truncatePdfText(section.columns[index], maxChars),
          x + cellPadding,
          currentY - 14,
          'bold',
          8,
        ),
      );
      x += width;
    }
    currentY -= rowHeight;
  };

  startPage();

  for (const section of data.sections) {
    const widths = computeColumnWidths(section, tableWidth);
    drawTableHeader(section, widths);

    for (const row of section.rows) {
      if (currentY - rowHeight < bottomY) {
        finishPage();
        startPage();
        drawTableHeader(section, widths);
      }

      let x = marginX;
      for (let index = 0; index < section.columns.length; index += 1) {
        const column = section.columns[index];
        const width = widths[index];
        const text = formatPdfValue(column, row[column]);
        const maxChars = Math.max(4, Math.floor((width - cellPadding * 2) / 5.2));

        currentOps.push(drawRect(x, currentY - rowHeight, width, rowHeight));
        currentOps.push(
          drawText(truncatePdfText(text, maxChars), x + cellPadding, currentY - 14, 'regular', 8),
        );
        x += width;
      }

      currentY -= rowHeight;
    }

    currentY -= 10;
  }

  finishPage();

  const objects: string[] = [];
  const addObject = (body: string) => {
    objects.push(body);
    return objects.length;
  };

  const regularFontObjectId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const boldFontObjectId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageObjectIds: number[] = [];

  for (const pageOps of pages) {
    const contentObjectId = addObject(
      `<< /Length ${pageOps.length} >>\nstream\n${pageOps}\nendstream`,
    );
    const pageObjectId = addObject(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentObjectId} 0 R /Resources << /Font << /F1 ${regularFontObjectId} 0 R /F2 ${boldFontObjectId} 0 R >> >> >>`,
    );
    pageObjectIds.push(pageObjectId);
  }

  const pagesObjectId = addObject(
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>`,
  );

  objects.forEach((body, index) => {
    if (body.includes('/Parent 0 0 R')) {
      objects[index] = body.replace('/Parent 0 0 R', `/Parent ${pagesObjectId} 0 R`);
    }
  });

  const catalogObjectId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjectId} 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return {
    fileName: `${data.fileStamp}_report.pdf`,
    contentType: 'application/pdf',
    content: pdf,
  };
};

export const buildInventoryExportFile = (
  data: InventoryExportData,
  format: InventoryExportFormat,
): InventoryExportFile => (format === 'pdf' ? buildPdfExport(data) : buildExcelExport(data));
