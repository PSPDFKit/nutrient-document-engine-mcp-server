/**
 * Result reporting and formatting for evaluation results
 */

import { FocusedEvaluationResults } from './types.js';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Reporter class for formatting and displaying evaluation results
 */
export class EvaluationReporter {
  /**
   * Print comparison results
   */
  printComparison(results: FocusedEvaluationResults[]): void {
    console.log('\n' + '='.repeat(80));
    console.log('🏆 MODEL COMPARISON - TOOL USAGE EFFECTIVENESS');
    console.log('='.repeat(80));

    // Sort by overall score
    const sorted = [...results].sort((a, b) => b.overallScore - a.overallScore);

    console.log('\n📊 OVERALL RANKINGS:');
    sorted.forEach((result, index) => {
      const rank = index + 1;
      const emoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '  ';
      console.log(
        `${emoji} ${rank}. ${result.model.padEnd(20)} ${(result.overallScore * 100).toFixed(1)}%`
      );
    });

    console.log('\n📋 DETAILED BREAKDOWN:');
    console.log(
      'Model'.padEnd(20) +
        'Overall'.padEnd(10) +
        'Tools'.padEnd(10) +
        'Order'.padEnd(10) +
        'Efficiency'
    );
    console.log('-'.repeat(60));

    sorted.forEach(result => {
      const overall = (result.overallScore * 100).toFixed(1) + '%';
      const tools = (result.correctToolUsage * 100).toFixed(1) + '%';
      const order = (result.correctOrderUsage * 100).toFixed(1) + '%';
      const efficiency = (result.efficiencyScore * 100).toFixed(1) + '%';

      console.log(
        result.model.padEnd(20) +
          overall.padEnd(10) +
          tools.padEnd(10) +
          order.padEnd(10) +
          efficiency
      );
    });

    // Find best and worst scenarios
    console.log('\n🎯 KEY INSIGHTS:');

    const allResults = results.flatMap(r => r.results);
    const bestScenarios = allResults.filter(r => r.score === 1.0);
    const worstScenarios = allResults.filter(r => r.score < 0.5);

    if (bestScenarios.length > 0) {
      const commonBest = this.findMostCommon(bestScenarios.map(r => r.scenarioId));
      console.log(`✅ Best performing scenario: ${commonBest} (consistent across models)`);
    }

    if (worstScenarios.length > 0) {
      const commonWorst = this.findMostCommon(worstScenarios.map(r => r.scenarioId));
      console.log(`❌ Most challenging scenario: ${commonWorst} (needs improvement)`);
    }

    console.log('='.repeat(80));
  }

  /**
   * Print progress update for a single scenario
   */
  printScenarioProgress(
    index: number,
    total: number,
    scenario: { description: string },
    result: { score: number }
  ): void {
    const status = result.score > 0.8 ? '✅' : result.score > 0.5 ? '⚠️' : '❌';
    console.log(
      `   ${index + 1}/${total} ${status} ${scenario.description} (${(result.score * 100).toFixed(0)}%)`
    );
  }

  /**
   * Print error for failed scenario
   */
  printScenarioError(
    index: number,
    total: number,
    scenario: { description: string },
    error: Error | string
  ): void {
    console.log(`   ${index + 1}/${total} ❌ ${scenario.description} - ERROR: ${error}`);
  }

  /**
   * Print model evaluation summary
   */
  printModelSummary(modelName: string, result: FocusedEvaluationResults): void {
    console.log(`   Overall Score: ${(result.overallScore * 100).toFixed(1)}%`);
    console.log(`   Correct Tools: ${(result.correctToolUsage * 100).toFixed(1)}%`);
    console.log(`   Correct Order: ${(result.correctOrderUsage * 100).toFixed(1)}%`);
    console.log(`   Efficiency: ${(result.efficiencyScore * 100).toFixed(1)}%`);
  }

  /**
   * Save results to file
   */
  async saveResults(
    results: FocusedEvaluationResults[],
    filename: string = path.join(
      dirname(fileURLToPath(import.meta.url)),
      'results',
      `${new Date(Date.now()).toISOString()}.json`
    )
  ): Promise<void> {
    try {
      await fs.promises.mkdir(path.dirname(filename));
      await fs.promises.writeFile(filename, JSON.stringify(results, null, 2));
      console.log(`\n📁 Results saved to: ${filename}`);
    } catch (error) {
      console.warn(`⚠️ Could not save results: ${error}`);
    }
  }

  /**
   * Find most common item in array
   */
  private findMostCommon(items: string[]): string {
    const counts = new Map<string, number>();
    items.forEach(item => counts.set(item, (counts.get(item) || 0) + 1));

    let maxCount = 0;
    let mostCommon = '';
    counts.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    });

    return mostCommon;
  }
}
