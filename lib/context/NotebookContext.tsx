"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type CellStatus = "idle" | "running" | "done";

export const CELL_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export interface NotebookContextType {
  cellStates: Record<string, CellStatus>;
  activeCell: string;
  setActiveCell: (id: string) => void;
  runCell: (cellId: string, durationMs?: number) => Promise<void>;
  runAllCells: () => Promise<void>;
  resetCell: (cellId: string) => void;
  resetAll: () => void;
  isExecuted: (cellId: string) => boolean;
  isRunning: (cellId: string) => boolean;
  totalCells: number;
  executedCount: number;
  allExecuted: boolean;
}

const NotebookContext = createContext<NotebookContextType | null>(null);

export function NotebookProvider({ children }: { children: React.ReactNode }) {
  const [cellStates, setCellStates] = useState<Record<string, CellStatus>>(() => {
    const init: Record<string, CellStatus> = {};
    CELL_IDS.forEach((id) => {
      init[id] = "idle";
    });
    return init;
  });

  const [activeCell, setActiveCell] = useState<string>("1");

  const runCell = useCallback(async (cellId: string, durationMs = 450) => {
    setCellStates((prev) => ({ ...prev, [cellId]: "running" }));
    await new Promise((resolve) => setTimeout(resolve, durationMs));
    setCellStates((prev) => ({ ...prev, [cellId]: "done" }));
  }, []);

  const runAllCells = useCallback(async () => {
    for (const id of CELL_IDS) {
      setCellStates((prev) => ({ ...prev, [id]: "running" }));
      await new Promise((resolve) => setTimeout(resolve, 220));
      setCellStates((prev) => ({ ...prev, [id]: "done" }));
    }
  }, []);

  const resetCell = useCallback((cellId: string) => {
    setCellStates((prev) => ({ ...prev, [cellId]: "idle" }));
  }, []);

  const resetAll = useCallback(() => {
    setCellStates(() => {
      const reset: Record<string, CellStatus> = {};
      CELL_IDS.forEach((id) => {
        reset[id] = "idle";
      });
      return reset;
    });
  }, []);

  const isExecuted = useCallback(
    (cellId: string) => cellStates[cellId] === "done",
    [cellStates]
  );

  const isRunning = useCallback(
    (cellId: string) => cellStates[cellId] === "running",
    [cellStates]
  );

  const executedCount = Object.values(cellStates).filter((s) => s === "done").length;
  const allExecuted = executedCount === CELL_IDS.length;

  // Keyboard shortcut: Shift+Enter or Ctrl+Enter to execute the active cell
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.shiftKey || e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const activeElem = document.activeElement;
        if (activeElem?.tagName === "TEXTAREA" || activeElem?.tagName === "INPUT") return;

        e.preventDefault();
        if (activeCell) {
          runCell(activeCell);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCell, runCell]);

  return (
    <NotebookContext.Provider
      value={{
        cellStates,
        activeCell,
        setActiveCell,
        runCell,
        runAllCells,
        resetCell,
        resetAll,
        isExecuted,
        isRunning,
        totalCells: CELL_IDS.length,
        executedCount,
        allExecuted,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebook() {
  const context = useContext(NotebookContext);
  if (!context) {
    throw new Error("useNotebook must be used within a NotebookProvider");
  }
  return context;
}
