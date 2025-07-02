/**
 * Focused LLM Tool Usage Evaluation
 *
 * Evaluates whether LLMs can:
 * 1. Call the right tools at the right time
 * 2. Use tools in the correct order
 * 3. Minimize unnecessary tool calls
 *
 * No performance metrics, no robustness testing, just tool usage correctness.
 *
 * This file now serves as the main entry point and re-exports the modular components.
 */

import { runFocusedEvaluation } from './runner.js';
import dotenv from 'dotenv';

dotenv.config();

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFocusedEvaluation().catch(console.error);
}
