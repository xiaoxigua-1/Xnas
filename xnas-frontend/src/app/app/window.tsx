import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineBorder, AiOutlineLine } from "react-icons/ai";
import { BsXCircleFill } from "react-icons/bs";
import { NextPage } from "next";

export enum WindowState {
  Normal,
  Maximize,
  Mininize
}

export interface WindowType extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  x: number;
  y: number;
  title: string;
  icon: string;
  move: boolean;
  clickX?: number;
  state: WindowState
}

export interface WindowFun {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

const Window: NextPage<WindowType & { zIndex: number } & WindowFun> = ({
  width,
  height,
  x,
  y,
  move,
  state,
  title,
  icon,
  zIndex,
  onMouseDown,
  onClose,
  onMaximize,
  onMinimize,
  ...props
}) => {
  const top = state == WindowState.Normal ? y : state == WindowState.Maximize ? 0 : 0;
  const left = state == WindowState.Normal ? x : state == WindowState.Maximize ? 0 : 0;

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
    >
      <HStack 
        justify="end"
        spacing={3}
        className="border-b-gray-400 border-b-[1px] p-1"
        onMouseDown={onMouseDown}
      >
        <HStack className="flex-1">
          <Avatar size="xs" src={icon} background=""/>
          <Text>{title}</Text>
        </HStack>
        <AiOutlineLine />
        <AiOutlineBorder onClick={onMaximize} />
        <AiOutlineClose onClick={onClose} />
      </HStack>
    </Box>
  );
};

export default Window;
