
# Web API

En esta sección, explicaremos los conceptos asociados a API, API REST y Web API, para luego ver como se implementa en ASP .NET Core Web API.

### ¿Qué es una API?

Una API (application programming interface) es un conjunto de definiciones, protocolos y herramientas para crear software y aplicaciones. Estas son ofrecidas por un software para ser utilizado por *otro* software, ofreciendo así una capa de abstracción.

En términos más simples, una API es un tipo de interfaz la cual tiene un conjunto de funciones que permite a los desarrolladores acceder a un conjunto especifico de funcionalidades o información de una aplicación, sistema operativo, librería, u otro servicio.

### ¿Qué es una Web API?

Una Web API, como su nombre indica, es una API en la web que utiliza el protocolo HTTP. Para acceder a esta API, se utiliza una URL (`https://x.com/a/b`). La información que se envía y recibe en estas APIs son en algún formato específico, como XML o JSON (el cual usaremos en este curso y es el standard actual).

Es un concepto y no una tecnología. Se puede crear una API Web usando distintas tecnologías como Java, JavaScript, .NET, etc. Un ejemplo de una API Web es la de [`Twitter`](https://developer.twitter.com/en/docs/twitter-api), la cual permite obtener información de los datos e integrarse con la plataforma misma.

Existen varios conceptos asociados a las Web APIs, como endpoints, REST, entre otros, que veremos más adelante en este documento. 

### ¿Qué es ASP .NET Core Web Api?

`ASP .NET Core Web Api` es el framework creado por Microsoft que corre sobre .NET Core. Es un framework extensible para crear servicios basados en HTTP REST, los cuales pueden ser accedidos mediante la web. Cuenta con varias características modernas que hacen la vida del desarrollador más fácil:

* Orientado a APIs REST
* Parseo automático a JSON customizable
* Herramientas de autenticación
* Definición simple de rutas en el código
* Tooling en varias plataformas para que el desarrollo sea cómodo y fácil

## ¿Qué es REST? Diseño de APIs

REST es un estilo arquitectónico que define guías de cómo hacer y cómo restringir los servicios Web y las interacciones con ellos.

Es importante aclarar que REST, en su condición de estilo arquitectónico, no es un estándar estricto, si no que permite flexibilidad. Debido a esta libertad y flexibilidad es importante definir buenas prácticas.

REST sirve como guía para definir como nombrar los recursos web y como utilizarlos. Esta interacción es fuertemente basada en herramientas del protocolo HTTP. Por ejemplo, REST da una recomendación de los verbos (`GET`, `POST`, etc.) a utilizar en cada caso. 

Cabe aclarar que REST son recomendaciones de cómo debemos implementar, son una guía, pero pueden existir casos específicos donde hay que romper estas convenciones. Lo importante es tener claro el por qué, qué es lo que se está buscando y mantener estos casos al mínimo posible. 

A continuación, definiremos una guía de diseño para APIs basada fuertemente en REST, mostrando algunas las recomendaciones y limitaciones de REST.

### Todas las requests son "stateless". No se mantiene estado del lado del servidor

Todo el estado (es decir, información necesaria para llevar a cabo una acción) tiene que estar del lado de la request (ya sea en la url, como parámetro, como header) y no del lado del servidor. 

Esto nos permite independizarnos del estado del servidor. No importa si tenemos muchos, si este se cae y se levanta de vuelta, nuestra request será recibida y procesada de la misma manera. 

A su vez, mantener estado del lado del servidor nos puede brindar problemas a la hora de tener que atender muchas solicitudes a la vez.

### Siempre usar sustantivos, nunca verbos.

Dentro de las url de una API REST, deben evitarse los verbos y preferir los sustantivos. 

**Mantener la url base lo más simple e intuitiva posible**

Una URL base que sea simple e intuitiva hace que utilizar la API sea simple. Si mediante la URL se puede entender que hace la API sin necesitar ningún tipo de documentación extra, será más simple de ser utilizada.

Algo que mantiene la simplicidad es intentar tener solo 2 URLs por recurso. Tomemos el ejemplo de una api que maneja perros. Para los perros, deberíamos tener solo 2 urls:

* `/dogs` que representa todos los perros del sistema
* `/dogs/123456` que representa a un perro especifico en el sistema

**Mantener los verbos fuera de la URL:**

Tener verbos en las URLs lleva a que, cuando una API va creciendo, se terminen teniendo demasiados endpoints innecesariamente. Aunque pueda haber pocos recursos, es difícil representar todos los estados posibles con verbos.

Por ejemplo, siguiendo con el caso de los perros. Si representamos todo con verbos, podemos terminar con casos así:

* `/getAllLeashedDogs`: Los perros que tenga una correa. Debería haber sido una url que obtenga todos los perros y reciba un parámetro para filtrar.
* `/getHungerLevel`: `Hunger` debería ser un atributo que se obtenga del perro, no es necesario una url solo para esto.

Y así pueden haber muchos más casos.

**Utilizar los verbos HTTP para representar las acciones:**

Si tomamos nuevamente el caso de los perros tenemos dos URLs: `/dogs` y `/dogs/123456`. Para operar sobre ellos, es decir, actualizarlos, obtenerlos, crearlos, etc., utilizamos los verbos HTTP. Estos son

* `GET`
* `POST`
* `PUT`
* `DELETE`

Estos generalmente se utilizan para expresar los que se llama `CRUD` de un recurso (**C**reate, **R**ead, **U**pdate, **D**elete).

Con las dos URLs de recursos (`/dogs` y `/dogs/123456`) en conjunto con los 4 verbos HTTP, tenemos un conjunto de operaciones que es intuitivo para los usuarios de la API. A continuación, se muestra cómo funcionan estas combinaciones:

|                  |      POST (crear)    |  GET (obtener)  |   PUT (modificar)   |   DELETE (borrar)  |
| ---------------- |:-------------:|:-----:|:-----:|:-----:|
| **`/dogs`**      |   Crear un nuevo perro     |  Obtener todos los perros  |   Actualizar un conjunto de perros a la misma vez   |   Borrar todos los perros   |
| **`/dogs/123456`** |   Error    |  Devolver perro con id 123456  |  Si existe perro con id 123456, actualizarlo, si no error   |  Borrar perro con id 123456, si no existe error  |

Debido a que esto es intuitivo y conocido por todos los desarrolladores, esta tabla ni siquiera es necesaria después. Alguien puede saber cómo funciona la API sin ninguna documentación.

### ¿Plural o singular? ¿Qué tanta abstracción?

Dijimos previamente que se deben utilizar sustantivos, pero no especificamos si debían ser en plural o en singular. 

A pesar de que no hay una decisión específica sobre esto, la intuición lleva a pensar que es mejor tener los recursos en plural. Los recursos quedan más fáciles de leer, y como generalmente los endpoints más utilizados son los GET, estos quedan más claro con plural. `GET /dogs` obtiene los perros, `GET /dogs/1234` obtiene de los perros, el de id `1234`.

Lo más importante es mantener la consistencia. Nunca mezclar singular con plural. La inconsistencia hace que la API no sea predecible y sea más difícil de usar.

**Los nombres concretos son mejor que los abstractos:**

A pesar de que los desarrolladores siempre están buscando un nivel de abstracción más alto, en los casos de los recursos en una API REST, se debe preferir los nombres concretos.

Imagínense que tenemos una api que tiene perros, gatos, pájaros, etc. Uno podría pensar que una buena abstracción es tener una sola url `/animals`. Sin embargo, esto termina siendo contraproducente:

* No se ve que hace la API con ver sus urls. Nos perdemos de la oportunidad de que un usuario de la API vea las urls y sepa que nuestro sistema maneja específicamente perros, gatos y pájaros.
* Resulta más difícil de utilizar la API, ya que no se sabe específicamente que puede contener la respuesta.

### Simplificar las asociaciones. Utilizar el ? para ocultar la complejidad

**Asociaciones**

En todos los sistemas siempre hay asociaciones entre recursos. A tiene una lista de B, B tiene una instancia de C. ¿Cómo podemos expresar estas asociaciones en las urls? 

Seguiremos con nuestro ejemplo de los perros. Imaginémos que tenemos dueños de estos perros. Queremos hacer una request a la API que me devuelva todos los perros de un dueño. Lo podemos representar de la siguiente manera

`GET /owners/1234/dogs`

Esto se puede leer de la siguiente manera: Del owner con id 1234, devolver todos los perros. Esto resulta intuitivo de leer y un usuario de la API lo puede entender simplemente de leer la URL.

Análogamente, para crear un perro para un owner especifico, podes utilizar la siguiente URL.

`POST /owners/1234/dogs`.

Es importante aclarar que hay que evitar llegar a demasiados niveles de relaciones "para adentro" ya que termina siendo confuso leerlo.

**Esconder complejidad detrás del ?**

Generalmente, las APIs toman en cuenta varios atributos cuando se hace una request, como pueden ser filtros, parámetros, etc. Por ejemplo, cuando se hace una consulta a `GET /dogs`, se puede querer obtener **solo** los perros que tengan color rojo, y estén corriendo. 

Estos parámetros (color y state pueden ser llamados) deben ser enviados como parámetros después del `?`, conocidos como query params.

Por ejemplo, la request puede ser así:

`GET /dogs?color=red&state=running&location=park`

### ¿Cómo se manejan las operaciones que no están relacionadas a recursos específicos?

Hasta ahora, estuvimos viendo como manejar recursos especificos. `Dog` es un recurso que representa una entidad en el sistema, que debe ser accedido, modificado, creado, etc.

Que pasa si tenemos que hacer algun tipo de calculo o funcion en nuestra API. Por ejemplo, hacer algun tipo de calculo financiero complejo, o hacer una traduccion de un lenguaje a otro. Ninguna de estas acciones se representa por un recurso. Estas acciones responden un resultado, no un recurso.

En este caso, es necesario usar verbos y no sustantivos. Es importante mantener estos verbos lo más simple posible. Por ejemplo, si tendriamos que tener un endpoint para convertir de una moneda a otra, se podria hacer de la siguiente manera:

`/convert?from=EUR&to=CNY&amount=100`

Esto convierte 100 euros a yuanes.

Es importante que estos endpoints sean documentados correctamente, especificando sus parámetros y su comportamiento. Dado que no es estandard, un usuario de la API no sabra como se comporta fácilmente.

### Manejo de errores

El manejo de errores es un aspecto critico de una buena API. Es muy importante poder explicarle al usuario de la API porque una request fallo, y brindarle toda la información necesaria para que pueda solucionarlo.

**Usar HTTP Codes**

Es importante usar los HTTP codes en las situaciones adecuadas para seguir un standard. Existen sobre 70 [codigos](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes), aunque solo un subconjunto es utilizado comunmente.

*Cuantos usar?*

Si se analiza los posibles flujos que pueden haber cuando se ejecuta un endpoint, hay solo 3:

* Todo anduvo correctamente - Exito
* El usuario hizo algo mal - Error del cliente
* La API hizo algo mal - Error de la API

Cada uno de estos se puede representar con los 3 siguientes codigos:

* **200** - OK
* **400** - Bad Request
* **500** - Server Error

A partir de esto, se pueden agregar los que se consideren necesarios. **201 - Created** es un codigo muy utilizado cuando se crea un elemento de un recurso. **401 - Unauthorized** tambien es muy utilizado, cuando el usuario no tiene permisos para realizar esa operacion.

**Retornar mensajes lo más expresivos posibles**

Mientras más expresivo y más información se le brinde al usuario, más fácil sera de usar la API.

Siempre sera peor tener:

`{"code" : 401, "message": "Authentication Required"}`

que:

```
{
    "developerMessage" : "Verbose, plain language description of the problem for the app developer with hints about how to fix it.",
    "userMessage": "Pass this message on to the app user if needed.",
    "errorCode" : 12345,
    "more info": "http://dev.teachdogrest.com/errors/12345"
}
```

En el segundo ejemplo, se brinda información descriptiva, se sabe donde ir a buscar más información sobre el error, y se brinda un mensaje que se le puede mostrar a un usuario.

## Como implementa esto `ASP .Net Core Web API`

A continuacion vamos a ver como implementa todos estos conceptos ASP .NET Core Web API.

Cuando creamos un proyecto Web API de ASP .NET core, se nos crea el proyecto con un Controlador de ejemplo. Este no tiene ninguna funcionalidad "real" si no que es para mostrar como funciona y poder hacer una rapida prueba. Lo utilizaremos para explicar los conceptos principales.

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Homeworks.WebApi.Controllers
{
    [Route("api/[controller]")] // 2
    [ApiController] // 3
    public class ValuesController : ControllerBase // 1
    {
        // GET api/values
        [HttpGet] // 4
        public ActionResult<IEnumerable<string>> Get() // 5
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")] // 6
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value) // 7
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
```

**--`public class ValuesController : ControllerBase` // 1**

Lo primero que debemos explicar es que es un controlador. Un `Controller` es una clase que se encarga de definir cada una de las rutas con la cual se puede acceder a un recurso especifico. Se pueden tener varios en la aplicacion, y tienen que heredar de `ControllerBase`. Una buena practica que hay que seguir es tener un `Controller` para cada uno de los recursos. Es decir, si nuestro sistema maneja `Usuarios` y `Animales`, se debe tener un Controller que se encarge del manejo de `Animales`, y otro Controller que se encarge del manejo de `Usuarios`.

**-- `[Route("api/[controller]")]` // 2**

La primera anotacion que veremos sera `Route`. Esta se utiliza para indicar a que url debe responder este controlador. Es una anotacion que se pone encima de la clase. Es decir, si se pone `[Route("api/testing")]` encima de un controlador, todos los metodos de adentro del controlador seran llamados con la url `{url}/api/testing/{resto la url}`, siendo resto de la url lo indicado (o no) por cada metodo.

En este caso, estamos utilizando `[Route("api/[controller]")]`. Esto indica que se utilice el nombre del controlador dentro de la url. Por ejemplo, en este caso, el controlador se llama `ValuesController`. La ruta que utilizara para este controlador sera `{url}/api/values`. Basicamente, si el Controller se llama `XController`, se remueve el controller y se utiliza `{url}/api/X`.

**-- `[ApiController]` // 3**

La siguiente anotacion es simple. Tambien se pone a nivel de clase y le indica a ASP .NET Core que esta clase es un controller.

**-- `[HttpGet]` // 4**

La siguiente notacion que vemos es `[HttpGet]`. Esta se pone a nivel de metodo, e indica que este metodo sera llamado cuando se utilice el verbo `GET` de HTTP en la url del controlador. En este caso, cuando se haga la request `GET {url}/api/values` se llamara al metodo `Get()`. 

Cada uno de estos metodos que definimos, al cual se accede mediante una ruta con un verbo HTTP, es lo que llamamos **endpoint**. Un endpoint es un punto de entrada a la API, ya sea para recibir o enviar datos.

**-- `public ActionResult<IEnumerable<string>> Get()` // 5**

Aca veremos el retorno de una funcion de un controlador. En una API,cuando se retorna de una funcion, existen varias cosas que se retornan. 

* Primero, los datos solicitados en si, como pueden ser los valores del `Get()` en este caso. 
* Segundo, se retorna un codigo HTTP que da más información sobre el resultado. Este puede ser un 400 si es un error, un 200 si es exitoso, 404 no encontrado, y un sin fin más de codigos HTTP que representan una cosa
* Tercero y ultimo, se retornan headers de una request HTTP, los cuales se utilizan para brindar otra información.

Existen 4 retornos posibles para un metodo de un endpoint:

**Tipo especifico:** 
Se retorna un tipo en particular, como por ejemplo, `IEnumerable<string>` o un `string`. El resultado es transformado en un JSON y se envia con un codigo de ejecucion exitosa (200).

**IActionResult:**
`ASP .NET Core` brinda varias ayudas para esto. Por ejemplo, existen varios metodos que retornan una respuesta adecuada, a la cual se le puede pasar la información que queremos devolver. Alguns de los más usados de estos son:

* `Ok(data)` que retorna una respuesta exitosa con un codigo 200. La data enviada como parámetro es transformada a JSON y devuelta (puede ser omitido y retornar vacio)
* `NotFoundResult()` que reotrna un codigo 404 por no haber encontrado un recurso
* `BadRequestResult()` que retorna un codigo 400, que hay un error en la request (puede ser por datos invalidos o cualquier otra razon). Si se pasa un string u objeto como parámetro, sera enviado como respuesta.

**ActionResult<T>:**

Funciona de manera muy similar, brindando mayor fácilidad a la hora de generar las respuestas, ya que se puede retornar tanto un IActionResult como el tipo especifico T. 


Se puede ver más del retorno de una API [aqui](https://docs.microsoft.com/en-us/aspnet/core/web-api/action-return-types?view=aspnetcore-2.2)

**-- `[HttpGet("{id}")]` // 6**

Aca se puede ver como se puede definir la ruta del endpoint mediante la anotacion `[HttpGet]`. El string que se le pasa como parámetro se debe agregar a la ruta para llamar a este endpoint especifico. 

Es decir, si tenemos un metodo con `[HttpGet("another")]` en un Controller que tiene `[Route("api/testing")]`, para llamar al endpoint se debe usar la url `GET {url}/api/testing/another`. 

En este caso, vemos que en la url se encuentra `{id}`. Cuando esta entre llaves `{x}` indica que este valor debe ser pasado como parámetro a la funcion. La funcion debe recibir como parámetro este valor, con el tipo adecuado y el mismo nombre que se definio en la url. 

Por ejemplo, si se utiliza la url `GET {url}/api/values/5`, se llamara a este metodo y se enviara como parámetro a la funcion el valor 5.

**-- `public void Post([FromBody] string value)` // 7**

Por ultimo, aca se puede ver como obtener la información que es enviada en el body de la request. Se le agrega el atributo `[FromBody]` a un parámetro, y se intentara parsear el JSON del body, crear un elemento del tipo del parámetro, y llamar a la funcion con el. 


# Más información

* El libro API Design EBook, que se encuentra en el curso de aulas.
