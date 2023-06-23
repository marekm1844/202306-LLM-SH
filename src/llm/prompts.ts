import { PromptTemplate } from 'langchain/prompts';

export const SUMMARY_PROMPT = PromptTemplate.fromTemplate(`
Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

export const QUESTION_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context,
politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`);

export const AVG_TEMP_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful AI weather assistant. Answer the avarege temperature in the last 10 years for {city} during {month}.

Helpful answer in markdown:`);
