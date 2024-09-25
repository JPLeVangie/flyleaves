// script.js
const noteArea = document.getElementById('note-area');
const settingsIcon = document.getElementById('settings-icon');
const settingsPanel = document.getElementById('settings-panel');
const savePathInput = document.getElementById('save-path-input');
const savePathButton = document.getElementById('save-path-button');
const chooseDirectoryButton = document.getElementById('choose-directory-button');
const saveButton = document.getElementById('save-button');

let savePath = '';
let directoryHandle = null;

// Create notification element
const notification = document.createElement('div');
notification.id = 'notification';
document.body.appendChild(notification);

function showNotification(message, duration = 3000) {
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.opacity = '1';
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, duration);
}

settingsIcon.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' || settingsPanel.style.display === '' ? 'block' : 'none';
});

savePathButton.addEventListener('click', () => {
    savePath = savePathInput.value;
    showNotification(`Save path set to: ${savePath}`);
    settingsPanel.style.display = 'none';
});

chooseDirectoryButton.addEventListener('click', async () => {
    try {
        directoryHandle = await window.showDirectoryPicker();
        savePath = directoryHandle.name;
        savePathInput.value = savePath;
        showNotification(`Directory selected: ${savePath}`);
    } catch (err) {
        console.error('Error selecting directory:', err);
        showNotification('Error selecting directory. Please try again.', 5000);
    }
});

async function saveNote() {
    const noteContent = noteArea.value;
    if (noteContent.trim() === '') {
        showNotification('Please enter some text before saving.', 5000);
        return;
    }

    if (!directoryHandle) {
        showNotification('Please choose a directory in the settings first.', 5000);
        return;
    }

    const fileName = `note_${new Date().toISOString().replace(/:/g, '-')}.md`;

    try {
        const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(noteContent);
        await writable.close();

        console.log(`Note saved as ${fileName} in ${savePath}`);
        showNotification(`Note saved as ${fileName}`);
        noteArea.value = '';
    } catch (err) {
        console.error('Error saving note:', err);
        showNotification('Error saving note. Please try again.', 5000);
    }
}

saveButton.addEventListener('click', saveNote);

// Add keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        saveNote();
    }
});

let touchStartX = 0;
let touchEndX = 0;

noteArea.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

noteArea.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX - touchStartX > 50) {
        saveNote();
    }
}

function resizeNoteArea() {
    const app = document.getElementById('app');
    const noteContainer = document.getElementById('note-container');
    const saveButtonHeight = saveButton.offsetHeight;
    const containerPadding = 40; // 20px top + 20px bottom

    if (window.innerWidth >= 768) {
        // Desktop view
        noteContainer.style.height = `${window.innerHeight - app.offsetTop - containerPadding}px`;
        noteArea.style.height = `${noteContainer.offsetHeight - saveButtonHeight - 20}px`; // 20px for margin
    } else {
        // Mobile view
        noteArea.style.height = `${window.innerHeight - app.offsetTop - saveButtonHeight - containerPadding}px`;
    }
}

window.addEventListener('resize', resizeNoteArea);
resizeNoteArea();
setTimeout(resizeNoteArea, 100);