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
      carrera: sheetName,
      materias: materias,
    };

    carreras.push(carrera);
  }
  return carreras;
}

export function updateRow(i: number, currentRowIndex: number) {
  // Reemplzamos el numero(fila) e incrementamos el indice actual del encabezado.
  // Como empieza en 12, ira incrementando 12 + 1, 12 + 2, 12 + 3, etc
  return headerExcel[i].replace(/[0-9]+/g, (currentRowIndex + i).toString());
}
