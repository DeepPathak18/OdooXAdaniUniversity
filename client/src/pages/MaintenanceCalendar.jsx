import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Settings, Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function MaintenanceCalendar({ user, onLogout }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Maintenance Calendar');

  const tabs = ['Maintenance', 'Dashboard', 'Maintenance Calendar', 'Equipment', 'Reporting', 'Teams'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Sample maintenance events
  const maintenanceEvents = [
    { date: 5, subject: 'HVAC System Check', time: '10:00 AM', status: 'scheduled' },
    { date: 12, subject: 'Electrical Inspection', time: '2:00 PM', status: 'in-progress' },
    { date: 18, subject: 'Equipment Calibration', time: '9:00 AM', status: 'scheduled' },
    { date: 25, subject: 'Preventive Maintenance', time: '11:00 AM', status: 'scheduled' },
  ];

  const getEventsForDate = (date) => {
    return maintenanceEvents.filter(event => event.date === date);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 bg-slate-800/30 border border-slate-700/50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isToday = 
        day === new Date().getDate() && 
        month === new Date().getMonth() && 
        year === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`h-32 bg-slate-800/50 border border-slate-700 p-2 overflow-y-auto ${
            isToday ? 'ring-2 ring-cyan-500 bg-cyan-500/10' : ''
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-cyan-400' : 'text-gray-300'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {events.map((event, idx) => (
              <div
                key={idx}
                className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                  event.status === 'in-progress'
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}
                title={`${event.subject} - ${event.time}`}
              >
                <div className="flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span className="truncate">{event.time}</span>
                </div>
                <div className="truncate font-medium">{event.subject}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                GearGuard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-cyan-400 transition-all cursor-pointer"
                title="View Profile"
              >
                {user ? (user.name ? user.name.charAt(0).toUpperCase() : user.firstName?.charAt(0).toUpperCase() || 'U') : 'U'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-700">
        <div className="px-6">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'Maintenance') {
                    navigate('/maintenance');
                  } else if (tab === 'Dashboard') {
                    navigate('/dashboard');
                  } else if (tab === 'Equipment') {
                    navigate('/equipment');
                  } else if (tab === 'Reporting') {
                    navigate('/reporting');
                  } else if (tab === 'Teams') {
                    navigate('/teams');
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`px-4 py-3 font-medium transition-all ${
                  activeTab === tab
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Calendar Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Today
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-400 py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {renderCalendarDays()}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cyan-500/20 border border-cyan-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500/30 border border-blue-500/50 rounded"></div>
              <span className="text-sm text-gray-300">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 ring-2 ring-cyan-500 bg-cyan-500/10 rounded"></div>
              <span className="text-sm text-gray-300">Today</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

