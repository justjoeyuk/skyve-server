$( document ).ready(function() {
    $('#save-button').click(function() {
      var epoch = Number($('#week-start-epoch').text())

      var params = {"start_time": epoch, "spaces": [1,4,5,2,3,0,0]}
      console.log(params)

      $.post("/api/allocations/", params)
      .done(function(data) {
        console.log(data)
        window.location.href = window.location.href
      })
      .fail(function() {
        alert("Could not create user")
      })
    })
});
