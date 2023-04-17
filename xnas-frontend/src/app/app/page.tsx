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
      title: "123",
      icon: "https://cdn.discordapp.com/avatars/458988300418416640/ae9f6c6cbf1cecdb4e50ead29ebdddf2.png?size=2048&quality=lossless",
    },
    {
      x: 20,
      y: 20,
      width: 300,
      height: 300,
      move: false,
      state: WindowState.Normal,
      title: "123",
      icon: "https://cdn.discordapp.com/avatars/458988300418416640/ae9f6c6cbf1cecdb4e50ead29ebdddf2.png?size=2048&quality=lossless",
    },
    {
      x: 20,
      y: 20,
      width: 300,
      height: 300,
      move: false,
      state: WindowState.Normal,
      title: "123",
      icon: "https://cdn.discordapp.com/avatars/458988300418416640/ae9f6c6cbf1cecdb4e50ead29ebdddf2.png?size=2048&quality=lossless",
    },
  ]);
  const [windowIndex, setWindowIndex] = useState<number[]>(windows.map((_, i) => i));

  const moveStart = (event: React.MouseEvent<HTMLDivElement>) => (index: number) => {
    const windowsClone = [...windows];
    const item = windowsClone[index];

    item.move = true;
    item.clickPos = [event.clientX - item.x, event.clientY - item.y];

    setWindows(windowsClone);
  };


  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    const windowsClone = [...windows];
  
    windowsClone.map(w => {
      if (w.move && w.state == WindowState.Normal) {
        w.x = event.clientX - w.clickPos!![0];
        w.y = event.clientY - w.clickPos!![1];
      }

      return w;
    });

    setWindows(windowsClone);
  };

  const moveEnd = () => {
    const windowsClone = [...windows];
    
    windowsClone.map(w => {
      w.move = false;
      w.resize = null;
      return w;
    })

    setWindows(windowsClone);
  };

  const onFocus = (index: number) => {
    const windowIndexClone = [...windowIndex];
    
    windowIndexClone.splice(windowIndex.indexOf(index), 1);
    windowIndexClone.splice(0, 0, index);

    setWindowIndex(windowIndexClone);
  };

  const onClose = (index: number) => {
      const windowsClone = [...windows];

      windowsClone.splice(index, 1);
      setWindows(windowsClone);
  };

  const onMaximize = (index: number) => {
      const windowsClone = [...windows];
      const state = windowsClone[index].state;

      windowsClone[index].state = state == WindowState.Normal ? WindowState.Maximize : WindowState.Normal;

      setWindows(windowsClone);
  };

  const onMinimize = (index: number) => {
    const windowsClone = [...windows];
  };

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
          onFocus={() => { onFocus(index); }}
          onClose={() => { onClose(index); }}
          onMaximize={() => { onMaximize(index); }}
          onMinimize={() => { onMinimize(index); }}
        /> 
      ))} 
    </Box>
  );
}
