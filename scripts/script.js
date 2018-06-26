const mathButtons = document.getElementById('mathButtons').children;
const mathDisplay = document.getElementById('mathDisplay');
console.log(mathDisplay);

function changeSource(source,element){
  element.src = source;
  console.log(element.src);
}

console.log(mathButtons[0].children)

let links = [];
let descs = [];
links.push('');
descs.push('<h2>Vector Mathematics</h2>');
links.push('scripts/math/functions/index.html');
descs.push('<h2>Graphs and Statistics</h2>')
links.push('');
descs.push('<h2>Trigonometri and Pythagora theorem</h2>')

for (let li in mathButtons) {

  console.log(li);
  mathButtons[li].children[0].onclick = function()
  {
    changeSource(links[li],mathDisplay);
  }
  console.log(mathButtons[li].children[0]);
}
