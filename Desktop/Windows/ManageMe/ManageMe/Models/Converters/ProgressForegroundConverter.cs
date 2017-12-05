using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;
using System.Windows.Media;

namespace ManageMe.Models.Converters
{
    public class ProgressForegroundConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            double progress = (double)value;
            Brush foreground = Brushes.Green;

            if (progress >= 95d)
            {
                foreground = Brushes.Red;
            }
            else if(progress >= 87.5d)
            {
                foreground = Brushes.Orange;
            }
            else if (progress >= 75d)
            {
                foreground = Brushes.Yellow;
            }

            return foreground;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
