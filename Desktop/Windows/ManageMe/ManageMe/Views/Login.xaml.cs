using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
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

namespace ManageMe.Views
{

    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class Login : Window
    {

        ManageMe.Utilities.User user;

        public Login()
        {
            InitializeComponent();

            user = new Utilities.User();

            this.MouseDown += delegate { DragMove(); };
        }

        private void buttonExit_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void buttonShowRegister_Click(object sender, RoutedEventArgs e)
        {
            gridSignIn.Visibility = Visibility.Hidden;
            this.Height = 475;
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
            if(textBoxCConfirmPassword.Password.Length > 0)
            {
                placeHolderTextBoxCConfirmPassword.Visibility = Visibility.Collapsed;
            }
            else
            {
                placeHolderTextBoxCConfirmPassword.Visibility = Visibility.Visible;
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
        }

        private void textBoxPassword_PasswordChanged(object sender, RoutedEventArgs e)
        {
            if (textBoxPassword.Password.Length > 0)
            {
                placeHolderTextBoxPassword.Visibility = Visibility.Collapsed;
            }
            else
            {
                placeHolderTextBoxPassword.Visibility = Visibility.Visible;
            }
        }

        private async void buttonRegister_Click(object sender, RoutedEventArgs e)
        {
            if(Utilities.Utilities.CheckPasswords(textBoxCPassword.Password,textBoxCConfirmPassword.Password))
            {
                if(Utilities.Utilities.CheckPasswordStrength(textBoxCPassword.Password))
                {
                    var result = await ManageMe.Utilities.User.Register(textBoxCUserName.Text, textBoxCPassword.Password, textBoxCFirstName.Text, textBoxCLastName.Text, textBoxCEmail.Text);
                    if(result.Status)
                    {
                        buttonBack_Click(null, null);
                    } else
                    {
                        MessageBox.Show(result.Message);
                    }
                }
            }
        }

        private void buttonLogin_Click(object sender, RoutedEventArgs e)
        {
            user.Login(textBoxUserName.Text, textBoxPassword.Password);
        }
    }
}
