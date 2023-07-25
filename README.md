# China APP

# API de Tracking Numbers

Una API para gestionar tracking numbers de envíos.

## Configuración

Antes de comenzar, asegúrate de tener instalado Node.js y MySQL. También crea un archivo `.env` en la raíz del proyecto para configurar las variables de entorno, tal como se muestra en el siguiente ejemplo:

DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=nombre_de_tu_base_de_datos

Instala las dependencias del proyecto:

npm install

Instala las dependencias del proyecto:

## Iniciar la API

Para iniciar la API, ejecuta el siguiente comando:

La API estará disponible en `http://localhost:3000`.

## Endpoints

### Agregar un nuevo tracking number

- URL: `POST /add`
- Descripción: Agrega un nuevo tracking number a la base de datos. El `deliverydate` se generará automáticamente con la fecha actual.
- Cuerpo de la solicitud (JSON):
  ```json
  {
    "trackingnumber": "TN123456789"
  }
  ```

Respuesta exitosa (201 Created):
{
"message": "El tracking number se ha agregado correctamente"
}

Actualizar el deliverydate de un tracking number
URL: PUT /actualizar/:trackingnumber
Descripción: Actualiza el deliverydate de un tracking number existente.
Parámetro de la URL:
trackingnumber: El tracking number que deseas actualizar.
Cuerpo de la solicitud (JSON):

{
"deliverydate": "2023-07-21"
}

Respuesta exitosa (200 OK):
{
"message": "El deliverydate se ha actualizado correctamente"
}

Respuesta de error (404 Not Found):
{
"message": "El tracking number no existe en la base de datos"
}

# Actualizar el shipmentdate en tracking numbers sin shipmentdate

URL: PUT /update/shipmentdate
Descripción: Actualiza el shipmentdate en aquellos tracking numbers que tienen deliverydate pero no tienen shipmentdate. El shipmentdate se establecerá como la fecha actual.
Respuesta exitosa (200 OK):

{
"message": "El shipmentdate se ha actualizado correctamente"
}

Consultar el estado de un tracking number
URL: GET /consultar/:trackingnumber
Descripción: Consulta el estado de un tracking number en la base de datos. Si tiene deliverydate y/o shipmentdate, la respuesta mostrará la fecha correspondiente.
Parámetro de la URL:
trackingnumber: El tracking number que deseas consultar.
Respuesta exitosa (200 OK):

{
"message": "El paquete ha sido entregado y embarcado",
"deliverydate": "2023-07-21",
"shipmentdate": "2023-07-15"
}

Respuesta cuando el paquete no ha sido entregado (404 Not Found):

{
"message": "El paquete no ha sido entregado"
}

# Contribuciones

Si encuentras algún problema o tienes sugerencias de mejora, no dudes en abrir un problema o enviar un pull request.

# Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

````
```
[
{
"trackingnumber": "TN123456789",
"deliverydate": "2023-07-21",
"shipmentdate": "2023-07-15"
},
{
"trackingnumber": "TN987654321",
"deliverydate": "2023-07-25",
"shipmentdate": "2023-07-18"
},
{
"trackingnumber": "TN567890123",
"deliverydate": "2023-07-28",
"shipmentdate": "2023-07-20"
}
]


{
  "trackingnumber": "TN123456789"
}
```
````
