using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ManageMe.Views.Controls
{
    /// <summary>
    /// Interaction logic for ProjectList.xaml
    /// </summary>
    public partial class ProjectList : UserControl
    {
        private string sessionID;
        private ProjectTypes projectType;

        public ProjectList()
        {
            InitializeComponent();
            this.sessionID = "";
            projectType = ProjectTypes.InProgress;
        }

        public string SessionID {
            set
            {
                sessionID = value;
            }
        }

        public async void UpdateList()
        {
            var projectList = await Utilities.API.GetProjects(sessionID);

            stackPanelProjects.Children.Clear();

            foreach (Models.JsonModels.JsonProject p in projectList)
            {
                stackPanelProjects.Children.Add(new ProjectListItem() { ProjectName = p.name, ProjectCompany = p.name , Progress = (new Random().NextDouble() * 100), Deadline = DateTime.Now.AddDays(7) });
            }
        }

        public ProjectTypes ProjectType
        {
            set
            {
                projectType = value;
            }
        }
    }

    public enum ProjectTypes {
        Pending,
        InProgress,
        Completed
    }
}
