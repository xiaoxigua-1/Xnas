import { Box } from "@chakra-ui/react";
import { NextPage } from "next";

export interface WindowType extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  x: number;
  y: number;
  move: boolean;
  clickX?: number;
}

const Window: NextPage<WindowType & { zIndex: number }> = ({ width, height, x, y, move, zIndex, ...props }) => {
  return (
    <Box 
      className="absolute bg-white shadow-2xl"
      style={{
        width,
        height,
        top: y,
        left: x,
        zIndex
      }}
      {...props}
    >

    </Box>
  );
};

export default Window;
