using WeatherApi.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace WeatherApi.Services
{
    public class WeatherService
    {
        private readonly IMongoCollection<Weather> _weathers;

        public WeatherService(IWeatherApiDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _weathers = database.GetCollection<Weather>(settings.WeatherCollectionName);
        }

        public List<string> GetLocations() => 
            _weathers.Distinct<string>("location", FilterDefinition<Weather>.Empty).ToList();

        public List<Weather> GetLocationData(string location) {
            var filterBuilder = Builders<Weather>.Filter;
            var filter = filterBuilder.Eq("location", location) & filterBuilder.Ne<string>("date", null);
            var result = _weathers.Find(filter).ToList();
            return result;
        }

        public UpdateResult AddLocation(string location) {
            var filter = Builders<Weather>.Filter.Eq("location", location);
            var update = Builders<Weather>.Update.Set("location", location);

            var options = new UpdateOptions();
            options.IsUpsert = true;
            var result = _weathers.UpdateOne(filter,update,options);
            return result;
        }

        public void SaveAll(string location, List<WeatherSansLocation> data) {
            var filter = Builders<Weather>.Filter.Eq("location", location);
            _weathers.DeleteMany(filter);

            var dataAvecLocation = new List<Weather>();

            if(data.Count == 0) {
                dataAvecLocation.Add( new Weather() { location = location } );
            } else {
                dataAvecLocation = data.Select( x => new Weather() 
                                    { 
                                        location = location,
                                        date = x.date,
                                        temperature = x.temperature,
                                        rainfall = x.rainfall,
                                        wind_speed = x.wind_speed
                                    } ).ToList();
            }
            _weathers.InsertMany(dataAvecLocation);
        }

        public void DeleteLocation(string location) {
            var filter = Builders<Weather>.Filter.Eq("location", location);
            _weathers.DeleteMany(filter);
        }
    }
}