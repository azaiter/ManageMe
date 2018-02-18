using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models
{
    public class Requirement
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Models.Comment> Comments { get; set; }
        public List<Models.File> Files { get; set; }
        public double Spent { get; set; }
        public double Cost { get; set; }
        public string Team { get; set; }
        public double Progress
        {
            get
            {
                try
                {
                    return Spent / Cost;
                }
                catch { }

                return 0;
            }
            set
            {

            }
        }
    }
}
