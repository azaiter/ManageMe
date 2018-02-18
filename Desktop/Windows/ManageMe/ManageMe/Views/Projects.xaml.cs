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

namespace ManageMe.Views
{
    /// <summary>
    /// Interaction logic for Projects.xaml
    /// </summary>
    public partial class Projects : UserControl
    {
        public ViewModels.ProjectsViewModel ViewModel;

        public Projects()
        {
            InitializeComponent();

            ViewModel = new ViewModels.ProjectsViewModel();

            this.DataContext = ViewModel;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            ViewModel.RefreshList();
        }
    }
}
