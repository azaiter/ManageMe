using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Models.EventArguments
{
    public class ViewProjectEventArgs : EventArgs
    {
        public long ProjectId;

        public ViewProjectEventArgs(long projectID) : base()
        {
            ProjectId = projectID;
        }
    }
}
