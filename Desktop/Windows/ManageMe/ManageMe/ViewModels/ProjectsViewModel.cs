using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.ViewModels
{
    public class ProjectsViewModel : INotifyPropertyChanged
    {
        private bool loading;

        public event PropertyChangedEventHandler PropertyChanged;

        public ObservableCollection<Models.Project> Projects { get; private set; }

        public ProjectsViewModel()
        {
            Projects = new ObservableCollection<Models.Project>();

            RefreshList();
        }

        public async void RefreshList()
        {
            Loading = true;

            var projectList = await Utilities.API.GetProjects(Utilities.User.Token);

            Projects.Clear();

            foreach (Models.JsonModels.JsonProject p in projectList)
            {
                var project = new Models.Project() { Progress = new Random().NextDouble() };

                Projects.Add(project);
            }

            Loading = false;
        }

        public bool Loading
        {
            get
            {
                return loading;
            }
            private set
            {
                loading = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Loading"));
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("NotLoading"));
            }
        }

        public bool NotLoading
        {
            get
            {
                return !loading;
            }
        }
    }
}
