using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WeatherApi.Models
{
    [BsonIgnoreExtraElements]
    public class Weather
    {
/*        
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
*/
        public string location { get; set; }

        public string date { get; set; }        

        public float temperature { get; set; }

        public float rainfall { get; set; }        

        public float wind_speed { get; set; }        
    }

    public class WeatherSansLocation
    {
        public string date { get; set; }        

        public float temperature { get; set; }

        public float rainfall { get; set; }        

        public float wind_speed { get; set; }        
    }
}