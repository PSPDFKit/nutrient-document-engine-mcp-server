#!/usr/bin/env node

/**
 * Simplified Procurement Document Processing
 */

import { HumanMessage } from '@langchain/core/messages';
import { glob } from 'glob';
import { procurementWorkflow } from './ProcurementWorkflow';
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

async function main() {
  const filePaths = await glob('assets/procurement/pdfs/*.pdf');

  try {
    const result = await procurementWorkflow.invoke(
      {
        messages: [new HumanMessage(`Process documents: ${filePaths.join(', ')}`)],
        documents: filePaths.map(path => ({
          filename: path.split('/').pop() || path,
          path,
          source: 'file_upload',
        })),
      },
      {
        configurable: {
          documentEngineMcpServerUrl: process.env.MCP_SERVER_URL || 'http://localhost:5100/mcp',
          model: new ChatOpenAI({
            model: 'gpt-4.1-mini',
            temperature: 0,
          }),
        },
      }
    );

    console.log('\n🎉 Procurement Workflow Completed Successfully!');
    console.log('='.repeat(60));

    const totalProcessed = result.processedDocuments.length;
    const totalGroups = result.groups.length;
    const totalOrphans = result.orphans.length;
    const completeGroups = result.groups.filter(g => g.status === 'complete').length;
    const partialGroups = result.groups.filter(g => g.status === 'partial').length;

    console.log(`📊 SUMMARY:`);
    console.log(`   Documents Processed: ${totalProcessed}`);
    console.log(
      `   Groups Formed: ${totalGroups} (${completeGroups} complete, ${partialGroups} partial)`
    );
    console.log(`   Orphan Documents: ${totalOrphans}`);

    const matchedDocs = result.groups.reduce((count, group) => {
      return (
        count + (group.purchaseOrder ? 1 : 0) + (group.invoice ? 1 : 0) + (group.payment ? 1 : 0)
      );
    }, 0);
    const matchRate = totalProcessed > 0 ? (matchedDocs / totalProcessed) * 100 : 0;
    console.log(`   Match Rate: ${matchRate.toFixed(1)}%`);

    if (result.groups.length > 0) {
      console.log('\n🔗 DOCUMENT GROUPS:');
      console.log('-'.repeat(40));

      result.groups.forEach((group, index) => {
        console.log(`\n📦 Group ${index + 1} [${group.status.toUpperCase()}]:`);
        console.log(`   ID: ${group.id}`);
        if (group.vendor) console.log(`   Vendor: ${group.vendor}`);
        if (group.totalAmount) console.log(`   Amount: $${group.totalAmount.toLocaleString()}`);

        if (group.purchaseOrder) {
          console.log(`   📋 Purchase Order: ${group.purchaseOrder.filename}`);
          if (group.purchaseOrder.extractedData.poNumber) {
            console.log(`      PO Number: ${group.purchaseOrder.extractedData.poNumber}`);
          }
        }

        if (group.invoice) {
          console.log(`   📄 Invoice: ${group.invoice.filename}`);
          if (group.invoice.extractedData.invoiceNumber) {
            console.log(`      Invoice Number: ${group.invoice.extractedData.invoiceNumber}`);
          }
        }

        if (group.payment) {
          console.log(`   💳 Payment: ${group.payment.filename}`);
          if (group.payment.extractedData.paymentReference) {
            console.log(`      Payment Ref: ${group.payment.extractedData.paymentReference}`);
          }
        }
      });
    }

    if (result.orphans.length > 0) {
      console.log('\n🔍 ORPHAN DOCUMENTS:');
      console.log('-'.repeat(40));

      result.orphans.forEach(orphan => {
        console.log(`\n📄 ${orphan.filename}`);
        console.log(`   Type: ${orphan.type}`);
        console.log(`   Confidence: ${(orphan.confidence * 100).toFixed(1)}%`);
        console.log(`   Reason: ${orphan.reason}`);
        console.log(`   Suggested Action: ${orphan.suggestedAction}`);

        if (orphan.extractedData.vendor) {
          console.log(`   Vendor: ${orphan.extractedData.vendor}`);
        }
        if (orphan.extractedData.amount) {
          console.log(`   Amount: $${orphan.extractedData.amount.toLocaleString()}`);
        }
      });
    }

    if (result.processedDocuments.length > 0) {
      console.log('\n📋 DOCUMENT CLASSIFICATIONS:');
      console.log('-'.repeat(40));

      result.processedDocuments.forEach(doc => {
        console.log(`\n${doc.filename}:`);
        console.log(`   Type: ${doc.type} (${(doc.confidence * 100).toFixed(1)}% confidence)`);
        if (doc.reasoning) {
          console.log(`   Reasoning: ${doc.reasoning}`);
        }
      });
    }

    console.log('\n✨ Processing Complete!');

    return {
      groups: result.groups,
      orphans: result.orphans,
    };
  } catch (error) {
    console.error('❌ Workflow execution failed:', (error as Error).message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
