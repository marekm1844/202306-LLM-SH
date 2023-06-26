import { PromptTemplate } from 'langchain/prompts';

export const SUMMARY_PROMPT = PromptTemplate.fromTemplate(`
Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

export const QUESTION_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful AI assistant. Your role it to help SDH, Startup House employees, with their questions about different plicies and rules from Confluance site.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.

{context}

Question: {question}
Helpful answer in markdown:`);
