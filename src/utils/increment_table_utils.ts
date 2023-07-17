export const incrementRow = (cell: string) => {
  const cellNumberMatches = cell.match(/\d+/g);

  const cellNumber = cellNumberMatches?.[0];

  if (!cellNumber) {
    throw new Error("The cell does not have a number");
  }

  const incrementedCellNumber = parseInt(cellNumber) + 1;

  const incrementedCell = cell.replace(
    cellNumber,
    incrementedCellNumber.toString()
  );

  return incrementedCell;
};

// Obs: Solo funciona hasta dos letras
export const incrementColumn = (cell: string) => {
  const cellLetterMatches = cell.match(/[A-Z]+/g);

  const cellLetter = cellLetterMatches?.[0];

  if (!cellLetter) {
    throw new Error("The cell does not have a  letter");
  }

  const indexCharCode = cellLetter.length - 1;

  const cellLetterCharcode = cellLetter.charCodeAt(indexCharCode);

  const incrementedCellLetterCharcode = cellLetterCharcode + 1;

  const incrementedCellLetter = String.fromCharCode(
    incrementedCellLetterCharcode
  );

  const incrementedCell = cell.replace(
    cellLetter,
    cellLetter.length == 1
      ? incrementedCellLetter
      : String.fromCharCode(cellLetter.charCodeAt(0)) + incrementedCellLetter
  );

  return incrementedCell;
};
