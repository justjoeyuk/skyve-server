$( document ).ready(function() {
    setupForm()
});


// MARK: Setup

function setupForm() {
  $( "#login-button" ).click(function() {
    var form = $(this).closest("form")

    var email = form.find("input[name='username']").val();
    var password = form.find("input[name='password']").val();

    $.post( "/api/users/login", { email: email, pwd: password })
    .done(function( data ) {
      document.cookie = "access_token" + "=" + data["token"] + "; path=/";
      window.location.href = '/admin'
    })
    .fail(function() {
      alert( "Could not login. Please ensure your credentials are correct." );
    })

    return false;
  });
}
