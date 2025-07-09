$( document ).ready(function() {
    //$('#firstModal').modal('show');
    //$('#chatBox').modal('show');
});


const element = document.querySelector('#chatBox');
element.classList.add('show');

let scrollerContent = document.getElementById('scrollerContent');

document.getElementById('addItems').addEventListener('click', function() {
  let newChild = scrollerContent.lastElementChild.cloneNode(true);
  newChild.innerHTML = "Item " + (scrollerContent.children.length + 1);
  scrollerContent.appendChild(newChild);
});