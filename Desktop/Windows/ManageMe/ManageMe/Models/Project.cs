using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models
{
    public class Project
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Models.Comment> Comments { get; set; }
        public List<Models.File> Files { get; set; }
        public List<Models.Requirement> Requirments;
    }
}
