import { initialColumn, initialRow, sheets } from "@/utils/constants";
import { incrementColumn } from "@/utils/increment_table_utils";
import { readdir, unlink, writeFile } from "fs/promises";
import path from "path";

import * as xlsx from "xlsx";

export let headerExcel: string[] = [];

export function addExams(cleanHeaders: any[]) {
  const exams = [
    "parcial_1_dia",
    "parcial_1_hora",
    "parcial_2_dia",
    "parcial_2_hora",
    "final_1_dia",
    "final_1_hora",
    "final_2_dia",
    "final_2_hora",
  ];

  const headersWithExams = cleanHeaders.map((header) => {
    if (header === "dia") {
      return exams.shift();
    }
    if (header === "hora") {
      return exams.shift();
    }
    return header;
  });
  return headersWithExams;
}

export function filterHeaders(headers: any[]) {
  return headers.map((header) => {
    return header
      .toLowerCase()
      .replace(/á/gi, "a")
      .replace(/é/gi, "e")
      .replace(/í/gi, "i")
      .replace(/ó/gi, "o")
      .replace(/ú/gi, "u")
      .replace(/ñ/gi, "n")
      .replace(/ /gi, "_")
      .replace(/,/gi, "")
      .replace(/-/gi, "_")
      .replace(/\//gi, "_")
      .trim();
  });
}

export function extractHeadersFromExcel(sheet: xlsx.WorkSheet) {
  const headers = [];

  let currentCellIndex = initialColumn + initialRow;

  while (sheet[currentCellIndex] != null) {
    headerExcel.push(currentCellIndex);
    const currentCell = sheet[currentCellIndex];
    const currentCellValue = currentCell.v;

    headers.push(currentCellValue);

    if (isLastLetter(currentCellIndex)) {
      currentCellIndex = "AA" + initialRow.toString();
    }

    currentCellIndex = incrementColumn(currentCellIndex);
  }

  return headers;
}

export function isLastLetter(currentCellIndex: string) {
  return currentCellIndex.match("Z") != null;
}

export async function handleFile(
  uploadPath: string,
  filePath: string,
  buffer: Buffer
) {
  const files = await readdir(uploadPath);

  // Delete all files in the directory
  files.forEach(async (file) => {
    await unlink(path.join(uploadPath, file));
  });

  // Write the file to the directory
  await writeFile(filePath, buffer);
}

export function getHeaders(workbook: xlsx.WorkBook) {
  const sheet = workbook.Sheets[sheets[0]];

  const headers = extractHeadersFromExcel(sheet);

  const cleanHeaders = filterHeaders(headers);

  const headersWithExams = addExams(cleanHeaders);

  return headersWithExams;
}
