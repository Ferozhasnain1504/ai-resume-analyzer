import React, { createContext, useContext, useState, type ReactNode } from 'react'

interface AccordionContextValue {
  openItem: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export const Accordion = ({ children }: { children: ReactNode }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div className='flex flex-col gap-4'>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ id, children }: { id: string; children: ReactNode }) => {
  return <div data-accordion-id={id}>{children}</div>;
};

export const AccordionHeader = ({ itemId, children }: { itemId: string; children: ReactNode }) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) return <div>{children}</div>;

  const isOpen = ctx.openItem === itemId;

  return (
    <button
      onClick={() => ctx.toggle(itemId)}
      className='flex items-center justify-between w-full p-4 rounded-2xl bg-white border border-gray-100'
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${itemId}`}
    >
      {children}
      <span className='ml-4 text-gray-500'>{isOpen ? '−' : '+'}</span>
    </button>
  );
};

export const AccordionContent = ({ itemId, children }: { itemId: string; children: ReactNode }) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) return <div id={`accordion-content-${itemId}`}>{children}</div>;

  const isOpen = ctx.openItem === itemId;

  return (
    <div
      id={`accordion-content-${itemId}`}
      className={`overflow-hidden transition-all ${isOpen ? 'max-h-[2000px] p-4' : 'max-h-0'}`}
    >
      {isOpen ? children : null}
    </div>
  );
};