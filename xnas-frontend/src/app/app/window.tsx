import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineBorder, AiOutlineLine } from "react-icons/ai";
import { NextPage } from "next";

export enum WindowState {
  Normal,
  Maximize,
  Mininize,
  Resize,
}

export enum ResizeState {
  Top,
  RightTop,
  Right,
  RightBottom,
  Bottom,
  Left,
  LeftTop,
  LeftBottom,
  Move
}

export interface WindowType extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  x: number;
  y: number;
  title: string;
  icon: string;
  move: boolean;
  state: WindowState;
  resize?: ResizeState | null;
}

export interface WindowFun {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  setResize: (state: ResizeState | null) => void;
  onMoveStart: (event: React.MouseEvent<HTMLDivElement>) => void;
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
  onMoveStart,
  onClose,
  onMaximize,
  onMinimize,
  onFocus,
  setResize,
  ...props
}) => {
  const top = state == WindowState.Normal || state == WindowState.Resize ? y : state == WindowState.Maximize ? 0 : state == WindowState.Mininize ? window.innerWidth : 0;
  const left = state == WindowState.Normal || state == WindowState.Resize ? x : state == WindowState.Maximize ? 0 : state == WindowState.Mininize ? window.innerHeight : 0;

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    let windowX = event.clientX - left;
    let windowY = event.clientY - top;

    if (windowX < 10 && windowY < 10) {
      setResize(ResizeState.LeftTop);
    } else if (windowX < 10 && windowY > height - 10) {
      setResize(ResizeState.LeftBottom);
    } else if (windowX < 10) {
      setResize(ResizeState.Left);
    } else if (windowY < 10 && windowX > width - 10) {
      setResize(ResizeState.RightTop);
    } else if (windowY < 10) {
      setResize(ResizeState.Top);
    } else if (windowX > width - 10 && windowY > height - 10) {
      setResize(ResizeState.RightBottom);
    } else if (windowX > width - 10) {
      setResize(ResizeState.Right);
    } else if (windowY > height - 10) {
      setResize(ResizeState.Bottom);
    } else if (windowX > 10 && windowY > 10 && windowX < width - 10 && windowY < 33) {
      setResize(ResizeState.Move);
    } else {
      setResize(null);
    }
  };

  return (
    <Box 
      className={`absolute bg-white shadow-2xl rounded-md ${move || state == WindowState.Resize ? "" : "transition-maximize"}`}
      style={{
        width: state == WindowState.Normal || state == WindowState.Resize ? width : window.innerWidth,
        height: state == WindowState.Normal || state == WindowState.Resize ? height : window.innerHeight,
        top,
        left,
        zIndex
      }}
      {...props}
      onMouseDown={(event) => {
        onFocus();
        onMoveStart(event);
      }}
      onMouseMove={onMouseMove}
      onMouseOut={() => setResize(null)}
    >
      <HStack 
        justify="end"
        spacing={3}
        className="border-b-gray-400 border-b-[1px] p-1"
      >
        <HStack className="flex-1 select-none ">
          <Image boxSize={6} borderRadius="full" src={icon} draggable={false} alt="app icon" />
          <Text>{title}</Text>
        </HStack>
        <AiOutlineLine onClick={onMinimize} onMouseEnter={() => setResize(null)} className="cursor-pointer" />
        <AiOutlineBorder onClick={onMaximize} onMouseEnter={() => setResize(null)} className="cursor-pointer" />
        <AiOutlineClose onClick={onClose} onMouseEnter={() => setResize(null)} className="cursor-pointer" />
      </HStack>
    </Box>
  );
};

export default Window;
