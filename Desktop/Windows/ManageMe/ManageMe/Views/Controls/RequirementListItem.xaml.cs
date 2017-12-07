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

        public RequirementListItem()
        {
            InitializeComponent();
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

        public bool Selected
        {
            set
            {
                if(value)
                {
                    borderSelected.BorderThickness = new Thickness(1, 1, 0, 1);
                }
                else
                {
                    borderSelected.BorderThickness = new Thickness(1);
                }
            }
        }

        public void UnSelect()
        {
            borderSelected.BorderThickness = new Thickness(1);
        }

        private void Grid_MouseDown(object sender, MouseButtonEventArgs e)
        {
            borderSelected.BorderThickness = new Thickness(1,1,0,1);
            RequirementSelected?.Invoke(sender, e);
        }
    }
}
