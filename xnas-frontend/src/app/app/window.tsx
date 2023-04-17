import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineBorder, AiOutlineLine } from "react-icons/ai";
import { NextPage } from "next";

export enum WindowState {
  Normal,
  Maximize,
  Mininize,
}

export enum ResizeState {
  Top,
  RightTop,
  Right,
  RightBottom,
  Bottom,
  Left,
  LeftTop,
  LeftBottom
}

export interface WindowType extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  x: number;
  y: number;
  title: string;
  icon: string;
  move: boolean;
  clickPos?: number[];
  state: WindowState;
  resize?: ResizeState | null;
}

export interface WindowFun {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

const Window: NextPage<WindowType & { zIndex: number } & WindowFun> = ({
  width,
  height,
  x,
  y,
  move,
  resize,
  state,
  title,
  icon,
  zIndex,
  onMouseDown,
  onClose,
  onMaximize,
  onMinimize,
  onFocus,
  ...props
}) => {
  const top = state == WindowState.Normal ? y : state == WindowState.Maximize ? 0 : state == WindowState.Mininize ? window.innerWidth : 0;
  const left = state == WindowState.Normal ? x : state == WindowState.Maximize ? 0 : state == WindowState.Mininize ? window.innerHeight : 0;

  return (
    <Box 
      className={`absolute bg-white shadow-2xl rounded-md ${move ? "" : "transition-maximize"}`}
      style={{
        width: state == WindowState.Normal ? width : window.innerWidth,
        height: state == WindowState.Normal ? height : window.innerHeight,
        top,
        left,
        zIndex
      }}
      {...props}
      onMouseDown={onFocus}
    >
      <HStack 
        justify="end"
        spacing={3}
        className="border-b-gray-400 border-b-[1px] p-1"
        onMouseDown={onMouseDown}
      >
        <HStack className="flex-1 select-none ">
          <Image boxSize={6} borderRadius="full" src={icon} draggable={false} alt="app icon" />
          <Text>{title}</Text>
        </HStack>
        <AiOutlineLine onClick={onMinimize}/>
        <AiOutlineBorder onClick={onMaximize} />
        <AiOutlineClose onClick={onClose} />
      </HStack>
    </Box>
  );
};

export default Window;
