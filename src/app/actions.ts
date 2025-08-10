"use server";

import {
  compareFiqhRulings,
  CompareFiqhRulingsInput,
} from "@/ai/flows/compare-fiqh-rulings";
import {
  summarizeIslamicText,
  SummarizeIslamicTextInput,
} from "@/ai/flows/summarize-islamic-text";
import {
  extractConceptsFromText,
  ExtractConceptsFromTextInput,
} from "@/ai/flows/extract-concept-from-text";
import {
  shamelaSearchGuidance,
  ShamelaSearchGuidanceInput,
} from "@/ai/flows/shamela-search-guidance";

export type Skill =
  | "fiqh-comparison"
  | "summarization"
  | "concept-extraction"
  | "shamela-guidance";

export async function getAiResponse(
  skill: Skill,
  input: any,
  language: "Urdu" | "English"
): Promise<{ content: string }> {
  try {
    let result: any;
    const languageInstruction = `\n\n(Important: Please provide the answer in clear ${language}.)`;

    switch (skill) {
      case "fiqh-comparison":
        const fiqhInput: CompareFiqhRulingsInput = {
          topic: input.topic + languageInstruction,
          sources: input.sources,
        };
        result = await compareFiqhRulings(fiqhInput);
        return { content: result.comparison };

      case "summarization":
        const summaryInput: SummarizeIslamicTextInput = {
          text: input.text + languageInstruction,
        };
        result = await summarizeIslamicText(summaryInput);
        return { content: result.summary };

      case "concept-extraction":
        const conceptInput: ExtractConceptsFromTextInput = {
          islamicText: input.text + languageInstruction,
        };
        result = await extractConceptsFromText(conceptInput);
        return { content: `- ${result.concepts.join("\n- ")}` };

      case "shamela-guidance":
        const shamelaInput: ShamelaSearchGuidanceInput = {
          query: input.query + languageInstruction,
        };
        result = await shamelaSearchGuidance(shamelaInput);
        return { content: result.steps.map((step, i) => `${i + 1}. ${step}`).join("\n") };

      default:
        throw new Error("Invalid skill selected.");
    }
  } catch (error) {
    console.error("AI Action Error:", error);
    return {
      content:
        "I'm sorry, but I encountered an issue while processing your request. Please check your input or try again.",
    };
  }
}
