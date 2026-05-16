const input = document.querySelector('#favchap');
const addChapterButton = document.querySelector('#add-chapter');
const list = document.querySelector('#list');

addChapterButton.addEventListener('click', function() {
    const chapter = input.value.trim();
    if (chapter === '') {
        return;
    }

    const li = document.createElement('li');
    li.textContent = chapter;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.addEventListener('click', function () {
        li.remove();
    });

    li.appendChild(deleteButton);
    list.appendChild(li);

    input.value = '';
    input.focus();
});