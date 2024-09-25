// script.js
const noteArea = document.getElementById('note-area');
const settingsIcon = document.getElementById('settings-icon');
const settingsPanel = document.getElementById('settings-panel'); 

settingsIcon.addEventListener('click', () => {
    settingsPanel.style.display = (settingsPanel.style.display === 'none') ? 'block' : 'none';
});

// Function to save the note
function saveNote() {
    const noteContent = noteArea.value;
    // We will implement the actual saving logic later (using local storage and the configured path)
    console.log("Note saved:", noteContent); 
    noteArea.value = ''; // Clear the note area after saving
}

// Add event listener for swipe right gesture
noteArea.addEventListener('touchstart', handleTouchStart, false);        
noteArea.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
}

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY
}