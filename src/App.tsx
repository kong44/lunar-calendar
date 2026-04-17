/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
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
  getDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KHMER_MONTHS, 
  KHMER_DAYS_SHORT, 
  toKhmerNumber, 
  HOLIDAYS_2026,
  Holiday,
  getKhmerLunarDay 
} from './constants';
import thngaiSile from './thngai_sile.png'
export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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
    return HOLIDAYS_2026.find(h => h.day === date.getDate() && h.month === date.getMonth());
  };

  const currentMonthHolidays = useMemo(() => {
    return HOLIDAYS_2026.filter(h => h.month === currentDate.getMonth());
  }, [currentDate]);

  const nextMonthHolidays = useMemo(() => {
    return HOLIDAYS_2026.filter(h => h.month === nextMonthDate.getMonth());
  }, [nextMonthDate]);

  const khmerMonthName = KHMER_MONTHS[currentDate.getMonth()];
  const khmerYear = toKhmerNumber(currentDate.getFullYear());

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b-2 border-khmer-red pb-4">
        <div className="header-left">
          <h1 className="text-4xl font-moul text-khmer-red">{khmerMonthName} {khmerYear}</h1>
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
            <span className="text-xl font-moul text-khmer-red">ខែ{khmerMonthName} ( {format(currentDate, 'MMMM')} )</span>
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
          <div className="text-xs uppercase tracking-widest font-bold text-khmer-gold mb-6 border-b border-khmer-border pb-2">
            ថ្ងៃឈប់សម្រាកសាធារណៈ
          </div>
          <div className="space-y-4">
            {currentMonthHolidays.length > 0 ? (
              currentMonthHolidays.map((h, i) => (
                <div key={i} className={`border-l-4 ${h.isArtDay ? 'border-khmer-gold bg-khmer-gold/5' : 'border-khmer-red'} pl-4 py-2 rounded-r-lg`}>
                  <h3 className={`text-sm font-bold font-moul leading-tight mb-1 ${h.isArtDay ? 'text-khmer-gold' : 'text-khmer-red'}`}>{h.nameKh}</h3>
                  <p className="text-[10px] text-text-muted">{toKhmerNumber(h.day)} {KHMER_MONTHS[h.month]} • {h.name}</p>
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
          <div className="text-lg font-moul leading-tight">
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
            <div className="text-2xl font-moul text-khmer-red">{KHMER_MONTHS[nextMonthDate.getMonth()]}</div>
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

