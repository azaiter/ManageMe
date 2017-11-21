using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models.JsonModels
{
    public class JsonAuthenticationMessage
    {
        public string password { get; set; }
        public string email { get; set; }
        public string username { get; set; }
    }
}
