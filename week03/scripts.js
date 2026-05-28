let scores = [100, 72, 83, 94, 88, 87];
scores.splice(2,1);
console.log(scores);


let firstname = "Edwin";
let lastname = "Ewudzie";
let fullname = firstname + " " + lastname;
console.log(fullname);

function fullname(firstname, lastname) {
    return firstname + " " + lastname;
}
console.log(fullname("Edwin", "Ewudzie"));
