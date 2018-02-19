using MaterialDesignThemes.Wpf;
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
    /// Interaction logic for ProjectWindow.xaml
    /// </summary>
    public partial class Project : UserControl
    {

        public Project(double projectID)
        {
            InitializeComponent();
            //Get Project data
            this.DataContext = new ViewModels.ProjectViewModel(new Models.Project());
        }

        public Project()
        {
            InitializeComponent();
            //Get Project data
            this.DataContext = new ViewModels.ProjectViewModel(new Models.Project());
        }

        private void buttonAddProjectFile_Click(object sender, RoutedEventArgs e)
        {
            var name = "";
            DependencyObject control = control = VisualTreeHelper.GetParent(this);
            while (name == "")
            {
                control = VisualTreeHelper.GetParent(control);
                if (control == null)
                {
                    break;
                }
                if((string)control.GetValue(FrameworkElement.NameProperty) == "RootDialog") {
                    ((DialogHost)control).IsOpen = true;
                }
            }
        }

        
    }


}
