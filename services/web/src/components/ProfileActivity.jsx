import { useMemo } from 'react';
import { useAuth } from "../context/AuthContext";

const processActivityData = (activityLog, weeks = 20) => {
  const days = weeks * 7;
  const data = [];
  const now = new Date();
  
  // Create Lookup Map from Activity Log
  const activityMap = {};
  if (Array.isArray(activityLog)) {
      activityLog.forEach(entry => {
          // Normalize date string locally
          // entry.date is YYYY-MM-DD
          activityMap[entry.date] = entry;
      });
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split('T')[0];

    // Check if we have logs for this date
    const log = activityMap[dateStr];
    const level = log ? log.level : 0;
    const count = log ? log.count : 0;

    data.push({
      date: dateStr,
      dateObj: date,
      level, 
      count
    });
  }
  return data;
};

export default function ProfileActivity({ compact = false }) {
  const { user } = useAuth();
  
  // Logic: 
  // - "Vertical Pattern" (Weeks stacked vertically, Days horizontal)
  // - Tall Look: Default to many weeks (e.g. 26 = 6 months)
  // - "Shrink": If compact is true, reduce weeks significantly.
  const weeks = compact ? 4 : 26; 
  
  // Re-memoize when weeks changes or user updates
  const data = useMemo(() => processActivityData(user?.activityLog, weeks), [weeks, user]);

  // Adjust start for Calendar Grid Alignment
  // Grid is 7 cols (Sun -> Sat)
  // We need to know which column the FIRST day starts in.
  const startDayIndex = data.length > 0 ? data[0].dateObj.getDay() : 0; 

  const getIcon = (level) => {
    switch (level) {
      case 1: return "/paws/pawlight.svg";
      case 2: return "/paws/pawmedium.svg";
      case 3: return "/paws/pawdark.svg";
      default: return null; 
    }
  };

  const daysLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col animate-fade-in-up transition-all duration-500 ease-in-out ${compact ? 'min-h-[300px]' : 'min-h-[500px]'}`}>
        <div className="mb-6 flex items-start justify-between">
            <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Learning Paws</h3>
                <p className="text-sm font-medium text-gray-400 mt-1">
                    {compact ? "Recent activity" : "Your daily consistency"}
                </p>
            </div>
            {/* Week counter pill */}
            <div className="px-3 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-400 border border-gray-100">
                {weeks} Weeks
            </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-3 mb-2 px-2">
             {daysLabels.map((d, i) => (
                 <div key={i} className="text-center text-[10px] font-bold text-gray-300 uppercase">
                     {d}
                 </div>
             ))}
        </div>

        {/* The Vertical Grid Container */}
        {/* grid-cols-7 = 7 Days Horizontal. Implicit Rows = Weeks flowing down. */}
        <div className="flex-1 w-full">
            <div className="grid grid-cols-7 gap-3 justify-items-center">
                {data.map((day, i) => (
                    <div 
                        key={i} 
                        style={{
                            // If it's the very first item, shift it to the correct column
                            gridColumnStart: i === 0 ? startDayIndex + 1 : 'auto'
                        }}
                        className="relative group w-8 h-8 flex items-center justify-center transition-all duration-500"
                    >
                         {day.level > 0 ? (
                            <img 
                                src={getIcon(day.level)} 
                                alt={`Activity level ${day.level}`}
                                className="w-full h-full object-contain transition-all duration-300 ease-out group-hover:scale-125 group-hover:drop-shadow-md opacity-90 hover:opacity-100"
                            />
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors" />
                        )}

                        {/* Text Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl flex flex-col items-center gap-1">
                            <span className="font-bold text-gray-300 uppercase text-[10px] tracking-wider">
                                {day.dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="font-semibold text-white">
                                {day.level === 0 ? "No activity" : `${day.count} lessons`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Footer / Legend */}
        <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mx-auto">
                <span>Less</span>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <img src="/paws/pawlight.svg" className="w-4 h-4 opacity-60" />
                    <img src="/paws/pawmedium.svg" className="w-4 h-4 opacity-80" />
                    <img src="/paws/pawdark.svg" className="w-4 h-4" />
                </div>
                <span>More</span>
            </div>
        </div>
    </div>
  );
}
