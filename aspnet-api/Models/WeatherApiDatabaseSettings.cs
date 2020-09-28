namespace WeatherApi.Models
{
    public class WeatherApiDatabaseSettings : IWeatherApiDatabaseSettings
    {
        public string WeatherCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IWeatherApiDatabaseSettings
    {
        string WeatherCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}