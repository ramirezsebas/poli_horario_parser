"use client"
import React, { use, useEffect } from 'react'
import styles from './page.module.css'
import {
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
    Button,
    Center,
    Container,
    Divider,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Input,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Select,
    Box,
    Icon,
    Tooltip,
} from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons';
import { downloadExcel, downloadFileFromObject } from '@/utils/download_utils';
import { isFileExcel } from '@/utils/file_utils';

const ITEMS_PER_PAGE = 10;


export default function Home() {

    const [files, setFiles] = React.useState<FileList | null>(null)

    const [isFileLoaded, setIsFileLoaded] = React.useState<boolean>(false)
    const [isFileProcessing, setIsFileProcessing] = React.useState<boolean>(false)
    const [errorUploadingFile, setErrorUploadingFile] = React.useState<string | null>(null)

    const [carreras, setCarreras] = React.useState<any>([]);
    const [isLoadingCarreras, setIsLoadingCarreras] = React.useState<boolean>(false);
    const [errorLoadingCarreras, setErrorLoadingCarreras] = React.useState<string | null>(null);
    const [selectedCarrera, setSelectedCarrera] = React.useState<string>("");

    const [carreraConMaterias, setCarreraConMaterias] = React.useState<any>(null);
    const [filteredMaterias, setFilteredMaterias] = React.useState<any>(null);

    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPages, setTotalPages] = React.useState<number>(0);

    const [isScrapingHorario, setIsScrapingHorario] = React.useState<boolean>(false);
    const [errorScrapingHorario, setErrorScrapingHorario] = React.useState<string | null>(null);


    useEffect(() => {
        if (!carreraConMaterias) {
            return;
        }

        if (selectedCarrera.length === 0) {
            setFilteredMaterias(carreraConMaterias);
            return;
        }

        const filterCarrerasConMaterias: any = carreraConMaterias.filter((element: any) => element?.carrera === selectedCarrera);

        setFilteredMaterias(filterCarrerasConMaterias);
    }, [selectedCarrera, carreraConMaterias]);

    useEffect(() => {
        if (filteredMaterias) {
            const totalPages = Math.ceil(filteredMaterias[0].materias.length / ITEMS_PER_PAGE);
            setTotalPages(totalPages);
        }
    }, [filteredMaterias]);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredMaterias[0].materias.slice(startIndex, endIndex);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };


    const closeErrorUploadingFile = () => {
        setTimeout(() => {
            setErrorUploadingFile(null);
        }, 5000);
    }

    const closeErrorLoadingCarreras = () => {
        setTimeout(() => {
            setErrorLoadingCarreras(null);
        }, 5000);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files) {
            setErrorUploadingFile('No se pudo subir el archivo');
            closeErrorUploadingFile();
            return;
        }

        if (files.length > 1) {
            setErrorUploadingFile('Solo puedes subir un archivo')
            closeErrorUploadingFile()
            return
        }

        if (!isFileExcel(files[0])) {
            setErrorUploadingFile('Solo puedes subir archivos de Excel')
            closeErrorUploadingFile()
            return
        }

        setFiles(files);
        setIsFileLoaded(true);


    }


    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        if (e.dataTransfer.files.length > 1) {
            setErrorUploadingFile('Solo puedes subir un archivo')
            closeErrorUploadingFile()
            return
        }

        if (!isFileExcel(e.dataTransfer.files[0])) {
            setErrorUploadingFile('Solo puedes subir archivos de Excel')
            closeErrorUploadingFile()
            return
        }

        setFiles(e.dataTransfer.files)
        setIsFileLoaded(true);

    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleFileProcessing = () => {
        setIsFileProcessing(true)

        const excelFile = files![0]

        const formData = new FormData()

        formData.append('file', excelFile)

        fetch('/api/parse_file', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setIsLoadingCarreras(true)
                fetch('/api/carreras', {
                    method: 'GET',
                }).then(response => response.json())
                    .then(data => {
                        setCarreras(data)
                    })
                    .catch(error => {
                        console.error(error)
                        setErrorLoadingCarreras('No se pudieron cargar las carreras')
                        closeErrorLoadingCarreras();
                    })
                    .finally(() => {
                        setIsLoadingCarreras(false)
                    });
                setCarreraConMaterias(data);
                setFilteredMaterias(data);
            })
            .catch(error => {
                console.error(error)
                closeErrorUploadingFile();
            })
            .finally(() => {
                setIsFileProcessing(false)
            })

    }




    if (isFileProcessing || isLoadingCarreras || isScrapingHorario) {
        return <Box width='100%' height='100%' >
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
            />
        </Box>;


    }


    return (
        <main className={styles.main}>
            <Heading style={{
                textAlign: 'center',
                marginBottom: '2rem'
            }} as='h1' size='2xl' noOfLines={1}>Bienvenido al Parser del Horario de la Poli</Heading>

            {
                carreraConMaterias &&
                <Button
                    style={{
                        marginBottom: '2rem'
                    }}
                    onClick={() => downloadFileFromObject(carreraConMaterias, 'horario_poli')}
                    colorScheme='blue'
                    size='lg'
                    disabled={!isFileLoaded}
                >
                    Descargar JSON de materias con todas las carreras
                </Button>
            }

            {
                carreraConMaterias &&
                selectedCarrera &&
                selectedCarrera.length > 0 &&
                <Button
                    style={{
                        marginBottom: '2rem'
                    }}
                    onClick={() => downloadFileFromObject(filteredMaterias, 'horario_poli')}
                    colorScheme='blue'
                    size='lg'
                    disabled={!isFileLoaded}
                >
                    Descargar JSON de materias con la carrera seleccionado ({selectedCarrera})
                </Button>
            }

            {

                !carreraConMaterias && <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                    <GridItem w='100%' h='10' >
                        <Heading as='h4' size='1xl' noOfLines={2}>Para empezar, arrastra o selecciona el archivo del horario de la Poli en la caja</Heading>
                    </GridItem>
                    <GridItem w='100%' h='10'  >
                        <Container onDrop={handleDrop} onDragOver={handleDragOver} onChange={handleFileChange} >
                            <Input type='file' />
                            <FormLabel htmlFor='file'>Arrastra o selecciona el archivo del horario de la Poli</FormLabel>
                        </Container>
                    </GridItem>
                </Grid>
            }

            {
                carreraConMaterias && carreras &&
                <Select placeholder='Seleccionar la carrera' value={selectedCarrera} onChange={(e) => setSelectedCarrera(e.target.value)}>
                    {
                        carreras.map((carrera: any) => {
                            return <option key={carrera.id} value={carrera.nombre}>{carrera.nombre}</option>
                        })
                    }

                </Select>
            }

            {
                filteredMaterias &&
                carreras &&
                selectedCarrera &&
                selectedCarrera.length > 0 &&

                <TableContainer>
                    <Table size='sm'>
                        <Thead>
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
                        </Thead>
                        <Tbody>
                            {
                                getCurrentPageItems().map((materia: any) => {
                                    return <Tr key={materia.item}>
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
                                }
                                )
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Item</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            }

            {filteredMaterias &&
                carreras &&
                selectedCarrera &&
                selectedCarrera.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                        <Button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            colorScheme="blue"
                            size="sm"
                            style={{ marginRight: '1rem' }}
                        >
                            Anterior
                        </Button>
                        {[...Array(totalPages)].map((_, index) => (
                            <Button
                                key={index + 1}
                                onClick={() => goToPage(index + 1)}
                                colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
                                size="sm"
                                style={{ marginRight: '0.5rem' }}
                            >
                                {index + 1}
                            </Button>
                        ))}
                        <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            colorScheme="blue"
                            size="sm"
                            style={{ marginLeft: '1rem' }}
                        >
                            Siguiente
                        </Button>
                    </div>
                )}





            {
                !carreraConMaterias && files &&
                <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                    <GridItem w='100%' h='10' >
                        <Heading as='h4' size='1xl' noOfLines={2}>Archivo cargado</Heading>
                    </GridItem>
                    <GridItem w='100%' h='10'  >
                        <Container>
                            <FormLabel htmlFor='file'>{files[0].name}</FormLabel>
                        </Container>
                    </GridItem>
                </Grid>
            }

            {
                !carreraConMaterias && isFileLoaded &&
                <>
                    <Divider />
                    <Button onClick={handleFileProcessing} isLoading={isFileProcessing} isDisabled={!isFileLoaded}>Procesar</Button>
                </>
            }

            <Box position='fixed' bottom='2rem' right='2rem'>
                <Tooltip label='Descargar horario' aria-label='A tooltip'>
                    <Button onClick={() => {
                        setIsScrapingHorario(true)
                        fetch('/api/scrape',
                            {
                                method: 'GET',
                            }
                        )
                            .then(res => res.json())
                            .then(res => {
                                const linkFile = res.link;

                                downloadExcel(linkFile);
                            }
                            )
                            .catch(err => {
                                setErrorScrapingHorario(err.message);


                            })
                            .finally(() => setIsScrapingHorario(false))

                    }} colorScheme='blue' size='lg' zIndex='1' >
                        <DownloadIcon w={8} h={8} />
                    </Button>
                </Tooltip>
            </Box>


            {
                errorUploadingFile &&
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>Hubo un error subiendo el archivo</AlertTitle>
                    <AlertDescription>{errorUploadingFile}</AlertDescription>
                </Alert>
            }

            {
                errorLoadingCarreras &&
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>Hubo un error cargando las carreras</AlertTitle>
                    <AlertDescription>{errorLoadingCarreras}</AlertDescription>
                </Alert>
            }

            {
                errorScrapingHorario &&
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>Hubo un error descargando el horario</AlertTitle>
                    <AlertDescription>{errorScrapingHorario}</AlertDescription>
                </Alert>
            }

        </main>

    )
}


