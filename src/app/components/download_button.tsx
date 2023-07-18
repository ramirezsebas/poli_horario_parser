"use client"
import React from 'react'
import {
    Button,
    Box,
    Tooltip,
} from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons';

interface DownloadButtonProps {
    isDisabled: boolean;
    onClick: () => void;

}

export default function DownloadButton({
    isDisabled,
    onClick,
}: DownloadButtonProps) {
    return (
        <Box position='fixed' bottom='2rem' right='2rem'>
            <Tooltip label='Descargar horario' aria-label='A tooltip'>
                <Button
                    isDisabled={isDisabled}
                    onClick={onClick} colorScheme='blue' size='lg' zIndex='1' >
                    <DownloadIcon w={8} h={8} />
                </Button>
            </Tooltip>
        </Box>
    )
}
