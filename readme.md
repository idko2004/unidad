# Unidad
Unidad es un juego parecido al UNO, pero con otras reglas, de hecho, es posible que algunas ya te las conozcas, porque nadie juega al UNO con las reglas oficiales.

Para jugar a Unidad es necesario que alguien instale el servidor, y el resto en la red local podrá jugar.

## Instalación
Es necesario tener instalados los siguientes programas:
- node.js
- npm
- [git (opcional)](https://git-scm.com/)

Para instalar node.js y npm, es recomendable utilizar [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) en Linux, o [nvs](https://github.com/jasongin/nvs#setup) en Windows.

### 1. Clonar el repositorio
Puedes clonar el repositorio usando git
```
git clone https://github.com/idko2004/unidad.git
```
O puedes descargar un zip con el botón verde de arriba que dice "code".

### 2. Instalar dependencias
Abre una terminal o consola en la carpeta del repositorio. 

> _(En windows, es posible abrir una consola escribiendo `cmd` en la barra de direcciones)_

Ejecuta el comando:
```
npm install
```

## Ejecutar el servidor
Para ejecutar el servidor, abre una terminal y ejecuta:
```
npm start
```
o
```
node main.js
```

Si no salen errores, ya estás listo para jugar.

**En la terminal deberán salir instrucciones sobre como conectarse con el navegador.**

**Es necesario que todos estén en la misma red wifi para jugar.**

## Variables de entorno
Se puede crear un archivo `.env` para definir variables de entorno.

Variables de entorno utilizadas:

- `GAME_PORT`: Puerto en el que se ejecuta el servidor WebSocket al que se accede para jugar. Por defecto es 8765.
- `HTTP_SERVER`: Decide si activar o no el servidor HTTP encargado de enviar los archivos al navegador. Por defecto es 1.
- `HTTP_PORT`: Puerto en el que se ejecuta el servidor HTTP. Por defecto es 8910.
- `DEBUG`: Decide si está permitido enviar información debug a los clientes que la soliciten. Por defecto es 0.
- `PING_RATE`: El tiempo en milisegundos entre pings a los clientes. Por defecto es 15000.

### Debug
Los clientes pueden preguntar por información debug al servidor WebSocket si la variable de entorno está activada.

Para poder acceder a información debug introduzca en el navegador, desde la consola de las herramientas de desarrollador:
```javascript
debug("<type>")
```
Los distintos tipos de debug son:
- `activeGames`: Devuelve los datos de todas las salas.

- `wsclients`: Devuelve todos los clientes de WebSocket.

- `player`: Devuelve la información de un jugador en una sala.

- `room`: Devuelve la información de una sala.

En los casos de `player` y `room` se puede introducir información adicional:
```javascript
debug("player") //Para obtener su propia información.

debug("player", "<username>") //Para obtener la información de un usuario en específico en la misma sala en la sala en la que se encuentra el cliente.

debug("player", ["<roomID>", "<username>"]) //Para obtener la información de un usuario en específico en una sala en específica.


debug("room") //Para obtener información de la sala en la que se encuentra el cliente.

debug("room", "<roomID>") //Para obtener información de una sala en específica.
```
