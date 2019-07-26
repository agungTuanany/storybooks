// Materialize Sidenav
const elem = document.querySelector('.sidenav');
const instance = M.Sidenav.init(elem, {
  inDuration: 350,
  outDuration: 350,
  edege: 'left'
});


// Materialize select form
document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('select');
  const instances = M.FormSelect.init(elems, {
    classes: "public"
  });
});

// Using ckeditor
CKEDITOR.replace('body1');



