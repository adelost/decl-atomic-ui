import {Circle, Line, Node, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, createRef, createSignal} from '@motion-canvas/core';

const BLUE = '#3b82f6';
const GREEN = '#22c55e';
const RED = '#ef4444';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  const scale = createSignal(1);

  view.add(
    <Node>
      {/* Animated circle */}
      <Circle
        ref={circle}
        size={() => scale() * 100}
        fill={BLUE}
        opacity={0.9}
      />
      {/* X axis */}
      <Line
        stroke={RED}
        lineWidth={3}
        endArrow
        arrowSize={8}
        points={[Vector2.zero, () => Vector2.right.scale(scale() * 80)]}
      />
      {/* Y axis */}
      <Line
        stroke={GREEN}
        lineWidth={3}
        endArrow
        arrowSize={8}
        points={[Vector2.zero, () => Vector2.up.scale(scale() * 80)]}
      />
    </Node>,
  );

  // Animation sequence
  yield* circle().position.x(100, 0.6);
  yield* circle().position.y(-50, 0.4);
  yield* scale(1.5, 0.5);
  yield* all(
    circle().position.x(0, 0.5),
    circle().position.y(0, 0.5),
    scale(1, 0.5)
  );
});
