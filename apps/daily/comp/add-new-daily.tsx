import React, { useRef, useState } from "react";
import { DailyParams } from "@/lib/types";
import { useSWRConfig } from "swr";
import useDaily from "../hooks/useDaily";
import Chip from "@/comp/Chip";

interface Items {
  [key: number]: string;
}

const AddNewDaily = ({ teamId }: { teamId: string }) => {
  const { mutate } = useSWRConfig();
  const { date, url, reset } = useDaily();
  const inputRef = useRef<HTMLInputElement>(null);
  const [list, setList] = useState<Items>({});
  const counter = useRef(0);

  const initialErrorObj = {
    show: false,
    message: "",
  };
  const [errorInList, setErrorInList] = useState(initialErrorObj);

  const dailyContainerRef = useRef<HTMLDivElement>(null);
  if (!url || !date) {
    // TODO UI
    return <p>ups! something went wrong</p>;
  }

  const formatDate = date.toLocaleDateString(undefined, {
    // day: "2-digit",
    // month: "long",
    dateStyle: "long",
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log("User pressed: ", event.key);
    if (!inputRef.current) return;
    if (inputRef.current.value.trim() === "") return;
    if (event.key != "Enter") return;
    // only the values
    const items = new Set<string>(Object.entries(list).map((a) => a[1]));
    if (items.has(inputRef.current.value)) {
      setErrorInList({
        show: true,
        message: "already in list",
      });
      setTimeout(() => {
        setErrorInList(initialErrorObj);
      }, 1500);
      return;
    }
    const obj: Items = {
      ...list,
      [counter.current]: inputRef.current.value,
    };
    setList(obj);
    counter.current += 1;
    inputRef.current.value = "";
    // console.log("offsetHeight", dailyContainerRef?.current);
    setTimeout(() => {
      // litte delay while the new item is rendered
      dailyContainerRef.current?.scrollTo({
        behavior: "smooth",
        top: dailyContainerRef?.current.scrollHeight + 30,
      });
    }, 100);
  };

  const handleLocalDelete = (keyParam: number) => {
    const { [keyParam]: _, ...newObj2 } = list;
    setList(newObj2);
  };

  const handleSave = async () => {
    console.log(list);
    // return;
    try {
      const res = await fetch("/api/daily/create", {
        method: "POST",
        body: JSON.stringify({
          date: date.getTime(),
          items: list,
          teamId,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        console.log(json);
        mutate(url);
        console.log("created");
        reset();
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <section className="container flex flex-col p-2">
      {/* {JSON.stringify(list)} */}
      <strong>teamId:{teamId}</strong>
      <header className="flex gap-1 center-x center-y">
        <button>{"<"}</button>
        <p className="text-normal text-secondary text-bold">{formatDate}</p>
        <button>{">"}</button>
      </header>
      <div
        ref={dailyContainerRef}
        className="mt-2"
        style={{
          flexGrow: 1,
          display: "grid",
          alignItems: "flex-end",
          overflow: "scroll",
        }}
      >
        <div className="flex gap-1 wrap">
          {Object.entries(list).map((k, index) => (
            <Chip
              key={index}
              name={k[1]}
              handleDelete={() => {
                // console.log(k);
                handleLocalDelete(+k[0]);
              }}
            />
          ))}
        </div>
      </div>
      <input
        className="input-primary mt-1"
        onKeyDown={handleKeyDown}
        placeholder="type here..."
        ref={inputRef}
        type="text"
      />
      <p className="text-secondary text-small">Enter to push</p>

      {errorInList.show && <strong> {errorInList.message}</strong>}

      <section className="flex gap-2 center-y mt-1">
        <button
          className="btn btn-secondary flex center-x p-1 max-width"
          onClick={reset}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary flex center-x center-text p-1 max-width"
          onClick={handleSave}
        >
          Save
        </button>
      </section>
      <style jsx>{`
        .container {
          width: 90%;
          overflow: hidden;
          flex-grow: 1;
          //max-width: 300px;
        }

        .dailys-container {
          flex-grow: 1;
          display: grid;
          align-items: flex-end;
          overflow: scroll;
        }
      `}</style>
    </section>
  );
};

export default AddNewDaily;
