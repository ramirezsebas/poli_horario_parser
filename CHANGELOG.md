# Registro de cambios

Todas las modificaciones notables a la API se documentarán en este archivo.

## [0.1.0] - 2023-07-22

### Agregado

* Backend

    1. Endpoint: /api/carreras
        * Método: GET
        * Descripción: Obtiene todas las carreras disponibles en la facultad Politécnica según sus siglas.
    2. Endpoint: /api/latest_horario
        * Método: GET
        * Descripción: Realiza web scraping en la página de la Politécnica para obtener el enlace al horario actualizado. Retorna el enlace en formato JSON.
    3. Endpoint: /api/horario
        * Método: POST
        * Enviar excel como: form-data
        * Descripción: Convierte el archivo enviado (Excel) en formato JSON para facilitar su visualización y procesamiento.

* Frontend

    1. Página principal
        * Seleccionar o arrastrar el archivo de excel que contiene el horario.
        * Botón de `Procesar` para iniciar el procesamiento del archivo.
        * Seleccionar la carrera que se desea ver con los datos correspondientes.
        * Botones para descargar el horario en formato JSON completo o en formato JSON por carrera.
        * Botón para descargar el excel de la página de la Politécnica.

Ten en cuenta que los endpoints están sujetos a cambios en futuras versiones, por lo que es esencial mantener la documentación actualizada con cualquier modificación.
