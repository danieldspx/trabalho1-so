import { InterruptMode } from '../enums/interrupt-mode.enum';

export interface CPUInternalState {
  programCounter: number;
  accumulator: number;
  interruptMode: InterruptMode;
}