import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { OutputParser } from './output';

export class Process extends EventEmitter {
    private childProcess: ChildProcess;

    public constructor(command: string) {
        super();

        this.childProcess = spawn(command, { shell: true });

        this.childProcess.stdout?.on('data', (data) => {
            this.emit('stdout', data.toString());
        });

        this.childProcess.stderr?.on('data', (data) => {
            this.emit('stderr', data.toString());
        });

        this.childProcess.on('close', (code) => {
            this.emit('close', code);
        });

        this.childProcess.on('error', (err) => {
            this.emit('error', err);
        });
    }

    public terminate(): void {
        this.childProcess.kill();
    }
}
