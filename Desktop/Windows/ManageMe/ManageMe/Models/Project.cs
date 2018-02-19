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
        public string Company { get; set; }
        public double Spent { get; set; }
        public double Cost { get; set; }
        public DateTime DueDate { get; set; }
        public int DaysRemaining { get { return (DueDate - DateTime.Now).Days; } }
        public List<Models.Comment> Comments { get; set; }
        public List<Models.File> Files { get; set; }
        public List<Models.Requirement> Requirments;
        public double Progress { get; set; }
    }
}
