import { Chicken, EggLog, Task, FoodLog, IncubationBatch, FinancialTransaction, InventoryItem, InventoryLog, Currency } from '../types';
import { APP_NAME, CURRENCY_DETAILS } from '../constants';

// Define a type for all application data
export interface AppData {
  chickens: Chicken[];
  eggLogs: EggLog[];
  tasks: Task[];
  foodLogs: FoodLog[];
  incubationBatches: IncubationBatch[];
  financialTransactions: FinancialTransaction[];
  inventoryItems: InventoryItem[];
  inventoryLogs: InventoryLog[];
}

// Helper function to trigger file download
export const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// --- XML Generation ---
const escapeXml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') {
    return String(unsafe); // Convert numbers/booleans to string
  }
  return unsafe.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return match;
    }
  });
};

const objectToXml = (objName: string, obj: any): string => {
  if (obj === null || obj === undefined) return '';
  let xml = '';
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value === null || value === undefined) continue; // Skip null/undefined properties

      // Convert camelCase to PascalCase for XML tags
      const tagName = key.charAt(0).toUpperCase() + key.slice(1);
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        xml += `<${escapeXml(tagName)}>${objectToXml(tagName, value)}</${escapeXml(tagName)}>`;
      } else if (Array.isArray(value)) {
        xml += `<${escapeXml(tagName)}>`;
        value.forEach(item => {
          // Assuming array items are objects, use a singular version of tagName or a generic 'Item'
          const singularItemName = tagName.endsWith('s') ? tagName.slice(0, -1) : 'Item';
          // Make sure item is an object before passing to objectToXml
          if (typeof item === 'object' && item !== null) {
            xml += objectToXml(singularItemName, item);
          } else {
            xml += `<${escapeXml(singularItemName)}>${escapeXml(String(item))}</${escapeXml(singularItemName)}>`;
          }
        });
        xml += `</${escapeXml(tagName)}>`;
      } else {
        xml += `<${escapeXml(tagName)}>${escapeXml(String(value))}</${escapeXml(tagName)}>`;
      }
    }
  }
  // Wrap the content with the object's name tag only if there's content
  return xml ? `<${escapeXml(objName)}>${xml}</${escapeXml(objName)}>` : `<${escapeXml(objName)}/>`;
};


export const generateXML = (data: AppData): string => {
  let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlString += '<GranjasNGData>\n';
  xmlString += `  <GeneratedDate>${new Date().toISOString()}</GeneratedDate>\n`;

  const createSection = <T,>(name: string, items: T[]) => {
    if (!items || items.length === 0) return `  <${name}/>\n`; // Self-closing tag for empty sections
    let sectionXml = `  <${name}>\n`;
    items.forEach(item => {
      // Use a singular name for individual items, e.g., Chicken for Chickens
      const singularName = name.endsWith('s') ? name.slice(0, -1) : 'Item';
      sectionXml += `    ${objectToXml(singularName, item)}\n`;
    });
    sectionXml += `  </${name}>\n`;
    return sectionXml;
  };
  
  xmlString += createSection('Chickens', data.chickens);
  xmlString += createSection('EggLogs', data.eggLogs);
  xmlString += createSection('Tasks', data.tasks);
  xmlString += createSection('FoodLogs', data.foodLogs);
  xmlString += createSection('IncubationBatches', data.incubationBatches);
  xmlString += createSection('FinancialTransactions', data.financialTransactions);
  xmlString += createSection('InventoryItems', data.inventoryItems);
  xmlString += createSection('InventoryLogs', data.inventoryLogs);

  xmlString += '</GranjasNGData>';
  return xmlString;
};


// --- PDF Generation ---
// Dynamically import jspdf and jspdf-autotable
let jsPDF: any = null;
let autoTable: any = null;

const loadPdfLibs = async () => {
  if (!jsPDF || !autoTable) {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.default; 
    const autoTableModule = await import('jspdf-autotable');
    autoTable = autoTableModule.default; 
  }
};


export const generatePDF = async (data: AppData): Promise<void> => {
  await loadPdfLibs();
  if (!jsPDF || !autoTable) {
    console.error("PDF libraries could not be loaded.");
    alert("Error al cargar las librerías para generar PDF. Intente de nuevo.");
    return;
  }

  const doc = new jsPDF({
    orientation: 'p', // portrait
    unit: 'pt', // points
    format: 'a4'
  });
  const today = new Date().toLocaleDateString();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const margin = 40; // points
  let yPos = margin;

  const addPageIfNeeded = () => {
    if (yPos > pageHeight - margin - 20) { // Check if new page needed (with bottom margin)
      doc.addPage();
      yPos = margin;
    }
  };
  
  const addTitle = (title: string) => {
    addPageIfNeeded();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(title, margin, yPos, { align: 'left' });
    yPos += doc.getLineHeight() * 1.5;
  };

  const addSectionTitle = (title: string) => {
    addPageIfNeeded();
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(47, 133, 90); // pf-green-dark
    doc.text(title, margin, yPos);
    yPos += doc.getLineHeight() * 1.2;
  };
  
  const addTable = (head: any[][], body: any[][], columnStyles: any = {}) => {
    addPageIfNeeded();
    if (body.length === 0) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(100); // Light Gray
      doc.text("No hay datos disponibles para esta sección.", margin, yPos);
      yPos += doc.getLineHeight() * 1.5;
      return;
    }
    autoTable(doc, {
      head: head,
      body: body,
      startY: yPos,
      theme: 'grid', 
      headStyles: { 
        fillColor: [47, 133, 90], // pf-green-dark
        textColor: [255, 255, 255], // white
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: 'linebreak', // Prevent text overflow
      },
      columnStyles: columnStyles,
      alternateRowStyles: { fillColor: [240, 255, 244] }, // pf-green-light (subtle)
      margin: { left: margin, right: margin },
      tableWidth: 'auto', // or a specific width: pageWidth - margin * 2
      didDrawPage: (data: any) => { 
        yPos = data.cursor.y + doc.getLineHeight(); // Update yPos after table draw
      },
    });
    // Update yPos based on where autoTable finished
    const lastAutoTable = (doc as any).lastAutoTable;
    if (lastAutoTable && lastAutoTable.finalY) {
        yPos = lastAutoTable.finalY + doc.getLineHeight() * 1.5;
    } else {
        // Fallback if finalY is not available (should be, but good to have)
        yPos += doc.getLineHeight() * (body.length + 1) * 1.5; // Approximate
    }
  };

  // Title Page
  addTitle(APP_NAME + " - Reporte de Datos");
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(45, 55, 72); // pf-text
  doc.text(`Generado el: ${today}`, margin, yPos);
  yPos += doc.getLineHeight() * 2;

  // Chickens
  addSectionTitle("Gallinas");
  addTable(
    [['ID', 'Nombre', 'Raza', 'Fecha Adquisición']],
    data.chickens.map(c => [c.id, c.name, c.breed, c.acquisitionDate])
  );

  // Egg Logs
  addSectionTitle("Registro de Huevos");
  addTable(
    [['ID', 'Fecha', 'Cantidad']],
    data.eggLogs.map(e => [e.id, e.date, e.quantity])
  );

  // Tasks
  addSectionTitle("Tareas y Recordatorios");
  addTable(
    [['ID', 'Descripción', 'Fecha Venc.', 'Completada']],
    data.tasks.map(t => [t.id, t.description, t.dueDate, t.isCompleted ? 'Sí' : 'No']),
    { 0: { cellWidth: 40 }, 1: { cellWidth: 'auto'}, 2: { cellWidth: 70 }, 3: {cellWidth: 60} }
  );

  // Food Logs
  addSectionTitle("Registro de Alimento");
  addTable(
    [['ID', 'Fecha', 'Cant. (kg)', 'Tipo', 'Notas']],
    data.foodLogs.map(fl => [fl.id, fl.date, fl.quantityKg.toFixed(2), fl.foodType || '-', fl.notes || '-']),
    { 0: {cellWidth: 40}, 2: {cellWidth: 50}, 4: {cellWidth: 'auto'}}
  );

  // Incubation Batches
  addSectionTitle("Lotes de Incubación");
  addTable(
    [['Lote', 'Inicio', 'Huevos', 'Raza', 'Ecl. Esp.', 'Ecl. Real', 'Nacidos', 'Notas', 'Inv?']],
    data.incubationBatches.map(ib => [
      ib.batchName, ib.startDate, ib.eggsSet, ib.breed || '-', 
      ib.expectedHatchDate || '-', ib.actualHatchDate || '-', ib.chicksHatched === undefined ? '-' : ib.chicksHatched,
      ib.notes || '-', ib.hasBeenRecordedInInventory ? 'Sí' : 'No'
    ]),
    { 0: {cellWidth: 70}, 2: {cellWidth: 40}, 6: {cellWidth: 40}, 8: {cellWidth: 30}}
  );

  // Financial Transactions
  addSectionTitle("Transacciones Financieras");
  addTable(
    [['Fecha', 'Descrip.', 'Cat.', 'Tipo', 'Monto', 'Mon.', 'Notas']],
    data.financialTransactions.map(ft => [
      ft.date, ft.description, ft.category, ft.transactionType === 'Income' ? 'Ingreso':'Gasto',
      ft.amount.toFixed(2), CURRENCY_DETAILS[ft.currency]?.symbol || ft.currency, ft.notes || '-'
    ]),
    { 1: {cellWidth: 100}, 4: {cellWidth: 50}, 5: {cellWidth:30} }
  );

  // Inventory Items
  addSectionTitle("Items de Inventario");
  addTable(
    [['Nombre', 'Cat.', 'Añadido', 'Unidad', 'Cant. Ini.', 'Cant. Act.', 'Tipo/Tamaño', 'Notas']],
    data.inventoryItems.map(ii => [
      ii.name, ii.category, ii.dateAdded, ii.unit, ii.initialQuantity, ii.currentQuantity,
      ii.category === 'Meat' ? ii.birdType || '-' : ii.eggSize || '-', ii.notes || '-'
    ]),
     { 0: {cellWidth: 80}, 1: {cellWidth: 40}, 4: {cellWidth:50}, 5: {cellWidth:50} }
  );
  
  // Inventory Logs
  addSectionTitle("Movimientos de Inventario");
  addTable(
    [['Item', 'Fecha', 'Acción', 'Cant.', 'Precio Vta.', 'Mon. Vta.', 'Notas']],
    data.inventoryLogs.map(il => {
        const itemName = data.inventoryItems.find(item => item.id === il.inventoryItemId)?.name || il.inventoryItemId;
        return [
            itemName, il.date, il.action, il.quantityChanged,
            il.salePricePerUnit !== undefined ? il.salePricePerUnit.toFixed(2) : '-',
            il.saleCurrency ? CURRENCY_DETAILS[il.saleCurrency]?.symbol || il.saleCurrency : '-',
            il.notes || '-'
        ];
    }),
    { 0: {cellWidth: 80}, 3: {cellWidth:40}, 4: {cellWidth:50}, 5: {cellWidth:30} }
  );

  doc.save(`${APP_NAME.replace(/\s+/g, '_')}_Datos_${today.replace(/\//g, '-')}.pdf`);
};