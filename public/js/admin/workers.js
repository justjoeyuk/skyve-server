$( document ).ready(function() {
    setupForm()
});


// MARK: Setup

function setupForm() {
  $( "#submit-button" ).click(function() {
    var form = $("#new-worker-form")
    var formData = form.serializeArray().reduce(function(a, x) { a[x.name] = x.value; return a; }, {});

    console.log(JSON.stringify(formData))
    $.post("/api/users", formData)
    .done(function(data) {
      window.location.href = window.location.href
    })
    .fail(function() {
      alert("Could not create user")
    })

    return false
  });
}
