using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ASPNetCoreWebApi.Infrastructure
{
    public class Detection
    {
        public string confidence { get; set; }
        public List<int> bounding_box { get; set; }
        public string name { get; set; }
    }

    public class Output
    {
        public List<Detection> detections { get; set; }
        public double nsfw_score { get; set; }
    }

    public class NudeImageApiResponse
    {
        public string id { get; set; }
        public Output output { get; set; }
    }
}
