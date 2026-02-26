import { extractCustomerFromGemini } from "@/global/service/end-points/customer-extraction/customer-extraction.service";
import { useState } from "react";

export interface CustomerExtractionResponse {
  name: string | null;
  address: string | null;
  dob: string | null;
  gender: string | null;
  contactNumbers: string[] | null;
  extractedFrom: string | null;
  documentNumber?: string | null;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const isBlankExtraction = (data: CustomerExtractionResponse) =>
  (!data.name || data.name.trim() === "") &&
  (!data.address || data.address.trim() === "") &&
  (!data.dob || data.dob.trim() === "") &&
  (!data.gender || data.gender.trim() === "") &&
  (!data.contactNumbers || data.contactNumbers.length === 0);

export const useCustomerExtraction = () => {
  const [data, setData] = useState<CustomerExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extract = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const base64 = await fileToBase64(file);

      const response = await extractCustomerFromGemini({
        contents: [
          {
            parts: [
              {
                text: `
Extract customer information from the document.

Return the following fields if clearly visible:
- name
- address
- date of birth
- gender
- contact numbers
- document number (Aadhaar / PAN / Passport / DL)

If the document number is not clearly visible, return null for documentNumber.
`,
              },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              address: { type: "STRING" },
              dob: { type: "STRING" },
              gender: { type: "STRING" },
              contactNumbers: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              documentNumber: { type: "STRING" },
              extractedFrom: { type: "STRING" },
            },
          },
        },
      });

      const candidate = response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidate || candidate.trim() === "{}") {
        throw new Error("No readable data found");
      }

      const parsed = JSON.parse(candidate) as CustomerExtractionResponse;

      if (isBlankExtraction(parsed)) {
        throw new Error("Document contains no extractable customer data");
      }

      setData(parsed);
      return parsed;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Extraction failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    extract,
    loading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
    },
  };
};
