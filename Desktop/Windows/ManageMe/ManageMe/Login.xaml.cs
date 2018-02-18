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
using System.Windows.Shapes;

namespace ManageMe
{
    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class Login : Window
    {
        public Login()
        {
            InitializeComponent();
        }

        public void ClearInputs()
        {
            textBoxCFirstName.Text = "";
            textBoxCLastName.Text = "";
            textBoxCUserName.Text = "";
            textBoxCEmail.Text = "";
            textBoxCPassword.Password = "";
            textBoxCConfirmPassword.Password = "";
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
            if (imageCUserNameError.Visibility == Visibility.Visible) return false;
            if (imageCFirstNameError.Visibility == Visibility.Visible) return false;
            if (imageCEmailError.Visibility == Visibility.Visible) return false;
            if (imageCLastNameError.Visibility == Visibility.Visible) return false;
            return true;
        }

        #region Control Events
        private void buttonExit_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void buttonShowRegister_Click(object sender, RoutedEventArgs e)
        {
            ClearInputs();
            gridSignIn.Visibility = Visibility.Hidden;
            this.Height = 500;
            gridRegister.Visibility = Visibility.Visible;
        }

        private void buttonBack_Click(object sender, RoutedEventArgs e)
        {
            gridSignIn.Visibility = Visibility.Visible;
            this.Height = 400;
            gridRegister.Visibility = Visibility.Hidden;
        }

        private void textBoxCConfirmPassword_PasswordChanged(object sender, RoutedEventArgs e)
        {

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

            if (Utilities.Utilities.IsStrongPassword(textBoxCPassword.Password))
            {
                imageCPasswordError.Visibility = Visibility.Hidden;
            }
            else
            {
                imageCPasswordError.Visibility = Visibility.Visible;
                imageCPasswordError.ToolTip = new ToolTip() { Content = "Password must have 1 Upper , 1 special, 1 lower character, 1 digit, and be 8 characters long" };
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

        private async void buttonRegister_Click(object sender, RoutedEventArgs e)
        {
            if (AllInputsValid())
            {
                var result = await Utilities.User.Register(textBoxCUserName.Text, textBoxCPassword.Password, textBoxCFirstName.Text, textBoxCLastName.Text, textBoxCEmail.Text);
                if (result.Status)
                {
                    MessageBox.Show("You have successfully registered " + textBoxCFirstName.Text + " " + textBoxCLastName.Text + ". You may now sign in.");
                    gridSignIn.Visibility = Visibility.Visible;
                    this.Height = 400;
                    gridRegister.Visibility = Visibility.Hidden;
                    ClearInputs();
                }
                else
                {
                    if (result.message.username != "")
                    {
                        imageCUserNameError.Visibility = Visibility.Visible;
                        imageCUserNameError.ToolTip = new ToolTip() { Content = "Username already taken" };
                    }
                    else
                    {
                        MessageBox.Show("There was an error registering, please try again.");
                    }

                }
            }
        }

        private async void buttonLogin_Click(object sender, RoutedEventArgs e)
        {
            var result = await Utilities.User.Login(textBoxUserName.Text, textBoxPassword.Password);
            if (result.Status)
            {
                Utilities.User.Token = result.token;
                MainWindow window = new MainWindow();
                this.Close();
                window.Show();
            }
            else
            {
                imageUserNameError.Visibility = Visibility.Visible;
                imageUserNameError.ToolTip = new ToolTip() { Content = "Username or password is incorrect" };
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
            if (textBoxCLastName.Text.Length < 4)
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
            if (textBoxCUserName.Text.Length < 4)
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
        #endregion
    }
}
