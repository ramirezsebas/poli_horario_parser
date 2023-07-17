import { Carrera } from "@/interfaces/carrera";
import { sheets } from "@/utils/constants";
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

    if (_fileTypeIsExcel(file)) {
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

function extractSubjetsForEachCarrera(
  workbook: xlsx.WorkBook,
  headersWithExams: any[]
) {
  const carreras: any = [];

  // Cada sheetName corresponde a la carrera(Siglas)
  for (let sheetName of sheets) {
    const currentSheet = workbook.Sheets[sheetName];

    let carrera: Carrera = {};

    let materias: Partial<Materia>[] = [];

    // TODO: Considerar que esto sea variable ya que podria variar
    // Se podria enviar desde la web?)
    let currentRowIndex = 12;
    let currentCellIndex = `A${currentRowIndex}`;

    // Recorremos cada fila de la hojas
    while (currentSheet[currentCellIndex] != null) {
      let materia: Partial<Materia> = {};
      // Recorremos cada columna de la fila
      // Obs: Como ya obtuvimos los encabezados, sabemos hasta donde debe ir que seria headerExcel.length
      for (let i = 0; i < headerExcel.length; i++) {
        const currentIndex = updateRow(i, currentRowIndex);
        const currentCell = currentSheet[currentIndex];
        const currentCellValue = currentCell?.v;
        const currentHeader = headersWithExams[i];

        materia = {
          ...materia,
          [currentHeader]: currentCellValue ?? null,
        };
      }
      materias.push(materia);

      currentRowIndex = currentRowIndex + 1;
      currentCellIndex = `A${currentRowIndex}`;
    }

    carrera = {
      ...carrera,
      [sheetName]: materias,
    };

    carreras.push(carrera);
  }
  return carreras;
}

function updateRow(i: number, currentRowIndex: number) {
  // Reemplzamos el numero(fila) e incrementamos el indice actual del encabezado.
  // Como empieza en 12, ira incrementando 12 + 1, 12 + 2, 12 + 3, etc
  return headerExcel[i].replace(/[0-9]+/g, (currentRowIndex + i).toString());
}

function _fileTypeIsExcel(file: File) {
  return (
    file.type !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}
