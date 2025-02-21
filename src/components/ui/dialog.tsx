"use client";

import * as React from "react";

interface DialogProps {
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function Dialog({ children }: DialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ asChild, children }: DialogTriggerProps) {
  const { setOpen } = React.useContext(DialogContext);
  
  return (
    <div onClick={() => setOpen(true)}>
      {children}
    </div>
  );
}

export function DialogContent({ className, children }: DialogContentProps) {
  const { open, setOpen } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center ${className}`}
      onClick={() => setOpen(false)}
    >
      <div 
        className="bg-white dark:bg-boxdark rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
