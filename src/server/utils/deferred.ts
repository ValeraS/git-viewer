export type Deferred<T> = {
  done: Promise<T>;
  resolve: (v?: T | PromiseLike<T>) => void;
  reject: (r: unknown) => void;
};

export function deferred<T>() {
  const d: Deferred<T> = {} as Deferred<T>;
  d.done = new Promise<T>((resolve, reject) => {
    d.resolve = resolve;
    d.reject = reject;
  });
  return d;
}
