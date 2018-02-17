using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models
{
    public class Comment
    {
        public DateTime Submitted { get; set; }
        public string SubmittedBy { get; set; }
        public string Content { get; set; }
    }
}
