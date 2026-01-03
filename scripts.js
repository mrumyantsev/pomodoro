const input = document.getElementById('input');
const button = document.getElementById('button');
const sound = new Audio('./sounds/mechanical-alarm-clock.wav');

const TIMER_TIME_MINUTES = 25;
const RINGING_TIME_SECONDS = 10;

class App {
    #ringer;
    #timer;

    constructor() {
        this.#ringer = new Ringer();
        this.#timer = new Timer(this.#ringer);
    }

    run() {
        input.value = String(TIMER_TIME_MINUTES);

        button.addEventListener('click', () => {
            this.#handleButtonClick();
        });
    }
    
    #handleButtonClick() {
        if (input.valueAsNumber <= 0) {
            input.value = '0';
        }

        if (this.#ringer.isOn) {
            this.#ringer.off();
        } else if (this.#timer.isOn) {
            this.#timer.off();
        } else {
            this.#timer.on();
        }
    }
}

class Timer {
    #timeoutId;
    #isOn;
    #ringer;

    constructor(ringer) {
        this.#timeoutId = 0;
        this.#isOn = false;
        this.#ringer = ringer;
    }

    get isOn() {
        return this.#isOn;
    }

    on() {
        this.#timeoutId = setTimeout(() => {
            this.off();
            this.#ringer.on();
        }, input.valueAsNumber * 60 * 1000);

        Text.setTimerSet();

        this.#isOn = true;
    }

    off() {
        clearTimeout(this.#timeoutId);

        Text.setDefault();

        this.#isOn = false;
    }
}

class Ringer {
    #timeoutId;
    #isOn;

    constructor() {
        this.#timeoutId = 0;
        this.#isOn = false;
    }

    get isOn() {
        return this.#isOn;
    }

    on() {
        sound.play();

        this.#timeoutId = setTimeout(() => {
            this.off();
        }, RINGING_TIME_SECONDS * 1000);

        Text.setRinging();

        this.#isOn = true;
    }

    off() {
        sound.pause();
        sound.currentTime = 0;

        clearTimeout(this.#timeoutId);

        Text.setDefault();

        this.#isOn = false;
    }
}

class Text {
    static APP_NAME = 'Pomodoro';

    static setDefault() {
        this.#set(this.APP_NAME, 'Start');
    }

    static setTimerSet() {
        this.#set(this.APP_NAME + ' Set', 'Stop');
    }

    static setRinging() {
        this.#set(this.APP_NAME + ' Ringing', 'Dismiss');
    }

    static #set(titleText, buttonText) {
        document.title = titleText;
        button.textContent = buttonText;
    }
}

const app = new App();

app.run();
