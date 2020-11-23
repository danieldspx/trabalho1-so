import { DataMemory } from '../memory/data-memory';
import { ProgramMemory } from '../memory/program-memory';
import { InterruptMode } from './enums/interrupt-mode.enum';
import { CPUInternalState } from './interfaces/cpu-internal-state-interface';

export class CPU {
  private programCounter: number = 0;
  private accumulator: number = 0;
  private interruptMode: InterruptMode = InterruptMode.NORMAL;
  private dataMemory = new DataMemory();
  private programMemory = new ProgramMemory();

  constructor() {
    this.resetInternalState();
  }

  updateProgramMemory(data: string[]) {
    this.programMemory.update(data);
  }

  updateDataMemory(data: number[]) {
    this.dataMemory.update(data);
  }

  getDataMemory() {
    return this.dataMemory.get();
  }

  getInterruptMode() {
    return this.interruptMode;
  }

  setNormalInterruptMode() {
    if (this.interruptMode !== InterruptMode.NORMAL) {
      this.interruptMode =  InterruptMode.NORMAL;
      this.programCounter++;
    }
  }

  /** Fetch intruction for current PC and increment it */
  fetchCurrentIntruction() {
    if (this.programCounter < this.programMemory.length) {
      return this.programMemory.at(this.programCounter++);
    }

    throw new Error('Invalid memory access.')
      // TODO: Should I return an error or set interruptMode = InterruptMode.INTERRUPTED
  }

  getInternalState(): CPUInternalState {
    return {
      programCounter: this.programCounter,
      accumulator: this.accumulator,
      interruptMode: this.interruptMode
    }
  }

  setInternalState(internalState: Partial<CPUInternalState>) {
    this.programCounter = internalState.programCounter || this.programCounter;
    this.accumulator = internalState.accumulator || this.accumulator;
    this.interruptMode = internalState.interruptMode || this.interruptMode;
  }

  resetInternalState() {
    this.accumulator = 0;
    this.programCounter = 0;
    this.interruptMode = InterruptMode.NORMAL;
  }

  executeNextInstruction() {
    if (this.interruptMode !== InterruptMode.NORMAL) { throw new Error('Can not execute any instruction in INTERRUPETED mode.'); }

    const intruction = this.fetchCurrentIntruction();

    this.decodeAndExecuteInstruction(intruction);
  }

  private decodeAndExecuteInstruction(instruction: string) {
    const args = instruction.split(' ');
    const OPCODE: string = args[0].toUpperCase();
    
    // This will look for a function composed by op + OPCODE, e.g. opCARGI
    const executionFunction = (this as any)[`op${OPCODE}`];

    if (typeof executionFunction !== 'function') {
      return this.interruptMode =  InterruptMode.INTERRUPTED;
    }

    args.shift();

    executionFunction(...args);
  }

  /**********************************
   *                                *
   * Functions for each Instruction *
   *                                *
   **********************************/

  /** coloca o valor `val` no acumulador (A=val) */
  private opCARGI(val: number) {
    this.accumulator = val;
  }

  /** coloca no acumulador o valor na posição `index` da memória de dados (A=M[index]) */
  private opCARGM(index: number) {
    this.accumulator = this.dataMemory.at(index);
  }

  /** coloca no acumulador o valor na posição que está na posição `index` da memória de dados (A=M[M[index]]) */
  private opCARGX(index: number) {
    this.opCARGM(this.dataMemory.at(index));
  }
  
  /** coloca o valor do acumulador na posição `index` da memória de dados (M[index]=A) */
  private opARMM(index: number) {
    this.dataMemory.set(index, this.accumulator);
  }
  
  /** coloca o valor do acumulador que está na posição `index` da memória de dados (M[M[index]]=A) */
  private opARMX(index: number) {
    this.opARMM(this.dataMemory.at(index));
  }

  /** soma ao acumulador o valor no endereço `index` da memória de dados (A=A+M[index]) */
  private opSOMA(index: number) {
    this.accumulator += this.dataMemory.at(index);
  }

  /** inverte o sinal do acumulador (A=-A) */
  private opNEG() {
    this.accumulator = -this.accumulator;
  }

  /** se A vale 0, coloca o valor n no PC */
  private opDESVZ(n: number) {
    if (this.accumulator === 0) {
      this.programCounter = n;
    }
  }
}