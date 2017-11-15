using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models
{
    class Result
    {
        public readonly bool Status;
        private readonly string Message;

        public Result(bool status, string message)
        {
            this.Message = message;
            this.Status = status;
        }
    }
}
