import type { NextPage } from "next";
import Head from "next/head";
import { getWeekOfMonth, MONTHS_NAMES, weekRange } from "@/src/date";

const Home: NextPage = () => {
  var date = new Date();

  var thisMonth = date.getMonth();

  // var thisDay = date.getDate();

  const weeks = () => {
    const list: string[] = [];

    for (let i = 0; i < 6; i++) {
      const week = new Date(date.getFullYear(), thisMonth, i * 7);
      const { start, end } = weekRange(week);
      list.push(
        `${MONTHS_NAMES[start.getMonth()]} ${start.getDate()} - ${
          MONTHS_NAMES[end.getMonth()]
        } ${end.getDate()}`
      );
    }

    return list;
  };
  // const today =
  return (
    <div>
      <Head>
        <title>Planing</title>
        <meta name="description" content="Content description here" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        {weeks().map((date, index) => (
          <div key={index}>{date}</div>
        ))}
        <strong style={{ marginTop: "1rem" }}>
          Week: {getWeekOfMonth(date)}
        </strong>
      </main>

      <footer>App footer</footer>
    </div>
  );
};

export default Home;
