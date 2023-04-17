'use client';

import { Box } from "@chakra-ui/react";
import Window, { WindowState, WindowType } from "./window";
import React, { useState } from "react";

export default function App() {
  const [windows, setWindows] = useState<WindowType[]>([
    {
      x: 20,
      y: 20,
      width: 300,
      height: 300,
      move: false,
      state: WindowState.Normal,
      title: "123"
    },
    {
      x: 20,
      y: 20,
      width: 300,
      height: 300,
      move: false,
      state: WindowState.Normal,
      title: "321"
    },
    {
      x: 20,
      y: 20,
      width: 300,
      height: 300,
      move: false,
      state: WindowState.Normal,
      title: "321"
    },
  ]);
  const [windowIndex, setWindowIndex] = useState<number[]>(windows.map((_, i) => i));

  const moveStart = (event: React.MouseEvent<HTMLDivElement>) => (index: number) => {
    const windowsClone = [...windows];
    const windowIndexClone = [...windowIndex];
    const item = windowsClone[index];

    item.move = true;
    item.clickX = event.clientX - item.x;

    windowIndexClone.splice(windowIndex.indexOf(index), 1);
    windowIndexClone.splice(0, 0, index);

    setWindowIndex(windowIndexClone);
    setWindows(windowsClone);
  };

  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    const windowsClone = [...windows];
  
    windowsClone.map(w => {
      if (w.move && w.state == WindowState.Normal) {
        w.x = event.clientX - (w.clickX ?? (w.width / 2));
        w.y = event.clientY - 10;
      }

      return w;
    });

    setWindows(windowsClone);
  };

  const moveEnd = () => {
    const windowsClone = [...windows];
    
    windowsClone.map(w => {
      w.move = false;
      return w;
    })

    setWindows(windowsClone);
  }

  return (
    <Box 
      className="w-full h-full bg-[url(/app/background)] bg-cover bg-center bg-no-repeat overflow-hidden"
      onMouseMove={move}
      onMouseUp={moveEnd} 
    >
      {windows.map((window, index) => (
        <Window
          {...window}
          key={index}
          zIndex={windows.length - windowIndex.indexOf(index)}
          onMouseDown={(event) => {
            moveStart(event)(index);
          }}
          onClose={() => {
            const windowsClone = [...windows];
            windowsClone.splice(index, 1);
            setWindows(windowsClone);
          }}
          onMaximize={() => {
            const windowsClone = [...windows];
            const state = windowsClone[index].state;

            windowsClone[index].state = state == WindowState.Normal ? WindowState.Maximize : WindowState.Normal;

            setWindows(windowsClone);
          }}
          onMinimize={() => {
            const windowsClone = [...windows];
          }}
        /> 
      ))} 
    </Box>
  );
}
