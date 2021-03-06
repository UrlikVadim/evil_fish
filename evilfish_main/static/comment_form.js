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
        var formData = new FormData(document.forms.commentform);
        if(formData.get('name') == ''){
            alert('Имя не может быть пустым',true);
            return false;
        }
        var mail = formData.get('email');
        if(mail == ''){
            alert('Почта не может быть пустым',true);
            return false;
        }
        if(!(mail.search(/[а-яёА-ЯЁ\w\d\s]{2,}@[а-яёА-ЯЁ\w\d\s]{2,}\.[а-яёА-ЯЁ\w\d\s]{2,}/i)+1)){
            alert('Некорректная почта',true);
            return false;
        }
        if(formData.get('comment') == ''){
            alert('Отзыв не может быть пустым',true);
            return false;
        }
        SENDING_COMMENT = true;
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
                        alert(xhr.responseText, true);
                        $('#comment-form-close').css('visibility', 'visible');
                    }
                );

            }

        }
        xhr.send(formData);
    }
});