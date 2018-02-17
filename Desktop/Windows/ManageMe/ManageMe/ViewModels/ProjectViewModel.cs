using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;

namespace ManageMe.ViewModels
{
    public class ProjectViewModel : INotifyPropertyChanged, IDisposable
    {
        public event PropertyChangedEventHandler PropertyChanged;

        private double id = -1;
        private string name;
        private string description;
        private List<Models.Comment> comments;
        private List<Models.File> files;
        private List<Models.Requirement> requirments;

        private System.Threading.Timer timer;

        public ProjectViewModel(Models.Project project)
        {
            ID = project.ID;
            Name = "HI!!!!!"; //project.Name;
            Description = project.Description;
            Comments = project.Comments;
            Files = project.Files;
            Requirments = project.Requirments;
            timer = new System.Threading.Timer(delegate { RefreshData(); }, new object(), 30000, 0);
        }

        public void Dispose()
        {
            timer = null;
        }

        public void RefreshData()
        {

            //Refresh the data

            timer.Change(30000, 0);
        }

        public double ID
        {
            get
            {
                return id;
            }
            private set
            {
                id = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("ID"));
            }
        }

        public string Name
        {
            get
            {
                return name;
            }
            private set
            {
                name = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Name"));
            }
        }

        public string Description
        {
            get
            {
                return description;
            }
            private set
            {
                description = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Description"));
            }
        }

        public List<Models.Comment> Comments
        {
            get
            {
                return comments;
            }
            private set
            {
                comments = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Comments"));
            }
        }

        public List<Models.File> Files
        {
            get
            {
                return files;
            }
            private set
            {
                files = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Files"));
            }
        }

        public List<Models.Requirement> Requirments
        {
            get
            {
                return requirments;
            }
            private set
            {
                requirments = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Requirments"));
        }
        }
    }
}
