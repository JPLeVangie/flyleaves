// DOM Elements
const noteArea = document.getElementById('note-area');
const titleInput = document.getElementById('title-input');
const settingsIcon = document.getElementById('settings-icon');
const settingsPanel = document.getElementById('settings-panel');
const savePathInput = document.getElementById('save-path-input');
const chooseDirectoryButton = document.getElementById('choose-directory-button');
const saveButton = document.getElementById('save-button');
const notification = document.getElementById('notification');

// Functions
function showNotification(message, duration = 3000) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

async function chooseDirectory() {
    try {
        const handle = await window.showDirectoryPicker();
        savePathInput.value = handle.name;
        showNotification(`Directory selected: ${handle.name}`);
    } catch (err) {
        console.error('Error selecting directory:', err);
        showNotification('Error selecting directory. Please try again.', 5000);
    }
}

async function saveNote() {
    const noteContent = noteArea.value.trim();
    const noteTitle = titleInput.value.trim();

    if (!noteContent) {
        showNotification('Please enter some text before saving.', 5000);
        return;
    }

    let fileName = noteTitle ? `${noteTitle}.md` : `note_${new Date().toISOString().replace(/:/g, '-')}.md`;
    fileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{
                description: 'Markdown Files',
                accept: {'text/markdown': ['.md']}
            }]
        });

        const writable = await handle.createWritable();
        await writable.write(noteContent);
        await writable.close();

        showNotification(`Note saved as ${fileName}`);
        noteArea.value = '';
        titleInput.value = '';
    } catch (err) {
        console.error('Error saving note:', err);
        showNotification('Error saving note. Please try again.', 5000);
    }
}

function resizeNoteArea() {
    const app = document.getElementById('app');
    const noteContainer = document.getElementById('note-container');
    const buttonContainerHeight = document.getElementById('button-container').offsetHeight;
    const titleContainerHeight = document.getElementById('title-container').offsetHeight;
    const containerPadding = 40; // 20px top + 20px bottom

    const availableHeight = window.innerHeight - app.offsetTop - containerPadding - buttonContainerHeight - titleContainerHeight;
    noteArea.style.height = `${availableHeight}px`;
}

// Event Listeners
settingsIcon.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

chooseDirectoryButton.addEventListener('click', chooseDirectory);
saveButton.addEventListener('click', saveNote);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        saveNote();
    }
});

window.addEventListener('resize', resizeNoteArea);

// Touch events for mobile swipe to save
let touchStartX = 0;
noteArea.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
noteArea.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 50) {
        saveNote();
    }
});

// Initial setup
resizeNoteArea();
setTimeout(resizeNoteArea, 100);