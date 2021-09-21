const app = document.querySelector('.app');

const pinDialogInitialState = {
  realPin: '',
  injectedPin: '',
  templateStructure: {
    block: 'section',
    cls: 'form-section',
    content: [
      {
        block: 'div',
        cls: 'message-window',
        content: [
          {
            block: 'div',
            cls: 'enter-message',
            content: [
              {
                block: 'p',
                cls: '',
                innerText:
                  'Введен верный пин-код. Теперь вы можете его сбросить и задать другой.',
              },
              {
                block: 'button',
                cls: 'close-window',
                innerText: 'OK',
              },
            ],
          },
        ],
      },
      {
        block: 'form',
        cls: 'pin-form',
        attrs: { action: '#' },
        content: [
          {
            block: 'h2',
            cls: '',
            innerText: 'Создайте шестизначный пин-код',
          },
          {
            block: 'label',
            cls: 'pin-input',
            content: [
              {
                block: 'input',
                cls: 'pin',
                attrs: {
                  type: 'password',
                  name: 'password',
                },
              },
            ],
          },
          {
            block: 'div',
            cls: 'for-message',
            content: [
              {
                block: 'p',
                cls: 'for-message__p',
              },
            ],
          },
          {
            block: 'button',
            cls: 'save-btn',
            innerText: 'Сохранить',
          },
        ],
      },
      {
        block: 'form',
        cls: 'pin-field',
        attrs: { action: '#' },
        content: [
          {
            block: 'h2',
            cls: '',
            innerText: 'Введите пин-код',
          },
          {
            block: 'div',
            cls: 'partitions',
            content: [
              {
                block: 'label',
                cls: 'pin-cell',
                content: [
                  {
                    block: 'input',
                    cls: 'cell',
                    attrs: {
                      type: 'text',
                    },
                  },
                ],
              },
              {
                block: 'label',
                cls: 'pin-cell',
                content: [
                  {
                    block: 'input',
                    cls: 'cell',
                    attrs: {
                      type: 'text',
                    },
                  },
                ],
              },
              {
                block: 'label',
                cls: 'pin-cell',
                content: [
                  {
                    block: 'input',
                    cls: 'cell',
                    attrs: {
                      type: 'text',
                    },
                  },
                ],
              },
              {
                block: 'label',
                cls: 'pin-cell',
                content: [
                  {
                    block: 'input',
                    cls: 'cell',
                    attrs: {
                      type: 'text',
                    },
                  },
                ],
              },
              {
                block: 'label',
                cls: 'pin-cell',
                content: [
                  {
                    block: 'input',
                    cls: 'cell',
                    attrs: {
                      type: 'text',
                    },
                  },
                ],
              },
              {
                block: 'label',
                cls: 'pin-cell',
                content: [
                  {
                    block: 'input',
                    cls: 'cell',
                    attrs: {
                      type: 'text',
                    },
                  },
                ],
              },
            ],
          },
          {
            block: 'div',
            cls: 'for-message',
            content: [
              {
                block: 'p',
                cls: 'for-message__p',
              },
            ],
          },
          {
            block: 'button',
            cls: 'check-btn',
            innerText: 'OK',
          },
          {
            block: 'button',
            cls: 'del-pin-btn',
            innerText: 'Сбросить пин-код',
          },
        ],
      },
    ],
  },
};

const templateEngine = block => {
  if (block === undefined || block === null || block === false) {
    return document.createTextNode('');
  }

  if (
    typeof block === 'string' ||
    typeof block === 'number' ||
    block === true
  ) {
    return document.createTextNode(String(block));
  }

  if (Array.isArray(block)) {
    const fragment = document.createDocumentFragment();

    block.forEach(contentItem => {
      const el = templateEngine(contentItem);

      fragment.appendChild(el);
    });

    return fragment;
  }

  const element = document.createElement(block.block);

  []
    .concat(block.cls)
    .filter(Boolean)
    .forEach(className => element.classList.add(className));

  if (block.attrs) {
    Object.keys(block.attrs).forEach(key => {
      element.setAttribute(key, block.attrs[key]);
    });
  }

  if (block.innerText) element.innerText = block.innerText;

  element.appendChild(templateEngine(block.content));

  return element;
};

const createTemplate = () => {
  return templateEngine(pinDialogInitialState.templateStructure);
};

// Template creation //

app.appendChild(createTemplate());

const messageWindow = app.querySelector('.message-window');
const closeWindowBtn = app.querySelector('.close-window');
const pinInput = app.querySelector('.pin');
const saveBtn = app.querySelector('.save-btn');
const delPinBtn = app.querySelector('.del-pin-btn');
const checkBtn = app.querySelector('.check-btn');
const partitions = app.querySelector('.partitions');
const pinField = app.querySelector('.pin-field');
const pinForm = app.querySelector('.pin-form');

const initialScreen = pin => {
  pinInput.value = '';

  const cells = partitions.querySelectorAll('.cell');
  for (let cell of cells) {
    cell.value = '';
  }

  messageWindow.classList.add('display-none');
  if (!pin) {
    pinField.classList.add('display-none');
    pinForm.classList.remove('display-none');
    pinInput.focus();
  } else {
    pinForm.classList.add('display-none');
    pinField.classList.remove('display-none');
    delPinBtn.classList.add('display-none');
    partitions.querySelector('.cell').focus();
    checkBtn.disabled = true;
    delPinBtn.classList.add('display-none');
  }
};

// Template initialization //

const startScreen = () => {
  pinDialogInitialState.realPin = localStorage.getItem('localhostPin');
  initialScreen(pinDialogInitialState.realPin);
};

startScreen();

// Functions //
const showMessage = (index, message) => {
  const messageForForm = app.querySelectorAll('.for-message')[index];
  const p = messageForForm.querySelector('p');
  p.innerText = message;
  setTimeout(() => (p.innerText = ''), 1000);
};

const checkPinCreate = () => {
  if (!pinInput.value) return;

  if (!pinDialogInitialState.realPin) pinDialogInitialState.realPin = '';

  if (!pinInput.value[pinInput.value.length - 1].match(/^\d+$/)) {
    showMessage(0, 'Пин-код может состоять только из цифр!');
    pinInput.value = pinDialogInitialState.realPin;
    return;
  }

  if (pinInput.value.length > 6) {
    pinInput.value = pinDialogInitialState.realPin;
    showMessage(0, 'Пин-код может состоять только из шести цифр!');
    pinInput.disabled = true;
    setTimeout(() => {
      pinInput.disabled = false;
      pinInput.focus();
    }, 1000);
    return;
  }

  pinDialogInitialState.realPin = pinInput.value;

  if (pinInput.value.length === 6) saveBtn.disabled = false;
};

const checkKeyCode = keyCode => {
  if (
    !pinDialogInitialState.realPin ||
    pinDialogInitialState.realPin.length !== 6
  )
    return;
  if (keyCode === 13) enterPinInLocalStorage();
};

const enterPinInLocalStorage = () => {
  localStorage.setItem('localhostPin', pinDialogInitialState.realPin);
  startScreen();
};

const deletePin = () => {
  localStorage.removeItem('localhostPin');
  startScreen();
};

const getInjectedPin = () => {
  pinDialogInitialState.injectedPin = '';

  const cells = partitions.querySelectorAll('.cell');

  for (let i = 0; i < 6; i++) {
    if (!cells[i].value.match(/^\d+$/)) {
      cells[i].value = '';
      return;
    }

    if (i === 0 && cells[i].value.length === 6) {
      pinDialogInitialState.injectedPin = cells[i].value;
      let valueArr = cells[i].value.split('');
      for (let y = 0; y < valueArr.length; y++) {
        cells[y].value = valueArr[y];
      }
      break;
    }

    if (cells[i].value.length > 1) {
      cells[i].value = cells[i].value[0];
      return;
    }

    if (cells[i].value) {
      pinDialogInitialState.injectedPin += cells[i].value;
      cells[i].blur();
      if (i + 1 < 6) cells[i + 1].focus();
    }
  }

  if (pinDialogInitialState.injectedPin.length === 6) checkBtn.disabled = false;
};

const verifyPin = () => {
  debugger;
  if (pinDialogInitialState.injectedPin !== pinDialogInitialState.realPin) {
    showMessage(1, 'Пин-код введен неверно!');
    checkBtn.disabled = true;
    return;
  }

  checkBtn.classList.add('display-none');
  delPinBtn.classList.remove('display-none');
  messageWindow.classList.remove('display-none');
};

const closeEnterMessage = () => {
  messageWindow.classList.add('display-none');
};

// Subscription to events //

pinInput.addEventListener('input', checkPinCreate);
pinInput.addEventListener('keydown', event => checkKeyCode(event.keyCode));
saveBtn.addEventListener('click', enterPinInLocalStorage);
delPinBtn.addEventListener('click', deletePin);
partitions.addEventListener('input', getInjectedPin);
checkBtn.addEventListener('click', verifyPin);
closeWindowBtn.addEventListener('click', closeEnterMessage);
