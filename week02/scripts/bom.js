const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('');
const li =  document.createElement('li');
const deletButton = document.createElement('button')

li.textContent = input.value;
deletButton.textContent = 'X'
li.append(deletButton);
list.append(li);

button.addEventListener('click', function() {
    if (input.value.trim() !== ''){
    li.textContent = input.value;
    deletButton.textContent = 'X'
    li.append(deletButton);
    list.append(li);
    }

    deletButton.addEventListener('click', function (){
        list.removeChild(li);
    });

    input.value = '';
    input.focus();




})