import React from 'react'
import {
    Container,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Input,
} from '@chakra-ui/react'

interface FileSectorProps {
    isInputDisabled: boolean;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileSector({
    isInputDisabled,
    handleDrop,
    handleDragOver,
    handleFileChange,
}: FileSectorProps) {
    return (
        <Grid templateColumns='repeat(2, 1fr)' gap={6}>
            <GridItem w='100%' h='10' >
                <Heading as='h4' size='1xl' noOfLines={2}>Para empezar, arrastra o selecciona el archivo del horario de la Poli en la caja</Heading>
            </GridItem>
            <GridItem w='100%' h='10'  >
                <Container onDrop={handleDrop} onDragOver={handleDragOver} onChange={handleFileChange} >
                    <Input type='file' disabled={isInputDisabled} />
                    <FormLabel htmlFor='file'>Arrastra o selecciona el archivo del horario de la Poli</FormLabel>
                </Container>
            </GridItem>
        </Grid>
    )
}
