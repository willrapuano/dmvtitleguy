"use client";

import { useState, useCallback } from "react";
import { blogFAQQuestionKey } from "@/lib/blog-portable-content";

interface AccordionItem {
  question: string;
  answer: string | any[]; // Can be string or portable text blocks
}

interface AccordionProps {
  value: {
    items?: AccordionItem[];
    _key?: string;
  };
}

/**
 * Clean up question text by stripping markdown heading markers
 */
function cleanQuestion(question: string): string {
  if (!question) return "";
  return question
    .replace(/^##\s+/, '')  // Strip leading ## 
    .replace(/^#\s+/, '')   // Strip leading # 
    .replace(/^\*\*/, '')   // Strip leading **
    .replace(/\*\*$/, '')   // Strip trailing **
    .trim();
}

/**
 * Convert portable text blocks to lightweight Markdown while preserving the
 * bold and italic emphasis used by current Sanity accordion answers.
 */
function blocksToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  
  return blocks
    .map(block => {
      if (block._type === 'block' && Array.isArray(block.children)) {
        return block.children.map((child: any) => {
          let text = child.text || "";
          const marks = Array.isArray(child.marks) ? child.marks : [];
          if (marks.includes("strong")) text = `**${text}**`;
          if (marks.includes("em")) text = `*${text}*`;
          return text;
        }).join("");
      }
      return "";
    })
    .join("\n\n");
}

/**
 * Simple safe markdown renderer for accordion answers
 * Only handles basic formatting to avoid ReactMarkdown issues
 */
function SafeAnswer({ content }: { content: string }) {
  if (!content) return null;
  
  // Split by double newlines to create paragraphs
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  
  return (
    <div className="space-y-4">
      {paragraphs.map((para, idx) => {
        // Handle bullet points
        if (para.trim().startsWith('* ') || para.trim().startsWith('- ')) {
          const items = para.split('\n').filter(line => line.trim().startsWith('* ') || line.trim().startsWith('- '));
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">{item.trim().replace(/^[*-]\s+/, '')}</li>
              ))}
            </ul>
          );
        }
        
        // Handle bold text **text**
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={idx} className="text-gray-700 leading-relaxed max-w-[68ch]">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Render answer as portable text or plain text
 */
function AnswerContent({ answer }: { answer: string | any[] }) {
  // If answer is an array (portable text blocks), convert to text
  if (Array.isArray(answer)) {
    const textContent = blocksToMarkdown(answer);
    return <SafeAnswer content={textContent} />;
  }
  
  // If answer is a string, render directly
  return <SafeAnswer content={answer} />;
}

export function Accordion({ value }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const items = value?.items || [];

  const handleClick = useCallback((key: string) => {
    setOpenIndex(prev => prev === key ? null : key);
  }, []);

  if (!items.length) {
    return null;
  }

  return (
    <div className="my-8 divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden" data-blog-inline-accordion>
      {items.map((item, i) => {
        if (!item?.question) return null;
        
        // Use a stable key based on the question or index
        const itemKey = item.question.slice(0, 20) + i;
        const isOpen = openIndex === itemKey;
        
        return (
          <div key={itemKey} className="bg-white" data-blog-question-key={blogFAQQuestionKey(item.question)}>
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => handleClick(itemKey)}
              aria-expanded={isOpen}
            >
              <span className="pr-4">{cleanQuestion(item.question)}</span>
              <svg
                aria-hidden="true"
                focusable="false"
                className={`w-5 h-5 text-gray-500 flex-shrink-0 ml-4 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && item.answer && (
              <div className="px-5 pb-4 text-gray-700 text-base leading-relaxed bg-white">
                <AnswerContent answer={item.answer} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
