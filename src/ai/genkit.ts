"use server";

import { genkit, type Plugin } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

const plugins: Plugin<any>[] = [];

if (process.env.GEMINI_API_KEY) {
    plugins.push(googleAI({
        apiVersion: "v1beta"
    }));
}

export const ai = genkit({
    plugins
});