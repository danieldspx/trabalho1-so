export class Memory<T> {
  private memory: T[] = [];

  update(data: T[]) {
    this.memory = data;
  }
}