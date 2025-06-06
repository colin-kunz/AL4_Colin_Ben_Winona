const submitButton = document.getElementById("submit");
const vornameField = document.getElementById("vorname");
const nachnameField = document.getElementById("nachname");
const emailField = document.getElementById("email");
const messageField = document.getElementById("message");
const spinner = document.getElementById("spinner");
const errorDiv = document.getElementById("error");
const feedbackDiv = document.getElementById("feedback");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function markInvalidField(field, isInvalid) {
  if (isInvalid) {
    field.classList.add("invalid");
  } else {
    field.classList.remove("invalid");
  }
}

// Live-Validierung
[vornameField, nachnameField, emailField, messageField].forEach((field) => {
  field.addEventListener("input", () => {
    if (field.value.trim() !== "") {
      markInvalidField(field, false);
      errorDiv.innerText = "";
    }
  });
});

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  errorDiv.innerText = "";
  feedbackDiv.innerText = "";

  const email = emailField.value.trim().toLowerCase();
  let hasError = false;

  const fields = [
    { field: vornameField, value: vornameField.value.trim() },
    { field: nachnameField, value: nachnameField.value.trim() },
    { field: emailField, value: email },
    { field: messageField, value: messageField.value.trim() },
  ];

  fields.forEach(({ field, value }) => {
    const invalid = value === "";
    markInvalidField(field, invalid);
    if (invalid) hasError = true;
  });

  if (hasError) {
    errorDiv.innerText = "Bitte alle Pflichtfelder ausfüllen.";
    return;
  }

  if (!isValidEmail(email)) {
    errorDiv.innerText = "Ungültige E-Mail-Adresse.";
    markInvalidField(emailField, true);
    return;
  }

  spinner.style.display = "block";

  try {
    const result = await databaseClient.executeSqlQuery(
      `SELECT email FROM user WHERE email = '${email}'`
    );
    const existing = result?.[1] || [];

    if (existing.length > 0) {
      errorDiv.innerText = "Diese E-Mail wird schon verwendet.";
      markInvalidField(emailField, true);
      return;
    }

    await databaseClient.insertInto("user", {
      vorname: vornameField.value.trim(),
      nachname: nachnameField.value.trim(),
      email: email,
      message: messageField.value.trim(),
    });

    document.getElementById("userForm").reset();
    fields.forEach(({ field }) => markInvalidField(field, false));
    feedbackDiv.innerText = "Nachricht erfolgreich abgeschickt!";
  } catch (error) {
    errorDiv.innerText = "Fehler beim Speichern.";
    console.error("Speicherfehler:", error);
  } finally {
    spinner.style.display = "none";
  }
});
