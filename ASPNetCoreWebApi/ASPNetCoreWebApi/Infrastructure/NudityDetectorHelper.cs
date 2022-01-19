using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http.Headers;

namespace ASPNetCoreWebApi.Infrastructure
{
    public class NudeImageDetectorHelper
    {
        readonly IConfiguration _configuration;
        public NudeImageDetectorHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<int> IsNudeImage(byte[] image)
        {
            using var client = new HttpClient();
            var apiKey = _configuration.GetValue<string>("DeepaiorgNudeDetectAPIKEY");
            using var httpClient = new HttpClient();
            using var formData = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(image);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("multipart/form-data");
            httpClient.DefaultRequestHeaders.Add("Api-Key", apiKey);
            formData.Add(fileContent, "image", "file.jpg");

            var response = await httpClient.PostAsync("https://api.deepai.org/api/nsfw-detector", formData);
            try
            {
                response.EnsureSuccessStatusCode();
            }
            catch (System.Exception)
            {
                return 0;
            }

            string responseJson = await response.Content.ReadAsStringAsync();
            var responseObject = JsonConvert.DeserializeObject<NudeImageApiResponse>(responseJson);
            if (responseObject.output.detections.Any())
            {
                var retVal = -1;
                foreach (var item in responseObject.output.detections)
                {
                    if (item.name.ToLower().StartsWith("female"))
                    {
                        retVal = -1;
                        break;
                    }
                    if (item.name.ToLower().StartsWith("male"))
                    {
                        retVal = 1;
                        break;
                    }
                }

                return retVal;
            }
            else
            {
                return 0;
            }
        }
    }
}