import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(f: StateCreator<T, [], []>, name?: string) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    const prevState = get();
    set(...args);
    const nextState = get();

    if (import.meta.env.DEV) {
      console.group(`🔄 ${name || 'Store'} Update`);
      console.log('Previous:', prevState);
      console.log('Next:', nextState);
      console.groupEnd();
    }
  };

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as Logger;

// Usage example:
// export const useStore = create<State>()(
//   logger(
//     (set) => ({
//       count: 0,
//       increment: () => set((state) => ({ count: state.count + 1 })),
//     }),
//     'CounterStore'
//   )
// );
