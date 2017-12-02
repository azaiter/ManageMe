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
        private System.Timers.Timer updateTimer;

        public ProjectList()
        {
            InitializeComponent();
            this.sessionID = "";
            projectType = ProjectTypes.InProgress;
            updateTimer = new System.Timers.Timer();
            updateTimer.AutoReset = true;
            updateTimer.Interval = 5000;
            updateTimer.Elapsed += new System.Timers.ElapsedEventHandler(updateTimer_Elapsed);

        }

        private void updateTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            UpdateList();
        }

        public string SessionID {
            set
            {
                sessionID = value;
            }
        }

        public void Start()
        {
            UpdateList();
            updateTimer.Start();
        }

        public void UpdateList()
        {

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
