var OPENER = false;
$('#comment-form').click(function(e){
    if(e.target.id != 'comment-form-close' && !OPENER){
        OPENER =!OPENER;
        $('#comment-form').animate(
            {
                top: '2%'
            },
            500,
            function(){
                $('#comment-form-close').css('visibility', 'visible');
            }
        );
    }
    if(e.target.id == 'comment-form-close'  && OPENER){
        OPENER =!OPENER;
        $('#comment-form').animate(
            {
                top: '92%'
            },
            500,
            function(){
                $('#comment-form-close').css('visibility', 'hidden');
            }
            );
    }
});
var ONLOAD_CAPTCHA = true;
$('#captcha-refresh').click(function(e){
    if(ONLOAD_CAPTCHA){
        ONLOAD_CAPTCHA = false;
        $('#captcha-refresh').addClass('captcha-loader');
        document.getElementById("captcha-image").src = "/getcaptcha?random="+new Date().getTime();
    }
});
document.getElementById("captcha-image").onload = document.getElementById("captcha-image").onerror = function(e){
    $('#captcha-refresh').removeClass('captcha-loader');
    ONLOAD_CAPTCHA = true;
};

var SENDING_COMMENT = false;
$('#comment-send').click(function(e){
    if(!SENDING_COMMENT){
        SENDING_COMMENT = true;
        var formData = new FormData(document.forms.commentform);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/sendcomment', true);
        document.getElementById("form-text-head").innerHTML = 'Отправка отзыва...';
        OPENER = true;
        $('#comment-form').animate(
            {
                top: '92%'
            },
            200,
            function(){
                $('#comment-form-close').css('visibility', 'hidden');
            }
            );

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4){
                return;
            }
            document.getElementById("form-text-head").innerHTML = 'Написать отзыв';
            SENDING_COMMENT = false;
            if (xhr.status == 200) {
                OPENER = true;
                $('#comment-form').animate(
                    {
                        top: '92%'
                    },
                    200,
                    function(){
                        $('#comment-form-close').css('visibility', 'hidden');
                    }
                    );
                $('#form-text-head').css('font-size','3vh');
                document.getElementById("form-text-head").innerHTML = xhr.responseText;
            } else {
                OPENER = true;
                $('#comment-form').animate(
                    {
                        top: '2%'
                    },
                    200,
                    function(){
                        alert(xhr.responseText);
                        $('#comment-form-close').css('visibility', 'visible');
                    }
                );

            }

        }
        xhr.send(formData);
    }
});