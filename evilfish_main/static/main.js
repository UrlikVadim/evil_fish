
var CURRENT_WINDOW = $('#toolbar').children()[0];
var SELECTED_CATEG = $('.categ > div')[0].firstElementChild;
var SELECTED_CATEG_VEGAN = $('.categ > div')[1].firstElementChild;

window.native_alert = window.alert;
window.alert = function(msg, error){
    msg = msg ? msg : 'Сервер не отвечает';
    if(error){
        document.getElementById("message-box-inner").innerHTML = '<b>Ошибка</b>' + msg.toString();
    }else{
        document.getElementById("message-box-inner").innerHTML = msg.toString();
    }
    $('#disable-win').css('display', 'block');
    $('#message-box').animate(
    {
        top: '25%'
    },
    300,
    function(){

    });
}
$('#message-box-close').click(function(e){
    $('#message-box').animate(
        {
            top: '-55%'
        },
        200,
        function(){
            $('#disable-win').css('display', 'none');
        });
});

function fetchProduct(id, vegan){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/getproduct/'+id, true);
    xhr.onreadystatechange = function() {
        if (this.readyState != 4){
            return;
        }
        if (xhr.status == 200) {
            var prod_view = document.getElementsByClassName('product-view');
            prod_view = (vegan) ? prod_view[1] : prod_view[0];
            prod_view.innerHTML = this.responseText;
        } else {
            alert(this.responseText, true);
        }

    }
    xhr.send();
}

window.onload = function(){
    // обработчик выбора вкладок
    $('#toolbar').click(function(e){
        if(e.target.classList.contains("menu-button") && CURRENT_WINDOW != e.target){
            CURRENT_WINDOW.classList.remove('menu-button-clicked');
            e.target.classList.add('menu-button-clicked');
            CURRENT_WINDOW = e.target;
            $('.content-page').css('overflow', 'hidden');
            $('#slide-block').animate(
            {
                left: e.target.dataset.offset
            },
            500,
            function(){
                $('.content-page').css('overflow', 'auto');
            }
            );
        }
    });
    // обработчик выбора категорий
    $('.categ > div').click(function(e){
        if(e.target.classList.contains("categ-item")){
            var sel_el = 1*this.dataset.vegan ? SELECTED_CATEG_VEGAN : SELECTED_CATEG;
            sel_el.classList.remove('categ-item-clicked');
            e.target.classList.add('categ-item-clicked');
            if(1*this.dataset.vegan){
                SELECTED_CATEG_VEGAN = e.target;
            }
            else{
                SELECTED_CATEG = e.target;
            }
            fetchProduct(e.target.dataset.id, 1*this.dataset.vegan);
        }

    });
    //$(SELECTED_CATEG).click();
    $(SELECTED_CATEG_VEGAN).click();

}
