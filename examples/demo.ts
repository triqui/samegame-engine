const logElement = document.getElementById('log') as HTMLElement;
const descriptionElement = document.getElementById('description') as HTMLElement;

function setDescription(html: string): void {
    descriptionElement.innerHTML = html;
}

function setLog(html: string): void {
    logElement.innerHTML = html;
}

(window as any).setDescription = setDescription;
(window as any).setLog = setLog;

const buttons = document.querySelectorAll<HTMLButtonElement>('.example');

buttons.forEach(button => {
    button.addEventListener('click', async () => {
        const controlButtons = document.getElementById('controls');
        if (controlButtons) {
            controlButtons.style.display = 'none';
        }
        const rotationButtons = document.getElementById('rotation');
        if (rotationButtons) {
            rotationButtons.style.display = 'none';
        }
        logElement.textContent = '';
        descriptionElement.textContent = '';
        buttons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        const name: string = button.getAttribute('data-example') as string;
        const module = await import(`./scenes/${name}.ts`);
        if (typeof module.run === 'function') {
            module.run();
        }
    });
});

buttons[0].click();