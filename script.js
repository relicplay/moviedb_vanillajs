const baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=639d3b6ab1d15163c1ac63fbf9db3a9e';

/*
let data = {}
let size = Object.keys(data).length;
console.log(size);
*/

let data = [];


(async () => {
    async function fetchData(myRequest) {
      const response = await fetch(`${baseUrl}${myRequest}`);
      
      const result = await response.json();
  
      return result;
    }
  
    data = await fetchData('&sort_by=popularity.desc');
    console.log(data);
    clearContent("#movielist");
  })();


  const clearContent = (targetId) => {
    const targetElement = document.querySelector(targetId);
    targetElement.innerHTML='NEW ITEMS WILL APPEAR HERE:';
  }


/*


const fetchData = async (myRequest) => {

    let myObject = await fetch(`${baseUrl}${myRequest}`);
    let myText = await myObject.text();

    //console.log(myText);

    const res = JSON.parse(myText);
    console.log(res.results[0]);
    

}

*/


