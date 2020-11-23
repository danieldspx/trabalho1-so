export class Memory<T> {
  private memory: T[] = [];

  update(data: T[]) {
    this.memory = data;
  }

  get() {
    return this.memory;
  }

  at(index: number) {
    return this.memory[index];
  }

  set(index: number, data: T) {
    this.memory[index] = data;
  }

  get length() {
    return this.memory.length;
  }
}