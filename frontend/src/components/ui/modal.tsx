import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {children}
      </div>
      <button
        className="absolute top-4 right-4 text-white text-xl"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
}

export function ModalContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b border-gray-200">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t border-gray-200 flex justify-end">{children}</div>;
}
