import { ReactP5Wrapper } from "@p5-wrapper/react";
import type { P5CanvasInstance } from "@p5-wrapper/react";
import React from "react";

type Props<Value> = {
  label: string;
  value: Value;

  height: number;
  width: number;

  onChange?: (checked: boolean, value: Value) => void;
};

const isInsideCircle = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  cr: number
) => {
  const dx = x - cx;
  const dy = y - cy;

  return dx * dx + dy * dy <= cr * cr;
};

const createKey = (x: number, y: number) => {
  return `${x},${y}`;
};

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const RadioButton = <Value,>(props: Props<Value>) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const circleX = Math.round(props.width / 2);
  const circleY = Math.round(props.height / 2);
  const circleRadius = (props.width - 2) / 2;

  const validateFill = React.useCallback(
    (p5: P5CanvasInstance) => {
      p5.loadPixels();

      const startX = Math.round(props.width / 2);
      const startY = Math.round(props.height / 2);

      const queue: [number, number][] = [[startX, startY]];

      const tolerance = 20;

      let empty = 0;

      const visited = new Map();

      visited.set(createKey(startX, startY), true);

      while (queue.length) {
        const [currentX, currentY] = queue.shift()!;

        const index = (currentY * props.width + currentX) * 4;

        const r = p5.pixels[index];
        const g = p5.pixels[index + 1];
        const b = p5.pixels[index + 2];

        if (
          r >= 255 - tolerance &&
          g >= 255 - tolerance &&
          b >= 255 - tolerance
        ) {
          continue;
        } else if (r === 0 && g === 0 && b === 0) {
          empty++;
        }

        for (const [offsetX, offsetY] of directions) {
          const nextX = currentX + offsetX;
          const nextY = currentY + offsetY;

          if (
            !visited.has(createKey(nextX, nextY)) &&
            isInsideCircle(nextX, nextY, circleX, circleY, circleRadius)
          ) {
            queue.push([nextX, nextY]);
            visited.set(createKey(nextX, nextY), true);
          }
        }
      }

      if (empty === 0) {
        setIsChecked(true);
      }
    },
    [circleRadius, circleX, circleY, props.height, props.width]
  );

  const sketch = React.useCallback(
    (p5: P5CanvasInstance) => {
      p5.setup = () => {
        const renderer = p5.createCanvas(props.width, props.height, p5.P2D);
        canvasRef.current = renderer.elt;

        p5.pixelDensity(1);
        p5.background(0, 0, 0, 0);

        p5.mouseReleased = () => {
          validateFill(p5);
        };

        p5.loadPixels();
      };

      p5.draw = () => {
        p5.noSmooth();
        p5.strokeWeight(2);
        p5.stroke(0, 255, 0, 255);

        if (p5.mouseIsPressed) {
          if (
            isInsideCircle(p5.mouseX, p5.mouseY, circleX, circleY, circleRadius)
          ) {
            p5.ellipse(p5.mouseX, p5.mouseY, 1, 1);
          }
        }

        p5.stroke(255);
        p5.strokeWeight(1);
        p5.fill(255, 0);
        p5.circle(circleX, circleY, circleRadius * 2);
      };
    },
    [props.width, props.height, circleX, circleY, circleRadius, validateFill]
  );

  React.useEffect(() => {
    props.onChange?.(isChecked, props.value);
  }, [isChecked, props]);

  return (
    <div className="flex gap-2">
      <div role="radio" className="flex items-center justify-center gap-2">
        <ReactP5Wrapper sketch={sketch} />
        <label>{props.label}</label>
      </div>
    </div>
  );
};

export default RadioButton;
