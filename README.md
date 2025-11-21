# PreParcial 2 - William Pollock

## 1. Cómo ejecutar el proyecto
- Descargar Node.js
- descargar npm
- tener MongoDB local o en la nube (yo usé Compass y Community Server)

En cuanto a su instalación, se hace lo siguiente:
- Clonar el repositorio a través de Github
- Cuando ya se haya abierto, ingresar en la terminal 'cd travel-planner'
- Después ingresar en la terminal 'npm install'

Para configurar la base de datos, se debe crear un archivo en la raíz del proyecto con 'mongodb://localhost:27017/travel-planner'

Para ejecutar la API, se debe ingresar el comando 'npm run start:dev' en la terminal y quedará disponible en 'http://localhost:3000'

## 2. Descripción de API
La API tiene un módulo de países y otro de planes de viaje:
CountriesModule:
- Gestiona países
- Usa un provider externo para consultar RestCountries
- Guarda los países en Mongo como caché

TravelPlansModule:
- Gestiona planes de viaje
- Cada plan está asociado a un país
- Reutiliza lógica de caché del módulo de países antes de guardar un plan

## 3. Modelo de datos
Country:
- code (string): código alpha-3, p. ej. "COL", "FRA".
- name (string): nombre del país.
- region (string): región (p. ej. "Americas", "Europe").
- subregion (string): subregión.
- capital (string): capital del país.
- population (number): población.
- flagUrl (string): URL de la bandera.
- createdAt, updatedAt (Date): timestamps automáticos.

TravelPlan:
- _id (ObjectId): identificador del plan.
- countryCode (string): código alpha-3 del país destino.
- title (string): título o nombre del viaje.
- startDate (Date): fecha de inicio.
- endDate (Date): fecha de fin.
- notes (string, opcional): notas o comentarios.
- createdAt, updatedAt (Date): timestamps.

## 4. Endpoints implementados
Countries:
- GET /countries (Devuelve todos los países almacenados en la base de datos/caché)
Ejemplo de respuesta:
[
  {
    "_id": "....",
    "code": "COL",
    "name": "Colombia",
    "region": "Americas",
    "subregion": "South America",
    "capital": "Bogotá",
    "population": 53057212,
    "flagUrl": "https://flagcdn.com/w320/co.png",
    "createdAt": "2025-11-20T...",
    "updatedAt": "2025-11-20T...",
    "__v": 0
  }
]

- GET /countries/:code (Busca el país por su código alpha-3)
Si el país ya está en la base de datos, lo devuelve con:
{
  "source": "cache",
  "country": { ... }
}

Si no está en la base de datos:
{
  "source": "external",
  "country": { ... }
}

Travel Plans:
- POST /travel-plans (Crea un nuevo plan de viaje)
Ejemplo de Body (para ingresar en Postman como JSON):
{
  "countryCode": "FRA",
  "title": "Viaje a París",
  "startDate": "2025-07-01",
  "endDate": "2025-07-10",
  "notes": "baguette"
}

Ejemplo de respuesta:
{
  "_id": "....",
  "countryCode": "FRA",
  "title": "Viaje a París",
  "startDate": "2025-07-01T00:00:00.000Z",
  "endDate": "2025-07-10T00:00:00.000Z",
  "notes": "baguette",
  "createdAt": "2025-11-20T...",
  "updatedAt": "2025-11-20T...",
  "__v": 0
}

- GET /travel-plans (Devuelve todos los planes de viaje registrados)
- GET /travel-plans/:id (Devuelve un plan de viaje específico por su ID)

## 5. Provider externo (RestCountries)
La API externa RestCountries se consume a través de un provider especializado, no directamente desde el servicio de países.
Se define una interfaz 'CountryInfoProvider' con una operación 'getCountryByAlpha3' dentro de 'country-info-provider.interface.ts'.
RestCountriesService implementa esta interfaz usando HttpService y la API 'https://restcountries.com/v3.1'.
Este provider se registra en el módulo de países y se inyecta en CountriesService usando un token (COUNTRY_INFO_PROVIDER).
Así, el módulo de países no depende de detalles de infraestructura (URLs, JSONs, etc.) sino de una abstracción.

## 6. Pruebas básicas
Se pueden hacer las siguientes pruebas usando Postman:

- País no cacheado --> externo:
'GET /countries/FRA'

La primera vez debe devolver "source": "external".

- País cacheado --> local:

Volver a llamar: 'GET /countries/FRA'

Ahora debe devolver "source": "cache" y se puede ver desde Mongo.

- Crear plan de viaje:

'POST /travel-plans' con un código válido (por ejemplo, "FRA" o "COL").

Verificar que:

Devuelva 201/200 con el plan creado (puse un Body JSON de ejemplo en la sección de 'Endpoints implementados' por si acaso)

El plan aparezca luego en 'GET /travel-plans'.

- Consultar un plan específico:

Tomar el _id del plan creado.

'GET /travel-plans/<id>' --> debería devolver ese plan.