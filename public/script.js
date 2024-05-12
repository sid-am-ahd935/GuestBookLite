const noteContainer = document.getElementById('note-container');
const newNoteInput = document.getElementById('new-note');
const submitButton = document.getElementById('submit-button');

// Function to display a note on the page
function displayNote(note) {
  const newNoteElement = document.createElement('div');
  newNoteElement.classList.add('note');
  newNoteElement.innerText = note.text;
  noteContainer.appendChild(newNoteElement);
}

// Get all notes on page load
$(document).ready(function() {
  $.getJSON('/notes', function(data) {
    data.forEach(displayNote);
  });
});

submitButton.addEventListener('click', () => {
  console.log("Submit button clicked");
  const newNoteText = newNoteInput.value.trim();
  if (newNoteText) {
    $.ajax({
      url: '/notes',
      type: 'POST',
      data: JSON.stringify({ text: newNoteText }),
      contentType: 'application/json',
      success: function(data) {
        displayNote(data);
        newNoteInput.value = '';
      },
      error: function(err) {
        console.error(err);
        alert('Error submitting note!');
      }
    });
  }
});
