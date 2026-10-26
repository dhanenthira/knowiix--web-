import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import './DateRangePicker.css';

/**
 * Format Date to YYYY-MM-DD
 */
export function formatIsoDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format Date to Human Readable "MMM D, YYYY"
 */
export function formatDisplayDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Shadcn UI Styled Date Range Picker
 *
 * Props:
 * - startDate: ISO string (YYYY-MM-DD) or null
 * - endDate: ISO string (YYYY-MM-DD) or null
 * - onChange: ({ startDate, endDate }) => void
 * - onClear: () => void
 * - placeholder: string
 */
export default function DateRangePicker({
  startDate = null,
  endDate = null,
  onChange,
  onClear,
  placeholder = 'Select date range'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);

  // Initialize viewing calendar month (defaults to startDate or current date)
  const initialView = startDate ? new Date(startDate) : new Date();
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth()); // 0-indexed

  // Internal draft state for smooth range picking
  const [draftStart, setDraftStart] = useState(startDate);
  const [draftEnd, setDraftEnd] = useState(endDate);

  const containerRef = useRef(null);

  // Sync internal draft when props change
  useEffect(() => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [startDate, endDate]);

  // Click outside listener to close popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setHoverDate(null);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Month navigation
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  // Preset Handlers
  const applyPreset = (presetKey) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start = null;
    let end = null;

    if (presetKey === 'today') {
      start = formatIsoDate(today);
      end = formatIsoDate(today);
    } else if (presetKey === '7d') {
      const s = new Date(today);
      s.setDate(s.getDate() - 6);
      start = formatIsoDate(s);
      end = formatIsoDate(today);
    } else if (presetKey === '14d') {
      const s = new Date(today);
      s.setDate(s.getDate() - 13);
      start = formatIsoDate(s);
      end = formatIsoDate(today);
    } else if (presetKey === '30d') {
      const s = new Date(today);
      s.setDate(s.getDate() - 29);
      start = formatIsoDate(s);
      end = formatIsoDate(today);
    } else if (presetKey === 'this_month') {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      const e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      start = formatIsoDate(s);
      end = formatIsoDate(e);
    } else if (presetKey === 'last_month') {
      const s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const e = new Date(today.getFullYear(), today.getMonth(), 0);
      start = formatIsoDate(s);
      end = formatIsoDate(e);
    } else if (presetKey === 'all') {
      start = null;
      end = null;
    }

    setDraftStart(start);
    setDraftEnd(end);
    if (start) {
      const d = new Date(start);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
    if (onChange) {
      onChange({ startDate: start, endDate: end });
    }
    setIsOpen(false);
  };

  // Handle Day Click
  const handleDayClick = (isoStr) => {
    if (!draftStart || (draftStart && draftEnd)) {
      // Starting new selection
      setDraftStart(isoStr);
      setDraftEnd(null);
    } else if (draftStart && !draftEnd) {
      // Completing selection
      let finalStart = draftStart;
      let finalEnd = isoStr;

      if (isoStr < draftStart) {
        finalStart = isoStr;
        finalEnd = draftStart;
      }

      setDraftStart(finalStart);
      setDraftEnd(finalEnd);
      setHoverDate(null);

      if (onChange) {
        onChange({ startDate: finalStart, endDate: finalEnd });
      }
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setDraftStart(null);
    setDraftEnd(null);
    setHoverDate(null);
    if (onClear) onClear();
    if (onChange) onChange({ startDate: null, endDate: null });
  };

  // Calendar calculations for viewYear and viewMonth
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { month: 'long' });
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  // Compute days list
  const calendarCells = [];

  // 1. Preceding days from prev month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const prevDate = new Date(viewYear, viewMonth - 1, dayNum);
    calendarCells.push({
      dayNum,
      iso: formatIsoDate(prevDate),
      isCurrentMonth: false
    });
  }

  // 2. Days in current month
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(viewYear, viewMonth, d);
    calendarCells.push({
      dayNum: d,
      iso: formatIsoDate(curDate),
      isCurrentMonth: true
    });
  }

  // 3. Trailing days to fill 42 cells (6 rows) or 35 cells
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(viewYear, viewMonth + 1, d);
    calendarCells.push({
      dayNum: d,
      iso: formatIsoDate(nextDate),
      isCurrentMonth: false
    });
  }

  // Determine current active effective range for highlight
  const effectiveStart = draftStart;
  const effectiveEnd = draftEnd || (draftStart && hoverDate && hoverDate >= draftStart ? hoverDate : null);

  // Label text
  let buttonLabel = placeholder;
  const hasSelection = Boolean(draftStart);
  if (draftStart && draftEnd) {
    if (draftStart === draftEnd) {
      buttonLabel = formatDisplayDate(draftStart);
    } else {
      buttonLabel = `${formatDisplayDate(draftStart)} – ${formatDisplayDate(draftEnd)}`;
    }
  } else if (draftStart) {
    buttonLabel = `${formatDisplayDate(draftStart)} – Pick End Date`;
  }

  const todayIso = formatIsoDate(new Date());

  return (
    <div className="shadcn-date-range-picker" ref={containerRef}>
      {/* Popover Trigger Button */}
      <button
        type="button"
        className={`shadcn-picker-trigger ${isOpen ? 'is-open' : ''} ${hasSelection ? 'has-range' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="shadcn-picker-icon">
          <CalendarIcon size={16} />
        </span>
        <span className="shadcn-picker-label">{buttonLabel}</span>
        {hasSelection && (
          <span
            className="shadcn-picker-clear-btn"
            title="Clear date filter"
            onClick={handleClear}
            role="button"
          >
            <X size={14} />
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="shadcn-picker-popover animate-in">
          {/* Preset Buttons Sidebar */}
          <div className="shadcn-picker-presets">
            <span className="shadcn-presets-header">Quick Filters</span>
            <button
              type="button"
              className={`shadcn-preset-btn ${!draftStart && !draftEnd ? 'active' : ''}`}
              onClick={() => applyPreset('all')}
            >
              All Time
            </button>
            <button
              type="button"
              className={`shadcn-preset-btn ${draftStart === todayIso && draftEnd === todayIso ? 'active' : ''}`}
              onClick={() => applyPreset('today')}
            >
              Today
            </button>
            <button
              type="button"
              className="shadcn-preset-btn"
              onClick={() => applyPreset('7d')}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              className="shadcn-preset-btn"
              onClick={() => applyPreset('14d')}
            >
              Last 14 Days
            </button>
            <button
              type="button"
              className="shadcn-preset-btn"
              onClick={() => applyPreset('30d')}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              className="shadcn-preset-btn"
              onClick={() => applyPreset('this_month')}
            >
              This Month
            </button>
            <button
              type="button"
              className="shadcn-preset-btn"
              onClick={() => applyPreset('last_month')}
            >
              Last Month
            </button>
          </div>

          {/* Calendar Month View */}
          <div className="shadcn-picker-calendar">
            {/* Header: Month Title & Navigation */}
            <div className="shadcn-cal-header">
              <button
                type="button"
                className="shadcn-cal-nav-btn"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="shadcn-cal-title">
                {monthName} {viewYear}
              </div>

              <button
                type="button"
                className="shadcn-cal-nav-btn"
                onClick={handleNextMonth}
                aria-label="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="shadcn-cal-weekdays">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="shadcn-cal-weekday">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="shadcn-cal-grid">
              {calendarCells.map((cell, idx) => {
                const isStart = cell.iso === effectiveStart;
                const isEnd = cell.iso === effectiveEnd;
                const isInRange =
                  effectiveStart &&
                  effectiveEnd &&
                  cell.iso > effectiveStart &&
                  cell.iso < effectiveEnd;
                const isToday = cell.iso === todayIso;

                let cellClass = 'shadcn-cal-day';
                if (!cell.isCurrentMonth) cellClass += ' outside-month';
                if (isToday) cellClass += ' is-today';
                if (isStart) cellClass += ' is-start';
                if (isEnd) cellClass += ' is-end';
                if (isInRange) cellClass += ' in-range';

                return (
                  <div
                    key={`${cell.iso}_${idx}`}
                    className={`shadcn-cal-day-cell ${isInRange ? 'cell-in-range' : ''} ${isStart ? 'cell-start' : ''} ${isEnd ? 'cell-end' : ''}`}
                  >
                    <button
                      type="button"
                      className={cellClass}
                      onClick={() => handleDayClick(cell.iso)}
                      onMouseEnter={() => {
                        if (draftStart && !draftEnd) {
                          setHoverDate(cell.iso);
                        }
                      }}
                    >
                      {cell.dayNum}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & Actions */}
            <div className="shadcn-picker-footer">
              <div className="shadcn-picker-status">
                {draftStart && draftEnd ? (
                  <span className="status-selected">
                    <Check size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    {formatDisplayDate(draftStart)} – {formatDisplayDate(draftEnd)}
                  </span>
                ) : draftStart ? (
                  <span className="status-picking">Pick an end date to finalize range</span>
                ) : (
                  <span className="status-empty">Click start date to begin</span>
                )}
              </div>

              <div className="shadcn-picker-actions">
                <button
                  type="button"
                  className="shadcn-btn-secondary"
                  onClick={handleClear}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="shadcn-btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
