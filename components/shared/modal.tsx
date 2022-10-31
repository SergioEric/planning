import React from "react";
import { zIndex } from "@/lib/constanst";

const Modal = ({
  open,
  children,
  onClose,
  maxWidth = 800,
  maxHeight = 600,
}: {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: number;
  maxHeight?: number;
}) => {
  React.useEffect(() => {
    const elements = document.querySelectorAll("body, #root, #__next");
    console.log("elements", elements);
    if (open) {
      elements.forEach((element) => {
        element.classList.add("no-scroll");
      });
      // body.classList.add("no-scroll");
    } else {
      // if (!body) return;
      elements.forEach((element) => {
        element.classList.remove("no-scroll");
      });
    }
  }, [open]);

  React.useEffect(() => {
    const barrier = document.querySelector(".modal");

    const onKeyDown = (event: KeyboardEvent) => {
      // console.log(event.key);
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    if (!open) {
      window.removeEventListener("keydown", onKeyDown);
    }

    const handler = (event: Event) => {
      event.preventDefault();
      if (event.target == barrier) {
        onClose();
      }
      // console.log("clicked .modal");
    };

    barrier?.addEventListener("click", handler);

    return () => {
      barrier?.removeEventListener("click", handler);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div
        className="modal flex center-y center-x"
        style={{
          height: open ? "auto" : 0,
          // overflow: "hidden",
          visibility: "initial",
          transition: "all 200ms",
          // transition: "translate 300ms, height 300ms",
          ...(!open && {
            // translate: "0 -400px",
            visibility: "hidden",
          }),
        }}
      >
        <div
          className="content flex flex-col center-y center-x"
          //center-y center-x
          style={{
            height: open ? "auto" : 0,
            transition: "all 200ms",
            ...(!open && {
              translate: "0 -400px",
              // visibility: "hidden",
            }),
          }}
        >
          {children}
        </div>

        <style global jsx>{`
          .no-scroll {
            overflow: hidden;
          }

          .modal {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            position: fixed;
            z-index: ${zIndex.modal};
            background-color: var(--modal-barrier-color);
          }

          .content {
            width: calc(100vw - 50px);
            min-height: 400px;
            background-color: var(--modal-surface-color);
            border: 1px solid var(--complementary);
            max-width: ${maxWidth}px;
            max-height: ${maxHeight}px;
            border-radius: 2px;
          }
        `}</style>
      </div>
    </>
  );
};

export default Modal;
