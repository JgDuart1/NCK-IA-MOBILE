# Implementação Drag & Drop - Plano 06

Este documento detalha a implementação correta do drag & drop para o Kanban usando bibliotecas já incluídas no projeto.

---

## Bibliotecas Usadas

```bash
# Já instaladas no Plano 01, apenas importar:
react-native-gesture-handler
react-native-reanimated
```

**NÃO INSTALAR**: `react-native-draggable-flatlist`, `react-native-drax`, etc.

---

## Implementação Recomendada

### TaskCardDraggable.tsx

```typescript
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { TaskCard } from './TaskCard';
import { Task } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = SCREEN_WIDTH * 0.75;

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

      // Calcular qual coluna baseado no deslocamento X
      const columnOffset = Math.round(event.translationX / COLUMN_WIDTH);
      const newColumnIndex = Math.max(0, Math.min(4, columnIndex + columnOffset));

      if (newColumnIndex !== columnIndex) {
        const statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
        runOnJS(onDrop)(statuses[newColumnIndex]);
      }

      // Animar de volta para posição original
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
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

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      minDist={10}
      activeOffsetX={[-10, 10]}
    >
      <Animated.View style={animatedStyle}>
        <TaskCard task={task} onPress={onPress} />
      </Animated.View>
    </PanGestureHandler>
  );
}
```

---

## Considerações de UX

### Feedback Visual Durante Drag

```typescript
// Adicionar sombra durante drag
const shadowStyle = useAnimatedStyle(() => ({
  shadowOpacity: scale.value > 1 ? 0.3 : 0.1,
  shadowRadius: scale.value > 1 ? 10 : 4,
  elevation: scale.value > 1 ? 10 : 2,
}));
```

### Indicador de Zona de Drop

```typescript
// Na KanbanColumn, adicionar highlight quando card está sobre ela
interface KanbanColumnProps {
  // ... existing props
  isDropTarget?: boolean;
}

// Estilo condicional
const containerStyle = [
  styles.container,
  isDropTarget && styles.dropTarget,
];

const styles = StyleSheet.create({
  dropTarget: {
    borderWidth: 2,
    borderColor: darkTheme.primary,
    borderStyle: 'dashed',
  },
});
```

---

## Alternativa Simplificada (Sem Drag Visual)

Se drag & drop visual for muito complexo para o tempo disponível, usar seleção de status via bottom sheet:

```typescript
// Ao segurar o card, mostrar opções de status
<TouchableOpacity
  onLongPress={() => showStatusPicker(task)}
  delayLongPress={200}
>
  <TaskCard task={task} />
</TouchableOpacity>

// StatusPicker como BottomSheet
function StatusPicker({ task, onSelect, onClose }) {
  const statuses = [
    { key: 'BACKLOG', label: 'Backlog' },
    { key: 'TODO', label: 'A Fazer' },
    { key: 'IN_PROGRESS', label: 'Em Progresso' },
    { key: 'IN_REVIEW', label: 'Em Revisão' },
    { key: 'DONE', label: 'Concluído' },
  ];

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Mover para:</Text>
          {statuses.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.option, task.status === s.key && styles.current]}
              onPress={() => onSelect(s.key)}
            >
              <Text>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}
```

---

## Performance

1. **Memoização**: Usar `React.memo` no TaskCard
2. **useCallback**: Para handlers de drag
3. **Worklets**: Manter lógica de animação no UI thread

```typescript
// Marcar como worklet se usar funções customizadas
'worklet';
```

---

## Nota: Colunas Dinâmicas

O código acima assume 5 colunas fixas. Para colunas dinâmicas:

```typescript
// Derivar do estado/layout real
const { columns } = useKanbanColumns(); // hook que retorna colunas ativas
const columnCount = columns.length;

// Calcular largura baseado no layout
const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
const columnWidth = containerWidth / Math.min(2, columnCount); // 2 colunas visíveis

// No onEnd, usar indices dinâmicos
const newColumnIndex = Math.max(0, Math.min(columnCount - 1, columnIndex + columnOffset));
const newStatus = columns[newColumnIndex].key;
```

Se o Kanban tiver colunas configuráveis por projeto, usar essa abordagem dinâmica.

---

## Decisão para o Agente

**Recomendação**: Implementar a versão com **Long Press + Status Picker** primeiro, pois:
1. Mais rápido de implementar
2. Menos bugs potenciais
3. Funciona bem em mobile
4. Drag & drop visual pode ser adicionado como melhoria futura

Se o agente tiver tempo e confiança, implementar o drag visual completo.
