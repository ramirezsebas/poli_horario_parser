import { Carrera } from "@/interfaces/carrera";
import { sheets } from "./constants";
import { headerExcel } from "./parse_utils";
import * as xlsx from "xlsx";

export function extractSubjetsForEachCarrera(
  workbook: xlsx.WorkBook,
  headersWithExams: any[]
) {
  const carreras: any = [];

  // Cada sheetName corresponde a la carrera(Siglas)
  for (let sheetName of sheets) {
    const currentSheet = workbook.Sheets[sheetName];

    let carrera: Partial<Carrera> = {};

    let materias: Partial<Materia>[] = [];

    // TODO: Considerar que esto sea variable ya que podria variar
    // Se podria enviar desde la web?)
    let currentRowIndex = 12;
    let currentCellIndex = `A${currentRowIndex}`;

    // Recorremos cada fila de la hojas
    while (isValidCell(currentSheet, currentCellIndex, currentRowIndex)) {
      let materia: Partial<Materia> = {};
      // Recorremos cada columna de la fila
      // Obs: Como ya obtuvimos los encabezados, sabemos hasta donde debe ir que seria headerExcel.length
      for (let i = 0; i < headerExcel.length; i++) {
        const currentIndex = updateColumn(i, currentRowIndex);
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
      carrera: sheetName,
      materias: materias,
    };

    carreras.push(carrera);
  }
  return carreras;
}

function isValidCell(
  currentSheet: xlsx.WorkSheet,
  currentCellIndex: string,
  currentRowIndex: number
) {
  return (
    currentSheet[currentCellIndex] != null ||
    currentSheet[
      currentCellIndex.replace(/[0-9]+/g, (currentRowIndex + 1).toString())
    ] != null
  );
}

export function updateColumn(
  i: number,
  currentRowIndex: number,
  increment = 0
) {
  // Reemplzamos el numero(fila) por el numero de fila actual + un incremento
  return headerExcel[i].replace(
    /[0-9]+/g,
    (currentRowIndex + increment).toString()
  );
}
