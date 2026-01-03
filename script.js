const dialog = document.getElementById("reg-dialog");
const openBtn = document.getElementById("open-modal");
const closeBtn = document.getElementById("close-modal");
const form = document.getElementById("reg-form");
const showPassBtn = document.getElementById("show-pass");

openBtn.addEventListener("click", () => dialog.showModal());
closeBtn.addEventListener("click", () => dialog.close());

// Закрытие по клику вне окна
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

// Показ пароля
showPassBtn.addEventListener("pointerdown", () => {
  document.getElementById("password").type = "text";
});
showPassBtn.addEventListener("pointerup", () => {
  document.getElementById("password").type = "password";
});

// Валидация по blur
form.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
});

function validateField(input) {
  const errorElem = document.getElementById(input.id + "-error");

  if (input.validity.valid) {
    input.removeAttribute("aria-invalid");
    errorElem.hidden = true;
    errorElem.textContent = "";
    return;
  }

  input.setAttribute("aria-invalid", "true");
  errorElem.hidden = false;

  if (input.validity.valueMissing) {
    errorElem.textContent = "Поле обязательно для заполнения.";
  } else if (input.validity.tooShort) {
    errorElem.textContent = `Минимальная длина: ${input.minLength} символов.`;
  } else if (input.validity.typeMismatch) {
    errorElem.textContent = "Введите корректный email.";
  } else {
    errorElem.textContent = "Некорректное значение.";
  }
}

// Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let firstInvalid = null;

  form.querySelectorAll("input").forEach((input) => {
    validateField(input);
    if (!input.validity.valid && !firstInvalid) {
      firstInvalid = input;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const data = new FormData(form);
  console.log("Данные формы:");
  for (const [key, value] of data.entries()) {
    console.log(key, value);
  }

  dialog.close();
});
