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

chaptersArray = ['Chapter 1', 'Chapter 2', 'Chapter 3'];

let chaptersArray = getChapterList() || [];
chaptersArray.forEach(chapter => { displayList(chapter); });

addChapterButton.addEventListener('click', function() {
    if (input.value !='') {
        displayList(input.value);
        chaptersArray.push(input.value);
        setChapterList(chaptersArray);
        input.value = '';
        input.focus();
    }
});

function displayList(chapter) {
    let li = document.createElement('li');
    li.textContent = chapter;   
}
    let deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';        
    deleteButton.addEventListener('click', function() {
        li.remove();
        chaptersArray = chaptersArray.filter(item => item !== chapter);
        setChapterList(chaptersArray);
    });
    li.appendChild(deleteButton);
    list.appendChild(li);


function setChapterList(chapters) {
    localStorage.setItem('chapters', JSON.stringify(chapters));
}

function getChapterList() {
    const chapters = localStorage.getItem('chapters');
    return chapters ? JSON.parse(chapters) : null;
}                                   

chapter = chapter.slice(0, chapter.length - 1);
chaptersArray = chaptersArray.filter(item => item !== chapter);
setChapterList(chaptersArray);  

function deleteChapter(chapter) {
    chapter = chapter.slice(0, chapter.length - 1);
    chaptersArray = chaptersArray.filter(item => item !== chapter);
    setChapterList(chaptersArray);  
}