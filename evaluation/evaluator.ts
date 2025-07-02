/**
 * Core evaluation logic for tool usage assessment
 */

import { BaseMessage, AIMessage } from '@langchain/core/messages';
import { ToolUsageScenario, ToolUsageResult, ToolCall } from './types.js';
import { Runnable } from '@langchain/core/runnables';

/**
 * Core evaluation logic class
 */
export class ToolUsageEvaluator {
  /**
   * Evaluate a single scenario
   */
  async evaluateScenario(scenario: ToolUsageScenario, agent: Runnable): Promise<ToolUsageResult> {
    const messages = [
      {
        role: 'system',
        content:
          "You are a document processing assistant. Use the appropriate tools to complete the user's request efficiently.",
      },
      { role: 'human', content: scenario.query },
    ];

    const result = await agent.invoke({ messages });

    // Extract tool calls
    const toolCalls = this.extractToolCalls(result.messages);
    const actualTools = toolCalls.map(call => call.name);

    // Evaluate correctness
    const correctTools = this.evaluateCorrectTools(
      actualTools,
      scenario.expectedTools,
      scenario.allowExtraTools
    );
    const correctOrder = this.evaluateCorrectOrder(actualTools, scenario.expectedTools);
    const efficient = this.evaluateEfficiency(actualTools.length, scenario.maxToolCalls);

    // Calculate score
    let score = 0;
    if (correctTools) score += 0.5; // 50% for using correct tools
    if (correctOrder) score += 0.3; // 30% for correct order
    if (efficient) score += 0.2; // 20% for efficiency

    // Collect issues
    const issues: string[] = [];
    if (!correctTools) {
      issues.push(
        `Expected tools: [${scenario.expectedTools.join(', ')}], got: [${actualTools.join(', ')}]`
      );
    }
    if (!correctOrder) {
      issues.push(`Tools called in wrong order`);
    }
    if (!efficient) {
      issues.push(`Used ${actualTools.length} tools, max allowed: ${scenario.maxToolCalls}`);
    }

    return {
      scenarioId: scenario.id,
      description: scenario.description,
      correctTools,
      correctOrder,
      efficient,
      correctParameters: true, // TODO: Implement parameter validation
      expectedTools: scenario.expectedTools,
      actualTools,
      toolCallCount: actualTools.length,
      maxAllowed: scenario.maxToolCalls || 999,
      score,
      issues,
    };
  }

  /**
   * Check if correct tools were used
   */
  private evaluateCorrectTools(
    actualTools: string[],
    expectedTools: string[],
    allowExtra: boolean = true
  ): boolean {
    // Check that all expected tools were used
    for (const expectedTool of expectedTools) {
      if (!actualTools.includes(expectedTool)) {
        return false;
      }
    }

    // If extra tools are not allowed, check that no extra tools were used
    if (!allowExtra) {
      for (const actualTool of actualTools) {
        if (!expectedTools.includes(actualTool)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if tools were used in correct order
   */
  private evaluateCorrectOrder(actualTools: string[], expectedTools: string[]): boolean {
    let expectedIndex = 0;

    for (const actualTool of actualTools) {
      if (expectedIndex < expectedTools.length && actualTool === expectedTools[expectedIndex]) {
        expectedIndex++;
      }
    }

    // All expected tools should have been found in order
    return expectedIndex === expectedTools.length;
  }

  /**
   * Check if tool usage was efficient
   */
  private evaluateEfficiency(actualCount: number, maxAllowed?: number): boolean {
    if (!maxAllowed) return true;
    return actualCount <= maxAllowed;
  }

  /**
   * Extract tool calls from agent messages
   */
  private extractToolCalls(messages: BaseMessage[]): ToolCall[] {
    const toolCalls: ToolCall[] = [];

    for (const message of messages) {
      if (message instanceof AIMessage && message.tool_calls) {
        for (const toolCall of message.tool_calls) {
          toolCalls.push({
            name: toolCall.name,
            parameters: toolCall.args || {},
          });
        }
      }
    }

    return toolCalls;
  }
}
