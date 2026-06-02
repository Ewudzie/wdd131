const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/aba-nigeria-temple/aba-nigeria-temple-5087-main.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/manti-utah-temple/manti-utah-temple-40551-main.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/payson-utah-temple/payson-utah-temple-38451-main.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/yigo-guam-temple/yigo-guam-temple-26495-main.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/washington-d.c.-temple/washington-d.c.-temple-14992-main.jpg"
    },
    {
        templeName: "Lima Peru",
        location: "Lima, Peru",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/lima-peru-temple/lima-peru-temple-12721-main.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/mexico-city-mexico-temple/mexico-city-mexico-temple-4060-main.jpg"
    },
    {
        templeName: "Sao Paulo Brazil",
        location: "Sao Paulo, Brazil",
        dedicated: "1978, September, 18",
        area: 14300,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/_temp/017-S%C3%A3o-Paulo-Brazil-Temple.jpg"
    },
    {
        templeName: "Tokyo Japan",
        location: "Tokyo, Japan",
        dedicated: "1980, October, 27",
        area: 10700,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/tokyo-japan-temple/tokyo-japan-temple-26340-main.jpg"
    },
    {
        templeName: "Bern Switzerland",
        location: "Bern, Switzerland",
        dedicated: "1955, September, 11",
        area: 17000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/bern-switzerland-temple/bern-switzerland-temple-54641-main.jpg"
    }
];

const gallery = document.querySelector("#temple-gallery");
const heading = document.querySelector("main h1");
const navLinks = document.querySelectorAll(".navigation a");

function getDedicatedYear(temple) {
    return Number(temple.dedicated.split(",")[0]);
}

function createTempleCard(temple) {
    const card = document.createElement("section");
    card.classList.add("temple-card");

    const name = document.createElement("h2");
    name.textContent = temple.templeName;

    const location = document.createElement("p");
    location.innerHTML = `<span>Location:</span> ${temple.location}`;

    const dedicated = document.createElement("p");
    dedicated.innerHTML = `<span>Dedicated:</span> ${temple.dedicated}`;

    const area = document.createElement("p");
    area.innerHTML = `<span>Area:</span> ${temple.area.toLocaleString()} sq ft`;

    const image = document.createElement("img");
    image.src = temple.imageUrl;
    image.alt = `${temple.templeName} Temple`;
    image.loading = "lazy";

    card.append(name, location, dedicated, area, image);
    return card;
}

function displayTemples(filteredTemples) {
    gallery.innerHTML = "";
    filteredTemples.forEach((temple) => {
        gallery.appendChild(createTempleCard(temple));
    });
}

function filterTemples(filter) {
    switch (filter) {
        case "old":
            return temples.filter((temple) => getDedicatedYear(temple) < 1900);
        case "new":
            return temples.filter((temple) => getDedicatedYear(temple) > 2000);
        case "large":
            return temples.filter((temple) => temple.area > 90000);
        case "small":
            return temples.filter((temple) => temple.area < 10000);
        default:
            return temples;
    }
}

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const filter = link.dataset.filter;

        heading.textContent = link.textContent;
        displayTemples(filterTemples(filter));
    });
});

displayTemples(temples);

document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;
