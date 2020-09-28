using WeatherApi.Models;
using WeatherApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace WeatherApi.Controllers
{

    public class AddLocationRequest {
        public string location { get; set; }
    }

    public class SaveAllRequest {
        public string location { get; set; }
        public List<WeatherSansLocation> data { get; set; }
    }

    [Route("/")]
    [ApiController]
    public class WeathersController : ControllerBase
    {
        private readonly WeatherService _weatherService;

        public WeathersController(WeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpGet("location/all")]
        public ActionResult<List<string>> Get() {
            var locations = _weatherService.GetLocations();

            if (locations == null) {
                return NotFound();
            }

            return locations;
        }

        [HttpGet("data/{location}")]
        public ActionResult<List<Weather>> Get(string location) {
            var data = _weatherService.GetLocationData(location);

            if (data == null) {
                return NotFound();
            }

            return data;
        }        

        [HttpPost("location/new")]
        public IActionResult Post(AddLocationRequest req)
        {
            _weatherService.AddLocation(req.location);
            return NoContent();
        }

        [HttpPost("data/save")]
        public IActionResult Post(SaveAllRequest req)
        {
            _weatherService.SaveAll(req.location, req.data);
            return NoContent();
        }

/*
        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var weather = _weatherService.Get(id);

            if (weather == null)
            {
                return NotFound();
            }

            _weatherService.Remove(weather.Id);

            return NoContent();
        }
*/        
    }
}