using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
    /// Interaction logic for ProjectListItem.xaml
    /// </summary>
    public partial class ProjectListItem : UserControl
    {
        private int id;

        public ProjectListItem()
        {
            InitializeComponent();
            id = 0;
        }

        public string ProjectName
        {
            set
            {
                textBlockProjectName.Text = value;
            }
            get
            {
                return textBlockProjectName.Text;
            }
        }

        public string ProjectCompany
        {
            set
            {
                textBlockProjectCompany.Text = value;
            }
            get
            {
                return textBlockProjectCompany.Text;
            }
        }

        public double Progress
        {
            set
            {
                progressBarProgress.Value = value;
            }
            get
            {
                return progressBarProgress.Value;
            }
        }

        public string ProgressText
        {
            set
            {
                textBlockProgress.Text = value;
            }
            get
            {
                return textBlockProgress.Text;
            }
        }

        public DateTime Deadline
        {
            set
            {
                textBlockDeadline.Text = value.ToLongDateString();
                textBlockRemainingDays.Text = (value.Date - DateTime.Now).Days.ToString() + " days remaining";
            }
            get
            {
                return DateTime.Parse(textBlockDeadline.Text);
            }
        }

    }
}
