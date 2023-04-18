'use client';

import { Box } from "@chakra-ui/react";
import Window, { ResizeState, WindowState, WindowType } from "./window";
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
  const [windowResize, setWindowResize] = useState<ResizeState | null>(null);

  const moveStart = () => (index: number) => {
    const windowsClone = [...windows];
    const item = windowsClone[index];
    
    if (item.resize == ResizeState.Move) {
      item.move = true;
    } else {
      item.state = WindowState.Resize;
    }

    setWindows(windowsClone);
  };


  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    const windowsClone = [...windows];
  
    windowsClone.map(w => {
      if (w.move && w.state == WindowState.Normal) {
        w.x += event.movementX;
        w.y += event.movementY;
      } else if (w.state == WindowState.Resize) {
        console.log(w.resize)
        switch(w.resize) {
          case ResizeState.LeftBottom:
          case ResizeState.LeftTop:
          case ResizeState.Left: {
            w.x = event.clientX;
            w.width -= event.movementX;
          }
        }

        switch (w.resize) {
          case ResizeState.LeftTop:
          case ResizeState.RightTop:
          case ResizeState.Top: {
            w.y = event.clientY;
            w.height -= event.movementY;
            break;
          }
        }

        switch (w.resize) {
          case ResizeState.LeftBottom:
          case ResizeState.RightBottom:
          case ResizeState.Bottom: {
            w.height += event.movementY;
            break;
          }
        }

        switch (w.resize) {
          case ResizeState.RightTop:
          case ResizeState.RightBottom:
          case ResizeState.Right: {
            w.width += event.movementX;
            break;
          }
        }
      }

      return w;
    });

    setWindows(windowsClone);
  };

  const moveEnd = () => {
    const windowsClone = [...windows];
    
    windowsClone.map(w => {
      w.move = false;
      if (w.state == WindowState.Resize)
        w.state = WindowState.Normal;
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

    console.log(state);
  };

  const onMinimize = (index: number) => {
    const windowsClone = [...windows];
  };

  const setResize = (index: number) => (state: ResizeState | null) => {
    const windowsClone = [...windows];
    const item = windowsClone[index];
    if (item.state == WindowState.Normal) {
      item.resize = state;
      setWindowResize(state);
      setWindows(windowsClone);
    }
  };

  let cursor = "cursor-auto";

  switch (windowResize) {
    case ResizeState.Bottom:
    case ResizeState.Top: {
      cursor = "cursor-ns-resize";
      break;
    }
    case ResizeState.Left:
    case ResizeState.Right: {
      cursor = "cursor-ew-resize";
      break;
    }
    case ResizeState.LeftBottom:
    case ResizeState.RightTop: {
      cursor = "cursor-nesw-resize";
      break;
    }
    case ResizeState.RightBottom:
    case ResizeState.LeftTop: {
      cursor = "cursor-nwse-resize";
      break;
    }
    case ResizeState.Move: {
      cursor = "cursor-move";
      break;
    }
  }

  return (
    <Box 
      className={`w-full h-full bg-[url(/app/background)] bg-cover bg-center bg-no-repeat overflow-hidden ${cursor}`}
      onMouseMove={move}
      onMouseUp={moveEnd} 
    >
      {windows.map((window, index) => (
        <Window
          {...window}
          key={index}
          zIndex={windows.length - windowIndex.indexOf(index)}
          onMoveStart={(event) => {
            moveStart(event)(index);
          }}
          onFocus={() => { onFocus(index); }}
          onClose={() => { onClose(index); }}
          onMaximize={() => { onMaximize(index); }}
          onMinimize={() => { onMinimize(index); }}
          setResize={(state) => { setResize(index)(state); }}
        /> 
      ))} 
    </Box>
  );
}
