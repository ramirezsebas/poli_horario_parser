export function downloadExcel(linkFile: any) {
  const link = document.createElement("a");
  link.href = linkFile;
  link.download = "horario.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const downloadFileFromObject = (object: any, fileName: string) => {
  const json = JSON.stringify(object);
  const blob = new Blob([json], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
