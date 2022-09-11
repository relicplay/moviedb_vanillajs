
const fetchData = async (url) => {

    let myObject = await fetch(url);
    let myText = await myObject.text();

    console.log(myText);

}



