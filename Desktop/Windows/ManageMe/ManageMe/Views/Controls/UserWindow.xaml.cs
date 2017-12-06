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
    /// Interaction logic for UserWindow.xaml
    /// </summary>
    public partial class UserWindow : UserControl
    {
        public event EventHandler Close;

        private bool editMode;

        public UserWindow()
        {
            InitializeComponent();
            EditMode = true;
        }

        private void buttonCancel_Click(object sender, RoutedEventArgs e)
        {

        }

        private void buttonCreate_Click(object sender, RoutedEventArgs e)
        {

        }

        private void comboBoxUser_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

        }

        public bool AllInputsValid()
        {
            if (textBoxCFirstName.Text == "") return false;
            if (textBoxCLastName.Text == "") return false;
            if (textBoxCUserName.Text == "") return false;
            if (textBoxCEmail.Text == "") return false;
            if (textBoxCPassword.Password == "") return false;
            if (textBoxCConfirmPassword.Password == "") return false;
            if (imageCConfirmPasswordError.Visibility == Visibility.Visible) return false;
            if (imageCPasswordError.Visibility == Visibility.Visible) return false;
            if (imageCUserNameError.Visibility == Visibility.Visible) return false;
            if (imageCEmailError.Visibility == Visibility.Visible) return false;
            if (imageCLastNameError.Visibility == Visibility.Visible) return false;
            if (imageCFirstNameError.Visibility == Visibility.Visible) return false;
            return true;
        }

        private void textBoxCConfirmPassword_PasswordChanged(object sender, RoutedEventArgs e)
        {
            if (textBoxCConfirmPassword.Password.Length > 0)
            {
                placeHolderTextBoxCConfirmPassword.Visibility = Visibility.Collapsed;
            }
            else
            {
                placeHolderTextBoxCConfirmPassword.Visibility = Visibility.Visible;
            }

            if (textBoxCConfirmPassword.Password == textBoxCPassword.Password)
            {
                imageCConfirmPasswordError.Visibility = Visibility.Hidden;
            }
            else
            {
                imageCConfirmPasswordError.Visibility = Visibility.Visible;
                imageCConfirmPasswordError.ToolTip = new ToolTip() { Content = "Passwords do not match" };
            }
        }

        private void textBoxCPassword_PasswordChanged(object sender, RoutedEventArgs e)
        {
            if (textBoxCPassword.Password.Length > 0)
            {
                placeHolderTextBoxCPassword.Visibility = Visibility.Collapsed;
            }
            else
            {
                placeHolderTextBoxCPassword.Visibility = Visibility.Visible;
            }

            if (Utilities.Utilities.IsStrongPassword(textBoxCPassword.Password))
            {
                imageCPasswordError.Visibility = Visibility.Hidden;
            }
            else
            {
                imageCPasswordError.Visibility = Visibility.Visible;
                imageCPasswordError.ToolTip = new ToolTip() { ToolTip = "Password must have 1 Upper , 1 special, 1 lower character, 1 digit, and be 8 characters long" };
            }
        }

        private void textBoxCFirstName_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (textBoxCFirstName.Text.Length < 4)
            {
                imageCFirstNameError.Visibility = Visibility.Visible;
                imageCFirstNameError.ToolTip = new ToolTip() { Content = "First name must be over 4 characters" };
            }
            else
            {
                imageCFirstNameError.Visibility = Visibility.Hidden;
            }
        }

        private void textBoxCLastName_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (textBoxCLastName.Text.Length < 2)
            {
                imageCLastNameError.Visibility = Visibility.Visible;
                imageCLastNameError.ToolTip = new ToolTip() { Content = "Last name must Be over 4 characters" };
            }
            else
            {
                imageCLastNameError.Visibility = Visibility.Hidden;
            }
        }

        private void textBoxCUserName_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (textBoxCUserName.Text.Length < 2)
            {
                imageCUserNameError.Visibility = Visibility.Visible;
                imageCUserNameError.ToolTip = new ToolTip() { Content = "Username must be over 4 characters" };
            }
            else
            {
                imageCUserNameError.Visibility = Visibility.Hidden;
            }
        }

        private void textBoxCEmail_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (Utilities.Utilities.IsValidEmail(textBoxCEmail.Text))
            {
                imageCEmailError.Visibility = Visibility.Visible;
                imageCEmailError.ToolTip = new ToolTip() { Content = "Not a valid email address" };
            }
            else
            {
                imageCEmailError.Visibility = Visibility.Hidden;
            }
        }

        public bool EditMode
        {
            get
            {
                return editMode;
            }
            set
            {
                editMode = value;
                if (editMode)
                {
                    buttonCreate.Content = "Update";
                    rowSelectUser.Height = new GridLength(50);

                }
                else
                {
                    buttonCreate.Content = "Create";
                    rowSelectUser.Height = new GridLength(0);
                }
            }
        }

        private void buttonRemoveTeam_Click(object sender, RoutedEventArgs e)
        {
            Close?.Invoke(this, new EventArgs());
        }
    }
}
