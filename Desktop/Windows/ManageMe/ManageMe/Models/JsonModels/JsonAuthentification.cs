using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models.JsonModels
{
    public class JsonAuthentification
    {
        public JsonAuthenticationMessage message { get; set; }
        public bool Status { get; set; }
        public string expire { get; set; }
        public string token { get; set; }

        public JsonAuthentification()
        {
            message = new JsonAuthenticationMessage();
        }
    }
}
