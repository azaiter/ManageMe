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
    /// Interaction logic for RequirementListItem.xaml
    /// </summary>
    public partial class RequirementListItem : UserControl
    {
        public event EventHandler<MouseButtonEventArgs> RequirementSelected;

        private bool selected;

        private int id;

        public RequirementListItem()
        {
            InitializeComponent();
        }

        public RequirementListItem(int id,string name)
        {
            this.id = id;
            RequirementName = name;
        }

        public string RequirementName
        {
            get
            {
                return textBlockRequirementName.Text;
            }
            set
            {
                textBlockRequirementName.Text = value;
            }
        }

        private void Grid_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Selected = true;
        }

        private void Grid_MouseEnter(object sender, MouseEventArgs e)
        {
            var grid = (Grid)sender;
            grid.Background = Brushes.LightGray;
        }

        private void Grid_MouseLeave(object sender, MouseEventArgs e)
        {
            var grid = (Grid)sender;
            grid.Background = Brushes.Transparent;
        }

        public bool Selected
        {
            get
            {
                return rectanagleViewing.Visibility == Visibility.Visible;
            }
            set
            {
                if(value)
                {
                    rectanagleViewing.Visibility = Visibility.Visible;
                    RequirementSelected?.Invoke(this, null);
                }
                else
                {
                    rectanagleViewing.Visibility = Visibility.Hidden;
                }
            }
        }
    }
}
