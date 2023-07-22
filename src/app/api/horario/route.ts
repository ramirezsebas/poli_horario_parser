import { extractSubjetsForEachCarrera } from "@/utils/excel_utils";
import { isFileExcel } from "@/utils/file_utils";
import { getHeaders } from "@/utils/parse_utils";
import { NextResponse } from "next/server";
import path from "path";
import * as xlsx from "xlsx";
import { readdir, unlink, writeFile } from "fs/promises";
import { existsSync, fstat } from "fs";

export async function POST(request: Request) {
  let formData;

  try {
    formData = await request.formData();
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al obtener el archivo excel del formdata",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  if (!formData.has("file")) {
    return NextResponse.json(
      {
        error_client:
          "No se ha enviado ningún archivo (formdata debe tener como clave 'file')",
      },
      {
        status: 400,
      }
    );
  }

  if (formData.getAll("file").length > 1) {
    return NextResponse.json(
      {
        error_client: "Solo se puede subir un archivo",
      },
      {
        status: 400,
      }
    );
  }

  const file: File | null = formData.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      {
        error_client: "No se ha enviado ningún archivo",
      },
      {
        status: 400,
      }
    );
  }

  if (file.length > 1) {
    return NextResponse.json(
      {
        error_client: "Solo se puede subir un archivo",
      },
      {
        status: 400,
      }
    );
  }

  if (!isFileExcel(file)) {
    return NextResponse.json(
      {
        error_client: "El archivo no es un excel",
      },
      {
        status: 400,
      }
    );
  }

  let bytes;

  try {
    bytes = await file.arrayBuffer();
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al convertir el archivo excel a bytes",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  let buffer;
  try {
    buffer = Buffer.from(bytes);
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al convertir el archivo excel a buffer",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  let uploadPath: string;

  try {
    uploadPath = path.join(process.cwd(), "public", "uploads");
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al obtener la ruta de la carpeta uploads",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  let filePath;

  try {
    filePath = path.join(uploadPath, file.name);
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al obtener la ruta del archivo excel",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  let filesFound;

  try {
    filesFound = await readdir(uploadPath);
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al leer los archivos de la carpeta uploads",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  try {
    filesFound.forEach(async (file) => {
      if (existsSync(path.join(uploadPath, file))) {
        await unlink(path.join(uploadPath, file));
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al eliminar los archivos de la carpeta uploads",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  try {
    await writeFile(filePath, buffer);
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al guardar el archivo excel",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  let workbook;
  try {
    workbook = xlsx.readFile(filePath);
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al leer el archivo excel",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  let headersWithExams;
  try {
    // Obtenemos los encabezados de la tabla
    headersWithExams = getHeaders(workbook);
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al obtener los encabezados de la tabla",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  let carreras;

  try {
    // Obtenemos las materias de cada carrera
    carreras = extractSubjetsForEachCarrera(workbook, headersWithExams);
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al extraer las materias de cada carrera",
        error: error.toString(),
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(carreras, {
    status: 200,
  });
}
