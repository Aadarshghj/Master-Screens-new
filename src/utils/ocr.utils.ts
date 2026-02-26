import { documentCode } from "@/const/common-codes.const";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface DetectionResult {
  document_type: string;
  document_number: string | null;
}

interface OCRResult {
  text: string;
  detected: DetectionResult;
  preview: string | null;
}

function detectType(text: string): DetectionResult {
  const upper = text.toUpperCase();

  if (
    /AADHAAR|UNIQUE IDENTIFICATION AUTHORITY|GOVERNMENT OF INDIA|YOUR AADHAAR NO/.test(
      upper
    )
  ) {
    const match = upper.match(/\d{4}\s\d{4}\s\d{4}/);
    return {
      document_type: documentCode.aadharCard,
      document_number: match ? match[0] : null,
    };
  }
  if (
    /INCOME TAX DEPARTMENT|PERMANENT ACCOUNT NUMBER|PAN CARD|TAXPAYER/.test(
      upper
    )
  ) {
    const match = upper.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
    return {
      document_type: documentCode.panCard,
      document_number: match ? match[0] : null,
    };
  }
  if (/DRIVING LICEN[CS]E|DL NO|TRANSPORT DEPARTMENT|LICENCE NO/.test(upper)) {
    const match = upper.match(/[A-Z]{2}\d{2}\s?\d{11,}/);
    return {
      document_type: documentCode.drivingLicence,
      document_number: match ? match[0] : null,
    };
  }
  if (
    /ELECTION COMMISSION|VOTER ID|EPIC|ELECTORS PHOTO IDENTITY CARD/.test(upper)
  ) {
    const match = upper.match(/[A-Z]{3}\d{7}/);
    return {
      document_type: documentCode.voterId,
      document_number: match ? match[0] : null,
    };
  }
  if (/PASSPORT|REPUBLIC OF INDIA|MINISTRY OF EXTERNAL AFFAIRS/.test(upper)) {
    const match = upper.match(/[A-Z]\d{7}/);
    return {
      document_type: documentCode.passport,
      document_number: match ? match[0] : null,
    };
  }

  return { document_type: documentCode.unknown, document_number: null };
}

function preprocessImage(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  const scale = 2;
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = avg > 128 ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = value;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

async function pdfToImages(file: File, maxPages: number = 1): Promise<Blob[]> {
  const pdfData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const images: Blob[] = [];

  const pagesToProcess = Math.min(pdf.numPages, maxPages);

  for (let i = 1; i <= pagesToProcess; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise;

    await new Promise<void>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          images.push(blob);
          resolve();
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      }, "image/png");
    });
  }

  return images;
}

let worker: Tesseract.Worker | null = null;

async function getWorker() {
  if (!worker) {
    worker = await Tesseract.createWorker("eng");
  }
  return worker;
}

export async function detectDocumentFromFile(file: File): Promise<OCRResult> {
  const isPDF = file.type === "application/pdf";
  const blobs: Blob[] = isPDF ? await pdfToImages(file, 1) : [file];

  let allText = "";
  let preview: string | null = null;
  const tesseractWorker = await getWorker();

  const blob = blobs[0];
  const imgUrl = URL.createObjectURL(blob);

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgUrl;
  });

  const processedCanvas = preprocessImage(image);

  preview = await new Promise<string>(resolve => {
    processedCanvas.toBlob(blob => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      }
    }, "image/png");
  });

  const { data } = await tesseractWorker.recognize(processedCanvas);
  allText = data.text;

  URL.revokeObjectURL(imgUrl);

  const detected = detectType(allText);

  if (detected.document_type === documentCode.unknown) {
    const rotated90 = await rotateImage(processedCanvas, 90);
    const { data: rotatedData } = await tesseractWorker.recognize(rotated90);
    allText += " " + rotatedData.text;
    const retryDetected = detectType(allText);
    if (retryDetected.document_type !== documentCode.unknown) {
      return { text: allText.trim(), detected: retryDetected, preview };
    }
  }

  return { text: allText.trim(), detected, preview };
}

async function rotateImage(
  image: HTMLCanvasElement,
  angle: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  if (angle === 90 || angle === 270) {
    canvas.width = image.height;
    canvas.height = image.width;
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    }, "image/png");
  });
}

export async function cleanupOCR() {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}
