/**
 * return the monday date of the incoming week
 */
export const mondayThisWeek = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}


export const offsetDate = (base: Date, count: number): Date => {
  const date = new Date(base)
  date.setDate(base.getDate() + count)
  return date
}

export const weekRange = (date: Date): { start: Date, end: Date } => {
  const monday = mondayThisWeek(date)
  return {
    start: monday,
    end: offsetDate(monday, 6),
  }
}

export const getWeekOfMonth = (date: Date): number => {
  const adjustedDate = date.getDate() + date.getDay();
  // console.log("d", date)
  // console.log(adjustedDate)
  const prefixes = ['0', '1', '2', '3', '4', '5'];
  return (parseInt(prefixes[0 | adjustedDate / 7]) + 1);
}

export const moveMonth = (direction: number, date: Date): Date => {
  if (direction != 0 && direction != 1) throw new Error("out of range");

  const leftMovement = direction === 0;

  if (leftMovement) {
    return new Date(date.setMonth(date.getMonth() - 1, 1))
  }

  return new Date(date.setMonth(date.getMonth() + 1,))
}

export const daysBetweenDates = (dateA: Date, dateB: Date,): number => {
  let diff = dateA.getTime() - dateB.getTime();

  diff /= 1000 * 60 * 60 * 24 // days

  return Math.abs(Math.round(diff));
}

interface WeekOnAList {
  weekIndex: number;
  start: Date;
  end: Date;
  template: string;
  range: Date[];
}
export const weeksOnAList = (date: Date) => {
  const list: WeekOnAList[] = [];

  for (let i = 0; i < 6; i++) {
    const week = new Date(date.getFullYear(), date.getMonth(), i * 7);
    const { start, end } = weekRange(week);

    const range = [
      ...Array(7).fill('').map(
        (_, key) => offsetDate(start, key)
      )
    ]
    list.push({
      weekIndex: i,
      range,
      start,
      end,
      template: `${MONTHS_NAMES[start.getMonth()]} ${start.getDate()} - ${MONTHS_NAMES[end.getMonth()]
        } ${end.getDate()}`
    });
  }

  return list;
};

/**
 * Get the week number of the month, from "First" to "Last"
 * @param {Date} date 
 * @returns {string}
 */
function weekOfTheMonth(date: Date) {
  const day = date.getDate()
  const weekDay = date.getDay()
  let week = Math.ceil(day / 7)

  const ordinal = ['First', 'Second', 'Third', 'Fourth', 'Last']
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


  // Check the next day of the week and if it' on the same month, if not, respond with "Last"
  const nextWeekDay = new Date(date.getTime() + (1000 * 60 * 60 * 24 * 7))
  if (nextWeekDay.getMonth() !== date.getMonth()) {
    week = 5
  }
  console.log("week", week)

  return `${ordinal[week - 1]} ${weekDays[weekDay]}`
}

export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export const findDateOnRange = (range: Date[], date: Date): boolean | null => {
  for (const current of range) {
    // console.log(daysBetweenDates(current, date))
    if (daysBetweenDates(current, date) <= 1 && date.getDate() === current.getDate()) {
      return true;
    }
  }
  return null;

}

// console.log(getWeekInMonth(new Date('19 October 2022')))

const days = [
  // new Date('2021-05-14'),
  // new Date('1 October 2022'),
  // new Date('8 October 2022'),
  // new Date('13 October 2022'),
  // new Date('17 October 2022'),
  // new Date('5 July 2010'),
  // new Date('12 July 2010'),
  // new Date('22 April 2017'),
  // new Date('29 April 2017'),
  // new Date('31 April 2017'),
]

// for (let i = 0; i < days.length; i += 1) {
//   const d = days[i]
//   console.log(d, weekOfTheMonth(d))
// }

export const MONTHS_NAMES = [
  "JAN",
  "FEB",
  "MARC",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const DAYS_NAMES = [
  "Monday", // 1
  "Tuesday", // 2
  "Wednesday", // 3
  "Thursday", // 4
  "Friday", // 5
  "Saturday", // 6
  "Sunday", // 0
];