using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


namespace WebApi_1.Controllers
{
    [ApiController]
    [Route("/api/Movies")]
    public class MoviesController : ControllerBase
    {
        
        public MoviesController()
        {
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            List<string> movies = new List<string>(){"hola","chau",id.ToString()};
            return Ok(movies);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            List<string> movies = new List<string>(){"hola","chau"};
            
            return Ok(movies);
        }


        [HttpPost]
        public IActionResult Post([FromBody]object movie)
        {
            
            try{
                //algun.Save(movies)
                return CreatedAtAction("Get", new { id   = 1 },movie);
            }catch(System.Exception)
            {
                return BadRequest();
            }
        }
    }
}
