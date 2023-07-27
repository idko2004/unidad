# Unidad
Unidad es un juego parecido al UNO, pero con otras reglas, de hecho, es posible que algunas ya te las conozcas, porque nadie juega al UNO con las reglas oficiales.

Puedes jugar a Unidad directamente en el sitio web [idko.infinityfreeapp.com/unidad](http://idko.infinityfreeapp.com/unidad/index.html) o puedes correr tu propia instancia.

## Instalación
Es necesario tener instaladas las siguientes dependencias:
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
**En la terminal deberán salir instrucciones sobre como conectarse con el navegador.**

## Variables de entorno
Se puede crear un archivo `.env` para definir variables de entorno.

Variables de entorno utilizadas:

- `GAME_PORT`: Puerto en el que se ejecuta el servidor WebSocket al que se accede para jugar. Por defecto es 8765.
- `HTTP_SERVER`: Decide si activar o no el servidor HTTP encargado de enviar los archivos al navegador. Por defecto es 1.
- `HTTP_PORT`: Puerto en el que se ejecuta el servidor HTTP. Por defecto es 8910.
- `DEBUG`: Decide si está permitido enviar información debug a los clientes que la soliciten. Por defecto es 0.

### Debug
Los clientes pueden preguntar por información debug al servidor WebSocket si la variable de entorno está activada.

Para poder acceder a información debug introduzca en el navegador, desde la consola de las herramientas de desarrollador:
```javascript
ws.send(JSON.stringify({ operation: "debug", debug: <debug_type> }))
```
Reemplace `<debug_type>` con `"activeGames"` o `"wsClients"`.