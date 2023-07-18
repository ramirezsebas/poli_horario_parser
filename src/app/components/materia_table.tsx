import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';

interface TableContainerProps {
    getPageItems: () => any;

}

export default function MateriaTable(
    { getPageItems }: TableContainerProps
) {
    return (
        <TableContainer>
            <Table size="sm">
                <Thead>
                    <MateriaTableHeader />
                </Thead>
                <Tbody>
                    {getPageItems().map((materia: any) => {
                        return (
                            <Tr key={materia.item}>
                                <Td>{materia.item}</Td>
                                <Td>{materia.dpto}</Td>
                                <Td>{materia.asignatura}</Td>
                                <Td>{materia.nivel}</Td>
                                <Td>{materia.sem_grupo}</Td>
                                <Td>{materia.sigla_carrera}</Td>
                                <Td>{materia.enfasis}</Td>
                                <Td>{materia.plan}</Td>
                                <Td>{materia.turno}</Td>
                                <Td>{materia.seccion}</Td>
                                <Td>{materia.plataforma_de_aula_virtual}</Td>
                                <Td>{materia.tit}</Td>
                                <Td>{materia.apellido}</Td>
                                <Td>{materia.nombre}</Td>
                                <Td>{materia.correo_institucional}</Td>
                                <Td>{materia.parcial_1_dia}</Td>
                                <Td>{materia.parcial_1_hora}</Td>
                                <Td>{materia.parcial_2_dia}</Td>
                                <Td>{materia.parcial_2_hora}</Td>
                                <Td>{materia.final_1_dia}</Td>
                                <Td>{materia.final_1_hora}</Td>
                                <Td>{materia.final_2_dia}</Td>
                                <Td>{materia.final_2_hora}</Td>
                                <Td>{materia.lunes}</Td>
                                <Td>{materia.martes}</Td>
                                <Td>{materia.miercoles}</Td>
                                <Td>{materia.viernes}</Td>
                                <Td>{materia.sabado}</Td>
                                <Td>{materia["fechas_de_clases_de_sabados_(turno_noche)"]}</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
                <Tfoot>
                    <MateriaTableHeader />
                </Tfoot>
            </Table>
        </TableContainer>
    );
}



function MateriaTableHeader() {
    return (
        <Tr>
            <Th>Ítem</Th>
            <Th>Departamento</Th>
            <Th>Asignatura</Th>
            <Th>Nivel</Th>
            <Th>Semestre/Grupo</Th>
            <Th>Sigla de Carrera</Th>
            <Th>Énfasis</Th>
            <Th>Plan</Th>
            <Th>Turno</Th>
            <Th>Sección</Th>
            <Th>Plataforma de Aula Virtual</Th>
            <Th>Título</Th>
            <Th>Apellido</Th>
            <Th>Nombre</Th>
            <Th>Correo Institucional</Th>
            <Th>Día Parcial 1</Th>
            <Th>Hora Parcial 1</Th>
            <Th>Día Parcial 2</Th>
            <Th>Hora Parcial 2</Th>
            <Th>Día Final 1</Th>
            <Th>Hora Final 1</Th>
            <Th>Día Final 2</Th>
            <Th>Hora Final 2</Th>
            <Th>Lunes</Th>
            <Th>Martes</Th>
            <Th>Miércoles</Th>
            <Th>Viernes</Th>
            <Th>Sábado</Th>
            <Th>Fechas de Clases de Sábados (Turno Noche)</Th>
        </Tr>
    )
}

