import { Events } from "phaser";

class RememberingEventEmitter extends Events.EventEmitter {
    private memory: Map<string | symbol, any[]> = new Map();

    emit(event: string | symbol, ...args: any[]) {
        this.memory.set(event, args);
        return super.emit(event, ...args);
    }

    on(event: string | symbol, fn: Function) {
        if (this.memory.has(event)) {
            fn(...this.memory.get(event)!);
        }
        return super.on(event, fn);
    }
}

export const EventBus = new RememberingEventEmitter();
