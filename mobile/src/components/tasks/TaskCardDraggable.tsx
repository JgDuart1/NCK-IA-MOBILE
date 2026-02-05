import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  LongPressGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { KANBAN_STATUSES, KANBAN_COLUMN_WIDTH } from './constants';

interface TaskCardDraggableProps {
  task: Task;
  onPress: () => void;
  onDrop: (newStatus: string) => void;
  columnIndex: number;
}

type ContextType = {
  startX: number;
  startY: number;
};

export function TaskCardDraggable({
  task,
  onPress,
  onDrop,
  columnIndex,
}: TaskCardDraggableProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const [dragEnabled, setDragEnabled] = useState(false);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      scale.value = withSpring(1.05);
      zIndex.value = 100;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      zIndex.value = 0;

      const columnOffset = Math.round(event.translationX / KANBAN_COLUMN_WIDTH);
      const newColumnIndex = Math.max(
        0,
        Math.min(KANBAN_STATUSES.length - 1, columnIndex + columnOffset)
      );

      if (newColumnIndex !== columnIndex) {
        runOnJS(onDrop)(KANBAN_STATUSES[newColumnIndex]);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0, {}, () => {
        runOnJS(setDragEnabled)(false);
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: scale.value > 1 ? 0.25 : 0.05,
    shadowRadius: scale.value > 1 ? 8 : 2,
    elevation: scale.value > 1 ? 8 : 1,
  }));

  return (
    <LongPressGestureHandler
      minDurationMs={200}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          setDragEnabled(true);
        } else if (
          nativeEvent.state === State.END ||
          nativeEvent.state === State.CANCELLED ||
          nativeEvent.state === State.FAILED
        ) {
          setDragEnabled(false);
        }
      }}
    >
      <Animated.View>
        <PanGestureHandler
          enabled={dragEnabled}
          onGestureEvent={gestureHandler}
          minDist={10}
          activeOffsetX={[-10, 10]}
        >
          <Animated.View style={[styles.card, animatedStyle, shadowStyle]}>
            <TaskCard task={task} onPress={onPress} />
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
});
