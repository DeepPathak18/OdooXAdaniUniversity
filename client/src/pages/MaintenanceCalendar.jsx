import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar, ChevronLeft, ChevronRight, Clock, Loader, AlertCircle } from 'lucide-react';
import MainNavigation from '../components/common/MainNavigation';

export default function MaintenanceCalendar({ user, onLogout }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [maintenanceEvents, setMaintenanceEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch calendar events from backend
  const fetchCalendarEvents = useCallback(async (selectedYear, selectedMonth) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/analytics/calendar-events?year=${selectedYear}&month=${selectedMonth}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
          navigate('/signin');
          return;
        }
        throw new Error(`Failed to fetch calendar events: ${response.status}`);
      }

      const events = await response.json();
      setMaintenanceEvents(Array.isArray(events) ? events : []);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(err.message || 'Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch events when component mounts or when month/year changes
  useEffect(() => {
    fetchCalendarEvents(year, month + 1);
  }, [fetchCalendarEvents, year, month]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date) => {
    return maintenanceEvents.filter(event => event.day === date);
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
          className={`h-32 bg-slate-800/50 border border-slate-700 p-2 overflow-y-auto hover:bg-slate-700/50 transition-colors ${
            isToday ? 'ring-2 ring-cyan-500 bg-cyan-500/10' : ''
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-cyan-400' : 'text-gray-300'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {events.map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded cursor-pointer transition-colors hover:opacity-80 ${
                  event.status === 'in-progress' || event.status === 'in_progress'
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    : event.status === 'completed'
                    ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                    : event.priority === 'Critical'
                    ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}
                title={`${event.subject} - ${event.time} - ${event.equipment} - ${event.technician} (${event.priority})`}
                onClick={() => {
                  // Optional: Navigate to maintenance request details
                  console.log('Event clicked:', event);
                }}
              >
                <div className="flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span className="truncate">{event.time}</span>
                </div>
                <div className="truncate font-medium">{event.subject}</div>
                <div className="truncate text-xs opacity-75">{event.equipment}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  // Legend Item Component
  const LegendItem = ({ color, label, span = false }) => (
    <div className={`flex items-center space-x-2 ${span ? 'md:col-span-2' : ''}`}>
      <div className={`w-4 h-4 ${color} rounded`}></div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      <MainNavigation user={user} onLogout={onLogout} />

      <main className="px-6 py-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-cyan-400">
              <Loader className="w-6 h-6 animate-spin" />
              <span>Loading calendar events...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => fetchCalendarEvents(year, month + 1)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Calendar Content */}
        {!loading && !error && (
          <>
            {/* Calendar Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-white">
                    {monthNames[month]} {year}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Today
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Next Month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map(day => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}

                {renderCalendarDays()}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LegendItem color="bg-cyan-500/20 border border-cyan-500/30" label="Scheduled" />
                <LegendItem color="bg-blue-500/30 border border-blue-500/50" label="In Progress" />
                <LegendItem color="bg-green-500/30 border border-green-500/50" label="Completed" />
                <LegendItem color="bg-red-500/30 border border-red-500/50" label="Critical Priority" />
                <LegendItem
                  color="ring-2 ring-cyan-500 bg-cyan-500/10"
                  label="Today"
                  span
                />
              </div>

              {/* Event Count Summary */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Total Events: {maintenanceEvents.length}</span>
                  <span>{monthNames[month]} {year}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
