using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManageMe.Utilities
{
    public static class TimeClock
    {
        private static bool clockedIn = false;

        public static int ProjectId;
        public static DateTime ClockedInTime;
        public static DateTime ClockedOutTime;

        public static bool ClockedIn
        {
            get
            {
                return clockedIn;
            }
            set
            {
                if (value)
                {
                    if (!clockedIn)
                    {
                        ClockedInTime = DateTime.Now;
                        ClockedOutTime = DateTime.Now;
                    }
                }
                else
                {
                    if (clockedIn)
                    {
                        ClockedOutTime = DateTime.Now;
                    }
                }
                clockedIn = value;
            }
        }

        public static TimeSpan TimeElapsed
        {
            get
            {
                return ClockedOutTime - ClockedInTime;
            }
        }
    }
}
