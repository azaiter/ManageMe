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
    }
}
