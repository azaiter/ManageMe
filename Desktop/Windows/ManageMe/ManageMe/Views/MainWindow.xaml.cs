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
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ManageMe.Views
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private Utilities.User user;
        private Rectangle lastHighlightNav;
        private Rectangle lastHighlightProjects;
        private Rectangle lastHighlightReports;
        private Grid lastGridContent;
        private Grid lastGridTop;

        public MainWindow()
        {
            InitializeComponent();

        }

        private void ShowPopOutBackDrop(object sender, EventArgs e)
        {
            gridPopOutBackdrop.Visibility = Visibility.Visible;
        }

        private void HidePopOutBackDrop(object sender, EventArgs e)
        {
            gridPopOutBackdrop.Visibility = Visibility.Hidden;
        }

        private void HidePopOuts(object sender, MouseEventArgs e)
        {

        }

        public MainWindow(string token)
        {
            InitializeComponent();
            this.user = new Utilities.User(token);

            lastHighlightNav = highlightDashboard;
            lastHighlightProjects = highlightInProgressProjects;
            lastHighlightReports = highlightHours;

            lastGridContent = gridDashboard;
            lastGridTop = gridTopDashboard;

            projectListInProgress.SessionID = token;
            projectListInProgress.UpdateList();

        }

        private void buttonViewUser_Click(object sender, RoutedEventArgs e)
        {
            if(lastHighlightNav != null)
            {
                lastHighlightNav.Visibility = Visibility.Hidden;
                lastHighlightNav.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightNav = highlightViewUser;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightNav.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightNav.Visibility = Visibility.Visible;

                if(lastGridContent != gridUser)
                {
                    lastGridContent.Visibility = Visibility.Collapsed;
                    lastGridTop.Visibility = Visibility.Collapsed;
                    lastGridContent = gridUser;
                    lastGridTop = gridTopUser;
                    lastGridContent.Visibility = Visibility.Visible;
                    lastGridTop.Visibility = Visibility.Visible;
                }

            }
        }

        private void buttonDashboard_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightNav != null)
            {
                lastHighlightNav.Visibility = Visibility.Hidden;
                lastHighlightNav.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightNav = highlightDashboard;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightNav.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightNav.Visibility = Visibility.Visible;

                if (lastGridContent != gridDashboard)
                {
                    lastGridContent.Visibility = Visibility.Collapsed;
                    lastGridTop.Visibility = Visibility.Collapsed;
                    lastGridContent = gridDashboard;
                    lastGridTop = gridTopDashboard;
                    lastGridContent.Visibility = Visibility.Visible;
                    lastGridTop.Visibility = Visibility.Visible;
                }
            }
        }

        private void buttonProjects_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightNav != null)
            {
                lastHighlightNav.Visibility = Visibility.Hidden;
                lastHighlightNav.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightNav = highlightProjects;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightNav.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightNav.Visibility = Visibility.Visible;
            }

            if (lastGridContent != gridProjects)
            {
                lastGridContent.Visibility = Visibility.Collapsed;
                lastGridTop.Visibility = Visibility.Collapsed;
                lastGridContent = gridProjects;
                lastGridTop = gridTopProjects;
                lastGridContent.Visibility = Visibility.Visible;
                lastGridTop.Visibility = Visibility.Visible;
            }
        }

        private void buttonReports_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightNav != null)
            {
                lastHighlightNav.Visibility = Visibility.Hidden;
                lastHighlightNav.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightNav = highlightReports;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightNav.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightNav.Visibility = Visibility.Visible;
            }

            if (lastGridContent != gridReports)
            {
                lastGridContent.Visibility = Visibility.Collapsed;
                lastGridTop.Visibility = Visibility.Collapsed;
                lastGridContent = gridReports;
                lastGridTop = gridTopReports;
                lastGridContent.Visibility = Visibility.Visible;
                lastGridTop.Visibility = Visibility.Visible;
            }
        }

        private void buttonSettings_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightNav != null)
            {
                lastHighlightNav.Visibility = Visibility.Hidden;
                lastHighlightNav.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightNav = highlightSettings;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightNav.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightNav.Visibility = Visibility.Visible;
            }

            if (lastGridContent != gridSettings)
            {
                lastGridContent.Visibility = Visibility.Collapsed;
                lastGridTop.Visibility = Visibility.Collapsed;
                lastGridContent = gridSettings;
                lastGridTop = gridTopSettings;
                lastGridContent.Visibility = Visibility.Visible;
                lastGridTop.Visibility = Visibility.Visible;
            }
        }

        private void buttonViewUser_MouseEnter(object sender, RoutedEventArgs e)
        {
            if(highlightViewUser.Visibility != Visibility.Visible)
            {
                highlightViewUser.Visibility = Visibility.Visible;
            }
        }

        private void buttonViewUser_MouseLeave(object sender, RoutedEventArgs e)
        {
            if (highlightViewUser != lastHighlightNav)
            {
                highlightViewUser.Visibility = Visibility.Hidden;
            }
        }

        private void buttonDashboard_MouseEnter(object sender, RoutedEventArgs e)
        {
            if (highlightDashboard.Visibility != Visibility.Visible)
            {
                highlightDashboard.Visibility = Visibility.Visible;
            }
        }

        private void buttonDashboard_MouseLeave(object sender, RoutedEventArgs e)
        {
            if (highlightDashboard != lastHighlightNav)
            {
                highlightDashboard.Visibility = Visibility.Hidden;
            }
        }

        private void buttonProjects_MouseEnter(object sender, RoutedEventArgs e)
        {
            if (highlightProjects.Visibility != Visibility.Visible)
            {
                highlightProjects.Visibility = Visibility.Visible;
            }
        }

        private void buttonProjects_MouseLeave(object sender, RoutedEventArgs e)
        {
            if (highlightProjects != lastHighlightNav)
            {
                highlightProjects.Visibility = Visibility.Hidden;
            }
        }

        private void buttonSettings_MouseEnter(object sender, RoutedEventArgs e)
        {
            if (highlightSettings.Visibility != Visibility.Visible)
            {
                highlightSettings.Visibility = Visibility.Visible;
            }
        }

        private void buttonSettings_MouseLeave(object sender, RoutedEventArgs e)
        {
            if (highlightSettings != lastHighlightNav)
            {
                highlightSettings.Visibility = Visibility.Hidden;
            }
        }

        private void buttonReports_MouseEnter(object sender, RoutedEventArgs e)
        {
            if (highlightReports.Visibility != Visibility.Visible)
            {
                highlightReports.Visibility = Visibility.Visible;
            }
        }

        private void buttonReports_MouseLeave(object sender, RoutedEventArgs e)
        {
            if (highlightReports != lastHighlightNav)
            {
                highlightReports.Visibility = Visibility.Hidden;
            }
        }

        private void buttonPendingProjects_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightProjects != null)
            {
                lastHighlightProjects.Visibility = Visibility.Hidden;
                lastHighlightProjects.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightProjects = highlightPendingProjects;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightProjects.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightProjects.Visibility = Visibility.Visible;
                projectListPending.Visibility = Visibility.Visible;
                projectListCompleted.Visibility = Visibility.Collapsed;
                projectListInProgress.Visibility = Visibility.Collapsed;
            }
        }

        private void buttonInProgress_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightProjects != null)
            {
                lastHighlightProjects.Visibility = Visibility.Hidden;
                lastHighlightProjects.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightProjects = highlightInProgressProjects;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightProjects.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightProjects.Visibility = Visibility.Visible;
                projectListPending.Visibility = Visibility.Collapsed;
                projectListCompleted.Visibility = Visibility.Collapsed;
                projectListInProgress.Visibility = Visibility.Visible;
                projectListInProgress.UpdateList();
            }
        }

        private void buttonCompleted_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightProjects != null)
            {
                lastHighlightProjects.Visibility = Visibility.Hidden;
                lastHighlightProjects.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightProjects = highlightCompletedProjects;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightProjects.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightProjects.Visibility = Visibility.Visible;
                projectListPending.Visibility = Visibility.Collapsed;
                projectListCompleted.Visibility = Visibility.Visible;
                projectListInProgress.Visibility = Visibility.Collapsed;
            }
        }

        private void buttonHours_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightReports != null)
            {
                lastHighlightReports.Visibility = Visibility.Hidden;
                lastHighlightReports.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightReports = highlightHours;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightReports.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightReports.Visibility = Visibility.Visible;
            }
        }

        private void buttonProjectReports_Click(object sender, RoutedEventArgs e)
        {
            if (lastHighlightProjects != null)
            {
                lastHighlightReports.Visibility = Visibility.Hidden;
                lastHighlightReports.Fill = System.Windows.Media.Brushes.Gray;
                lastHighlightReports = highlightProjectReports;
                var converter = new System.Windows.Media.BrushConverter();
                lastHighlightReports.Fill = (Brush)converter.ConvertFromString("#2c75a3");
                lastHighlightReports.Visibility = Visibility.Visible;
            }
        }

        private void buttonPendingProjects_MouseEnter(object sender, MouseEventArgs e)
        {
            if (highlightPendingProjects.Visibility != Visibility.Visible)
            {
                highlightPendingProjects.Visibility = Visibility.Visible;
            }
        }

        private void buttonPendingProjects_MouseLeave(object sender, MouseEventArgs e)
        {
            if (highlightPendingProjects != lastHighlightProjects)
            {
                highlightPendingProjects.Visibility = Visibility.Hidden;
            }
        }

        private void buttonInProgress_MouseEnter(object sender, MouseEventArgs e)
        {
            if (highlightInProgressProjects.Visibility != Visibility.Visible)
            {
                highlightInProgressProjects.Visibility = Visibility.Visible;
            }
        }

        private void buttonInProgress_MouseLeave(object sender, MouseEventArgs e)
        {
            if (highlightInProgressProjects != lastHighlightProjects)
            {
                highlightInProgressProjects.Visibility = Visibility.Hidden;
            }
        }

        private void buttonCompleted_MouseEnter(object sender, MouseEventArgs e)
        {
            if (highlightCompletedProjects.Visibility != Visibility.Visible)
            {
                highlightCompletedProjects.Visibility = Visibility.Visible;
            }
        }

        private void buttonCompleted_MouseLeave(object sender, MouseEventArgs e)
        {
            if (highlightCompletedProjects != lastHighlightProjects)
            {
                highlightCompletedProjects.Visibility = Visibility.Hidden;
            }
        }

        private void buttonHours_MouseEnter(object sender, MouseEventArgs e)
        {
            if (highlightHours.Visibility != Visibility.Visible)
            {
                highlightHours.Visibility = Visibility.Visible;
            }
        }

        private void buttonHours_MouseLeave(object sender, MouseEventArgs e)
        {
            if (highlightHours != lastHighlightReports)
            {
                highlightHours.Visibility = Visibility.Hidden;
            }
        }

        private void buttonProjectReports_MouseEnter(object sender, MouseEventArgs e)
        {
            if (highlightProjectReports.Visibility != Visibility.Visible)
            {
                highlightProjectReports.Visibility = Visibility.Visible;
            }
        }

        private void buttonProjectReports_MouseLeave(object sender, MouseEventArgs e)
        {
            if (highlightProjectReports != lastHighlightReports)
            {
                highlightProjectReports.Visibility = Visibility.Hidden;
            }
        }

        private void buttonLogout_Click(object sender, RoutedEventArgs e)
        {
            var login = new Login();
            login.Show();
            this.Close();
        }
        
        private void buttonCancelSearchNotifications_Click(object sender, RoutedEventArgs e)
        {
            buttonCancelSearchNotifications.Visibility = Visibility.Hidden;
            textBoxSearchNotifications.Text = "";
            Storyboard storyBoard = (Storyboard)this.Resources["storyBoardHideSearchPane"];
            storyBoard.Begin();
        }

        private void textBoxSearchNotifications_TextChanged(object sender, TextChangedEventArgs e)
        {
            if(listViewSearchResults.Width == 0)
            {
                Storyboard storyBoard = (Storyboard)this.Resources["storyBoardShowSearchPane"];
                storyBoard.Begin();
            } else
            {
                buttonCancelSearchNotifications.Visibility = Visibility.Visible;
            }
        }
    }
}
