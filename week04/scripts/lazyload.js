//document.getElementById("lastModified").innerHTML = document.lastModified;

// Update the copyright year
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Show the page's actual last modified date and time
document.getElementById("lastModified").textContent =
    "Last Modification: " + document.lastModified;


    let names = ['Nancy','Blessing','Jorge','Svetlana','Bob'];

    let namesB = names.filter(name => name.startsWith('B'));

    console.log(namesB);

    let lengths = names.map(name => name.length);

    console.log(lengths);

    let totalLength = names.reduce((total, name) => total + name.length, 0);

    console.log(totalLength);

