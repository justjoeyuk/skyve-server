$( document ).ready(function() {
    $('#save-button').click(function() {
      var epoch = Number($('#week-start-epoch').text())

      var s0 = $('#s0').val();
      var s1 = $('#s1').val();
      var s2 = $('#s2').val();
      var s3 = $('#s3').val();
      var s4 = $('#s4').val();
      var s5 = $('#s5').val();
      var s6 = $('#s6').val();
      var params = {"start_time": epoch, "spaces": [s0,s1,s2,s3,s4,s5,s6]}

      console.log(params)

      $.ajax({
        url:"/api/allocations/",
        type:"POST",
        data:JSON.stringify(params),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(){
          location.href = location.href
        }
      })
    })
});
