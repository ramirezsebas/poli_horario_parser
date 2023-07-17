"use client"
import React from 'react'
import styles from './page.module.css'
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Center, Container, Divider, FormLabel, Grid, GridItem, Heading, Input, Spinner } from '@chakra-ui/react'


export default function Home() {

    const [files, setFiles] = React.useState<FileList | null>(null)

    const [isFileLoaded, setIsFileLoaded] = React.useState<boolean>(false)

    const [isFileProcessing, setIsFileProcessing] = React.useState<boolean>(false)

    const [errorUploadingFile, setErrorUploadingFile] = React.useState<string | null>(null)

    const closeErrorUploadingFile = () => {
        setErrorUploadingFile(null)
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
                console.log(data)
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setIsFileProcessing(false)
            })

    }

    if (isFileProcessing) {
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
            <Heading as='h1' size='2xl' noOfLines={1}>Bienvenido al Parser del Horario de la Poli</Heading>


            <Grid templateColumns='repeat(2, 1fr)' gap={6}>
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

            {
                files &&
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
                isFileLoaded &&
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





        </main>

    )
}
