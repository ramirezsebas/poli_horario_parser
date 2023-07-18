# Horario Parser de Politecnica

Este proyecto fue creado con el objetivo de facilitar el acceso a los datos del horario de la facultad Politécnica de la Universidad Nacional de Asunción.

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

2. Realizar web scraping de la página de la Poli para obtener el enlace del horario
Endpoint: /api/latest_horario

Método: GET

Descripción: Este servicio realiza web scraping en la página de la Politécnica para obtener el enlace al horario actualizado. Retorna el enlace en formato JSON.

3. Obtener el horario en formato JSON a partir de los datos en bruto

Endpoint: /api/horario

Método: POST

Enviar excel como: form-data

Descripción: Este servicio convierte el archivo enviado (Excel) en formato JSON para facilitar su visualización y procesamiento.

### Contribuciones

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu contribución: git checkout -b nombre-rama.
3. Realiza los cambios y haz commits: git commit -m "Descripción de los cambios".
4. Haz push a tu rama: git push origin nombre-rama.
5. Crea una solicitud de extracción (pull request) en GitHub.

### Licencia

Especifica la licencia bajo la cual se distribuye tu proyecto. Por ejemplo, puedes utilizar la licencia MIT o cualquier otra que se ajuste a tus necesidades.

Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme.

Correo electrónico: <ramirezmatias946@gmail.com>
LinkedIn: Matias Sebastian Ramirez Brizuela
