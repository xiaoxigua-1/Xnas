'use client';

import { Box } from "@chakra-ui/react";
import Window, { WindowType } from "./window";
import React, { useState } from "react";

export default function App() {
  const [windows, setWindows] = useState<WindowType[]>([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      move: false
    },
    {
      x: 200,
      y: 400,
      width: 100,
      height: 100,
      move: false
    },
    {
      x: 500,
      y: 800,
      width: 100,
      height: 100,
      move: false
    },
  ]);

  const moveStart = (event: React.MouseEvent<HTMLDivElement>) => (index: number) => {
    const windowsClone = [...windows];
    const item = windows[index];

    item.move = true;
    item.clickX = event.clientX - item.x;

    windowsClone.splice(index, 1);
    windowsClone.splice(0, 0, item);
    setWindows(windowsClone);

    console.log("move start");
  };

  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    const windowsClone = [...windows];
  
    windowsClone.map(w => {
      if (w.move) {
        console.log(w.x, event.clientX);
        w.x = event.clientX - (w.clickX ?? (w.width / 2));
        w.y = event.clientY - 10;
      }

      return w;
    });

    setWindows(windowsClone);
  };

  const moveEnd = () => {
    let windowsClone = [...windows];
    
    windowsClone.map(w => {
      w.move = false;
      return w;
    })

    setWindows(windowsClone);
  }

  return (
    <Box 
      className="w-full h-full bg-[url(/app/background)] bg-cover bg-center bg-no-repeat"
      onMouseMove={move}
      onMouseUp={moveEnd} 
    >
      {windows.map((window, index) => (
        <Window
          key={index}
          zIndex={windows.length - index}
          {...window}
          onMouseDown={(event) => {
            moveStart(event)(index);
          }}
        /> 
      ))} 
    </Box>
  );
}
