/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import EventEmitter from 'eventemitter3';

class EventBus {

    private static instance: EventEmitter;

    static getInstance(): EventEmitter {
        if (!this.instance) {
            this.instance = new EventEmitter();
        }
        return this.instance;
    }
}

export default EventBus.getInstance();