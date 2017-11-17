using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Utilities
{
    public static class Utilities
    {
        public static bool CheckPasswords(string password, string confirmPassword)
        {
            return password == confirmPassword;
        }

        public static bool CheckPasswordStrength(string password)
        {
            return true;
        }
    }
}
