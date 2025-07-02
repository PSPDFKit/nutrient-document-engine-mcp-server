/**
 * Document Matching Node
 * Groups documents into procurement cycles and identifies orphans
 */

import { WorkflowStateAnnotation } from '../State';
import { DocumentGroup, OrphanDocument, ProcessedDocument } from '../types';

/**
 * LangGraph node that performs document matching
 */
export async function matchDocumentsNode(state: typeof WorkflowStateAnnotation.State): Promise<{
  groups: DocumentGroup[];
  orphans: OrphanDocument[];
}> {
  const documents = state.processedDocuments;
  console.log(`🔍 Matching ${documents.length} documents...`);

  const groups: DocumentGroup[] = [];
  const usedDocuments = new Set<string>();

  // Strategy 1: Match by exact reference numbers
  matchByReferences(documents, groups, usedDocuments);

  // Strategy 2: Match by vendor and amount for remaining documents
  matchByVendorAndAmount(documents, groups, usedDocuments);

  // Remaining documents become orphans
  const orphans = createOrphans(documents, usedDocuments);

  console.log(`✅ Created ${groups.length} groups, found ${orphans.length} orphans`);

  return { groups, orphans };
}

/**
 * Match documents by reference numbers (most reliable)
 */
function matchByReferences(
  documents: ProcessedDocument[],
  groups: DocumentGroup[],
  usedDocuments: Set<string>
): void {
  const pos = documents.filter(
    d => d.type === 'purchase_order' && !usedDocuments.has(d.documentId)
  );
  const invoices = documents.filter(d => d.type === 'invoice' && !usedDocuments.has(d.documentId));
  const payments = documents.filter(d => d.type === 'payment' && !usedDocuments.has(d.documentId));

  for (const po of pos) {
    const poNumber = po.extractedData.poNumber;
    if (!poNumber) continue;

    const matchingInvoices = invoices.filter(
      inv => inv.extractedData.poReference === poNumber && !usedDocuments.has(inv.documentId)
    );

    for (const invoice of matchingInvoices) {
      const invoiceNumber = invoice.extractedData.invoiceNumber;
      if (!invoiceNumber) {
        // Create PO + Invoice group without payment
        const group = createGroup([po, invoice]);
        groups.push(group);
        usedDocuments.add(po.documentId);
        usedDocuments.add(invoice.documentId);
        continue;
      }

      const matchingPayments = payments.filter(
        pay =>
          pay.extractedData.invoiceReference === invoiceNumber && !usedDocuments.has(pay.documentId)
      );

      if (matchingPayments.length > 0) {
        // Complete 3-way match
        const group = createGroup([po, invoice, matchingPayments[0]]);
        groups.push(group);
        usedDocuments.add(po.documentId);
        usedDocuments.add(invoice.documentId);
        usedDocuments.add(matchingPayments[0].documentId);
      } else {
        // PO + Invoice without payment
        const group = createGroup([po, invoice]);
        groups.push(group);
        usedDocuments.add(po.documentId);
        usedDocuments.add(invoice.documentId);
      }
    }
  }

  // Handle orphan invoice-payment pairs (no PO found)
  for (const invoice of invoices) {
    if (usedDocuments.has(invoice.documentId)) continue;

    const invoiceNumber = invoice.extractedData.invoiceNumber;
    if (!invoiceNumber) continue;

    const matchingPayments = payments.filter(
      pay =>
        pay.extractedData.invoiceReference === invoiceNumber && !usedDocuments.has(pay.documentId)
    );

    if (matchingPayments.length > 0) {
      const group = createGroup([invoice, matchingPayments[0]]);
      groups.push(group);
      usedDocuments.add(invoice.documentId);
      usedDocuments.add(matchingPayments[0].documentId);
    }
  }
}

/**
 * Match remaining documents by vendor and amount similarity
 */
function matchByVendorAndAmount(
  documents: ProcessedDocument[],
  groups: DocumentGroup[],
  usedDocuments: Set<string>
): void {
  const available = documents.filter(d => !usedDocuments.has(d.documentId));

  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      const doc1 = available[i];
      const doc2 = available[j];

      if (isVendorAmountMatch(doc1, doc2)) {
        // Look for a third document that also matches
        for (let k = j + 1; k < available.length; k++) {
          const doc3 = available[k];
          if (isVendorAmountMatch(doc1, doc3) && isVendorAmountMatch(doc2, doc3)) {
            const group = createGroup([doc1, doc2, doc3]);
            groups.push(group);
            usedDocuments.add(doc1.documentId);
            usedDocuments.add(doc2.documentId);
            usedDocuments.add(doc3.documentId);
            return;
          }
        }

        const group = createGroup([doc1, doc2]);
        groups.push(group);
        usedDocuments.add(doc1.documentId);
        usedDocuments.add(doc2.documentId);
        return;
      }
    }
  }
}

/**
 * Check if two documents match by vendor and amount
 */
function isVendorAmountMatch(doc1: ProcessedDocument, doc2: ProcessedDocument): boolean {
  const vendor1 = doc1.extractedData.vendor?.toLowerCase();
  const vendor2 = doc2.extractedData.vendor?.toLowerCase();
  const amount1 = doc1.extractedData.amount;
  const amount2 = doc2.extractedData.amount;

  if (!vendor1 || !vendor2 || !amount1 || !amount2) return false;

  // Vendor similarity (simple contains check)
  const vendorMatch = vendor1.includes(vendor2) || vendor2.includes(vendor1);

  // Amount similarity (within 5% variance)
  const amountDiff = Math.abs(amount1 - amount2) / Math.max(amount1, amount2);
  const amountMatch = amountDiff <= 0.05;

  return vendorMatch && amountMatch;
}

/**
 * Create a document group from matched documents
 */
function createGroup(documents: ProcessedDocument[]): DocumentGroup {
  const id = `group_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const po = documents.find(d => d.type === 'purchase_order');
  const invoice = documents.find(d => d.type === 'invoice');
  const payment = documents.find(d => d.type === 'payment');

  const vendor =
    po?.extractedData.vendor || invoice?.extractedData.vendor || payment?.extractedData.vendor;
  const totalAmount =
    po?.extractedData.amount || invoice?.extractedData.amount || payment?.extractedData.amount;

  const hasAll3 = po && invoice && payment;
  const status = hasAll3 ? 'complete' : 'partial';

  return {
    id,
    purchaseOrder: po,
    invoice,
    payment,
    vendor,
    totalAmount,
    status,
  };
}

/**
 * Create orphan documents with suggested actions
 */
function createOrphans(
  documents: ProcessedDocument[],
  usedDocuments: Set<string>
): OrphanDocument[] {
  const orphans: OrphanDocument[] = [];

  for (const doc of documents) {
    if (usedDocuments.has(doc.documentId)) continue;

    let reason: string;
    let suggestedAction: string;

    switch (doc.type) {
      case 'purchase_order':
        reason = 'No matching invoice found';
        suggestedAction = 'Check if invoice has been received or needs to be requested from vendor';
        break;
      case 'invoice':
        reason = 'No matching PO or payment found';
        suggestedAction = 'Verify PO number on invoice and check if payment has been processed';
        break;
      case 'payment':
        reason = 'No matching invoice found';
        suggestedAction = 'Locate the corresponding invoice or verify payment reference number';
        break;
      default:
        reason = 'Document type could not be determined';
        suggestedAction = 'Manual review required to classify document';
    }

    orphans.push({
      ...doc,
      reason,
      suggestedAction,
    });
  }

  return orphans;
}
