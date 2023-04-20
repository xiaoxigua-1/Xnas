'use client';

import { Box, HStack, Image } from "@chakra-ui/react";
import { NextPage } from "next";
import { WindowType } from "./window";

export interface DockData {
  windows: WindowType[];
}

export interface DockFuns {
  onMinimize: (index: number) => void;
}

const Dock: NextPage<DockData & DockFuns> = ({ windows, onMinimize }) => {
  return (
    <HStack className="bg-white w-full h-10 bg-opacity-40 select-none px-5">
      {windows.map((window, index) => (
        <Box key={index} className="h-full" onClick={() => onMinimize(index)}>
          <Image src={window.icon} alt="app icon" className="h-full" draggable={false}/> 
        </Box>
      ))}
    </HStack>
  );
};

export default Dock;
