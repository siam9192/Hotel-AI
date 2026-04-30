import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import z from "zod";

/**
 * Get the hotel policy document
 * @returns The policy document content
 */
const getPolicySchema = z.object({
  section: z
    .string()
    .optional()
    .describe("Optional specific section to retrieve"),
});

export const getPolicyTool: DynamicStructuredTool<typeof getPolicySchema> =
  tool(
    async function ({
      section,
    }: z.infer<typeof getPolicySchema>): Promise<any> {
      try {
        const path = "docs/policy.pdf";
        const loader = new PDFLoader(path);
        const docs = await loader.load();
        const content = docs[0].pageContent;

        // If a specific section is requested, try to extract it
        if (section) {
          const sections = content.split(/^##?\s+/m);
          for (const s of sections) {
            if (s.toLowerCase().includes(section.toLowerCase())) {
              return {
                success: true,
                section,
                content: s.trim(),
              };
            }
          }
          return {
            success: true,
            section,
            content,
            message: `Section "${section}" not found, returning full policy`,
          };
        }

        return {
          success: true,
          content,
        };
      } catch (error) {
        return `Error: Failed to get policy. ${error instanceof Error ? error.message : String(error)}`;
      }
    },
    {
      name: "getPolicy",
      description:
        "Get the hotel policy document containing rules and regulations. Optionally specify a section.",
    },
  );

const contactInfoSchema = z.object({
  section: z
    .string()
    .optional()
    .describe("Optional specific section to retrieve"),
});

export const getContactInfoTool: DynamicStructuredTool<
  typeof contactInfoSchema
> = tool(
  async function ({
    section,
  }: z.infer<typeof contactInfoSchema>): Promise<any> {

    try {
      const path = "docs/contact.pdf";
      const loader = new PDFLoader(path);
      const docs = await loader.load();
      const content = docs[0].pageContent;

      // If a specific section is requested, try to extract it
      if (section) {
        const sections = content.split(/^##?\s+/m);
        for (const s of sections) {
          if (s.toLowerCase().includes(section.toLowerCase())) {
            return {
              success: true,
              section,
              content: s.trim(),
            };
          }
        }
        return {
          success: true,
          section,
          content,
          message: `Section "${section}" not found, returning full policy`,
        };
      }

      return {
        success: true,
        content,
      };
    } catch (error) {
      return `Error: Failed to get contact information. ${error instanceof Error ? error.message : String(error)}`;
    }
  },

  {
    name: "getContactInfo",
    description:
      "Get the hotel's contact information document. Optionally specify a section.",
  },
);

export const policyTools = [getPolicyTool, getContactInfoTool];