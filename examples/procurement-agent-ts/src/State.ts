import { Annotation, messagesStateReducer } from '@langchain/langgraph';
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { RunnableConfig } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { BaseMessage } from '@langchain/core/messages';
import { BaseDocument, DocumentGroup, OrphanDocument, ProcessedDocument } from './types';

export const ConfigurationSchema = Annotation.Root({
  documentEngineMcpServerUrl: Annotation<string>,
  model: Annotation<BaseChatModel>,
});

export function ensureRunnableConfig(config: RunnableConfig): typeof ConfigurationSchema.State {
  const configurable = config.configurable ?? {};

  const model = (configurable.model ??
    new ChatOpenAI({
      model: 'gpt-4.1-mini',
      temperature: 0.1,
    })) as BaseChatModel;

  return {
    documentEngineMcpServerUrl:
      configurable.documentEngineMcpServerUrl ?? 'http://localhost:5100/mcp',
    model,
  };
}

export const WorkflowStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  documents: Annotation<BaseDocument[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  processedDocuments: Annotation<ProcessedDocument[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  groups: Annotation<DocumentGroup[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  orphans: Annotation<OrphanDocument[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
});
