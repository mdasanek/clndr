// Календарь тренировок
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const weekdayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const calendarMonth = document.getElementById('calendar-month');
const calendarYear = document.getElementById('calendar-year');
const calendarWeekdays = document.getElementById('calendar-weekdays');
const calendarDays = document.getElementById('calendar-days');
const emojiModal = document.getElementById('emoji-modal');

let currentDate = new Date();
let viewMonth = currentDate.getMonth();
let viewYear = currentDate.getFullYear();
let selectedDate = null;

function getSelectedDays() {
  try {
    return JSON.parse(localStorage.getItem('selectedDays') || '{}');
  } catch {
    return {};
  }
}

function setSelectedDays(days) {
  localStorage.setItem('selectedDays', JSON.stringify(days));
}

function showEmojiModal(dateStr) {
  selectedDate = dateStr;
  emojiModal.classList.add('show');
}

function hideEmojiModal() {
  emojiModal.classList.remove('show');
  selectedDate = null;
}

function selectEmoji(emoji) {
  if (!selectedDate) return;
  
  const days = getSelectedDays();
  if (emoji === '') {
    delete days[selectedDate];
  } else {
    days[selectedDate] = emoji;
  }
  setSelectedDays(days);
  
  // Обновляем отображение
  renderCalendar(viewMonth, viewYear);
  hideEmojiModal();
}

function renderCalendar(month, year) {
  calendarMonth.textContent = monthNames[month];
  calendarYear.textContent = year;
  
  // 1. Дни недели
  calendarWeekdays.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const el = document.createElement('div');
    el.className = 'calendar-weekday';
    el.textContent = weekdayNames[i];
    calendarWeekdays.appendChild(el);
  }

  // 2. Дни месяца
  calendarDays.innerHTML = '';
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1; // Пн=0, Вс=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selectedDays = getSelectedDays();
  const today = new Date();

  // Пустые ячейки до первого дня месяца
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day';
    empty.textContent = '';
    empty.style.cursor = 'default';
    calendarDays.appendChild(empty);
  }
  
  // Дни месяца
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'calendar-day';
    
    if (selectedDays[dateStr]) {
      el.textContent = selectedDays[dateStr];
      el.classList.add('selected');
    } else {
      el.textContent = day;
    }
    
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      el.classList.add('today');
    }
    
    el.addEventListener('click', () => {
      if (el.textContent === '') return;
      showEmojiModal(dateStr);
    });
    
    calendarDays.appendChild(el);
  }
  
  // Пустые ячейки до конца сетки (чтобы всегда было 6 строк)
  const totalCells = 42; // 6 строк * 7 колонок
  const filledCells = startDay + daysInMonth;
  for (let i = filledCells; i < totalCells; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day';
    empty.textContent = '';
    empty.style.cursor = 'default';
    calendarDays.appendChild(empty);
  }
}

// Обработчики для модального окна
document.querySelectorAll('.emoji-option').forEach(option => {
  option.addEventListener('click', () => {
    const emoji = option.getAttribute('data-emoji');
    selectEmoji(emoji);
  });
});

// Закрытие модального окна при клике вне его
emojiModal.addEventListener('click', (e) => {
  if (e.target === emojiModal) {
    hideEmojiModal();
  }
});

document.getElementById('prev-month').onclick = () => {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderCalendar(viewMonth, viewYear);
};
document.getElementById('next-month').onclick = () => {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderCalendar(viewMonth, viewYear);
};
document.getElementById('prev-year').onclick = () => {
  viewYear--;
  renderCalendar(viewMonth, viewYear);
};
document.getElementById('next-year').onclick = () => {
  viewYear++;
  renderCalendar(viewMonth, viewYear);
};

renderCalendar(viewMonth, viewYear); 