import { sheets } from "@/utils/constants";
import { incrementColumn, incrementRow } from "@/utils/increment_table_utils";
import {
  addExams,
  extractHeadersFromExcel,
  filterHeaders,
  getHeaders,
  handleFile,
  headerExcel,
} from "@/utils/parse_utils";
import { NextResponse } from "next/server";
import path from "path";
import * as xlsx from "xlsx";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file: File | null = formData.get("file") as unknown as File;

    if (!file) {
      return NextResponse.error();
    }

    if (file.length > 1) {
      return NextResponse.error();
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const uploadPath = path.join(process.cwd(), "public", "uploads");

    const fileName = file.name;

    const filePath = path.join(uploadPath, fileName);

    await handleFile(uploadPath, filePath, buffer);

    const workbook = xlsx.readFile(filePath);

    const headersWithExams = getHeaders(workbook);

    const carreras: any = [];

    // for (let sheetName of sheets) {
    const sheet = workbook.Sheets[sheets[0]];
    let carrera = {};

    let currentIndex = 12;

    let currentCell = headerExcel[0].replace(/11/gi, currentIndex.toString());
    let materias = [];

    while (sheet[currentCell] != null) {
      let materia = {};
      for (let i = 0; i < headerExcel.length; i++) {
        const currentCellValue = sheet[currentCell]?.v;

        const currentHeader = headersWithExams[i];

        materia = {
          ...materia,
          [currentHeader]: currentCellValue,
        };

        materias.push(materia);
        currentCell = currentCell.replace(
          currentIndex.toString(),
          (currentIndex + 1).toString()
        );
      }
    }

    carrera = {
      ...carrera,
      [sheets[0]]: materias,
    };

    carreras.push(carrera);
    // }

    return NextResponse.json(carreras);
  } catch (error) {
    console.log("error");
    console.log(error);
    console.log(typeof error);
    return NextResponse.error();
  }
}
