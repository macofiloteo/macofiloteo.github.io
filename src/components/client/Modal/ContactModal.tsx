'use client';

import React, { RefObject, useRef } from 'react';
import Modal from './Modal';
import { segment } from '@utils';

export default function ContactModal(props: Readonly<{ modalRef: RefObject<HTMLDialogElement | null> }>) {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      visitor_name: formData.get('visitorName') as string,
      visitor_email: formData.get('visitorEmail') as string,
      visitor_message: formData.get('visitorMessage') as string,
    };
    segment.track('contact_form_submitted', payload);
    formRef.current?.reset();
    props.modalRef.current?.close();
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    segment.track('contact_form_close_btn_clicked');
    props.modalRef.current?.close();
  };

  return (
    <Modal modalRef={props.modalRef}>
      <h1 className="xs:text-3xl text-lg font-bold mb-4">Say hi to me!</h1>
      <form onSubmit={handleSubmit} ref={formRef}>
        <input autoComplete="off" maxLength={50} minLength={3} required name="visitorName" type="text" placeholder="Your Name" className="focus:outline focus:outline-zinc-500/75 block w-full mb-2 p-2 border-2 border-zinc-700/25 rounded-md" />
        <input autoComplete="off" maxLength={50} minLength={5} name="visitorEmail" required type="email" placeholder="Your Email" className="focus:outline focus:outline-zinc-500/75 block w-full mb-2 p-2 border-2 border-zinc-700/25 rounded-md" />
        <textarea maxLength={10000} name="visitorMessage" placeholder="Your Message" className="focus:outline focus:outline-zinc-500/75 min-h-[250px] max-h-[600px] block w-full mt-8 mb-2 p-2 border-2 border-zinc-700/25 rounded-md" rows={4}></textarea>
        <div className="mt-4 flex justify-end">
          <button onClick={handleClose} className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Close</button>
          <button type="submit" className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Send</button>
        </div>
      </form>
    </Modal>

  );
}
