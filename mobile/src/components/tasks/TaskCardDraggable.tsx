import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { KANBAN_STATUSES, KANBAN_COLUMN_WIDTH, KanbanStatus } from './constants';

interface TaskCardDraggableProps {
  task: Task;
  onPress: () => void;
  onDrop: (newStatus: KanbanStatus) => void;
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
  const context = useSharedValue<ContextType>({ startX: 0, startY: 0 });

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(dragEnabled)
      .minDistance(10)
      .onBegin(() => {
        context.value = { startX: translateX.value, startY: translateY.value };
        scale.value = withSpring(1.05);
        zIndex.value = 100;
      })
      .onUpdate((event) => {
        translateX.value = context.value.startX + event.translationX;
        translateY.value = context.value.startY + event.translationY;
      })
      .onEnd((event) => {
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
      })
      .onFinalize(() => {
        scale.value = withSpring(1);
        zIndex.value = 0;
        runOnJS(setDragEnabled)(false);
      });
  }, [
    columnIndex,
    context,
    dragEnabled,
    onDrop,
    scale,
    translateX,
    translateY,
    zIndex,
  ]);

  const longPressGesture = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(200)
        .onStart(() => {
          runOnJS(setDragEnabled)(true);
        })
        .onEnd(() => {
          runOnJS(setDragEnabled)(false);
        }),
    []
  );

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
    <GestureDetector gesture={Gesture.Simultaneous(longPressGesture, panGesture)}>
      <Animated.View style={[styles.card, animatedStyle, shadowStyle]}>
        <TaskCard task={task} onPress={onPress} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
});
