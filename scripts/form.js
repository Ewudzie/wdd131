const products = [
    {
        id: "fc-1888",
        name: "FC-1888",
        averageRating: 4.5
    },
    {
        id: "fc-2050",
        name: "FC-2050",
        averageRating: 4.7
    },
    {
        id: "fs-1987",
        name: "FS-1987",
        averageRating: 3.5
    },
    {
        id: "ac-2000",
        name: "AC-2000",
        averageRating: 4.9
    },
    {
        id: "jj-1969",
        name: "JJ-1969",
        averageRating: 3.9
    }
];

const productSelect = document.querySelector("#product-name");
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    productSelect.appendChild(option);
});

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;
