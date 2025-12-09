// public/js/favorite-validation.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#favoriteForm")
  const errorBox = document.querySelector("#favorite-errors")
  const notesInput = document.querySelector("#favorite_notes")

  if (!form || !errorBox || !notesInput) return

  form.addEventListener("submit", (event) => {
    const messages = []

    if (notesInput.value.length > 500) {
      messages.push("Notes must be 500 characters or less.")
    }

    if (messages.length > 0) {
      event.preventDefault()
      errorBox.innerHTML = ""
      messages.forEach((msg) => {
        const p = document.createElement("p")
        p.textContent = msg
        errorBox.appendChild(p)
      })
      errorBox.style.display = "block"
    } else {
      errorBox.style.display = "none"
    }
  })
})
