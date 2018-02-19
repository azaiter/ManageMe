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
    public static class User
    {
        public static string Token { get; set; }
        public static string TokenExpire { get; set; }
        public static string UserName { get; set; }
        public static string FirstName { get; set; }
        public static string LastName { get; set; }
        public static string Email { get; set; }

        /// <summary>
        ///  This method logs the user in.
        /// </summary>
        public static async Task<ManageMe.Models.JsonModels.JsonAuthentification> Login(string username, string password)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.manageme.tech");

                var dict = new Dictionary<string, string>();
                dict.Add("username", username);
                dict.Add("password", password);
                var content = new StringContent(JsonConvert.SerializeObject(dict), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/user/login", content);
                string resultContent = await response.Content.ReadAsStringAsync();
                var jObject = new Models.JsonModels.JsonAuthentification();
                try
                {
                    jObject = JsonConvert.DeserializeObject<Models.JsonModels.JsonAuthentification>(resultContent);
                }
                catch (Exception ex)
                {

                }
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
        public static async Task<ManageMe.Models.Result> LogOut()
        {

            return new ManageMe.Models.Result(false, "Error");
        }

        /// <summary>
        ///  This method determines if the user is in a role.
        /// </summary>
        public static async Task<ManageMe.Models.Result> IsInRole(string role)
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

                var dict = new Dictionary<string, string>();
                dict.Add("first_name", firstName);
                dict.Add("last_name", lastName);
                dict.Add("email", email);
                dict.Add("username", username);
                dict.Add("password", password);
                var content = new StringContent(JsonConvert.SerializeObject(dict), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/user/create", content);
                string resultContent = await response.Content.ReadAsStringAsync();
                var jObject = new Models.JsonModels.JsonAuthentification();
                try
                {
                    jObject = JsonConvert.DeserializeObject<Models.JsonModels.JsonAuthentification>(resultContent);
                } catch(Exception ex)
                {

                }
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
