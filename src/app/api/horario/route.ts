import { extractSubjetsForEachCarrera } from "@/utils/excel_utils";
import { isFileExcel } from "@/utils/file_utils";
import { getHeaders, handleFile, headerExcel } from "@/utils/parse_utils";
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

    if (!isFileExcel(file)) {
      return NextResponse.error();
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const uploadPath = path.join(process.cwd(), "public", "uploads");

    const filePath = path.join(uploadPath, file.name);

    // Eliminamos los archivos que estén en la carpeta uploads
    // y guardamos el archivo que se subió
    await handleFile(uploadPath, filePath, buffer);

    const workbook = xlsx.readFile(filePath);

    // Obtenemos los encabezados de la tabla
    const headersWithExams = getHeaders(workbook);

    // Obtenemos las materias de cada carrera
    const carreras: any = extractSubjetsForEachCarrera(
      workbook,
      headersWithExams
    );

    return NextResponse.json(carreras);
  } catch (error) {
    return NextResponse.error();
  }
}

