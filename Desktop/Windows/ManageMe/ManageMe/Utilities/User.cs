using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Utilities
{
    /// <summary>
    ///  This class maintains user session state.
    /// </summary>
    public class User
    {
        public string sessionState = "";
        public string userName = "";
        public string firstName = "";
        public string lastName = "";
        public string email = "";

        /// <summary>
        ///  This method logs the user in.
        /// </summary>
        public async Task<ManageMe.Models.JsonModels.JsonAuthentification> Login(string username, string password)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.manageme.tech");
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("username", username),
                    new KeyValuePair<string, string>("password", password)
                });

                var response = await client.PostAsync("/user/login", content);
                string resultContent = await response.Content.ReadAsStringAsync();
                var jObject = JsonConvert.DeserializeObject<Models.JsonModels.JsonAuthentification>(resultContent);
                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    jObject.Status = true;
                }
                else
                {
                    jObject.Status = false;
                }
                return jObject;
            }
        }

        /// <summary>
        ///  This method logs the user out.
        /// </summary>
        public async Task<ManageMe.Models.Result> LogOut()
        {

            return new ManageMe.Models.Result(false, "Error");
        }

        /// <summary>
        ///  This method determines if the user is in a role.
        /// </summary>
        public async Task<ManageMe.Models.Result> IsInRole(string role)
        {
            return new ManageMe.Models.Result(false, "Error");
        }

        /// <summary>
        ///  This method regesters a user.
        /// </summary>
        public static async Task<ManageMe.Models.JsonModels.JsonAuthentification> Register(string username, string password, string firstName,string lastName,string email)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.manageme.tech");
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("first_name", firstName),
                    new KeyValuePair<string, string>("last_name", lastName),
                    new KeyValuePair<string, string>("email", email),
                    new KeyValuePair<string, string>("username", username),
                    new KeyValuePair<string, string>("password", password)
                });

                var response = await client.PostAsync("/user/create", content);
                string resultContent = await response.Content.ReadAsStringAsync();
                var jObject = JsonConvert.DeserializeObject<Models.JsonModels.JsonAuthentification>(resultContent);
                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    jObject.Status = true;
                }
                else
                {
                    jObject.Status = false;
                }
                return jObject;
            }
        }
    }
}
