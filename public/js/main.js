$(document).ready(function() {
  var shrineImgs = ["http://placekitten.com/100/100", "http://placekitten.com/200/200"]

  function pickRandImg(arrayOfImgs) {
    return arrayOfImgs[Math.floor(Math.random() * arrayOfImgs.length)]
  }

  function cats() {
  	setInterval(function() {
  		var cat = document.createElement("div");
  		cat.className = "cat";
  		var width = Math.floor((Math.random() * 200) + 100);
  		var height = Math.floor((Math.random() * 200) + 50);
  		var startLeft = Math.floor((Math.random() * screen.width));
  		var img = document.createElement("img");
  		img.setAttribute('width', width);
  		img.setAttribute('height', height);
  		img.setAttribute('src', pickRandImg(shrineImgs));
  		cat.style.top = "0px";
  		cat.style.left = startLeft+"px";
  		cat.appendChild(img);
  		document.getElementsByTagName("body")[0].appendChild(cat);
  		setTimeout(function() {
  			var cheight = document.getElementsByTagName("body")[0].clientHeight;
        console.log(cheight);
  			cat.style.top = Math.floor((Math.random() * cheight) + 200)+"px";
  		},100);
  	}, 1000);
  }
});
