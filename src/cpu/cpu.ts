import { DataMemory } from '../memory/data-memory';
import { ProgramMemory } from '../memory/program-memory';
import { InterruptMode } from './enums/interrupt-mode.enum';

export class CPU {
  private programCounter: number = 0;
  private accumulator: number = 0;
  private interruptMode: InterruptMode = InterruptMode.NORMAL;
  private dataMemory = new DataMemory();
  private programMemory = new ProgramMemory();

  updateProgramMemory(data: string[]) {
    this.programMemory.update(data);
  }

  updateDataMemory(data: number[]) {
    this.dataMemory.update(data);
  }
}