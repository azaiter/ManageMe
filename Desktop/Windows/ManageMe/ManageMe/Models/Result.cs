using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models
{
    public class Result
    {
        public readonly bool Status;
        public readonly string Message;

        public Result(bool status, string message)
        {
            this.Message = message;
            this.Status = status;
        }
    }
}
