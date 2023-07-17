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
    TableCaption,
    TableContainer,
    Select,
} from '@chakra-ui/react'
import { Carrera } from '@/interfaces/carrera'


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


    useEffect(() => {
        if (!carreraConMaterias) {
            return;
        }

        if (selectedCarrera.length === 0) {
            setFilteredMaterias(carreraConMaterias);
            return;
        }

        const filterCarrerasConMaterias: any = carreraConMaterias.filter((element: any) => element.carrera === selectedCarrera);

        setFilteredMaterias(filterCarrerasConMaterias);
    }, [selectedCarrera])


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

    const isFileExcel = (file: File) => {
        return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleFileProcessing = () => {
        setIsFileProcessing(true)

        const excelFile = files![0]

        console.log(excelFile);

        const formData = new FormData()

        formData.append('file', excelFile)

        console.log(formData);

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
                        console.log(data)
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
                console.log(data)
                setCarreraConMaterias(data)
            })
            .catch(error => {
                console.error(error)
                closeErrorUploadingFile();
            })
            .finally(() => {
                setIsFileProcessing(false)
            })

    }

    const downloadFileFromObject = (object: any, fileName: string) => {
        const json = JSON.stringify(object)
        const blob = new Blob([json], { type: 'application/json' })
        const href = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



    if (isFileProcessing || isLoadingCarreras) {
        return <Center>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
            />
        </Center>;
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
                carreraConMaterias && carreras &&
                // Create pagination table with search and sort functionalities

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
                                carreraConMaterias[0].materias.map((materia: any) => {
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

        </main>

    )
}
