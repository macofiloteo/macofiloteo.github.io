import React from 'react';


export default function Modal(props: { modalRef: React.RefObject<HTMLDialogElement | null>, children: React.ReactNode }) {
  return (
    <dialog ref={props.modalRef}>
      <div className="relative z-10" aria-labelledby="dialog-title" role="dialog" aria-modal="true">

        <div className="fixed inset-0 transition-opacity" aria-hidden="true"></div>

        <div className="fixed inset-0 z-10 w-screen bg-black/75 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="p-8 dark:bg-black text-black dark:text-zinc-300 relative transform border-2 border-zinc-700/25 overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg shadow-sm shadow-zinc-500/10">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
