import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import {
  daysBetweenDates,
  DAYS_NAMES,
  findDateOnRange,
  formatDate,
  getWeekOfMonth,
  MONTHS_NAMES,
  moveMonth,
  offsetDate,
  weekRange,
  weeksOnAList,
} from "@/src/date";
import { Daily } from "@prisma/client";

import AddIcon from "@/comp/icons/addIcons";
import AddNewDaily from "@/apps/daily/comp/add-new-daily";
import Modal from "@/comp/shared/modal";
import DailyProvider from "@/apps/daily/contexts/DailyContext";
import useDaily from "@/apps/daily/hooks/useDaily";

const fetcher = (resource: RequestInfo, init: RequestInit) =>
  fetch(resource, init).then((res) => res.json());

const Page: NextPage = () => {
  const dailyState = useDaily();
  const { open: modalIsOpen, changeModalState, reset } = dailyState;
  const initialDate = new Date(); // tomorrow offsetDate(new Date(), 1);

  const thisDay = 3 > 2 ? initialDate.getDay() : 1; // initialDate.getDay();

  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);

  const WEEKS = weeksOnAList(currentMonth);

  //TODO set to 0 when moving throughout month
  const indexOfThisDate =
    WEEKS.find((week) => findDateOnRange(week.range, initialDate))?.weekIndex ??
    1;

  const [currentWeek, setCurrentWeek] = useState<number>(
    indexOfThisDate,
    // getWeekOfMonth(currentMonth)
  );

  const text = currentMonth.toLocaleString("es-CO", {
    month: "long",
    year: "numeric",
  });

  // const { data, error, mutate } = useSWR<any>(
  //   `api/getWeklyFood?m=${currentMonth.getMonth()}&y=${currentMonth.getFullYear()}&w=${currentWeek}`,
  //   fetcher,
  //   { refreshInterval: () => 1000 }
  // );

  const { data, error } = useSWR<Daily[]>(
    `api/getTestDaily?startDate=${WEEKS[currentWeek].start}&endDate=${WEEKS[currentWeek].end}`,
    fetcher,
    // { refreshInterval: () => 1000 }
  );
  // console.log(rangeOfWeeks[2].range);
  // console.log(
  //   "INDEX",
  //   rangeOfWeeks.find((A) => A.range?.indexOf(currentMonth.getDate()))
  // );

  useEffect(() => {
    const diff = daysBetweenDates(initialDate, currentMonth);
    const sameYear = initialDate.getFullYear() === currentMonth.getFullYear();
    const sameMonth = initialDate.getMonth() === currentMonth.getMonth();

    if (diff <= 30 && sameYear && sameMonth) {
      // back on the same month
      setCurrentWeek(
        // getWeekOfMonth(initialDate)
        WEEKS.find(
          (week) => findDateOnRange(week.range, initialDate),
          // (week) => week.range.includes(initialDate)
        )?.weekIndex ?? 1,
      );
      return;
      // getWeekOfMonth(initialDate)
    }
    setCurrentWeek(getWeekOfMonth(currentMonth));
  }, [currentMonth]);

  const itemsFor = (index: number) =>
    Object.entries(
      data?.find(
        (daily) =>
          new Date(daily.date).getDay() === (index != 6 ? index + 1 : 0),
      )?.itemList ?? {},
    );

  // const [openModal, setOpenModal] = useState(false);

  // const switchModal = (state: boolean) => setOpenModal(state);

  return (
    <>
      <Head>
        <title>List your recipes</title>
        <meta name="description" content="Content description here" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <header className="flex space-between p-1 ">
        <p>logo</p>
        <p>menu</p>
      </header>
      <section className="flex center-x" style={{ width: "100%" }}>
        <div
          className="flex gap-2 center-x space-between"
          style={{ maxWidth: "300px", width: "100%" }}
        >
          <button
            onClick={() => {
              setCurrentMonth(moveMonth(0, currentMonth));
            }}
          >
            left
          </button>
          <p>{text.charAt(0).toUpperCase() + text.slice(1)}</p>
          <button
            onClick={() => {
              setCurrentMonth(moveMonth(1, currentMonth));
            }}
          >
            right
          </button>
        </div>
      </section>
      {JSON.stringify(`${initialDate.getMonth() + 1}-${initialDate.getDate()}`)}
      <p>
        <strong>currentWeek : {currentWeek}</strong>
      </p>
      <strong>indexOfThisDate : {indexOfThisDate}</strong>
      <section className="flex center-x">
        <div className="flex gap-2 mt-2 scroll">
          {WEEKS.map((week, index) => (
            <div
              key={index}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                userSelect: "none",
                ...(currentWeek === week.weekIndex && {
                  color: "var(--secondary)",
                }),
              }}
              onClick={() => {
                setCurrentWeek(week.weekIndex);
              }}
            >
              <p>{week.template}</p>
              {/* <p>{week.range?.join(",")}</p> */}
            </div>
          ))}
        </div>
      </section>
      <strong>thisDay :{thisDay}</strong>
      {/* <button
        onClick={() =>
          changeModalState({
            ...dailyState,
            type: "create",
            open: true,
          })
        }
      >
        open modal
      </button> */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Modal open={modalIsOpen} onClose={reset} maxWidth={420} maxHeight={300}>
        {/* unmount AddNewDaily */}
        {modalIsOpen && <AddNewDaily teamId="" />}
      </Modal>
      <section className="flex flex-col gap-3 m-3 daily-container p-2">
        {DAYS_NAMES.map((day, index) => (
          <div key={index}>
            <>
              <p
                style={{
                  fontWeight: "bold",
                  color: "rgb(52, 52, 52)",
                  ...(thisDay != 0 &&
                    index === thisDay - 1 && {
                      color: "var(--primary)",
                    }),
                  ...(thisDay === 0 &&
                    index === DAYS_NAMES.length - 1 && {
                      color: "var(--primary)",
                    }),
                }}
              >
                {day}
              </p>
              <div
                className="flex gap-1 ml-3 wrap"
                style={{ alignItems: "flex-start" }}
              >
                {/* {JSON.stringify(itemsFor(index))} */}
                {itemsFor(index).length > 0 ? (
                  itemsFor(index).map((json, key) => (
                    <span key={key}>
                      {json[1]}
                      {" /"}
                    </span>
                  ))
                ) : (
                  <>
                    <button
                      className="btn btn-secondary center-y gap-1"
                      onClick={() =>
                        changeModalState({
                          ...dailyState,
                          type: "create",
                          open: true,
                          date: offsetDate(WEEKS[currentWeek].start, index),
                          url: `api/getTestDaily?startDate=${WEEKS[currentWeek].start}&endDate=${WEEKS[currentWeek].end}`,
                        })
                      }
                    >
                      <AddIcon />
                      add new
                    </button>
                    {WEEKS[currentWeek].range[index].getDate()}
                    {/* <AddNewDaily
                      url="/api/daily/create"
                      options={{
                        // day: index != 6 ? index + 1 : 0,
                        // itemList: [],
                        date: offsetDate(WEEKS[currentWeek].start, index),
                        url: `api/getTestDaily?startDate=${WEEKS[currentWeek].start}&endDate=${WEEKS[currentWeek].end}`,
                        // date: WEEKS[currentWeek].range[index],
                      }}
                    /> */}
                  </>
                )}
              </div>
            </>
          </div>
        ))}
      </section>
      {/* {data && data.} */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {error && (
        <>
          <p>
            <strong>error</strong>
          </p>
          {/* <p>type {JSON.stringify(typeof error)}</p>
        <p>{JSON.stringify(error)}</p> */}
          {/* <p>{JSON.stringify(error?.message)}</p> */}
        </>
      )}
      {/* <button onClick={() => mutate()}>refresh</button>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          // @ts-ignore
          const form = new FormData(event.target);

          const json = Object.fromEntries(form);
          const ctrl = new AbortController();
          fetch("api/createDaily", {
            method: "POST",
            body: JSON.stringify(json),
            signal: ctrl.signal,
          })
            .then(async (result) => {
              console.log(result);
              const data = await result.json();
              if (result.ok) {
                console.log("DATA", data);
                mutate();
              } else {
                if (typeof data === "object" && "message" in data) {
                  console.log(data.message);
                }
              }
            })
            .catch((e) => {
              // console.log(Object.keys(e));
              // console.log(Object.entries(e));
              console.log("error sending", e);
            });
          // setTimeout(() => {
          //   ctrl.abort();
          // }, 100);
          // console.log(json);
        }}
      >
        <input type="number" placeholder="day" name="day" required />
        <input type="text" name="content" />
        <input type="submit" value="Save" className="btn btn-primary" />
      </form> */}
      <style jsx>{`
        .scroll {
          max-width: 1000px;
          overflow-x: scroll;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scroll::-webkit-scrollbar {
          display: none;
        }

        .daily-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          margin: 0 auto;
          max-width: 800px;
        }
      `}</style>
    </>
  );
};

const ContainerPage = () => {
  return (
    <DailyProvider>
      <Page />
    </DailyProvider>
  );
};

export default ContainerPage;
