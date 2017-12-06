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
    /// Interaction logic for CreateTeam.xaml
    /// </summary>
    public partial class TeamWindow : UserControl
    {
        public event EventHandler Close;

        private bool editMode;

        public TeamWindow()
        {
            InitializeComponent();
            EditMode = true;
        }

        private void buttonCancel_Click(object sender, RoutedEventArgs e)
        {
            Close?.Invoke(this, new EventArgs());
        }

        private void buttonCreate_Click(object sender, RoutedEventArgs e)
        {
            Close?.Invoke(this, new EventArgs());
        }

        private void buttonAddToTeam_Click(object sender, RoutedEventArgs e)
        {
            var found = false;

            foreach (RemovableListItem item in stackPanelMembers.Children)
            {
                if ((string)item.Tag == (string)((ComboBoxItem)comboBoxAddToTeam.SelectedItem).Tag)
                {
                    found = true;
                    break;
                }
            }

            if ((string)((ComboBoxItem)comboBoxTeamLead.SelectedItem).Tag == (string)((ComboBoxItem)comboBoxAddToTeam.SelectedItem).Tag) {
                found = true;
            }

            if (!found)
            {
                var selectedItem = (ComboBoxItem)comboBoxAddToTeam.SelectedItem;
                var newItem = new RemovableListItem((string)selectedItem.Content, selectedItem.Tag);
                newItem.RemoveMe += new EventHandler<RoutedEventArgs>(stackPanelMembers_RemoveMe);
                stackPanelMembers.Children.Add(newItem);
            }

        }

        private void stackPanelMembers_RemoveMe(object sender, RoutedEventArgs e)
        {
            var item = (RemovableListItem)sender;
            stackPanelMembers.Children.Remove(item);
        }

        private void comboBoxTeamLead_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (stackPanelMembers != null)
            {
                RemovableListItem removeThis = null;
                foreach (RemovableListItem item in stackPanelMembers.Children)
                {
                    if ((string)item.Tag == (string)((ComboBoxItem)comboBoxTeamLead.SelectedItem).Tag)
                    {
                        removeThis = item;
                        break;
                    }
                }
                stackPanelMembers.Children.Remove(removeThis);
            }
        }

        public bool EditMode {
            get {
                return editMode;
            }
            set {
                editMode = value;
                if(editMode)
                {
                    buttonCreate.Content = "Update";
                    rowSelectTeam.Height = new GridLength(27);
                    
                }
                else
                {
                    buttonCreate.Content = "Create";
                    rowSelectTeam.Height = new GridLength(0);
                }
            }
        }

        private void buttonRemoveTeam_Click(object sender, RoutedEventArgs e)
        {
            Close?.Invoke(this, new EventArgs());
        }
    }
}
