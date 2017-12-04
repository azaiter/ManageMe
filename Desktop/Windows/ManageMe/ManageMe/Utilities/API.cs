using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Utilities
{
    static class API
    {
        public static async  Task<List<Models.JsonModels.JsonProject>> GetProjects(string sessionId)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.manageme.tech");

                var dict = new Dictionary<string, string>();
                dict.Add("token", sessionId);
                var content = new StringContent(JsonConvert.SerializeObject(dict), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/project/get", content);
                string resultContent = await response.Content.ReadAsStringAsync();
                var jObject = new List<Models.JsonModels.JsonProject>();
                try
                {
                    jObject = JsonConvert.DeserializeObject<List<Models.JsonModels.JsonProject>>(resultContent);
                }
                catch (Exception ex)
                {

                }
                return  jObject;
            }
        }

        public static async Task<bool> CreateProject(string sessionId, string name, string desc)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.manageme.tech");

                var dict = new Dictionary<string, string>();
                dict.Add("token", sessionId);
                dict.Add("project_name", name);
                dict.Add("project_desc", desc);
                var content = new StringContent(JsonConvert.SerializeObject(dict), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/project/create", content);
                string resultContent = await response.Content.ReadAsStringAsync();
                return response.StatusCode == System.Net.HttpStatusCode.OK;
            }
        }
    }
}
