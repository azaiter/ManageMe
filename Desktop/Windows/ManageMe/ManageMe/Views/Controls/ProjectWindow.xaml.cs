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
    public partial class ProjectWindow : UserControl
    {

        public ProjectWindow()
        {
            InitializeComponent();
        }

        public string ProjectName
        {
            get
            {
                return textBlockProjectName.Text;
            }
            set
            {
                textBlockProjectName.Text = value;
            }
        }

        public string ProjectDescription
        {
            get
            {
                return textBlockProjectDescription.Text;
            }
            set
            {
                textBlockProjectDescription.Text = value;
            }
        }

        public string RequirementDescription
        {
            get
            {
                return textBlockRequirementDescription.Text;
            }
            set
            {
                textBlockRequirementDescription.Text = value;
            }
        }

        private void richTextBoxProjectComment_TextChanged(object sender, TextChangedEventArgs e)
        {
            var comment = new TextRange(richTextBoxProjectComment.Document.ContentStart, richTextBoxProjectComment.Document.ContentEnd).Text;
            if (comment != "\r\n")
            {
                placeHolderTextBoxProjectComment.Visibility = Visibility.Hidden;
            }
            else
            {
                placeHolderTextBoxProjectComment.Visibility = Visibility.Visible;
            }
        }

        private void richTextBoxRequirementComment_TextChanged(object sender, TextChangedEventArgs e)
        {
            var comment = new TextRange(richTextBoxRequirementComment.Document.ContentStart, richTextBoxRequirementComment.Document.ContentEnd).Text;
            if (comment != "\r\n")
            {
                placeHolderTextBoxRequirementComment.Visibility = Visibility.Hidden;
            }
            else
            {
                placeHolderTextBoxRequirementComment.Visibility = Visibility.Visible;
            }
        }
    }


}
