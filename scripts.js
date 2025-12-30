const input = document.getElementById('input');
const button = document.getElementById('button');
const sound = new Audio('./sounds/mechanical-alarm-clock.wav');

const RINGING_TIME_SECONDS = 10;

const main = () => {
    const text = new Text();
    const ringer = new Ringer(text);
    const timer = new Timer(text, ringer);

    document.addEventListener('DOMContentLoaded', (event) => {
        button.addEventListener('click', () => {
            if (input.value === '') {
                input.value = '0';
            }

            timer.toggle();
        });
    });
}

class Timer {
    #intervalId;
    #isActive;
    #text;
    #ringer;

    constructor(text, ringer) {
        this.#intervalId = 0;
        this.#isActive = false;
        this.#text = text;
        this.#ringer = ringer;
    }

    get isActive() {
        return this.#isActive;
    }

    on() {
        this.#intervalId = setInterval(() => {
            this.off();
            this.#ringer.on();
        }, input.valueAsNumber * 60 * 1000);
        this.#isActive = true;
        this.#text.setTimerSet();
    }

    off() {
        if (this.#ringer.isActive) {
            this.#ringer.off();
        }

        if (this.#isActive) {
            clearInterval(this.#intervalId);
            this.#isActive = false;
            this.#text.setDefault();
        }
    }

    toggle() {
        if (this.#isActive || this.#ringer.isActive) {
            this.off();
        } else {
            this.on();
        }
    }
}

class Ringer {
    #intervalId;
    #isActive;
    #text;

    constructor(text) {
        this.#intervalId = 0;
        this.#isActive = false;
        this.#text = text;
    }

    get isActive() {
        return this.#isActive;
    }

    on() {
        sound.play();
        this.#intervalId = setInterval(() => {
            this.off();
        }, RINGING_TIME_SECONDS * 1000);
        this.#isActive = true;
        this.#text.setRinging();
    }

    off() {
        sound.pause();
        sound.currentTime = 0;
        clearInterval(this.#intervalId);
        this.#isActive = false;
        this.#text.setDefault();
    }
}

class Text {
    setDefault() {
        this.#setTexts('Pomodoro', 'Start');
    }

    setTimerSet() {
        this.#setTexts('Pomodoro Set', 'Stop');
    }

    setRinging() {
        this.#setTexts('Pomodoro Ringing', 'Dismiss');
    }

    #setTexts(documentTitle, buttonText) {
        document.title = documentTitle;
        button.textContent = buttonText;
    }
}

main();
