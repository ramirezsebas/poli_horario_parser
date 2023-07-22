# Horario Parser de Politecnica

Este proyecto fue creado con el objetivo de facilitar el acceso a los datos del horario de la facultad Politécnica de la Universidad Nacional de Asunción. Una forma sencilla de obtener el horario y usarla en otras aplicaciones.

## TODO

[] Mejorar el manejo de error
[] Responsive
[] Mejorar el diseño

## El mismo fue desarrollado utilizando las siguientes tecnologías

- Next.js
- Chakra UI
- React
- Node.js
- TypeScript

## Tabla de Contenidos

1. Instalación
2. Uso
3. API
4. Contribuciones
5. Licencia
6. Contacto

### Instalación

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto: cd nombre-del-proyecto.
3. Instala las dependencias utilizando Yarn: yarn install.
4. Inicia el servidor de desarrollo: yarn dev.
5. Accede a la aplicación en tu navegador: <http://localhost:3000>.

### Uso

Para poder obtener la informacion del horario solo se debe seleccionar o arrastrar el archivo de excel que contiene el horario y luego presionar el boton de `Procesar`. Una vez terminado el proceso, se podra seleccionar la carrera que se desea ver con los datos correspondientes.

Ademas, se tendra dos botonos para descargar el horario en formato JSON completo o en formato JSON por carrera.

Si no tienes el excel, podrás descargarlo desde la página de la Politécnica con el boton que esta en la parte inferior con el icono de descargas.

### API

1. Obtener todas las carreras de la facultad Politécnica según sus siglas
Endpoint: /api/carreras

Método: GET

Descripción: Este servicio devuelve todas las carreras disponibles en la facultad Politécnica, utilizando sus siglas correspondientes. (Esta en duro en el codigo, se puede cambiar para que se obtenga de la base de datos)

Response:

```json
[
    {
        "id": "5ffdfe13-456a-486e-8413-0dcab24071bc",
        "nombre": "IAE"
    },
    {
        "id": "41faabc6-ffbe-432e-b49f-1823fb8c8050",
        "nombre": "ICM"
    },
    {
        "id": "35329e5d-6326-4bb5-a011-db45235f012c",
        "nombre": "IEK"
    },
    {
        "id": "510e6298-f6d5-4e74-9d37-b44a90886a11",
        "nombre": "IEL"
    },
    {
        "id": "0a75b22f-cde2-47fa-a235-acc1cda9ded5",
        "nombre": "IEN"
    },
    {
        "id": "f4037228-3958-452e-bd67-0d1a7eba3328",
        "nombre": "IIN"
    },
    {
        "id": "8a8641b5-25ef-4eda-965c-0828b0460466",
        "nombre": "IMK"
    },
    {
        "id": "c4f82e23-2906-4ab5-b05d-fec9b5929c85",
        "nombre": "ISP"
    },
    {
        "id": "fc8ecfa6-d218-4966-8b65-1374d6225089",
        "nombre": "LCA"
    },
    {
        "id": "353c4def-402c-40c4-b86c-9be9e8bd6a93",
        "nombre": "LCI"
    },
    {
        "id": "7a376384-9d4c-49b8-9d81-e96d184b4e0c",
        "nombre": "LCIk"
    },
    {
        "id": "36f40390-dd0e-4e7e-a9f8-654deab35580",
        "nombre": "LEL"
    },
    {
        "id": "5e2757e0-311a-4824-a981-a7e90d048f87",
        "nombre": "LGH"
    },
    {
        "id": "8860defc-4b65-4c22-9fae-7586de8c0b20",
        "nombre": "TSE"
    }
]
```

2. Realizar web scraping de la página de la Poli para obtener el enlace del horario
Endpoint: /api/latest_horario

Método: GET

Descripción: Este servicio realiza web scraping en la página de la Politécnica para obtener el enlace al horario actualizado. Retorna el enlace en formato JSON.

Response:

```json
{
    "title": "Primer Periodo Académico 2023 – Carreras de Grado ",
    "link": "https://www.pol.una.py/wp-content/uploads/Planificacion-de-clases-y-examenes-Primer-Periodo-2023-version-web-22062023.xlsx"
}
```

3. Obtener el horario en formato JSON a partir de los datos en bruto

Endpoint: /api/horario

Método: POST

form-data: file (Tipo Excel)

Response:

```json
[
    {
        "carrera":"IAE",
        "materias":[
           {
                "item": 1,
                "dpto": "DEE",
                "asignatura": "Aerodinámica I (*)",
                "nivel": 6,
                "sem_grupo": "---",
                "sigla_carrera": "IAE",
                "enfasis": "-- --",
                "plan": 2012,
                "turno": "T",
                "seccion": "TQ",
                "plataforma_de_aula_virtual": null,
                "tit": "Ing.\r\nIng.",
                "apellido": "Mendoza Ruiz\r\nMeaurio Barrios",
                "nombre": "Anìbal Antonio\r\nCésar Iván",
                "correo_institucional": null,
                "parcial_1_dia": null,
                "parcial_1_hora": null,
                "parcial_2_dia": null,
                "parcial_2_hora": null,
                "final_1_dia": null,
                "final_1_hora": null,
                "final_2_dia": null,
                "final_2_hora": null,
                "lunes": null,
                "martes": null,
                "miercoles": null,
                "viernes": null,
                "sabado": null,
                "fechas_de_clases_de_sabados_(turno_noche)": null
            },
            {
                "item": 2,
                "dpto": "DEE",
                "asignatura": "Aerodinámica II",
                "nivel": 7,
                "sem_grupo": "---",
                "sigla_carrera": "IAE",
                "enfasis": "-- --",
                "plan": 2012,
                "turno": "T",
                "seccion": "TQ",
                "plataforma_de_aula_virtual": null,
                "tit": "Ing.\r\n",
                "apellido": "Mendoza Ruiz\r\nA CONFIRMAR",
                "nombre": "Anìbal Antonio\r\n",
                "correo_institucional": null,
                "parcial_1_dia": null,
                "parcial_1_hora": null,
                "parcial_2_dia": null,
                "parcial_2_hora": null,
                "final_1_dia": null,
                "final_1_hora": null,
                "final_2_dia": null,
                "final_2_hora": null,
                "lunes": null,
                "martes": null,
                "miercoles": "13:00 - 15:15 (L)",
                "viernes": "13:15 - 17:00",
                "sabado": null,
                "fechas_de_clases_de_sabados_(turno_noche)": null
            },
            {
                "item": 3,
                "dpto": "DEE",
                "asignatura": "Aeronáutica General",
                "nivel": 1,
                "sem_grupo": "---",
                "sigla_carrera": "IAE",
                "enfasis": "-- --",
                "plan": 2012,
                "turno": "M",
                "seccion": "MI",
                "plataforma_de_aula_virtual": null,
                "tit": "Abog.",
                "apellido": "Leguizamón Ovelar",
                "nombre": "Edgar Antonio",
                "correo_institucional": null,
                "parcial_1_dia": null,
                "parcial_1_hora": null,
                "parcial_2_dia": null,
                "parcial_2_hora": null,
                "final_1_dia": null,
                "final_1_hora": null,
                "final_2_dia": null,
                "final_2_hora": null,
                "lunes": null,
                "martes": null,
                "miercoles": null,
                "viernes": null,
                "sabado": "08:00 - 11:45",
                "fechas_de_clases_de_sabados_(turno_noche)": null
            },
        ]
    }
]
```

Descripción: Este servicio convierte el archivo enviado (Excel) en formato JSON para facilitar su visualización y procesamiento.

### Contribuciones

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu contribución: git checkout -b nombre-rama.
3. Realiza los cambios y haz commits: git commit -m "Descripción de los cambios".
4. Haz push a tu rama: git push origin nombre-rama.
5. Crea una solicitud de extracción (pull request) en GitHub.

Obs: No olvides actualizar la documentación si es necesario. (Ya sea en el README.md o en el CHANGELOG.md)

### Licencia

MIT License

Copia (c) [2023] [Matias Ramirez]

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados (el "Software"), para utilizar el Software sin restricciones, incluyendo, entre otras, las siguientes acciones:

- Usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, con sujeción a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADA A GARANTÍAS DE COMERCIALIZACIÓN, ADECUACIÓN PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑO U OTRA RESPONSABILIDAD, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, QUE SURJA DE O EN RELACIÓN CON EL SOFTWARE O EL USO U OTROS TRATOS EN EL SOFTWARE.

### Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme.

Correo electrónico: <ramirezmatias946@gmail.com>
LinkedIn: Matias Sebastian Ramirez Brizuela
