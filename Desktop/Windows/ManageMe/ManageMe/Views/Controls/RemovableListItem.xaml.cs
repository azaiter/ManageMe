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
    /// Interaction logic for RemovableListItem.xaml
    /// </summary>
    public partial class RemovableListItem : UserControl
    {
        public event EventHandler<RoutedEventArgs> RemoveMe;

        public RemovableListItem()
        {
            InitializeComponent();
        }

        public RemovableListItem(string text, object tag)
        {
            InitializeComponent();
            Text = text;
            this.Tag = tag;
        }

        private void buttonRemove_Click(object sender, RoutedEventArgs e)
        {
            RemoveMe?.Invoke(this, e);
        }

        public string Text
        {
            set
            {
                textBoxText.Text = value;
            }
            get
            {
                return textBoxText.Text;
            }
        }
    }
}
