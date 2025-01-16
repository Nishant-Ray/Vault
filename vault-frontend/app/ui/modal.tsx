import { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { dmSans } from '@/app/ui/fonts';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  const [modalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = () => {
    if (onClose) onClose();
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (modalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [modalOpen]);

  return (
    <dialog className="w-1/2 rounded-md shadow-sm px-4 py-4" ref={modalRef} onKeyDown={handleKeyDown}>
      <XMarkIcon className="cursor-pointer text-gray-400 hover:text-off_black transition-all duration-150 ease-in-out w-6 justify-self-end" onClick={handleCloseModal}/>
      <div className="px-10 py-2">
        <h6 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-3xl font-semibold mb-8 text-center`}>{title}</h6>
        {children}
      </div>
    </dialog>
  );
}
