/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  getDay,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KHMER_MONTHS, 
  KHMER_DAYS_SHORT, 
  toKhmerNumber, 
  Holiday,
  getKhmerLunarDay,
  isArtDay,
  ART_DAYS,
  KHMER_HOLIDAY_NAMES 
} from './constants';
import thngaiSile from './thngai_sile.png'
export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
      if (!apiKey) {
        console.warn('VITE_GOOGLE_CALENDAR_API_KEY is missing');
        return;
      }

      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const timeMin = new Date(year, 0, 1).toISOString();
        const timeMax = new Date(year, 11, 31).toISOString();
        const calendarId = 'en.kh#holiday@group.v.calendar.google.com';

        const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
          params: {
            key: apiKey,
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
          }
        });

        if (response.data && response.data.items) {
          const fetchedHolidays = response.data.items.map((item: any) => {
            const name = item.summary;
            return {
              date: item.start.date || item.start.dateTime.split('T')[0],
              name: name,
              nameKh: KHMER_HOLIDAY_NAMES[name] || name, 
              isArtDay: isArtDay(parseISO(item.start.date || item.start.dateTime))
            };
          });
          setHolidays(fetchedHolidays);
        }
      } catch (error) {
        console.error('Error fetching holidays from Google:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [currentDate.getFullYear()]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [startDate, endDate]);

  const nextMonthDate = addMonths(currentDate, 1);
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getDayHoliday = (date: Date): Holiday | undefined => {
    const dayStr = format(date, 'yyyy-MM-dd');
    // Check dynamic holidays
    const holiday = holidays.find(h => h.date === dayStr);
    
    // Check if it's an art day (manual mapping since API won't have it)
    if (isArtDay(date)) {
      return {
        date: dayStr,
        name: date.getMonth() === 2 ? 'National Culture Day' : 'World Art Day',
        nameKh: date.getMonth() === 2 ? 'ទិវាវប្បធម៌ជាតិ' : 'ទិវាសិល្បៈពិភពលោក',
        isArtDay: true
      };
    }
    return holiday;
  };

  const currentMonthHolidays = useMemo(() => {
    const monthHolidays = holidays.filter(h => isSameMonth(parseISO(h.date), monthStart));
    
    // Inject Art Days if missing
    ART_DAYS.forEach(ad => {
      if (ad.month === currentDate.getMonth()) {
        const dateObj = new Date(currentDate.getFullYear(), ad.month, ad.day);
        const dayStr = format(dateObj, 'yyyy-MM-dd');
        if (!monthHolidays.find(h => h.date === dayStr)) {
          monthHolidays.push({
            date: dayStr,
            name: ad.name,
            nameKh: ad.nameKh,
            isArtDay: true
          });
        }
      }
    });

    return monthHolidays.sort((a, b) => a.date.localeCompare(b.date));
  }, [currentDate, holidays, monthStart]);

  const nextMonthHolidays = useMemo(() => {
    return holidays.filter(h => isSameMonth(parseISO(h.date), nextMonthDate));
  }, [nextMonthDate, holidays]);

  const khmerMonthName = KHMER_MONTHS[currentDate.getMonth()];
  const khmerYear = toKhmerNumber(currentDate.getFullYear());

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b-2 border-khmer-red pb-4">
        <div className="header-left">
          <h1 className="text-4xl font-bold text-khmer-red">{khmerMonthName} {khmerYear}</h1>
        </div>
        <div className="header-right text-right text-text-muted text-sm space-y-1">
          <div>ពុទ្ធសករាជ ២៥៦៩ - ២៥៧០</div>
          <div>{format(currentDate, 'MMMM yyyy')} • Year of the Horse</div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4">
        
        {/* Main Calendar Card */}
        <div className="bento-card md:col-span-2 md:row-span-3 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-bold text-khmer-red">ខែ{khmerMonthName} ( {format(currentDate, 'MMMM')} )</span>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-khmer-cream text-khmer-red border border-khmer-border transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-khmer-cream text-khmer-red border border-khmer-border transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-4 border-b border-khmer-border pb-2">
            {KHMER_DAYS_SHORT.map((day, idx) => (
              <div 
                key={day} 
                className={`text-center text-[10px] font-bold uppercase tracking-widest ${idx === 0 ? 'text-khmer-red' : 'text-text-muted'}`}
              >
                {day}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentDate.toString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-7 grid-rows-6 flex-grow gap-1"
            >
              {days.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const holiday = getDayHoliday(day);
                const isSun = getDay(day) === 0;

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative flex flex-col items-center justify-center rounded-xl p-1 transition-all border
                      ${!isCurrentMonth ? 'opacity-20 pointer-events-none border-transparent' : 'border-gray-50'}
                      ${isSelected ? 'bg-khmer-red/5 border-khmer-red' : 'hover:bg-khmer-cream'}
                      ${holiday ? 'bg-red-50/50' : ''}
                      ${isToday(day) ? 'ring-2 ring-khmer-gold ring-inset' : ''}
                    `}
                  >
                    <span className={`text-base font-bold transition-transform ${isSun || holiday ? 'text-khmer-red' : 'text-text-dark'} ${isSelected ? 'scale-110' : ''}`}>
                      {toKhmerNumber(day.getDate())}
                    </span>
                    
                    {/* Lunar Date Display */}
                    {isCurrentMonth && (
                      <span className={`text-[8px] mt-0.5 font-medium ${isSelected ? 'text-khmer-red' : 'text-text-muted'}`}>
                        {getKhmerLunarDay(day).day} {getKhmerLunarDay(day).phase.charAt(0)}
                      </span>
                    )}

                    {holiday && (
                      <div className="absolute top-1 right-1" title={holiday.nameKh}>
                        <div className={`w-1.5 h-1.5 rounded-full ${holiday.isArtDay ? 'bg-khmer-gold' : 'bg-khmer-red'}`} />
                      </div>
                    )}
                    
                    {getKhmerLunarDay(day).isSile && isCurrentMonth && (
                      <div className="absolute top-1 left-1" title="ថ្ងៃសីល">
                        <img 
                          src={thngaiSile}
                          alt="Thngai Sile" 
                          className="w-4 h-4 md:w-5 md:h-5 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Public Holiday List Card */}
        <div className="bento-card md:col-span-1 md:row-span-2 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 border-b border-khmer-border pb-2">
            <div className="text-xs uppercase tracking-widest font-bold text-khmer-gold">
              ថ្ងៃឈប់សម្រាកសាធារណៈ
            </div>
            {isLoading && <Loader2 className="w-3 h-3 animate-spin text-khmer-gold" />}
          </div>
          <div className="space-y-4">
            {currentMonthHolidays.length > 0 ? (
              currentMonthHolidays.map((h, i) => (
                <div key={i} className={`border-l-4 ${h.isArtDay ? 'border-khmer-gold bg-khmer-gold/5' : 'border-khmer-red'} pl-4 py-2 rounded-r-lg`}>
                  <h3 className={`text-sm font-bold leading-tight mb-1 ${h.isArtDay ? 'text-khmer-gold' : 'text-khmer-red'}`}>
                    {h.nameKh || h.name}
                  </h3>
                  <p className="text-[10px] text-text-muted">
                    {toKhmerNumber(parseISO(h.date).getDate())} {KHMER_MONTHS[parseISO(h.date).getMonth()]} • {h.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted italic opacity-60">គ្មានថ្ងៃឈប់សម្រាកក្នុងខែនេះទេ</p>
            )}
          </div>
        </div>

        {/* Selected Day Info Card (Today/Lunar Phase equivalent) */}
        <div className="bento-card md:col-span-1 md:row-span-1 bg-khmer-red text-white border-khmer-red shadow-[4px_4px_0px_theme(colors.khmer-red)] flex flex-col justify-center items-center text-center">
          <div className="h-12 mb-2 flex items-center justify-center">
            {getKhmerLunarDay(selectedDate || new Date()).isSile ? (
              <img 
                src="/art-day-icon.png" 
                alt="Sile Icon" 
                className="w-10 h-10 object-contain brightness-200 contrast-125"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-4xl">🌕</div>
            )}
          </div>
          <div className="text-lg font-bold leading-tight">
            ថ្ងៃ {selectedDate ? getKhmerLunarDay(selectedDate).day : ''} {selectedDate ? getKhmerLunarDay(selectedDate).phase : ''} ខែ{selectedDate ? getKhmerLunarDay(selectedDate).month : ''}
          </div>
          <div className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">
            {selectedDate ? format(selectedDate, 'EEEE, do MMMM') : ''}
          </div>
        </div>

        {/* Quote Card */}
        <div className="bento-card md:col-span-1 md:row-span-1 italic text-khmer-gold flex items-center justify-center text-center text-lg font-medium leading-relaxed px-6">
          "សេចក្តីសុខ កើតចេញពីចិត្តដែលស្ងប់"
        </div>

        {/* Next Month Card */}
        <div className="bento-card md:col-span-1 md:row-span-1 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-khmer-gold mb-2">ខែបន្ទាប់ ({format(nextMonthDate, 'MMMM').toUpperCase()})</div>
            <div className="text-2xl font-bold text-khmer-red">{KHMER_MONTHS[nextMonthDate.getMonth()]}</div>
          </div>
          <div className="text-[10px] text-text-muted leading-relaxed">
            មាន {toKhmerNumber(nextMonthHolidays.length)} ថ្ងៃឈប់សម្រាកធំៗ ។<br />
            {nextMonthHolidays[0]?.nameKh || 'បន្តដំណើរទៅមុខទៀត'}
          </div>
        </div>

      </div>

      <footer className="mt-4 text-center">
        <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] opacity-50">
          DESIGNED FOR KHMER CULTURAL HERITAGE • 2026
        </p>
      </footer>
    </div>
  );
}

