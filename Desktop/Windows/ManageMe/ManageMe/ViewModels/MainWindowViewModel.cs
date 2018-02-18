using Dragablz;
using ManageMe.Views;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace ManageMe.ViewModels
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        private List<UIElement> contentList;
        private ObservableCollection<Views.Controls.Project> projects;
        private UIElement content;
        private int contentIndex;
        public IInterTabClient InterTabClient { get; set; }

        public MainWindowViewModel()
        {
            InterTabClient = new MainInterTabClient();
            contentList = new List<UIElement>();
            projects = new ObservableCollection<Views.Controls.Project>();
            projects.Add(new Views.Controls.Project(1));
            projects.Add(new Views.Controls.Project(1));
            contentList.Add(new Dashboard());
            contentList.Add(new Projects());
            contentList.Add(new Reports());
            ContentIndex = 0;

        }

        public ObservableCollection<Views.Controls.Project> Projects
        {
            get
            {
                return projects;
            }
            private set
            {
                projects = new ObservableCollection<Views.Controls.Project>();
            }
        }

        public int ContentIndex
        {
            get
            {
                return contentIndex;
            }
            set
            {
                contentIndex = value;
                Content = contentList[value];
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("ContentIndex"));
            }
        }

        public List<string> MainMenuList
        {
            get
            {
                return new List<string>() { "Dashboard", "Projects", "Reports" };
            }
        }

        public UIElement Content
        {
            get
            {
                return content;
            }
            private set
            {
                content = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Content"));
            }
        }
    }

    public class MainInterTabClient : IInterTabClient
    {
        public INewTabHost<Window> GetNewHost(IInterTabClient interTabClient, object partition, TabablzControl source)
        {
            var view = new DragablzHost();
            return new NewTabHost<DragablzHost>(view, view.TabablzControl); //TabablzControl is a names control in the XAML
        }

        public TabEmptiedResponse TabEmptiedHandler(TabablzControl tabControl, Window window)
        {
            return TabEmptiedResponse.CloseWindowOrLayoutBranch;
        }
    }
}
