import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { CPU } from './cpu/cpu';

const cpu = new CPU();

const instructionsLineReader = createInterface({input: createReadStream(`${__dirname}/assets/instructions.txt`)});

const allInstructions: string[] = [];

instructionsLineReader.on('line', instruction => allInstructions.push(instruction))

instructionsLineReader.on('close', () => { // All instructions were loaded
  cpu.updateProgramMemory(allInstructions);
  try {
    while(true) {
      cpu.executeNextInstruction();
    }
    // for (let i = 0; i < allInstructions.length; i++) {
    //   cpu.executeNextInstruction();
    // }
  } catch (error) {
    console.log('Error: ', error.message);
    console.log('Data Memory: ', cpu.getDataMemory());
    console.log('Internal State: ', cpu.getInternalState());
  }
})
